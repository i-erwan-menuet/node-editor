<template>
    <VueDraggableResizable :key="index" :x="50" :y="50"
						   :w="node.width" :h="50" class-name-active="node-active"
						   drag-handle=".node-title" :resizable="false"
                           @dragging="onNodeDrag()" @resizing="onNodeResize()">
      <div v-bind:id="id" class="node">
        <div class="node-container">
          <!--Node title - summary of the node-->
          <div class="node-title">{{node.title}}</div>

          <!--Node data - every line represents a typed information or data of any kind-->
          <div class="node-content">
            <div class="node-data-line" v-for="(data, index) in node.data" v-bind:key="index">
              <div class="node-data-title">{{ data.title }}</div>
              <div class="node-data-type"></div>
            </div>
          </div>

          <!--Node actions - actions the user can do on this node (add data for example)-->
          <div class="node-actions">
            
          </div>

          <!--Node link point - anchor of link(s) with other nodes-->
          <div class="node-link-point"></div>
        </div>
      </div>
    </VueDraggableResizable>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import VueDraggableResizable from "vue-draggable-resizable";

import Node from "../types/Node"

@Component({
  components: {
    VueDraggableResizable
  }
})
export default class AppNode extends Vue {
  @Prop() private index!: Number;
  @Prop() private node!: Node;

  //METHODS
  onNodeDrag(){

  }

  onNodeResize(){

  }

  //COMPUTED
  get id(): String{
    if(this.index == null){
      return "";
    }
    return "node_" + this.index;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  	.node{
		min-width: 200px;
		border:1px solid #ddd;
		box-shadow: 0px 0px 2px 1px #eee;
	}

	.node-container{
		width: 100%;
		height: 100%;
		display:flex;
		flex-direction: column;
		position: relative;
	}
	.node-title {
		flex: 0 0 30px;
		line-height: 30px;
		text-align: center;
		background-color: #0080ff;
	}
	.node-title:hover{
		cursor:pointer;
	}
	.node-content{
		flex:1 1 auto;
		display: flex;
		flex-direction: column;
	}
	.node-data-line{
		width: 100%;
		flex:0 0 30px;
		line-height: 30px;
		border-bottom: 1px solid #ccc;
		display: flex;
		flex-direction: row;
	}
	.node-data-line:hover{
		background-color: #f2f2f2;
	}
	.node-data-title{
		flex: 1 1 70%;
		border-right:1px solid #e6e6e6;
		padding:0 5px;
	}
	.node-data-type{
		flex: 1 1 30%;
		padding:0 5px;
	}
	.node-actions{
		flex:0 0 30px;
	}
	.node-link-point{
		position: absolute;
		bottom: 0px;
		left:50%;
		transform: translate(-50%, 50%);
		width:15px;
		height:15px;
		border-radius: 50%;
		background-color: #eee;
		border:1px solid #ccc;
	}
	.node-link-point:hover{
		cursor:pointer;
	}

	.node-active .node{
		border:1px solid #666;
	}
</style>
