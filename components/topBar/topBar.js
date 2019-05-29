import { request } from '../../utils/request.js'

function navigateToDetail(that) {
  wx.navigateTo({
    url: `../../pages/search/search?type=${that.data.type}`
  })
}

const app = getApp()


Component({
  properties: {
    type:String,
  },
  data: {
    searchTarget: '',
    status: false,
    statusBarHeight: app.globalData.statusBarHeight,
    system: app.globalData.system,
    searchlist: {},
    height:''
  },
  lifetimes: {
    created() {

      },
  },
  pageLifetimes: {
    show() {
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          that.height = res.screenHeight
        }
    })
      if (that.height > 736) {
        that.setData({
          height:  that.height*10%+'px'
        })
      }
    }
  },

  methods: {
    getInput() {
      navigateToDetail(this)
    }
  }
})