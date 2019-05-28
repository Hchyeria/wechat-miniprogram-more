import { request, BASE_URL } from '../../utils/request.js'
import { postCode } from '../../utils/authorize.js'

import { getType, selctType } from '../../utils/pick.js'

const app = getApp()

Component({
  properties: {
    isShow: Boolean
  },
  data: {
    containHeight: '100px',
    contentList: [0.25,0.2,0.1,0.15,0.2,0.4]
  },
  pageLifetimes: {
    show() {
      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            containHeight: res.windowHeight + 'px'
          })
        }
      })
    }
  },
  methods: {
    
  }
})