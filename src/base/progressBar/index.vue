
<template>
  <div class="progress-bar" ref="barRef">
    <div class="bar-inner">
        <!-- 已播放的进度 -->
      <div class="progress" ref="progressRef"></div>
      <!-- 按钮 -->
      <div class="progress-btn-wrapper" ref="btnRef"
                         @touchstart.prevent="progressTouchStart"
                           @touchmove="progressTouchMove"
                             @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>  
    </div>
  </div>  
</template>

<script>
// 引入transform 前缀
import { prefixStyle } from 'common/js/dom'
// 按钮宽度
const BTN_WIDTH = 16
const transform = prefixStyle('transform')
export default {
  props: {
    // 当前播放进度 [0, 1]
    percent: {
      type: Number,
      default: 0  
    }  
  },
  created () {
    // 共享数据对象
    this.touch = {}
  },
  methods: {
    // 拖动小球改变播放进度，小球滑动开始位置
    progressTouchStart (e) {
      this.touch.init = true
      // 开始滑动的位置
      this.touch.startX = e.touches[0].pageX
      // 当前偏移
      this.touch.left = this.$refs.progressRef.clientWidth
    },
    // 拖动小球改变播放进度，小球滑动过程中
    progressTouchMove (e) {
      if (!this.touch.init) return

      // 滑动的差值
      let deltaX = e.touches[0].pageX - this.touch.startX
      // 进度条的差值，大于0，小于总长度
      let offsetWidth = Math.min(this.$refs.barRef.clientWidth - BTN_WIDTH, Math.max(0, this.touch.left + deltaX))

      this._move(offsetWidth)
    },
    // 拖动小球改变播放进度，小球滑动结束
    progressTouchEnd () {
      this.touch.init = false
    },
    // 进度条前进 + 小球前进
    _move(offsetWidth) {
      this.$refs.progressRef.style.width = `${offsetWidth}px`
      this.$refs.btnRef.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    // 播放进度
    percent(newVal) {
      // 拖动的时候不要 watch
      if (newVal >= 0 && !this.touch.init) {
        let barWidth = this.$refs.barRef.clientWidth - BTN_WIDTH
        let offsetWidth = newVal * barWidth
        this._move(offsetWidth)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
