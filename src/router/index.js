import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
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

router.beforeEach((to, from, next) => {
  if (!window.FIRST_PATH) {
    // 用于浏览器后退历史判断
    window.FIRST_PATH = to.path;
  }
  next()
})

router.afterEach((to, from) => {
  // 路由变化更新navbar的title
  if (to.meta) {
    let title = to.meta.title || '小牛普惠';
    if (IS_APP_ENV) {
      let navBar = new NavBar({
        title: title,
        buttons: to.meta.buttons || [],
        isHideNavBar: !!to.meta.isHideNavBar ? 1 : 0
      });
      navBar.show()
    } else {
      document.querySelector('title').innerText = title;
    }
  }
})

export default router