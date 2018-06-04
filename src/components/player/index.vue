<template>
  <div class="player-wrap" v-show="playList.length > 0">
    <!-- 正常的播放器 -->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景图 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
          </div>
          <!-- 顶部 -->
        <div class="top">
          <!-- 返回按钮 -->
          <div @click="back" class="back">
            <i class="icon-back"></i>
          </div>
          <!-- 歌曲名和歌手名 -->
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 中间区域 -->
        <div class="middle">
          <div class="middle-l">
            <!-- 唱片 -->
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="playing ? 'play' : 'play pause' ">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
          </div>
        </div>
        <!-- 底部操作区 -->
        <div class="bottom">
          <!-- 播放进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange="onProgressBarChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <!-- 底部控制栏 -->
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay"  :class="playing ? 'icon-pause' : 'icon-play' "></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 迷你播放器 -->
    <transition name="mini">
      <div @click="open" class="mini-player" v-show="!fullScreen">
        <div class="icon">
          <img width="40" height="40" :class="playing ? 'play' : 'play pause'"
                                                    :src="currentSong.image" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="playing ? 'icon-pause-mini' : 'icon-play-mini'" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放成功的时候会派发canplay事件和timeUpdate事件, 播放失败会派发error事件 -->
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateTime"
                                 @canplay="ready" @error="error"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ProgressBar from 'base/progressBar'
import ProgressCircle from 'base/progressCircle'
import { playMode } from 'common/js/config'
// 打乱数组方法
import { shuffle } from 'common/js/utils'
// 动画插件
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
// 添加transform前缀
const transform = prefixStyle('transform')
export default {
  components: { ProgressBar, ProgressCircle },
  data () {
    return {
      songReady: false, // 歌曲是否播放成功
      currentTime: 0, // 当前播放时间
      radius: 32
    }
  },
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    // 当歌曲url未加载或者加载失败禁止点击 前进/后退
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    // 获取当前歌曲播放时间相对于总时长比例
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'currentIndex',
      'playing',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    // 切换播放模式
    changeMode () {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 重置currentIndex
    _resetCurrentIndex (list) {
      // fingIndex是es6的语法接收一个函数，可以拿到每个list元素
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 最小化播放器
    back () {
      this.setFullScreen(false)
    },
    // 最大化播放器
    open () {
      this.setFullScreen(true)
    },
    // 把mutations的一些方法调用出来
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLATING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    // 播放/暂停
    togglePlay () {
      this.setPlayingState(!this.playing)
    },
    // 下一首
    next () {
      if (!this.songReady) { return }
      let index = this.currentIndex + 1
      if (index === this.playList.length) { index = 0 }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    // 上一首
    prev () {
      if (!this.songReady) { return }
      let index = this.currentIndex - 1
      if (index === -1) {index = this.playList.length - 1}
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      this.songReady = false
    },
    // audio标签成功播放派发的事件
    ready () {
      this.songReady = true
    },
    // audio标签播放失败派发的事件
    error () {
      console.log('error')
      this.songReady = true
    },
    updateTime (e) {
      // e.target.currentTime表示audio当前的播放时间
      this.currentTime = e.target.currentTime
    },
    // 把播放时间转换成分秒的形式
    format (interval) {
      interval = interval | 0
      let minute = this._pad(interval / 60 | 0)
      let second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 监听子组件进度条改变
    onProgressBarChange (percent) {
      // 设置当前歌曲播放时间
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      // 如果当前是暂停的，拖动进度条之后播放
      if (!this.playing) { this.togglePlay() }
    },
    // 给播放时间补0
    _pad (num) {
      let len = num.toString().length
      while (len < 2) {
        num = '0' + num
        len++
      }
      return num
    },
    // 计算偏移量和缩放比例
    _getPosAndScale () {
      // 迷你CD唱片宽
      let targetWidth = 40
      // 迷你CD唱片距左边距离
      let paddingLeft = 40
      // 迷你CD唱片距底部距离
      let paddingBottom = 30
      // 大的CD唱片距顶部距离
      let paddingTop = 80
      // 大的CD唱片的宽度
      let width = window.innerWidth * 0.8
      // 计算缩放比例
      let scale = targetWidth / width
      // X、Y轴偏移量
      let x = -(window.innerWidth / 2 - paddingLeft)
      let y = window.innerHeight - paddingTop -width / 2 - paddingBottom
      return {x, y, scale}
    },
    // 添加CD唱片逐渐 变大/变小 动画
    // 中部 cd 唱片，js 动画钩子
    enter (el, done) {
      let {x, y, scale} = this._getPosAndScale()
      // 声明动画效果
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      // 注册动画函数
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      // 执行动画函数runAnimation之后调用done(回调)
      // done执行完就会跳到afterEnter
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      // 销毁动画函数move, 然后把样式置为空
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      let {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      // 监听transition动画结束，调用done(回调), 随之执行afterLeave
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    }
  },
  watch: {
    // 监听currentSong, 然后播放歌曲
    currentSong (newSong, oldSong) {
      // if (newSong.id === oldSong.id) { return } 
      // 添加延时，然后播放
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    // 监听playing, 播放器 暂停/播放
    playing (newPlaying) {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>


<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.player-wrap {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
              -webkit-animation-play-state:paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
            margin-right: 5px;
          }
          &.time-r {
            text-align: right;
            margin-left: 5px;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;
      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter, &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
