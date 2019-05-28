import {
  forTabBar
} from '../../custom-tab-bar/switchTab.js'
import {
  request, BASE_URL
} from '../../utils/request.js'

import { onShare } from '../../utils/share.js'
import { loadContent, loadBanner, loadBannerText  } from './protoIndex.js'
import { loadArticles } from './loadArticles.js'

let page = 1
let typeID = 1
const app = getApp()

Page({
  data: {
    type: 'article',
    articleList: [],
    BASE_URL,
    banner: undefined,
    islogin: true,
    msgListStyle: 'displayHide',
    TabBar: undefined,
    contentList: [],
    searchList: {},
    typeID: 1,
    isshow:false,
    isLoad: true,
    toastError: 0,
    toastMessage: "",
    bannerTop: '129px'
  },
  onShareAppMessage(res) {
    return onShare(res)
  },
  onPullDownRefresh() {
    loadContent(this, 2, this.data.type, 1, this.data.typeID, 1).then(data => wx.stopPullDownRefresh());
  },
  onLoadIndex() {
    this.setData({
      isLoad: ''
    })
  },
  onBannerLoad() {
    if (this.data.isLoad) {
      this.setData({
        isLoad: ''
      })
    }
  },
  onLoadPictrue() {
    if (this.data.typeID == 1) {
      if (this.data.isLoad) {
        wx.pageScrollTo({
          scrollTop: 0
        })
        this.setData({
          isLoad: ''
        })
      }
    }
  },
  Goindex(login) {
    this.setData({
      islogin: !login.detail.data.islogin,
      msgListStyle: 'messageList-motion',
      isshow:true
    })
    this.data.TabBar.setData({
      isshow: true,
    })
    let that = this
    var query = wx.createSelectorQuery();
    query.select('.top').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        bannerTop: res[0].height + 'px'
      })
    })
  },
  onShow() {
    page = 1
    console.log('index-page run under type:', this.data.type)
    forTabBar(this, this.data.type[0] === 'a' ? 0 : 1)
    let TabBar = this.getTabBar()
    this.setData({
      TabBar
    })
    if (this.data.islogin) {
      TabBar.setData({
        isshow: false,
      })
    }
  },
  onLoad() {
    let that = this;
    this.setData({
      isLoad: true
    })
    typeID = 1
    loadBanner(this, typeID, this.data.type)
    loadContent(this, 2, this.data.type, page, typeID)
    loadBannerText(this, this.data.type)
  },
  onReady(){
    this.setData({
      isLoad: ''
    })
  },
  onReachBottom() {
    let that = this;
    if (!this.data.islogin) {
      page++
      loadContent(this, 2, this.data.type, page, typeID).then(length => {
        if (length !== 0)
          that.setData({
            toastError: '',
            toastMessage: `已为您加载${length}条内容`
          })
      })
    }
  },
  tabTap(e) {
    page = 1
    typeID = e.detail.tid
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      contentList: [],
      typeID: typeID,
      isLoad: true
    })
    loadContent(this, 2, this.data.type, page, typeID)
    loadBanner(this, typeID, this.data.type)
  },
  toSend(e) {
    wx.navigateTo({
      url: '../send/send'
    })
  }
})