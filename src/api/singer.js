
import jsonp from 'common/js/jsonp'
import { commonParams, options } from 'api/config'

export const MySinger = {
  /**
  * jsonp 抓取歌手页数据
  * 接口：https://c.y.qq.com/v8/fcg-bin/v8.fcg
  */
  getSingerList () {
    let config = {
      channel: 'singer',
      page: 'list',
      key: 'all_all_all',
      pagesize: 100,
      pagenum: 1,
      g_tk: 1576475597,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0
    }
    let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    let data = Object.assign({}, commonParams, config)
    return jsonp(url, data, options)
  },

  getSingerDetail (singerId) {
    let config = {
      g_tk: 1664029744,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0,
      order: 'listen',
      begin: 0,
      num: 100,
      songstatus: 1,
      singermid: singerId
    }
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    let data = Object.assign({}, commonParams, config)
    return jsonp(url, data, options)
  }
}
