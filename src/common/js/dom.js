
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
  },

  getElementIndex (el, name, val) {
    if (val) {
      return el.setAttribute(`data-${name}`, val)
    } else {
      return el.getAttribute(`data-${name}`)
    }
  }
}
// 自动判断浏览器加CSS兼容前缀 prefixStyle
// 首先生成基于用户浏览器的div样式
let elementStyle = document.createElement('div').style
// 根据 vendor 供应商定义的不同浏览器前缀，去测试用户浏览器。
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform', // 火狐
    O: 'OTransform', // opera
    ms: 'msTransform', // IE
    standard: 'transform' // 标准
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()
// 方法就是判断创建的 div 样式是否有相应的前缀样式，
// 如果有，则返回前缀样式的key，也就是需要的 前缀
// 通过 prefixStyle 函数，参数为我们需要兼容的样式。
// 如果需要加签注，返回的格式是 前缀 + 首字母大写的样式
// （应为通常前缀样式为 -webkit-transform-origin，JS操作时，
// 不能写 -，可以采用驼峰写法，也就是样式首字母大写）
export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
