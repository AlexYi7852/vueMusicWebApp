import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
// 解决移动端延迟300毫秒事件
import fastclick from 'fastclick'
// import router from './router'

import 'common/scss/index.scss'

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
