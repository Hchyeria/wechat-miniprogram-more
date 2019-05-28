import {request} from './request.js'

export function doAuth(){
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              console.log("hfdghgfh")
              resolve()
            },
            fail() {
              console.log("23333")
              reject()
            }
          })
        }
      }
    })
  })
} 

export function userInfo(app){
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res){
        console.log(res)
        app.globalData.userInfo.nickName = res.nickName
        app.globalData.userInfo.avatarUrl = res.avatarUrl
        resolve()
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
        console.log(res)
        app.globalData.code = res.code
        wx.hideLoading()
        resolve()
      }
    })
  })
}

export function postCode(app){
  return new Promise((resolve,reject) =>{
    request('login.php', 0, {
      code: app.globalData.code,
      username: app.globalData.userInfo.nickName,
      avatar: app.globalData.userInfo.avatarUrl
    }, 'POST', 0, 1).then(data => {
      app.globalData.openID = data.openID,
      app.globalData.secret_key = data.secret_key
      resolve(data)
    })
  })

}