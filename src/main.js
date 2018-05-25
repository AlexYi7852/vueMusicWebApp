import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// 解决移动端延迟300毫秒事件
import fastclick from 'fastclick'

import 'common/scss/index.scss'

fastclick.attach(document.body)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
