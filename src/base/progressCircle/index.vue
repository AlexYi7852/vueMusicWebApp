<!-- mini 的圆形进度条, 父组件是player
利用了 SVG 实现，其中有两个圆，
一个是背景圆形，另一个为已播放的圆形进度 -->
<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" cx="50" cy="50" r="50" fill="transparent"/>
      <!-- stroke-dasharray(进度条总长)描边以及描边距离,stroke-dashoffset描边(进度条长度)偏移 -->
      <circle class="progress-bar" cx="50" cy="50" r="50" fill="transparent"
                          :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" />
    </svg> 
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    // 圆圈宽高  
    radius: {
      type: Number,
      default: 100 
    },
    // 进度条百分比
    percent: {
      type: Number,
      default: 0  
    }
  },
  data () {
    return {
      // 圆的周长和它的直径之比  
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset () {
      return (1 - this.percent) * this.dashArray
    }  
  }
}
</script>


<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.progress-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: $color-theme-d;
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>
