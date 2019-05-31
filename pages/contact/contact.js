// pages/contact/contact.js
import {
  request
} from '../../utils/request.js'

function setcontact(type, param, data, that) {
  request(type, param, data, 'POST', 1, 1).then(data => {
    that.setData({
      toastError: '',
      toastMessage: data.result[0]
    })

    wx.navigateBack({
      delta: 1
    })
  })
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaVal: '',
    contact_way: '',
    toastError: 0,
    toastMessage: "",
    isToast: false
  },
  onText(e) {
    this.setData({
      textareaVal: e.detail.value
    })
  },
  onInput(e) {
    this.setData({
      contact_way: e.detail.value
    })
  },
  onSetContext: function (e) {
    let that = this
    let data = {
      content: this.data.textareaVal,
      contact_way: this.data.contact_way
    }
    if (this.data.textareaVal == '' || this.data.contact_way == '') {
      that.setData({
        isToast: true,
        toastError: 'ggg',
        toastMessage: `请填写完整！`
      })
    }
    else
      setcontact('support.php', {
        secondType: 'contact_us',
      }, data, this)
  }
})