export const HOST = 'https://lmy.kaixindeken.top:777'
const BASE_URL = `${HOST}/api`

function toString(obj){
  let keys = Object.keys(obj)
  let s = []
  for(let i in keys){
    s.push(`${keys[i]}=${obj[keys[i]]}`)
  }
  return s.join('&')
}

export function request(targetURL,params){
  return new Promise((resolve,reject) => {
    let rejectAndAlert = err => {
      wx.showModal({
        title: '请求失败',
        content: err.message,
        showCancel: false
      })
      reject(err)
    }
    let url = `${BASE_URL}/${targetURL}?${toString(params)}`
    console.log(url)
    wx.request({
      url: url,
      success(res){
        let {data} = res
        if (data.error_code === -1 || data.error_code === undefined){
          resolve(data)
          return
        }
        let err = new Error(`返回数据异常`)
        err.res = res
        return rejectAndAlert(err)
      },
      fail(res){
        let err = new Error(`request:fail`)
        err.res = res
        return rejectAndAlert(err)
      }
    })
  })
}