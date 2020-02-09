<template>
    <span :style="style" class="base-icon" @click="$emit('click')">
        <font-awesome-icon :icon="icon" :color="color" :size="fontSize"/>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator";

@Component({
})
export default class BaseIcon extends Vue {
  @Prop() private icon!: String;
  @Prop() private color!: String;
  @Prop() private background!: String;
  @Prop() private size!: number;
  @Prop() private fill!: Boolean;

  private baseSize:number = 30;

  get fontSize(): string{
      return this.size ? this.size + "x" : "1x";
  }

  get style(): Object{
      return {
        backgroundColor: this.background,
        width: this.fill ? "100%" : "",
        height: this.fill ? "100%" : ""
      }
  }
}
</script>

<style scoped>
    .base-icon{
        flex: 0 0 auto;
		border-radius: 50%;
		text-align: center;
        padding:3px;
        margin:3px;
        cursor:pointer;	
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .base-icon:hover{
        opacity: 0.5;
    }
</style>