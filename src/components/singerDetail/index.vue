

<template>
  <transition name="slide">
    <div class="singer-detail"></div>    
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    console.log('hello')
    // console.log(this.singer)
  }
}
</script>


<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  &.slide-enter-active, .slide-leave-active {
    transition: all .3s
  }
  &.slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
