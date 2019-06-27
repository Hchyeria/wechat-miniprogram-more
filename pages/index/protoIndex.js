import {
  request, BASE_URL
} from '../../utils/request.js'

import {
  forTabBar
} from '../../custom-tab-bar/switchTab.js'
import { onShare } from '../../utils/share.js'
import { showRepeatMsg } from '../../utils/pick.js'

const app = getApp()

function setLimit() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success(res) {
        switch (res.networkType) {
          case 'wifi':
            resolve(8)
            return
          case '4g':
            resolve(5)
        }
        resolve(3)
      },
      fail(res) {
        reject(5)
      }
    })
  })
}
export function loadContent(that, mode, type, page, typeID, isRefsh = 0, isrecent = 0, isOnlySchool = 0) {
  return new Promise((resolve, reject) => {
    setLimit()
      .then(limit => {
        let params;
        if (isrecent && type[0] === 'a'){
          params = {
            secondType: `recent_similar`,
            secret_key: app.globalData.secret_key,
            latitude: app.globalData.latitude,
            longitude: app.globalData.longitude
          }
          return request( `users.php`, params)
        }
        else{
        if (type[0] === 'a') {
          if(mode === 3){
            params = {
              secondType: `select_${type}_by_type`,
              typeID, mode, limit, page,
              longitude: app.globalData.longitude,
              latitude: app.globalData.latitude,
              secret_key: app.globalData.secret_key
            }
              
          }
          if(mode !== 3) {
            params = {
              secondType: `select_${type}_by_type`,
              typeID, mode, limit, page,
              secret_key: app.globalData.secret_key
            }
          }
          if (isOnlySchool) {
            params = {
              secondType: `select_${type}_by_type`,
              typeID, mode: 2, limit, page, only_school: 1,
              secret_key: app.globalData.secret_key
            }
          }
        } else {
          if(mode!='3'){
          params = {
            secondType: `select_${type}_by_type`,
            type: typeID,
            limit, page,mode,
            secret_key: app.globalData.secret_key
          }
          }
          else{
            params = {
              secondType: `select_${type}_by_type`,
              type: typeID,
              limit, page, mode, 
              longitude: app.globalData.longitude,
              latitude: app.globalData.latitude,
              secret_key: app.globalData.secret_key
            }
          }
        }
          return request(`${type}s.php`, params)
        }
      })
      .then(data => {
        if (isrecent){
          that.setData({
            recentLength: data.result.length
          })
        }
        if (isRefsh){
          that.setData({
            contentList: data.result
          })
        }
        if (!isRefsh){
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

export function tabChange(typeID, that, page) {
  if (typeID > that.data.typeID) {
    that.setData({
      contentList: [],
      typeID: typeID,
      isLoad: true,
      isSlide: [0, 1]
    })
    setTimeout(() => {
      that.setData({
        isSlide: [0, 0]
      })
    }, 400)
  }
  else {
    that.setData({
      contentList: [],
      typeID: typeID,
      isLoad: true,
      isSlide: [1, 0]
    })
    setTimeout(() => {
      that.setData({
        isSlide: [0, 0]
      })
    }, 400)
  }
  loadContent(that, that.data.mode, that.data.type, page, typeID, 0, 0, that.data.isOnlySchool)
  loadBanner(that, typeID, that.data.type)
}

function attachRefresher(that,type){
  app[`refresher_${type}`] = () => {
    console.log(`refresh_${type}`)
    that.onPullDownRefresh()
  }
}

export function MPage(type) {
  let page = 1
  let typeID = 1

  let time = 0
  let touchDot = [0, 0]
  let interval = ''
  let maxtypeID = 5

  return Page({
    data: {
      overlayHeight: app.globalData.deviceH+20 + "px",
      isOverlay:false,
      contentList: [],
      BASE_URL,
      banner: undefined,
      bannerText: [],
      type,
      searchList: {},
      typeID: 1,
      isLoad: true,
      addIconActive: false,
      toastError: 0,
      toastMessage: "",
      bannerTop: '',
      isSlide: [0, 0],
      isloadDown: false,
      mode: 1,
      isOnlySchool: 0,
      latitude:'',
      longitude:'',
      recentLength: 5
    },
    onShareAppMessage(res) {
      return onShare(res)
    },
    onPullDownRefresh() {
      loadContent(this, this.data.mode, this.data.type, 1, this.data.typeID, 1, 0, this.data.isOnlySchool).then(data => wx.stopPullDownRefresh());
    },
    onShow() {
      page = 1
      forTabBar(this, this.data.type[0] === 'a' ? 0 : 1)
      this.data.addIconActive &&  this.setData({
        addIconActive: false
      })
    },
    onLoad() {
      if (this.data.type[0] === 'i'){
        this.setData({
          mode:2
        })
      }
      typeID = 1
      attachRefresher(this,type)
      loadBannerText(this, this.data.type)
      if (this.data.type[0] === 'a'){
        loadContent(this, this.data.mode, this.data.type, page, typeID, 0, 1, this.data.isOnlySchool)
        loadContent(this, this.data.mode, this.data.type, page, typeID, 0, 0, this.data.isOnlySchool)
      }
      else{
        loadContent(this, this.data.mode, this.data.type, page, typeID, 0, 0, this.data.isOnlySchool)
      }
      loadBanner(this, typeID, this.data.type)
    },
    onReachBottom() {
      let that = this;
      that.setData({
        isloadDown: true
      })
      loadContent(this, this.data.mode, this.data.type, page, typeID, 0, 0, this.data.isOnlySchool).then(length => {
        if(length !== 0 ){
          page++;
        }
        that.setData({
          isloadDown: false
        })
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
    onStoreLeng(e) {
      maxtypeID = e.detail.len
    },
    tabTap(e, that = 0) {
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
        if (time > 10) {
          clearInterval(interval);
        }
      }, 100);
    },
    touchEnd(e) {
      let touchMove = []
      touchMove[0] = e.changedTouches[0].pageX;
      touchMove[1] = e.changedTouches[0].clientY;
      let tempY = touchMove[1] > touchDot[1] ? touchMove[1] - touchDot[1] : touchDot[1] - touchMove[1]
      if (touchMove[0] - touchDot[0] <= -80 && time < 10 && tempY < 40) {
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
      if (touchMove[0] - touchDot[0] >= 80 && time < 10 && tempY <= 40) {
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
      setTimeout(() =>{
        wx.navigateTo({
          url: '../send/send'
        })
      }, 50)
     
    },
    onChooseMode(e){
      let that = this;
      let { id, isOnlySchool } = e.detail
      this.setData({
        contentList: [],
        mode: id,
        isOnlySchool,
        isloadDown: true
      })
      page = 1
      loadContent(this, id, this.data.type, page, typeID, 0, 0, isOnlySchool).then(() =>{
        that.setData({
          isloadDown: false
        })
      })
      
    },
    onOverlay(e){
      let { isOverlay } = e.detail
      this.setData({
        isOverlay
      })
    },
    onCloseOverlay(e){
      this.data.isOverlay &this.setData({isOverlay: false})
    }
  })
}
