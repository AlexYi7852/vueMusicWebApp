
import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend' // 推荐页
import Ranking from 'components/ranking' // 排行榜
import Search from 'components/search' // 搜索页面
import Singer from 'components/singer' // 歌手页面
import UserCenter from 'components/userCenter' // 个人中心
import SingerDetail from 'components/singerDetail' // 歌手详情页面

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    console.log(to, 'to', from, 'from', savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    { path: '/', redirect: '/recommend' },
    { path: '/recommend', component: Recommend, meta: { keepAlive: true } },
    { path: '/ranking', component: Ranking },
    { path: '/search', component: Search },
    {
      path: '/singer',
      component: Singer,
      meta: { keepAlive: false },
      children: [
        {
          path: ':id', // 表示 id 为变量
          component: SingerDetail
        }
      ]
    },
    { path: '/user', component: UserCenter }
  ]
})
