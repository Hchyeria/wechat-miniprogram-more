import {
  request, BASE_URL
} from '../../utils/request.js'

import {
  forTabBar
} from '../../custom-tab-bar/switchTab.js'
import { onShare } from '../../utils/share.js'

const app = getApp()
function setLimit() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success(res) {
        switch (res.networkType) {
          case 'wifi':
            resolve(15)
            return
          case '4g':
            resolve(10)
        }
        resolve(5)
      },
      fail(res) {
        reject(5)
      }
    })
  })
}
export function loadContent(that, mode, type, page, typeID, isRefsh = 0) {
  return new Promise((resolve, reject) => {
    setLimit()
      .then(limit => {
        let params;
        if (type[0] === 'a') {
          if (typeID == 4 || typeID==2)
          params = {
            secondType: `select_${type}_by_type`,
            typeID, mode, limit, page,
            secret_key: app.globalData.secret_key
          }
          else{
            params = {
              secondType: `select_${type}_by_type`,
              typeID, mode, limit, page,
            }
          }
        } else {
          params = {
            secondType: `select_${type}_by_type`,
            type: typeID,
            limit, page
          }
        }
        return request(`${type}s.php`, params)
      })
      .then(data => {
        if (isRefsh){
          that.setData({
            contentList: data.result
          })
        }
        else{
          that.setData({
            contentList: that.data.contentList.concat(data.result)
          })
        }
        resolve(data.result.length)
      })
  })
}
export function loadBanner(that, second_type, type) {
  return new Promise((resolve, reject) => {
    that.setData({
      banner:false
    })
    request('pictures.php', {
      secondType: 'get_banner_by_type',
      first_type: type[0] === 'a' ? 1 : 2,
      second_type
    }).then(data => {
      if (data.result[0]) {
        that.setData({
          banner: data.result[Math.floor(Math.random() * data.result.length)].b_name
        })
      }
    })
  })
}

export function loadBannerText(that, type) {
  return new Promise((resolve, reject) => {
    request('types.php', {
      secondType: 'get_' + type + '_types'
    }).then(data => {
      that.setData({
        bannerText: data.result
      })
    })
  })
}

export function MPage(type) {
  let page = 1
  let typeID = 1
  const app = getApp()
  return Page({
    data: {
      contentList: [],
      BASE_URL,
      banner: undefined,
      bannerText: [],
      type,
      searchList: {},
      typeID: 1,
      isLoad: true,
      toastError: 0,
      toastMessage: "",
      bannerTop: ''
    },
    onShareAppMessage(res) {
      return onShare(res)
    },
    onPullDownRefresh() {
      loadContent(this, 2, this.data.type, 1, this.data.typeID, 1).then(data => wx.stopPullDownRefresh());
    },
    onShow() {
      page = 1
      console.log('index-page run under type:', this.data.type)
      forTabBar(this, this.data.type[0] === 'a' ? 0 : 1)
    },
    onLoad() {
      typeID = 1
      loadBannerText(this, this.data.type)
      loadContent(this, 2, this.data.type, page, typeID)
      loadBanner(this, typeID, this.data.type) 
    },
    onReachBottom() {
      page++;
      let that = this;
      loadContent(this, 2, this.data.type, page, typeID).then(length => {
        if (length !== 0){
          console.log(that)
          that.setData({
            toastError: '',
            toastMessage: `已为您加载${length}条内容`
          })
        }
      })
    },
    onBannerLoad(){
      if (this.data.isLoad) {
        wx.pageScrollTo({
          scrollTop: 0
        })
        this.setData({
          isLoad: ''
        })
        let that = this;
        if (!this.data.bannerTop){
          var query = wx.createSelectorQuery();
          query.select('.top').boundingClientRect()
          query.exec(function (res) {
            console.log(res)
            that.setData({
              bannerTop: res[0].height + 'px'
            })
          })
        }
      }
    },
    onLoadPictrue(){
      if (this.data.typeID == 1){
        if (this.data.isLoad) {
          this.setData({
            isLoad: ''
          })
        }
      }
    },
    tabTap(e) {
      page = 1
      typeID = e.detail.tid
      wx.pageScrollTo({
        scrollTop: 0
      })
      loadContent(this, 2, this.data.type, page, typeID)
      loadBanner(this, typeID, this.data.type)
      this.setData({
        contentList: [],
        typeID: typeID,
        isLoad: true
      })
    },
    toSend(e) {
      wx.navigateTo({
        url: '../send/send'
      })
    }
  })
}
