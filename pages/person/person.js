import { forTabBar } from '../../custom-tab-bar/switchTab.js'
import {
  request
} from '../../utils/request.js'

function loadUser(that) {
  return new Promise(() => {
    request('users.php', {
      secondType: 'get_user_info',
      secret_key: app.globalData.secret_key,
    }).then(data => {
      that.setData({
        reply: data.result[0].reply_num,
        post: data.result[0].post_num,
        school: data.result[0].school_name
      })
    })
  })
}

const app = getApp()

Page({
  data: {
    avatar: '',
    nickName: '',
    post: '',
    reply: '',
    school: '',
  },
  onShow() {
    loadUser(this)
    this.setData({
      avatar: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    })
    wx.stopPullDownRefresh()
    forTabBar(this, 2)
  },
  collection() {
    wx.navigateTo({
      url: `../../pages/collection/collection`,
    })
  },
  post() {
    wx.navigateTo({
      url: `../../pages/post/post`,
    })
  },
  message() {
    wx.navigateTo({
      url: `../../pages/mymessage/mymessage`,
    })
  },
  contact() {
    wx.navigateTo({
      url: `../../pages/contact/contact`,
    })
  },
  userbook() {
    wx.navigateTo({
      url: `../../pages/userbook/userbook`,
    })
  },
})