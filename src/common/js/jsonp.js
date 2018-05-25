import originJSONP from 'jsonp'

function param (data) {
  let url = ''
  for (let i in data) {
    let value = data[i] !== undefined ? data[i] : ''
    url += `&${i}=${encodeURIComponent(value)}`
  }
  // 如果有url就删除第一个&
  return url ? url.substring(1) : ''
}

export default function jspnp (url, data, option) {
  // 如果url没有？就加一个? 否则加上&
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(url)

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
