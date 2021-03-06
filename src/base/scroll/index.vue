
<template>
  <div ref="scrollWrapper">
    <slot></slot>  
  </div>  
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    // 1：滚动的时候会派发scroll事件，会截流
    // 2：滚动的时候实时派发scroll事件，不会截流
    // 3：除了实时派发scroll事件，在swiper的情况下仍然能实时派发scroll事件  
    probeType: {
      type: Number,
      default: 1  
    },
    click: {
      type: Boolean,
      default: true  
    },
    data: {
      type: Array,
      default: null  
    },
    // 监听scroll组件滚动
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // 确保dom已经渲染，所以需要setTimeout 20
    setTimeout(() => {
      this._initScroll()  
    }, 20)
  },
  methods: {
    // 初始化scroll组件
    _initScroll () {
      // 如果dom还未生成， 直接return
      if (!this.$refs.scrollWrapper) { return }
      // 生成scroll实例
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 监听滚动事件，并派发事件以供父组件监听，将 pos 值传出去
      if (this.listenScroll) {
        let _self = this
        // 实时监测滚动事件，派发事件：Y轴距离
        this.scroll.on('scroll', (pos) => {
          _self.$emit('scroll', pos)
        })
      }
    },
    // 代理better-scroll的enable(), disable(), refresh()方法
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 点击右侧， 左侧联动到相应位置
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 如果data变化， 需要重新计算scroll
    data () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
