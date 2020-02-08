<template>
  <div id="app" @contextmenu.prevent="displayContextualMenu($event)">
    <ContextualMenu ref="contextualMenu"/>
    <ToolMenu ref="toolMenu"/>

    <div id="viewport" @mousedown.left="startPanning($event)" @mouseup="handleMouseUp()" @mousemove="handleMouseMove($event)"
                       @mousewheel.prevent="zoomOnMousePosition($event)" @click.middle="resetZoom($event)">
      <div id="view" ref="view">
        <AppNode v-for="(node, index) in nodes" :key="index" :node="node" :index="index"
                 @drag-node="startGrabbingNode($event)"/>
        <AppNode v-if="grabbingNodeIndex != -1" :node="grabbedNodeShadow" :index="grabbingNodeIndex" :shadow="true"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";

//MODULES
import { Component, Vue, Watch } from "vue-property-decorator";

/*COMPONENTS*/
import AppNode from "./components/AppNode.vue";
import ContextualMenu from "./components/ContextualMenu.vue";
import ToolMenu from "./components/ToolMenu.vue";

/*MODELS*/
import Node from "./types/Node";
import ScreenPosition from './types/ScreenPosition';

@Component({
  components: {
    AppNode,
    ContextualMenu,
    ToolMenu
  }
})
export default class App extends Vue {  
  $refs!:{
    contextualMenu: ContextualMenu,
    toolMenu: ToolMenu,
    view: HTMLElement
  }

  grabbingNodeIndex: number = -1;
  grabbedNodeShadow: Node = new Node("Shadow node", new ScreenPosition(0,0));

  private isPanning: Boolean = false;
  private lastMouseX!: number;
  private lastMouseY!: number;

  private deltaMouseX!: number;
  private deltaMouseY!: number;

  private zoom: number = 1;
  private zoomFactor: number = 0.1;
  private zoomMax: number = 1.5;
  private zoomMin: number = 0.3;

  //Initiate the application by fetching data from store
  mounted(){
    this.$store.commit('fakeInit');
  }

  //Handle pad effect
  startPanning(event:MouseEvent):void{
    this.isPanning = true;

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }
  stopPanning():void{
    this.isPanning = false;
  }
  pan(event: MouseEvent):void{
    if(this.isPanning){
      var deltaX = this.lastMouseX - event.clientX;
      var deltaY = this.lastMouseY - event.clientY;

      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;

      let left = parseFloat(this.$refs.view.style.left as string);
      let top = parseFloat(this.$refs.view.style.top as string);

      left = isNaN(left) ? 0 : left;
      top = isNaN(top) ? 0 : top;

      left -= deltaX / this.zoom;
      top -= deltaY / this.zoom;

      this.$refs.view.style.left = left.toString() + "px";
      this.$refs.view.style.top = top.toString() + "px";
    }
  }

  //Handle node grab effect
  startGrabbingNode(event: any): void{
    this.grabbingNodeIndex = event.index;

    this.grabbedNodeShadow = JSON.parse(JSON.stringify(this.nodes[this.grabbingNodeIndex]));

    this.deltaMouseX = (event.mousePosition.x / this.zoom) - (this.grabbedNodeShadow.position.x as number);
    this.deltaMouseY = (event.mousePosition.y / this.zoom) - (this.grabbedNodeShadow.position.y as number);
  }
  ///TO DO:
  ///Find a way to commit only when user has stopped grabbing the current node to improve perf
  ///and minimize store commitments as well
  moveGrabbedNode(event: MouseEvent): void{
    if(this.grabbingNodeIndex != -1){
      let x = (event.x / this.zoom) - this.deltaMouseX;
      let y = (event.y / this.zoom) - this.deltaMouseY;

      this.grabbedNodeShadow.position.x = x;
      this.grabbedNodeShadow.position.y = y;      
    }
  }
  stopGrabbing(): void{
    this.$store.commit("moveNodeToPosition", {
      index: this.grabbingNodeIndex,
      newPosition: this.grabbedNodeShadow.position
    })

    this.grabbingNodeIndex = -1;
  }  

  //Handle global mouse events
  handleMouseUp(): void{
    this.stopPanning();
    this.stopGrabbing();
  }
  handleMouseMove(event: MouseEvent):void{
    this.moveGrabbedNode(event);
    this.pan(event);
  }

  //Handle zoom
  zoomOnMousePosition(event: MouseWheelEvent): void{
    let sign = event.deltaY > 0 ? -1 : 1;
    this.zoom += sign * this.zoomFactor;

    if(this.zoom > this.zoomMax){
      this.zoom = this.zoomMax;
    }
    else if(this.zoom < this.zoomMin){
      this.zoom = this.zoomMin;
    }

    // // Calculate displacement of zooming position.
    // let dx = (event.clientX - image.getLeft()) * (factor - 1);
    // let dy = (event.clientY - image.getTop()) * (factor - 1);
    // // Compensate for displacement.
    // image.setLeft(image.getLeft() - dx);
    // image.setTop(image.getTop() - dy);
    
    // canvas.renderAll();
  }
  resetZoom(event: MouseEvent):void{
    this.zoom = 1;
  }

  //Display contextual menu
  displayContextualMenu(event: MouseEvent): void{
    this.$refs.contextualMenu.show(event);
    this.stopGrabbing();
    this.stopPanning();
  }


  //COMPUTED GETTERS
  get nodes(): Array<Node>{
    let nodes = this.$store.state.nodes;
    return nodes;
  }

  @Watch('zoom')
  onZoomChanged(){
    this.$refs.view.style.zoom = this.zoom.toString();
  }
}
</script>

<style>
body {
  background-color: white;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin:0;
  padding:0;
}

#app{
  width: 100vw;
  height: 100vh;
}

#viewport{
  width:100%;
  height:100%;
  overflow: hidden;
  display: block;
  background-color: transparent;
}

#view {
  position: relative;
  width: 100%;
  height: 100%;
  top:0px;
  left:0px;
  z-index: 0;
}
</style>
