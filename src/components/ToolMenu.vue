<template>
    <div id="tool_menu">
        <BaseIcon icon="bars" color="black" background="transparent" size="2" :fill="true"/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator";
import BaseIcon from "./BaseIcon.vue"

@Component({
    components:{
        BaseIcon
    }
})
export default class ToolMenu extends Vue {

}
</script>

<style scoped>
    #tool_menu{
        position:fixed;
        z-index:1000000;
        left:25px;
        top:25px;

        width:75px;
        height:75px;
        border-radius: 50%;
        border:1px solid #a9a9a9;

        text-align: center;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: white;
    }

    #tool_menu:hover{
        box-shadow: 0px 1px 3px 1px #ccc;
    }
</style>