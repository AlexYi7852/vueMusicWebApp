<template>
  <div id="app">
    <MyHeader></MyHeader>
    <MyTab></MyTab>
    <router-view></router-view>
  </div>
</template>

<script>
import MyTab from 'components/MyTab'
import MyHeader from 'components/MyHeader'
export default {
  components: { MyHeader, MyTab }
}
</script>

<style scoped lang="sass">
  @import './common/scss/variable';
</style>
