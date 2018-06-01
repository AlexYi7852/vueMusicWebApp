
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

let elementStyle = document.createElement('div').style
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

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
