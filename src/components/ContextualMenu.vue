<template>
  <transition name="fade">
    <div id="contextual_menu_overlay" v-if="display" v-on:mousedown.self="hide()">
      <div id="contextual_menu" v-bind:style="style">
        <div class="contextual_menu_action" @click="addNode()">
          <span>
            <font-awesome-icon icon="plus"/>
          </span>
          <p>Add new node</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator";
import "../utils/directives";
import ScreenPosition from '../types/ScreenPosition';

@Component({
})
export default class ContextualMenu extends Vue {
  display: Boolean = false;

  width:number = 180;
  height: number = 150;
  top: number = 50;
  left: number = 50;

  show(event:MouseEvent):void{
    this.top = event.pageY - 2;
    this.left = event.pageX - 2;

    if(this.left + this.width > screen.width){
      this.left = screen.width - this.width;
    }
    if(this.top + this.height > screen.height){
      this.top = screen.height - this.height;
    }

    this.display = true;
  }

  hide():void{
    this.display = false;
  }

  addNode(): void{
    this.$emit("add-node", new ScreenPosition(this.left, this.top));
    this.hide();
  }

  get style(): Object{
    return {
      top: this.top + "px",
      left: this.left + "px",
      width: this.width + "px",
      height: this.height + "px"
    }
  }
}
</script>

<style scoped>
    #contextual_menu_overlay{
      position:fixed;
      width: 100%;
      height: 100%;
      z-index: 1000001;
    }

    #contextual_menu{
      position: absolute;;
      z-index: 1000002;
      background-color: white;
      box-shadow: 1px 1px 2px 1px #ccc;
      border-radius: 3px;
      display:flex;
      flex-direction: column;
      padding:3px;
    }

    .contextual_menu_action{
      flex: 0 0 35px;
      line-height: 35px;
      width:100%;

      display:flex;
      text-align: left;
      user-select: none;
    }

    .contextual_menu_action:hover{
      background-color: #f4f4f4;
    }

    .contextual_menu_action:active{
      background-color: rgb(85, 87, 255);
    }


    .contextual_menu_action span{
      flex: 0 0 30px;
      line-height: 35px;
      text-align: center;
    }

    .contextual_menu_action p{
      margin: 0;
      padding-left: 5px;
      flex:1 1 auto;
    }

</style>