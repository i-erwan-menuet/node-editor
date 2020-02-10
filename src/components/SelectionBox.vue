<template>
    <div id="select_box" :style="style"></div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator";
import ScreenPosition from '../types/ScreenPosition';

@Component({
})
export default class SelectionBox extends Vue {
    @Prop() private end!: ScreenPosition;

    private flipX: Boolean = false;
    private flipY: Boolean = false;

    get start(): ScreenPosition{
        return this.$store.state.selectionStartPos as ScreenPosition;
    }

    get width(): number{
        let w = this.end.x - this.start.x;
        this.flipX = w < 0;
        return this.flipX ? -w : w;
    }

    get height(): number{
        let h = this.end.y - this.start.y;
        this.flipY = h < 0;
        return this.flipY ? -h : h;
    }

    get style(): Object{
        let top = this.flipY ? this.end.y : this.start.y;
        let left = this.flipX ? this.end.x : this.start.x;

        return {
            top: top + "px",
            left: left + "px",
            width: this.width + "px",
            height: this.height + "px",
        }
    }
}
</script>

<style scoped>
    #select_box{
        position:fixed;
        z-index:1000003;

        background-color:rgb(0, 183, 255);
        border:1px solid rgb(0, 174, 255);

        opacity: 0.6;
    }

</style>