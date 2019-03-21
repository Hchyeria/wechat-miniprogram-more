import { doAuth,login } from './utils/authorize.js'
App({
  onLaunch(){
    login(this).then(() => {
      console.log(this.globalData.openid)
      console.log(this.globalData.userInfo)
    })
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    system: wx.getSystemInfoSync()['system'].charAt(0),
    openid:1111,
    userInfo:{}
  }
})