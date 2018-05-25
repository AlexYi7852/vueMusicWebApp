<template>
  <div id="app">
    <MyHeader></MyHeader>
    <Tabbar></Tabbar>
    <router-view></router-view>
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
