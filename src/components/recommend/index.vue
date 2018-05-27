
<template>
  <div class="recommend">
    <!-- better-scroll 滚动组件，当请求到 lists 时才渲染 -->
    <scroll ref="scroll" :data="discList" class="recommend-content">
      <div>
        <!-- 轮播图，当请求到 recommends 时才渲染 -->
        <div v-if="sliderList.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in sliderList" :key="index">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">  
              </a>  
            </div>
          </slider> 
        </div>
        <!-- 歌单推荐列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in discList" :key="index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" />
              </div>
              <div class="text">
                <h2 class="name">{{ item.creator.name }}</h2>
                <p class="desc">{{ item.dissname }}</p>
              </div>
            </li>
          </ul>  
        </div>
      </div>
    <div class="loading-container" v-show="!discList.length">
      <loading></loading>
    </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll'
import Slider from 'base/slider'
import Loading from 'base/loading'
import { MyRecommend } from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
  components: { Slider, Scroll, Loading },
  data () {
    return {
      flag: false,
      sliderList: [], // 轮播列表
      discList: []    // 歌单列表
    }
  },
  created () {
    this._getSliderList()
    this._getDiscList()
  },
  methods: {
    // 获取轮播图数据  
    _getSliderList () {
      MyRecommend.getSliderList().then((res) => {
        if (res.code === ERR_OK) {
          this.sliderList = res.data.slider
        }  
      })  
    },
    // 抓取推荐页歌单列表数据
    _getDiscList () {
      MyRecommend.getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    // 当获取到第一张图片时，Better-scroll 重新计算
    loadImage () {
      if (!this.flag) {
        this.$refs.scroll.refresh()
        this.flag = true
      }
    }
  } 
}
</script>


<style lang="scss" scoped>
@import '../../common/scss/variable';
@import '../../common/scss/mixin';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .desc {
            color: $color-text-d;
          }
        }
      }
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
