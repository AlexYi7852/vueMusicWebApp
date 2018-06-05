<!-- 父组件是recommend -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <!-- 下面小点 -->
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index"
                   :class="{ active: currentDotsIndex === index}"></span>  
    </div>
  </div>  
</template>

<script>
import BScroll from "better-scroll";
import { MyDom } from "common/js/dom";
export default {
  data() {
    return {
      dots: [],
      currentDotsIndex: 0 // 当前小点
    };
  },
  props: {
    // 是否循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播延时
    interval: {
      type: Number,
      default: 3000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      if (this.autoPlay) {
        this._initPlay();
      }
      // 当窗口尺寸改变时，重新计算轮播宽度
      window.addEventListener("resize", () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      });
    }, 20);
  },
  methods: {
    // 横向滚动需要设置slider(sliderGroup)宽度
    _setSliderWidth(isResize) {
      // 首先获取slider(sliderGroup)的子元素数量
      this.children = this.$refs.sliderGroup.children;
      let width = 0; // 初始化父元素宽度
      // 获取父元素的宽度, 每个子元素的宽度等于父元素的宽度
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        // 给每个子元素添加class类名, 并且设置宽度
        MyDom.addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth; // 累加计算出父元素的总宽度
      }
      // 如果可以无缝循环轮播，父元素的宽度要加两个子元素的宽度
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    // 初始化slider
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 是否允许横向滚动
        scrollY: false, // 是否允许纵向滚动
        // 现象:
        //     可以轮播,但不能循环(不能从第一张往前翻,不能从最后一张往后翻)
        //     按教程里给slider-group增加了2个slider的宽度,但他们出现在轮播图片的末尾(2个空白)
        //     第一张图没有对应dot,第二张图对应第一个dot,以此类推
        // 0.1.15中可以正常运行,原来是better-scoll版本的问题,在新版本中,
        // 轮播图的bs对象需要这么配置(snap写在一个对象中):
        snap: {
          loop: this.loop, // 是否可以无缝循环轮播
          snapThreshold: 0.3, // 用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
          snapSpeed: 400 // 轮播图切换的动画时间
        }, // 该属性是给 slider 组件使用的，普通的列表滚动不需要配置
        momentum: false // 当快速滑动时是否开启滑动惯性
      });
      // 滚动完毕的时候获取它的pageIndex
      this.slider.on("scrollEnd", () => {
        // 获取当前小点
        let dotsIndex = this.slider.getCurrentPage().pageX;
        // 老版本有,新版去掉:
        // if (this.loop) {
        //   pageIndex -= 1
        // }
        this.currentDotsIndex = dotsIndex;
        if (this.autoPlay) {
          clearTimeout(this.timer); //用手拖动的时候
          this._initPlay();
        }
      });
    },
    // 老版本后dots会多两个
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    // 无缝循环轮播
    _initPlay() {
      let pageIndex = this.currentDotsIndex;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        // 1.0版本以上用next() 实现无缝循环轮播
        // 1.0以下用goToPage， goToPage是better-scroll内置方法
        this.slider.next();
      }, this.interval);
    }
  },
  // 离开页面的时候清除定时器，有利于内存释放
  destroyed () {
    clearTimeout(this.timer)
  }
};
</script>

<style lang="scss" scoped>
@import "common/scss/variable";

.slider {
  min-height: 1px;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot {
      display: inline-block;
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
}
</style>
