<template>
  <div id="app">
    <ContextualMenu/>
    <AppNode v-for="(node, index) in Nodes" v-bind:key="index" v-bind:node="node" v-bind:index="index"/>
  </div>
</template>

<script lang="ts">
import store from "@/store";

//MODULES
import { Component, Vue } from "vue-property-decorator";

/*COMPONENTS*/
import AppNode from "./components/AppNode.vue";
import ContextualMenu from "./components/ContextualMenu.vue";

/*MODELS*/
import Node from "./types/Node";

@Component({
  components: {
    AppNode,
    ContextualMenu
  }
})
export default class App extends Vue {
  mounted(){
    this.$store.commit('fakeNodeInitialization');
  }

  get Nodes(): Array<Node>{
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
