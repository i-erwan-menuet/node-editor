<template>
    <div id="tool_menu">
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator";

@Component({
})
export default class ToolMenu extends Vue {

}
</script>

<style scoped>
    #tool_menu{
        position:fixed;
        z-index:1000000;
        left:50%;
        bottom:25px;
        transform:translateX(-50%);

        width:500px;
        height:50px;
        border-radius: 3px;
        border:1px solid #a9a9a9;
        /* background-color: rgba(163, 163, 163, 0.445); */
    }

    #tool_menu:hover{
        box-shadow: 0px 1px 3px 1px #ccc;
        transition:all 0.3s ease-in-out 0s;
    }
</style>