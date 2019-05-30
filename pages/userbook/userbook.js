// pages/userbook/userbook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  exit() {
    wx.navigateBack({
      delta: 1
    })
  }
})