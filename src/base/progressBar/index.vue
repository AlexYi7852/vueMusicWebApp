
<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
        <!-- 已播放的进度 -->
      <div class="progress" ref="progress"></div>
      <!-- 按钮 -->
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"></div>
      </div>  
    </div>
  </div>  
</template>

<script>
// 引入transform 前缀
import { prefixStyle } from 'common/js/dom'
// 按钮宽度
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    // 百分比
    percent: {
      type: Number,
      default: 0  
    }  
  },
  watch: {
    percent (newPercent) {
      if(newPercent >= 0) {
        // 首先获取progressBar的宽度  
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 按钮偏移的宽度
        let offsetWidth = newPercent * barWidth
        // 播放的进度的宽度
        this.$refs.progress.style.width = `${offsetWidth}`
        // 按钮偏移量
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
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
