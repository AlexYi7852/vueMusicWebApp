const mixin = {
  data () {
    return {
      show: false
    }
  },
  methods: {
    // 限制用户输入框只能输入数字
    onlyNumber (val) {
        return val.replace(/\D/g,'')
      }
  }
}