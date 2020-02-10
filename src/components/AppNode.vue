<template>
	<div v-bind:id="id" 
		 v-bind:style="style" 
		 ref="el"
		 class="node" :class="{ 'shadow': shadow, 'selected': isSelected }"> 
		<div class="node-container" @mouseenter="mouseIn()" @mouseleave="mouseOut()">
			<!--Node title - summary of the node-->
			<div class="node-title" @mousedown.stop="dragNode($event)">
				{{node.title}}
			</div>

			<!--Node data - every line represents a typed information or data of any kind-->
			<div class="node-content">
				<div class="node-data-line" v-for="(line, index) in node.lines" v-bind:key="'line_' + index">
					<div class="node-data" v-for="(data, index) in line.data" v-bind:key="'data_' + index">
						{{ data.value }}
					</div>
				</div>

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

import { Component, Prop, Watch, Vue, Emit } from "vue-property-decorator";
import ScreenPosition from "@/types/ScreenPosition";

import Node from "@/types/Node"

@Component({
  components: {
	  BaseIcon
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
		debugger;

		let startP: ScreenPosition =  this.$store.state.selectionStartPos;
		let endP: ScreenPosition = this.$store.state.selectionEndPos;

		let flipX = endP.x - startP.x;
		let flipY = endP.y - startP.y;

		let inXRange: Boolean = flipX > 0 ? this.node.position.x >= startP.x && this.node.position.x + this.$el.clientWidth <= endP.x :
											this.node.position.x >= endP.x && this.node.position.x + this.$el.clientWidth <= startP.x;
											
		let inYRange: Boolean = flipY > 0 ? this.node.position.y >= startP.y && this.node.position.y + this.$el.clientHeight <= endP.y :
											this.node.position.y >= endP.y && this.node.position.y + this.$el.clientHeight <= startP.y;

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

	/* .node:hover .node-title{
		background-color: #59acff;
	} */
	
	.node-content{
		flex:1 1 auto;
		display: flex;
		flex-direction: column;
	}
	.node-data-line{
		width: 100%;
		flex:0 0 35px;
		line-height: 35px;
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

	.node-data{
		flex: 1 1 auto;
		width:fit-content;
		border-right:1px solid #e6e6e6;
		padding:0 5px;
	}
	.node-data:last-child{
		border-right: none;
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
