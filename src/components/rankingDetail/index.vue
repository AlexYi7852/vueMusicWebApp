
<template>
  <transition name="slide" class="ranking-detail"></transition>
</template>



<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';

.ranking-detail {
  // position: fixed;
  // z-index: 100;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // background: $color-background;
}

.slide-enter-active, .slide-leave-active {
  transition: all .3s ease;
}
.slide-enter, .slide-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
</style>
