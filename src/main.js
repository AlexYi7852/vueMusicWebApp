import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import mixin from './mixin'
import store from './store'
import router from './router'
// 解决移动端延迟300毫秒事件
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/scss'

Vue.mixin(mixin)
// 移动端自适应rem
// import './utils/setFontSize.js'

fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  loading: require('common/img/default.png')
})
// Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
