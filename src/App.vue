<template>
  <div id="app">
    <ContextualMenu ref="contextualMenu"/>
    <ToolMenu ref="toolMenu"/>

    <div id="viewport" @mousedown="startPanning($event)" @mouseup="stopPanning()" @mousemove="pan($event)"
                       @contextmenu.prevent="displayContextualMenu($event)">
      <div id="view" ref="view">
        <AppNode v-for="(node, index) in nodes" v-bind:key="index" v-bind:node="node" v-bind:index="index"/>
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

  private zoom: number = 1;
  private zoomMin: number = 0.3;
  private zoomMax: number = 1.3;
  private zoomDelta: number = 0.05;

  private isPanning: Boolean = false;
  private lastMouseX!: number;
  private lastMouseY!: number;

  mounted(){
    this.$store.commit('fakeNodeInitialization');
  }

  startPanning(event:MouseEvent):void{
    this.isPanning = true;

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  stopPanning(): void{
    this.isPanning = false;
  }

  pan(event: MouseEvent):void{
    if(this.isPanning){
      debugger;

      var deltaX = this.lastMouseX - event.clientX;
      var deltaY = this.lastMouseY - event.clientY;

      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;

      let left = parseFloat(this.$refs.view.style.left as string);
      let top = parseFloat(this.$refs.view.style.top as string);

      left = isNaN(left) ? 0 : left;
      top = isNaN(top) ? 0 : top;

      left -= deltaX;
      top -= deltaY;

      this.$refs.view.style.left = left.toString() + "px";
      this.$refs.view.style.top = top.toString() + "px";
    }
  }

  resetZoom():void{
    this.zoom = 1;
  }

  updateZoom(event: MouseWheelEvent): void{
    let sign = event.deltaY > 0 ? 1 : -1;
    this.zoom = this.zoom + (this.zoomDelta * sign);
    if(this.zoom > this.zoomMax){
      this.zoom = this.zoomMax;
    }
    else if(this.zoom < this.zoomMin){
      this.zoom = this.zoomMin;
    }
  }

  displayContextualMenu(event: MouseEvent): void{
    this.$refs.contextualMenu.show(event);
  }

  get nodes(): Array<Node>{
    let nodes = this.$store.state.nodes;
    return nodes;
  }

  @Watch('zoom')
  onZoomChanged(){
    //this.containerDOM.style.zoom = this.zoom.toString();
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
}

#view:active{
  cursor:grab;
}
</style>
