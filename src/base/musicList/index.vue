
<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back">
      <i class="icon-back"></i>  
    </div>
    <!-- 顶部歌手名字 -->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="aratarStyle" ref="avatar">
      <div class="filter"></div>
    </div>
    <div class="avatar-layer" ref="layer">

    </div>
    <scroll @scroll="scroll" :probeType="probeType" 
    :listenScroll="listenScroll" :data="songs" class="list" ref="scrollList">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>  
</template>

<script>
import Scroll from 'base/scroll'
import SongList from 'base/songList'
// 预留回退栏高度
const RESERCED_HEIGHT = 40
export default {
  components: { Scroll, SongList },
  props: {
    avatar: {
      type: String,
      default: ''  
    },
    songs: {
      type: Array,
      default: []  
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.avatar.clientHeight
    // 记录最大滚动距离 = 图片高度 - 回退栏高度
    this.minTranslateY = -this.imageHeight + RESERCED_HEIGHT
    // scroll组件距离顶部的高度 = 图片高度
    this.$refs.scrollList.$el.style.top = `${this.imageHeight}px`
  },
  computed: {
    aratarStyle () {
      return `background-image: url(${this.avatar})`
    }
  },
  methods: {
    scroll (pos) {
      this.scrollY = pos.y
    }
  },
  watch: {
    // 推层动画逻辑
    scrollY (newY) {
      let zIndex = 0
      // 滚动最大的距离是图片的高度
      let tranlateY = Math.max(this.minTranslateY, newY)
      this.$refs.layer.style['transform'] = `translate3d(0, ${tranlateY}px, 0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${tranlateY}px, 0)`
      // 当滚动条滚动到顶部的时候
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.avatar.style.paddingTop = 0
        this.$refs.avatar.style.height = `${ RESERCED_HEIGHT }px`
      } else {
        this.$refs.avatar.style.paddingTop = '70%'
        this.$refs.avatar.style.height = 0
      }
      this.$refs.avatar.style.zIndex = zIndex
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 100;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .avatar-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    // overflow: hidden;
    background: $color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
