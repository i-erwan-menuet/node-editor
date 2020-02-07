import Vue from "vue";
import Vuex from "vuex";
import  Node from "../types/Node";
import ScreenPosition from '@/types/ScreenPosition';
import Data from '@/types/Data';
import { DataType, DataContentType } from '@/constants/Enumerations';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nodes: Array<Node>()
  },

  mutations: {
    fakeNodeInitialization(state){
      let fakeNode = new Node("Test Node 1", new ScreenPosition(150, 150));
      let fakeData = new Data("Test Data 1", DataType.Information, DataContentType.Text);
      let fakeData2 = new Data("Test Data 2", DataType.Information, DataContentType.Text);

      fakeNode.addData(fakeData);
      fakeNode.addData(fakeData2);

      let fakeNode2 = new Node("Test Node 2", new ScreenPosition(800, 450));
      let fakeData3 = new Data("Test Data 3", DataType.Information, DataContentType.Text);
      
      fakeNode2.addData(fakeData3);

      state.nodes.push(fakeNode);
      state.nodes.push(fakeNode2);
    },
    moveNodePositionAtIndex(state, payload){
      let node = state.nodes[payload.index];
      node.moveToPosition(new ScreenPosition(payload.x, payload.y));
    }
  },

  actions: {

  },

  modules: {

  }
});
