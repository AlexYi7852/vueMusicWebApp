
export const MyDom = {
  // 判断是否有这个class类名
  hasClass (el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  },
  // 添加class类名
  addClass (el, className) {
    if (this.hasClass(el, className)) {
      return
    }
    let newClass = el.className.split('')
    newClass.push(className)
    el.className = newClass.join('')
  }
}
