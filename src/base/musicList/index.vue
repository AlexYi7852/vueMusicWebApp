
<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>  
    </div>
    <!-- 顶部歌手名字 -->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="aratarStyle" ref="avatar">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 图片蒙层 -->
      <div class="filter" ref="filter"></div>
    </div>
    <div class="avatar-layer" ref="layer">

    </div>
    <scroll @scroll="scroll" :probeType="probeType" 
    :listenScroll="listenScroll" :data="songs" class="list" ref="scrollList">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>  
</template>

<script>
import Scroll from 'base/scroll'
import Loading from 'base/loading'
import SongList from 'base/songList'

import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
// 预留回退栏高度
const RESERCED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('background-filter')
export default {
  components: { Scroll, SongList, Loading },
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
    // 计算头像的url
    aratarStyle () {
      return `background-image: url(${this.avatar})`
    }
  },
  methods: {
    // 设置store播放器的展开状态，传入播放列表， 播放歌曲index 
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    // 调用actions.selectPlay方法
    ...mapActions([
      'selectPlay'
    ]),
    // 接收子组件scroll事件的pos对象
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    }
  },
  watch: {
    // 推层动画逻辑
    scrollY (newY) {
      let zIndex = 0
      let scale = 1 // 组件下拉的时候图片放大的倍数
      // 滚动最大的距离是图片的高度
      let tranlateY = Math.max(this.minTranslateY, newY)
      this.$refs.layer.style[transform] = `translate3d(0, ${tranlateY}px, 0)`
      // 取得newY除以图片的大小
      const percent = Math.abs(newY / this.imageHeight)
      let blur = 0 // 组件上拉图片添加蒙层
      if (newY > 0) {
        zIndex = 10
        scale = 1 + percent // 图片放大的倍数
      } else {
        blur = Math.min(20 * percent, 20)
      }
      // 设置图片蒙层样式
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 当滚动条滚动到顶部的时候 改变图片的样式
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.avatar.style.paddingTop = 0
        this.$refs.avatar.style.height = `${ RESERCED_HEIGHT }px`
        // 随机播放按钮隐藏
        this.$refs.playBtn.style.display = 'none'
      // 否则重置样式
      } else {
        this.$refs.avatar.style.paddingTop = '70%'
        this.$refs.avatar.style.height = 0
        // 随机播放按钮显示
        this.$refs.playBtn.style.display = 'block'
      }
      // 设置下拉图片放大的倍数
      this.$refs.avatar.style.zIndex = zIndex
      this.$refs.avatar.style[transform] = `scale(${ scale })`
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
