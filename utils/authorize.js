import {request} from './request.js'

export function doAuth(app) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          resolve()
          return
        }
        wx.getUserInfo({
          success: res => {
            if (app.userInfoReadyCallback) {
              app.userInfoReadyCallback(res)
              app.globalData.userInfo = res
              resolve()
              return
            }
          }
        })
      }
    })
  })
}

export function login(app) {
  return new Promise((resolve,reject)=>{
    wx.showLoading({
      title: '登陆中',
      mask: true
    })
    wx.login({
      success: res => {
        request('users.php', {
          secondType: 'get_openID',
          code: res.code
        }).then(data => {
          console.log(`openid=${data.openid}`)
          app.globalData.openid = data.openid
          wx.hideLoading()
          resolve()
        }, () => {
          wx.hideLoading()
          reject()
        })
      }
    })
  })
}