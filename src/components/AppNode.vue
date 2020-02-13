<template>
	<div v-bind:id="id" v-bind:style="style" 
		 ref="el" class="node" :class="{ 'shadow': shadow, 'selected': isSelected }"
		 v-outside-click="disableEdition"> 
		<div class="node-container" @mouseenter="mouseIn()" @mouseleave="mouseOut()">
			<!--Node title - summary of the node-->
			<div class="node-title" @mousedown.stop="dragNode($event)">
				<input :disabled="!inEdition" type="text" :value="node.title" placeholder="Title..." @keydown.enter="updateNodeTitle($event)"/>
			</div>

			<!--Node data - every line represents a typed information or data of any kind-->
			<div class="node-content">
				<LineData v-for="(line, index) in node.lines" :key="id + '_line_' + index"
						  :index="index" :line="line" :node-in-edition="inEdition"></LineData>

				<div v-if="inEdition">
					<BaseIcon id="add_row_icon" class="node-data-edition-icon" @click="addLine()"
							  background="blue" icon="plus" color="white"/>
					<BaseIcon id="add_column_icon" class="node-data-edition-icon" v-if="node.lines.length > 0" @click="addColumn()"
					 	 	  background="blue" icon="plus" color="white"/>
				</div>
			</div>

			<!--Node actions - actions the user can do on this node (add data for example)-->
			<transition name="fade">
				<div v-if="mouseOver || inEdition" class="node-actions">
					<BaseIcon @click="editNode()" :background="inEdition ? 'lightblue' : 'blue'" icon="cog" :color="inEdition ? 'blue' : 'white'"/>
					<BaseIcon @click="copyNode()" background="yellow" icon="copy" color="white"/>

					<BaseIcon v-if="!confirmDelete" @click="confirmNodeDeletion()" background="red" icon="trash" color="white"/>
					<div v-else class="node-action-multi">
						<BaseIcon @click="deleteNode()" background="green" icon="check" color="white" title="Confirm delete"/>
						<BaseIcon @click="cancelNodeDeletion()" background="red" icon="times" color="white"/>
					</div>
				</div>
			</transition>
		</div>					
		<!--Node link point - anchor of link(s) with other nodes-->
		<div v-if="!inEdition" class="node-link-point"></div>
	</div>
</template>

<script lang="ts">
import store from "@/store"

import BaseIcon from "./BaseIcon.vue";
import LineData from "./LineData.vue";

import { Component, Prop, Watch, Vue, Emit } from "vue-property-decorator";
import ScreenPosition from "@/types/ScreenPosition";

import Node from "@/types/Node"

@Component({
  components: {
	  BaseIcon,
	  LineData
  }
})
export default class AppNode extends Vue {
  $refs!: {
	el: HTMLElement
  }

  @Prop() private index!: number;
  @Prop() private node!: Node;
  @Prop() private shadow!: Boolean;

  inEdition: Boolean = false;
  mouseOver: Boolean = false;

  //TODO: think about unique node id
  //the data are shared between components when I delete one and another one gets the same index
  confirmDelete: Boolean = false;

  private copyCount: number = 0;
  private copyTimer: any = null;

  mounted(){
	  
  }

  //METHODS
  dragNode(event: MouseEvent): void{
	  if(this.inEdition){
		  return;
	  }

	  let deltaX = event.x - (this.node.position.x as number);
	  let deltaY = event.y - (this.node.position.y as number);

	  this.$emit("drag-node", {
		  index: this.index,
		  mousePosition: new ScreenPosition(event.x, event.y)
	  });
	  this.inEdition = false;
  }
  editNode(){
	  this.inEdition = !this.inEdition;
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
  copyNode(){
	  this.copyCount += 1;
	  if(this.copyTimer){
		  clearTimeout(this.copyTimer);
	  }
	  this.copyTimer = setTimeout( () => {
		  this.copyCount = 0;
	  }, 1000);

	  this.$store.commit("copyNode", {
		  index: this.index,
		  count: this.copyCount
	  });
  }

  addLine(){
	  this.$store.commit("addLineToNode", this.index);
  }
  addColumn(){
	  this.$store.commit("addColumnToNode", this.index);
  }

  resetCopyCount(){
	  this.copyCount = 0;
  }

  mouseIn(): void{
	  this.mouseOver = true;
  }

  mouseOut(): void{
	  this.mouseOver = false;
	  this.cancelNodeDeletion();
  }

  updateNodeTitle(event: Event):void{
	  let target = event.target as HTMLInputElement;
	  this.$store.commit("updateNodeTitle", {
		  index: this.index,
		  value: target.value
	  });
  }

  disableEdition():void{
	this.inEdition = false;
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

  get isSelected(): Boolean{
	  if(this.$store.state.selectionActive === true)
	  {
		let startP: ScreenPosition =  this.$store.state.selectionStartPos;
		let endP: ScreenPosition = this.$store.state.selectionEndPos;

		if(startP == null || endP == null){
			return false;
		}

		let zoomStartP = new ScreenPosition(startP.x, startP.y).divide(this.$store.state.zoom);
		let zoomEndP = new ScreenPosition(endP.x, endP.y).divide(this.$store.state.zoom);

		let parentView = this.$refs.el.parentElement as HTMLElement;
		let offsetL = parentView.offsetLeft;
		let offsetT = parentView.offsetTop;

		let flipX = endP.x - startP.x;
		let flipY = endP.y - startP.y;

		let offsetNodeX = this.node.position.x + offsetL;
		let offsetNodeY = this.node.position.y + offsetT;

		let inXRange: Boolean = flipX > 0 ? offsetNodeX >= zoomStartP.x && offsetNodeX + this.$el.clientWidth <= zoomEndP.x :
											offsetNodeX >= zoomEndP.x && offsetNodeX + this.$el.clientWidth <= zoomStartP.x;
											
		let inYRange: Boolean = flipY > 0 ? offsetNodeY >= zoomStartP.y && offsetNodeY + this.$el.clientHeight <= zoomEndP.y :
											offsetNodeY >= zoomEndP.y && offsetNodeY + this.$el.clientHeight <= zoomStartP.y;

		return inYRange && inXRange;
	  }
	  return false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  	.node{
		position:absolute;
		width:fit-content;
		height:fit-content;
		min-width: 250px;
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

	.node.selected{
		box-shadow: 0px 0px 4px 1px rgb(0, 135, 212);
	}

	.node-container{
		width: 100%;
		height: 100%;
		display:flex;
		flex-direction: column;
		position: relative;
	}
	.node-title {
		flex: 0 0 40px;
		line-height: 40px;
		text-align: center;
		background-color: #0080ff;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
		user-select: none;
	}
	.node-title:hover{
		cursor:grab;
	}

	.node-title input{
		background-color: #52a9ff;
		border:1px solid #016edb;
		border-radius: 3px;
		height:30px;
		line-height:30px;
		text-align: center;
	}

	.node-title input:disabled{
		background-color: inherit;
		cursor:grab;
		border:none;
		color:black;
	}

	/* .node:hover .node-title{
		background-color: #59acff;
	} */
	
	.node-content{
		flex:1 1 auto;
		display: flex;
		flex-direction: column;
	}	

	.node-actions{
		flex:0 0 0px;
		padding-left:10px;
		position:absolute;
		width: fit-content;
		height:fit-content;
		top:0;
		right:0;
		transform:translateY(-99%);
		background-color: transparent;
		display:flex;
		flex-direction: row;
		align-items: flex-end;
		text-align: left;
	}

	.node.grabbed .node-actions{
		display:none;
	}

	.node-action-multi{
		display:flex;
		flex-direction: column;
		width:fit-content;		
	}

	.node-actions .base-icon{
		width:30px;
		height:30px;
		line-height: 30px;
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

	.node-data-edition-icon{
		position: absolute;
		border-radius: 50%;
		margin:0;
		width:20px;
		height:20px;
	}

	#add_row_icon{		
		bottom: 0px;
		left:50%;
		transform: translate(-50%, 50%);

	}

	#add_column_icon{
		top: 50%;
		right:0;
		transform: translate(50%, 0);
	}
</style>
