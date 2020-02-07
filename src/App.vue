<template>
  <div id="app" @click.middle="resetZoom()" @mousewheel="updateZoom($event)" @contextmenu.prevent="displayContextualMenu($event)">
    <ContextualMenu ref="contextualMenu"/>
    <ToolMenu ref="toolMenu"/>
    <div id="node_container">
      <AppNode v-for="(node, index) in nodes" v-bind:key="index" v-bind:node="node" v-bind:index="index"/>
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
    toolMenu: ToolMenu
  }

  private zoom: number = 1;
  private zoomMin: number = 0.3;
  private zoomMax: number = 1.3;
  private zoomDelta: number = 0.05;

  private containerDOM!: HTMLElement;

  mounted(){
    this.$store.commit('fakeNodeInitialization');
    this.containerDOM = document.getElementById("node_container") as HTMLElement;
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
    this.containerDOM.style.zoom = this.zoom.toString();
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width:100vw;
  height:100vh;
}

#node_container{
  width:100%;
  height:100%;
  overflow: hidden;
}

body{
  margin:0;
  padding:0;
}
</style>
