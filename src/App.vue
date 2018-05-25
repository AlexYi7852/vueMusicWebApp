<template>
  <div id="app">
    <MyHeader></MyHeader>
    <TabBar></TabBar>
    <router-view></router-view>
  </div>
</template>

<script>
import TabBar from 'components/tabbar'
import MyHeader from 'components/header'
export default {
  components: { MyHeader, TabBar }
}
</script>

<style scoped lang="sass">
  @import './common/scss/variable';
</style>
