<template>
  <div id="app">
    <MyHeader></MyHeader>
    <Tabbar></Tabbar>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Tabbar from 'components/tabbar'
import MyHeader from 'components/header'
export default {
  components: { MyHeader, Tabbar }
}
</script>

<style scoped lang="sass">
  @import './common/scss/variable';
</style>
