import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior(to, from, savedPosition) {
    // console.log(to, 'to', from, 'from', savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend', // 推荐页
      meta: { title: '推荐', keepAlive: true },
      component: resolve => require(['components/recommend'], resolve)
    },
    {
      path: '/ranking', // 排行榜
      meta: { title: '排行榜' },
      component: resolve => require(['components/ranking'], resolve)
    },
    {
      path: '/search', // 搜索页面
      meta: { title: '搜索' },
      component: resolve => require(['components/search'], resolve)
    },
    {
      path: '/singer', // 歌手页面
      meta: { title: '歌手', keepAlive: false},
      component: resolve => require(['components/singer'], resolve),
      children: [{
        path: ':id', // 歌手详情页面  id 为变量
        component: resolve => require(['components/singerDetail'], resolve)
      }]
    }, 
    {
      path: '/user', // 个人中心
      meta: { title: '个人中心' },
      component: resolve => require(['components/userCenter'], resolve)
    }
  ]
})
