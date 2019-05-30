import {
  forTabBar
} from '../../custom-tab-bar/switchTab.js'
import {
  request, BASE_URL
} from '../../utils/request.js'

import { onShare } from '../../utils/share.js'
import { loadContent, loadBanner, loadBannerText, tabChange  } from './protoIndex.js'
import { showRepeatMsg } from '../../utils/pick.js'

let page = 1
let typeID = 1
const app = getApp()
let time = 0
let touchDot = [0, 0]
let interval = ''
let maxtypeID = 5



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
    addIconActive: false,
    loadClass: '',
    toastError: 0,
    toastMessage: "",
    bannerTop: '129px',
    isSlide: [0, 0],
    isloadDown: false
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
    loadContent(this, 2, this.data.type, page, typeID)
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
    clearInterval(interval)
    time = 0
    page = 1

    forTabBar(this, this.data.type[0] === 'a' ? 0 : 1)
    let TabBar = this.getTabBar()
    this.setData({
      addIconActive: false,
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
    loadBannerText(this, this.data.type)
  },
  onReady(){
    this.setData({
      isLoad: ''
    })
  },
  onReachBottom() {
    let that = this;
    that.setData({
      isloadDown: true
    })
    if (!that.data.islogin) {
      page++
      loadContent(that, 2, that.data.type, page, typeID).then(length => {
        if (length !== 0){
          showRepeatMsg(this, '', `已为您加载${length}条内容`, { isloadDown: false})
        }
        else{
          that.setData({
            isloadDown: false
          })
        }
      })
    }
  },
  onStoreLeng(e){
    maxtypeID = e.detail.len
  },
  tabTap(e, that=0) {
    page = 1
    typeID = e.detail.tid
    wx.pageScrollTo({
      scrollTop: 0
    })
    tabChange(typeID, that ? that : this, page)
  },
  touchStart(e) {
    touchDot[0] = e.touches[0].pageX;
    touchDot[1] = e.touches[0].clientY;
    time = 0;
    interval = setInterval(() => {
      time++;
      if (time > 10){
        clearInterval(interval);
      }
    }, 100);
  },
  touchEnd(e) {
    let touchMove = []
    touchMove[0] = e.changedTouches[0].pageX;
    touchMove[1] = e.changedTouches[0].clientY;
    let tempY = touchMove[1] > touchDot[1] ? touchMove[1] - touchDot[1] : touchDot[1] - touchMove[1]
    if (touchMove[0] - touchDot[0] <= -80 && time < 10 && tempY < 50) {
      if (typeID < maxtypeID) {
        this.tabTap({
          detail: {
            tid: ++typeID
          }
        }, this)
        this.setData({
          typeID
        })
      } 
    }
    if (touchMove[0] - touchDot[0] >= 80 && time < 10 && tempY <= 50) {
      if (typeID > 1) {
        this.tabTap({
          detail: {
            tid: --typeID
          }
        }, this)
        this.setData({
          typeID
        })
      }
    }
    clearInterval(interval);
    time = 0;
  },
  toSend(e) {
    this.setData({
      addIconActive: true
    })
    wx.navigateTo({
      url: '../send/send'
    })
  },
  onDelete(){
    this.onPullDownRefresh()
  }
})