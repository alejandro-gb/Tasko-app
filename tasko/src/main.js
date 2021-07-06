import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import EventBus from './EventBus'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import AudioRecorder from 'vue-audio-recorder'
import { BootstrapVueIcons } from 'bootstrap-vue'

Vue.prototype.$bus = EventBus
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(AudioRecorder)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
