import Vue from 'vue'
import App from './App.vue'
import vFlagIcons from 'v-flag-icons'
import 'v-flag-icons/css/rectangular.min.css'
Vue.use(vFlagIcons)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
