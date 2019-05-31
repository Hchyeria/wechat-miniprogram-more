export const BASE_URL = 'wechatmore.xyz:666'
export const API_URL = `https://${BASE_URL}/api`
export const NOT_API_URL = `https://${BASE_URL}`

function toString(obj) {
  let s = []
  Object.keys(obj).forEach(i => s.push(`${i}=${obj[i]}`))
  return s.join('&')
}

export function request(targetURL, paramdata = undefined, postdata = {}, method = 'GET', ishasapi = 1, isfromdata = 0) {
  return new Promise((resolve, reject) => {
    let rejectAndAlert = err => {
      wx.showModal({
        title: '请求失败',
        content: err.message,
        showCancel: false
      })
      reject(err)
    }
    let url = ishasapi ? `${API_URL}/${targetURL}` : `${NOT_API_URL}/${targetURL}`

    if (paramdata) {
      url = `${url}?${toString(paramdata)}`
    }
    wx.request({
      url,
      method,
      data: method == 'POST' ? postdata : {},
      header: {
        'Content-Type': isfromdata ?
          'application/x-www-form-urlencoded' :
          'application/json'
      },
      success(res) {
        let { data } = res
        if (data === undefined) {
          let err = new Error(`返回数据异常`)
          err.res = res
          return rejectAndAlert(err)
        }
        if (data.error_code === -1 || data.error_code === undefined || data.error_code === 5) {
          resolve(data)
          return
        }
        let err = new Error(`返回数据异常`)
        err.res = res
        return rejectAndAlert(err)
      },
      fail(res) {
        let err = new Error(`request:fail`)
        err.res = res
        return rejectAndAlert(err)
      }
    })
  })
}
export function parseTimeStamp(t) {
  let [date, time] = t.split(' ')
  let dates = date.split('-')
  dates[1]--
  let times = time.split(':')
  date = new Date()
  date.setFullYear(...dates)
  date.setHours(times[0])
  date.setMinutes(times[1])
  date.setSeconds(times[2])
  let now = (new Date()).getTime()
  let during = (now - date.getTime()) / 1000
  if (during > 30 * 24 * 60 * 60) {
    return parseInt(during / (30 * 24 * 60 * 60)) + '月前'
  } else if (during > 7 * 24 * 60 * 60) {
    return parseInt(during / (7 * 24 * 60 * 60)) + '周前'
  } else if (during > 24 * 60 * 60) {
    return parseInt(during / (24 * 60 * 60)) + '天前'
  } else if (during > 60 * 60) {
    return parseInt(during / (60 * 60)) + '小时前'
  } else if (during > 60) {
    return parseInt(during / 60) + '分钟前'
  } else {
    return '数秒前'
  }
}