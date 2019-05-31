import {
  request, BASE_URL
} from '../../utils/request.js'

import {
  postCode, getUserInfo
} from '../../utils/authorize'

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
export function loadContent(that, mode, type, page, typeID, isRefsh = 0) {
  return new Promise((resolve, reject) => {
    setLimit()
      .then(limit => {
        let params;
        if (type[0] === 'a') {
          params = {
            secondType: `select_${type}_by_type`,
            typeID, mode, limit, page,
            secret_key: app.globalData.secret_key
          }
        } else {
          params = {
            secondType: `select_${type}_by_type`,
            type: typeID,
            limit, page,
            secret_key: app.globalData.secret_key
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
  loadContent(that, 2, that.data.type, page, typeID)
  loadBanner(that, typeID, that.data.type)
}

export function onGetUserInfo(that) {
return new Promise((resolve, reject) =>{
  wx.getSetting({
    success (res){
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: function(res) {
            let { nickName, avatarUrl } = res.userInfo
            app.globalData.userInfo.nickName = nickName
            app.globalData.userInfo.avatarUrl = avatarUrl
            console.log(res.userInfo)
            postCode(app).then(data =>{
              getUserInfo(app).then(data => {
                app.globalData.userInfo = Object.assign({}, app.globalData.userInfo, data.result[0])
              })
              let targetURL = 'school.php'
              let params = { 
                action: 'check_school',
                secret_key: app.globalData.secret_key
              }
              checkSchool(targetURL, params).then(data =>{
                if (!data.state){
                  that.goLogin()
                }
              })
              resolve(data)
            })
          },
          fail: function(e){
            showRepeatMsg(that, '', '获取个人信息失败，请稍后再试')
          }
        })
      }
      else{
        that.goLogin()
      }
    }
  })
})
}

export function checkSchool(targetURL, params){
  return new Promise((resolve, reject) => {
    request(targetURL, params, {}, 'GET', 0, 1)
      .then(data => {
        resolve(data)
      })
      .catch(e => {
        reject(e)
      })
  })
}

export function MPage(type) {
  let page = 1
  let typeID = 1
  const app = getApp()

  let time = 0
  let touchDot = [0, 0]
  let interval = ''
  let maxtypeID = 5

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
      addIconActive: false,
      toastError: 0,
      toastMessage: "",
      bannerTop: '',
      isSlide: [0, 0],
      isloadDown: false
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
      this.data.addIconActive &&  this.setData({
        addIconActive: false
      })
    },
    onLoad() {
      typeID = 1
      let that = this;
      if(!app.globalData.secret_key){
        onGetUserInfo(this).then(() => {
          loadBannerText(this, this.data.type)
          loadContent(this, 2, this.data.type, page, typeID)
          loadBanner(this, typeID, this.data.type)
        })
      }
      else{
        loadBannerText(this, this.data.type)
        loadContent(this, 2, this.data.type, page, typeID)
        loadBanner(this, typeID, this.data.type)
      }
      if (JSON.stringify(app.globalData.userInfo) === "{}" ){
        getUserInfo(app).then(data =>{
          app.globalData.userInfo = Object.assign({}, app.globalData.userInfo, data.result[0])
        })
      }
    },
    onReachBottom() {
      page++;
      let that = this;
      that.setData({
        isloadDown: true
      })
      loadContent(this, 2, this.data.type, page, typeID).then(length => {
        if (length !== 0) {
          showRepeatMsg(this, '', `已为您加载${length}条内容`, { isloadDown: false })
        }
        else {
          that.setData({
            isloadDown: false
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
      }, 500)
     
    },
    goLogin(){
      wx.navigateTo({
        url: '../login/login'
      })
    }
  })
}
