<template>
  <div id="app">
    <MyHeader></MyHeader>
    <Tabbar></Tabbar>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <player></player>
  </div>
</template>

<script>
import Tabbar from 'components/tabbar'
import MyHeader from 'components/header'
import Player from 'components/player'
export default {
  components: { MyHeader, Tabbar, Player }
}
</script>

<style scoped lang="sass">
  @import './common/scss/variable';
</style>
