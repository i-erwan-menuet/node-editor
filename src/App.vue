<template>
  <div id="app" @contextmenu.prevent="displayContextualMenu($event)">
    <ContextualMenu ref="contextualMenu"/>
    <ToolMenu ref="toolMenu"/>
    <AppNode v-for="(node, index) in nodes" v-bind:key="index" v-bind:node="node" v-bind:index="index"/>
  </div>
</template>

<script lang="ts">
import store from "@/store";

//MODULES
import { Component, Vue } from "vue-property-decorator";

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

  mounted(){
    this.$store.commit('fakeNodeInitialization');
  }

  displayContextualMenu(event: MouseEvent): void{
    this.$refs.contextualMenu.show(event);
  }

  get nodes(): Array<Node>{
    let nodes = this.$store.state.nodes;
    return nodes;
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

body{
  margin:0;
  padding:0;
}
</style>
