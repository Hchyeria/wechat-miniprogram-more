import { login } from './utils/authorize.js'

App({
  onLaunch() {
    login(this)
  },
  onShow() {
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    system: wx.getSystemInfoSync()['system'].charAt(0),
    deviceH: wx.getSystemInfoSync()['windowHeight'],
    code: ' ',
    openID: '',
    userInfo: {},
    secret_key: '',
    latitude:'',
    longitude:''
  }
})