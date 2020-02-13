<template>
    <div class="node-data-line">
        <div v-for="(data, column) in line.data" v-bind:key="column" class="node-data">            
            <input v-if="nodeInEdition" type="text" v-bind:value="data.value"/>
            <p v-else>{{data.value}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator";

import Data from "@/types/Data"
import BaseIcon from "./BaseIcon.vue"

@Component({
    components:{
        BaseIcon
    }
})
export default class LineData extends Vue {
    @Prop() private nodeInEdition!: Boolean;
    @Prop() private line!: Array<Data>;
    @Prop() private index!: number;

}
</script>

<style scoped>
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
        min-width: 25px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
	}
	.node-data:last-child{
		border-right: none;
	}

    .node-data p{
        width:100%;
        height:100%;
        margin:0;
        padding:0 5px;
    }

    .node-data input{
        width:98%;
        margin:auto;
        height:100%;
        border:none;
        background-color: transparent;
        padding:0 5px;
    }
</style>