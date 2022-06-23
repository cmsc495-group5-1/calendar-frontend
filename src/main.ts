import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCompositionAPI from '@vue/composition-api'
import DatetimePicker from 'vuetify-datetime-picker'

Vue.use(VueCompositionAPI)
Vue.use(DatetimePicker)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
