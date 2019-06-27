Component({
  properties: {
    isShow: Boolean,
    loadClass: {
      type: String,
      value: ''
    },
    bannerTop:{
      type: String,
      value: '100px'
    }
  },
  data: {
    containHeight: '100px',
    contentList: [0.25, 0.2, 0.1, 0.15, 0.2, 0.4]
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