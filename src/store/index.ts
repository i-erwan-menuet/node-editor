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
      
      state.nodes.push(fakeNode);
    }
  },

  actions: {

  },

  modules: {

  }
});
