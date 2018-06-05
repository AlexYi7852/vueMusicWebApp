

<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :avatar="avatar"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { MySinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'base/musicList'
export default {
  components: { MusicList },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    avatar () {
      return this.singer.avatar
    },
    // 取 vuex 中存好的数据
    ...mapGetters([
      // 将 singer 映射为 getters 里面的singer数据,直接可以this.singer调用
      'singer'
    ])
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      // 禁止直接刷新详情页（获取不到歌手 id）
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      MySinger.getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._handlerSongs(res.data.list)
        }
      })
    },
    // 重组 res.data.list 数据
    _handlerSongs (list) {
      let result = []
      list.forEach((item) => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          result.push(createSong(musicData))
        }
      })
      return result
    }
  }
}
</script>


<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.slide-enter-active, .slide-leave-active {
  transition: all .3s
}
.slide-enter, .slide-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

</style>
