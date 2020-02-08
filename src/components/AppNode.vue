<template>
	<div v-bind:id="id" v-bind:style="style" class="node" :class="{ 'shadow': shadow }" v-on:click.stop.prevent>
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
				<span class="node-action c-blue" title="Edit"><font-awesome-icon icon="pen" color="white"/></span>
				<span class="node-action c-yellow" title="Copy"><font-awesome-icon icon="copy" color="white"/></span>
				<span v-if="!confirmDelete" class="node-action c-red" title="Delete" @click="confirmNodeDeletion()"><font-awesome-icon icon="trash" color="white"/></span>
				<span v-else class="node-action-multi" title="Confirm delete">
					<span class="node-action c-green" @click="deleteNode()"><font-awesome-icon icon="check" color="white"/></span>
					<span class="node-action c-red" @click="cancelNodeDeletion()"><font-awesome-icon icon="times" color="white"/></span>
				</span>
			</div>

			<!--Node link point - anchor of link(s) with other nodes-->
			<div class="node-link-point"></div>
		</div>
	</div>
</template>

<script lang="ts">
import store from "@/store"

import { Component, Prop, Watch, Vue, Emit } from "vue-property-decorator";
import ScreenPosition from "@/types/ScreenPosition";

import Node from "@/types/Node"

@Component({
  components: { }
})
export default class AppNode extends Vue {
  @Prop() private index!: number;
  @Prop() private node!: Node;
  @Prop() private shadow!: Boolean;
;
  inEdition: Boolean = false;

  //TODO: think about unique node id
  //the data are shared between components when I delete one and another one gets the same index
  confirmDelete: Boolean = false;

  mounted(){
	  
  }

  //METHODS
  dragNode(event: MouseEvent): void{
	  let deltaX = event.x - (this.node.position.x as number);
	  let deltaY = event.y - (this.node.position.y as number);

	  this.$emit("drag-node", {
		  index: this.index,
		  mousePosition: new ScreenPosition(event.x, event.y)
	  });
	  this.inEdition = false;
  }

  confirmNodeDeletion(){
	  this.confirmDelete = true;
  }
  cancelNodeDeletion(){
	  this.confirmDelete = false;
  }

  deleteNode(){
	  this.$store.commit("deleteNode", this.index);
	  this.confirmDelete = false;
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
		top: this.node.position.y + "px",
		left: this.node.position.x + "px",
		zIndex: this.index + 1
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
		min-width: 300px;
		border:1px solid #ddd;
		box-shadow: 0px 0px 2px 1px #eee;
		background-color: white;
		border-radius: 3px;
	}

	.node.grabbed{
		box-shadow: 0px 0px 4px 0px rgb(133, 133, 133);
		cursor:grabbing;
	}

	.node.shadow{
		opacity: 0.4;
	}

	.node-container{
		width: 100%;
		height: 100%;
		display:flex;
		flex-direction: column;
		position: relative;
	}
	.node-title {
		flex: 0 0 50px;
		line-height: 50px;
		text-align: center;
		background-color: #0080ff;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
		user-select: none;
	}
	.node-title:hover{
		cursor:grab;
	}
	
	.node-content{
		flex:1 1 auto;
		display: flex;
		flex-direction: column;
	}
	.node-data-line{
		width: 100%;
		flex:0 0 40px;
		line-height: 40px;
		border-bottom: 1px solid #ccc;
		display: flex;
		flex-direction: row;
	}

	.node-data-line:last-child{
		border-bottom: none;
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
		padding-left:10px;
		position:absolute;
		width: fit-content;
		min-width:50px;
		height:fit-content;
		top:0;
		right:0;
		transform:translateX(99%);
		opacity: 1;
		background-color: transparent;
		display:none;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;

		animation-name: slideFadeLeft;
		animation-duration: 0.5s;
	}

	@keyframes slideFadeLeft {
		from {
			opacity: 0;
			transform:translateX(50%);
		}
		to {
			opacity: 1;
			transform:translateX(99%);
		}
	}

	.node:hover .node-actions{
		display:flex;
	}

	.node.grabbed .node-actions{
		display:none;
	}

	.node-action-multi{
		display:flex;
		flex-direction: row;
		width:fit-content;		
	}

	.node-action{
		flex: 0 0 30px;
		width:30px;
		border-radius: 50%;
		text-align: center;
		line-height: 30px;
		margin-bottom: 5px;
	}

	.node-action:hover{
		box-shadow: 0px 0px 3px 1px #ccc;
		cursor:pointer;
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

	.c-blue{
		background-color: blue;
	}

	.c-red{
		background-color: red;
	}

	.c-yellow{
		background-color: yellow;
	}

	.c-green{
		background-color: green;
	}
</style>
