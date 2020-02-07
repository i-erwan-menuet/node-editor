<template>
	<div v-bind:id="id" v-bind:style="style" class="node">
		<div class="node-container">
			<!--Node title - summary of the node-->
			<div class="node-title" @mousedown.stop="dragNode($event)">
				{{node.title}}
			</div>

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
</template>

<script lang="ts">
import store from "@/store"

import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import ScreenPosition from "@/types/ScreenPosition";

import Node from "@/types/Node"

@Component({
  components: { }
})
export default class AppNode extends Vue {
  @Prop() private index!: Number;
  @Prop() private node!: Node;
  @Prop() private dragged!: Boolean;

  isDragged: Boolean = false;
  isActive: Boolean = false;

  x: number = 0;
  y: number = 0;
  deltaX!: number;
  deltaY!: number;

  mounted(){
	  if(this.node != null){
		this.x = this.node.position.x as number;
		this.y = this.node.position.y as number;
	  }
  }

  //METHODS
  dragNode(event: MouseEvent): void{
	  this.isDragged = true;
	  this.deltaX = event.x - this.x;
	  this.deltaY = event.y - this.y;
  }

  moveNode(event: MouseEvent): void{
	  if(this.isDragged){
		  this.x = event.x - this.deltaX;
		  this.y = event.y - this.deltaY;
	  }
  }

  releaseNode(): void{
	  this.isDragged = false;
  }

  //COMPUTED
  get id(): String{
    if(this.index == null){
      return "";
    }
    return "node_" + this.index;
  }

  get style(): Object{
	  return {
		top: this.y + "px",
		left: this.x + "px",
	  }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  	.node{
		position:absolute;
		width:fit-content;
		height:fit-content;
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
		flex:0 0 0px;
		position:absolute;
		width:100%;
		height:35px;
		top:-30px;
		left:0px;
		background-color: #eee;
		display:none;
	}

	.node:hover .node-actions{
		display:flex;
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
