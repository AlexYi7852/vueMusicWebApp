
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
    _initScroll () {
      if (!this.$refs.scrollWrapper) { return }
      this.scroll = new BScroll(this.$refs.scrollWrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let _self = this
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
