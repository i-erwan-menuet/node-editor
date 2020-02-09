import Vue from "vue";
import App from "./App.vue";
import store from "./store";

require("@/utils/style.css");

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faCog, faFolderOpen, faSave, faPen, faTrash, faCopy, faCheck, faTimes, faBars, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

library.add(
  faPlus,
  faPlusCircle,
  faFolderOpen,
  faCopy,
  faSave,
  faPen,
  faTrash,
  faCheck,
  faTimes,
  faCog,
  faBars
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
