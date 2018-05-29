
<template>
  <div class="singer">
    <imitate-mail-list :data="singerList">

    </imitate-mail-list>
  </div>  
</template>

<script>
import Scroll from 'base/scroll'
import { MySinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
// 通讯录组件
import imitateMailList from 'base/imitateMailList'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10 
export default {
  components: { Scroll, imitateMailList },
  data () {
    return {
      singerList: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      MySinger.getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 组合我们所需要的数据
    _normalizeSinger (list) {
      // 所有数据集合
      let map = {
        hot: { // 热门
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 组合热门数据列表
        console.log(item, index)
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表， 我们需要处理map
      let hot = []
      let rest = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          rest.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(rest)
    }
  }
}
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
