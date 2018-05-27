import axios from 'axios'
import jsonp from 'common/js/jsonp'
import { commonParams, options } from 'api/config'

export const MyRecommend = {
  /**
   * jsonp 抓取推荐页轮播图数据
   * 接口：https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg
   */
  getSliderList () {
    let config = {
      uin: 0,
      platform: 'h5',
      needNewCode: 1
    }
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, commonParams, config)
    return jsonp(url, data, options)
  },
  /**
   * axios 抓取推荐页歌单列表数据
   * 接口：
   * 接口提供方使用了 referer:https://y.qq.com/portal/playlist.html
   * axios 结合 node.js 代理后端请求
   */
  getDiscList () {
    let config = {
      platform: 'yqq',
      hostUin: 0,
      sin: 0,
      ein: 29,
      sortId: 5,
      needNewCode: 0,
      categoryId: 10000000,
      rnd: Math.random(),
      format: 'json'
    }
    let url = '/api/getDiscList'
    let data = Object.assign({}, commonParams, config)
    return axios.get(url, {
      params: data
    }).then((res) => {
      return Promise.resolve(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }
}
