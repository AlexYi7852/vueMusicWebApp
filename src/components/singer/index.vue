
<template>
  <div class="singer">
    <imitate-mail-list @select="selectSinger" :data="singerList"></imitate-mail-list>
    <router-view></router-view>
  </div>  
</template>

<script>
import Scroll from 'base/scroll'
import { MySinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
// 通讯录组件
import imitateMailList from 'base/imitateMailList'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10 // 热门数据长度
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
    selectSinger (singer) {
      this.$router.push({ path: `/singer/${singer.id}` })
      // 提交数据到state.singer
      // 提交数据到store.state.singer
      this.setSinger(singer)
    },
    _getSingerList () {
      MySinger.getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._handlerSinger(res.data.list)
        }
      })
    },
    // 组合我们所需要的数据
    _handlerSinger (list) {
      // 所有数据集合
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 当索引小于10, 组合热门数据列表
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 字母/ title
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 组合其它字母的数据
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表， 我们需要处理map
      let hot = []  // 热门数据列表
      let rest = [] // 其它字母数据列表
      for (let key in map) {
        let val = map[key]  // 数据
        // 如果title是字母, 就添加到rest列表
        if (val.title.match(/[a-zA-Z]/)) {
          rest.push(val)
        // 其它的添加到热门列表  
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 把字母数据列表进行排序
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(rest)
    },
    // 提交到vuex.store.singer
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
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
