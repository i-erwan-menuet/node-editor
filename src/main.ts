import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faFolderOpen, faSave, faPen, faTrash, faCopy, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

library.add(
  faPlus,
  faFolderOpen,
  faCopy,
  faSave,
  faPen,
  faTrash,
  faCheck,
  faTimes
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
