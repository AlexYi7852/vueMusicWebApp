

<template>
  <transition name="slide">
    <div class="singer-detail"></div>    
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { MySinger } from 'api/singer'
import { ERR_OK } from 'api/config'
// import { createSong } from 'common/js/song'
export default {
  data () {
    songs: []
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
    console.log(this.singer)
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      MySinger.getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          // this.songs = this._handlerSongs(res.data.list)
          console.log(this.songs)
        }
      })
    },
    // 重组歌曲列表
    // _handlerSongs (list) {
    //   let result = []
    //   list.forEach((item) => {
    //     let { musicData } = item
    //     if (musicData.songid && musicData.albummid) {
    //       result.push(createSong(musicData))
    //     }
    //   })
    //   return result
    // }
  }
}
</script>


<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  &.slide-enter-active, .slide-leave-active {
    transition: all .3s
  }
  &.slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
