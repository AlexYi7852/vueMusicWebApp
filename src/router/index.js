import Vue from 'vue'
import Router from 'vue-router'
import MyRank from 'components/MyRank'
import MySearch from 'components/MySearch'
import MySinger from 'components/MySinger'
import MyRecommend from 'components/MyRecommend'

Vue.use(Router)

export default new Router({
  routers: [
    {
      name: 'rank',
      path: '/rank',
      component: MyRank
    },
    {
      name: 'search',
      path: '/search',
      component: MySearch
    },
    {
      name: 'singer',
      path: '/singer',
      component: MySinger
    },
    {
      name: 'recommend',
      path: '/recommend',
      component: MyRecommend
    }
  ]
})
