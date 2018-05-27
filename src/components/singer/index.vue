
<template>
  <div class="singer">歌手</div>  
</template>

<script>
import Scroll from 'base/scroll'
import { MySinger } from 'api/singer'
import { ERR_OK } from 'api/config'
export default {
  data () {
    return {
      singerList: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      MySinger.getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = res.data.list
          console.log(this.singerList)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
