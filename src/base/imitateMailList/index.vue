<!-- 父组件是singer -->
<template>
  <scroll ref="scroll" class="singer-wrapper" :probeType="probeType"
         :data="data" :listenScroll="listenScroll" @scroll="scroll">
    <!-- 左侧歌手列表 -->
    <ul>
      <!-- 点击右侧，左侧联动 -->
      <li class="list-group" v-for="(group, index) in data" :key="index" ref="listGroup">
        <h2 class="list-group-title" :class="{'current': currentIndex === index}">
          {{ group.title }}
        </h2>
        <ul>
          <li v-for="(item, index) in group.items"
          @click="selectItem(item)" :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧字母列表 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart"
                   @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" 
                   :class="{'current': currentIndex === index}"
                              :data-index="index" class="item">
        {{ item }}
        </li>
      </ul>
    </div>
    <!-- 滚动固定标题实现 -->
    <div ref="fixedTitleRef" class="list-title-fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>

    <!-- loading 组件 -->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>  
</template>

<script>
import Scroll from "base/scroll"
import Loading from 'base/loading'
import { MyDom } from 'common/js/dom'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 29
export default {
  components: { Scroll, Loading },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      // listGroup下一个子元素距离上一个子元素title的距离
      diff: -1
    }
  },
  props: {
    // 从父组件传过来的数据列表
    data: {
      type: Array,
      default: []
    }
  },
  created () {
    this.touch = {},
    // 监听滚动事件
    this.listenScroll = true,
    // better-scroll 属性probeType = 3的时候不会阻拦派发scroll
    this.probeType = 3,
    // 每个listGroup子元素距顶部的距离列表
    this.listHeight = []
  },
  computed: {
    // 字母列表
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    // 固定title
    fixedTitle () {
      if (this.scrollY > 0) { return '' }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  // watch 的回调函数的第一个参数表示变化的新值
  watch: {
    // 监听data变化，计算每个listGroup子元素距顶部的距离
    data () {
       // 延时，确保DOM渲染之后执行，
      //  通常是nextTick，这里用setTimeout是为了兼容更低
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    // 这里的 scrollY 是当前组件上的，和 BScroll 的并不是一个
    // 监听 scrollY 落在listGroup哪个子元素区间，实现高亮联动
    scrollY (newY) {
      const listHeight = this.listHeight
      // 1. 当滚动至顶部以上
      if (newY > 0) { this.currentIndex = 0; return }

      // 2. 当在中间部分滚动，
      // length之所以 -1 是因为 当初高度列表定义必须多一个
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 第一个子元素距顶部的距离，依次累加
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        // 当-Y值小于等于height1 并且大于height，
        // 就知道currentIndex在哪个子元素区间
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // 在中间部分滚动时，会不断设置 diff 值，
          // 每个区块的高度上限（也就是底部）减去 Y轴偏移的值
          this.diff = height2 + newY // height 上限 - newY 的值
          return
        }
      }
      // 3. 当滚动至底部，且 newY 大于最后一个元素的上限
      this.currentIndex = listHeight - 2
    },
    // watch 检测 diff 变化，判断如果 diff>0 且 小于 title 块的高度，
    // 设为差值，否则为0, 再将 fixed 的 title 块 translate 偏移
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 当偏移量等于title的高度时, 什么也不做 
      if(this.fixedTop === fixedTop) { return }
      this.fixedTop = fixedTop
      // 给title添加偏移量
      this.$refs.fixedTitleRef.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  methods: {
    // 监听点击事件，将具体点击的歌手派发出去，
    // 以供父组件 singer 监听
    selectItem (item) {
      this.$emit('select', item)
    },
    // 点击右侧，左侧联动
    onShortcutTouchStart (event) {
      // 第一次触碰的位置
      let firstTouch = event.touches[0]
      // 保存 第一次触碰的位置的Y值
      this.touch.y1 = firstTouch.pageY
      // 获取 点击具体锚点的 index 值
      let firstIndex = MyDom.getElementIndex(event.target, 'index')
      // 保存 第一次触碰时的锚点 index 值
      this.touch.firstIndex = firstIndex
      // 点击右侧，左侧联动到相应的位置
      this._scrollTo(firstIndex)
    },
    // 滑动右侧，左侧滚动到相应位置
    onShortcutTouchMove (event) {
      // 获取最后一次手指触碰的位置
      let lastTouch = event.touches[0]
      // 获取最后一次手指触碰的位置的Y值
      this.touch.y2 = lastTouch.pageY
      // 两次触碰 Y 轴的偏移锚点值
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
      // 获取 偏移了多少 index 值  ，因为 firstIndex 是字符串，所以要转成数字再相加
      let targetIndex = parseInt(this.touch.firstIndex) + delta
      this._scrollTo(targetIndex)
    },
    // 接收从scroll组建传过来的Y值
    scroll (pos) {
      this.scrollY = pos.y
    },
    // 计算每个listGroup子元素的高度
    _calculateHeight () {
      // 遍历listGroup， 获取每个子元素的距顶部的高度
      const list = this.$refs.listGroup
      // 第一个子元素是0
      let height = 0
      this.listHeight.push(height)
      // 把每个子元素的高度添加到this.listHeight
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        // 把每个子元素的距顶部的高度添加到this.listHeight
        this.listHeight.push(height)
      }
    },
    // 点击/触摸 移动/滚动 到目标元素
    _scrollTo (index) {
      // 如果点击到最上面或者最下面的padding位置， 直接return
      if (!index && index !== 0) { return }
      // 如果滑动到最上面padding位置， index = 0
      else if (index < 0) {
        index = 0 
      // 滑动到最下面padding位置， index = 最后一个索引
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0)
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.singer-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
      &.current {
        color: $color-theme;
      }
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-title-fixed {
    position: absolute;
    top: -1px;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-theme;
      background: $color-highlight-background;
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
