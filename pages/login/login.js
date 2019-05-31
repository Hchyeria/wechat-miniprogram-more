import {
  request,
  BASE_URL
} from '../../utils/request.js'
import {
  postCode
} from '../../utils/authorize.js'

import {
  getType,
  selctType,
  showRepeatMsg
} from '../../utils/pick.js'

const app = getApp()

function setSchool(targetURL, params, data) {
  return new Promise((resolve, reject) => {
    request(targetURL, params, data, 'POST', 0, 1)
      .then(data => {
        resolve(data)
      })
      .catch(e => {
        reject(e)
      })
  })
}

function checkSchool(targetURL, params) {
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

function getUserInfo(secret_key) {
  return new Promise((resolve, reject) => {
    request('users.php', {
        secondType: 'get_user_info',
        secret_key
      }, {}, 'GET')
      .then(data => {
        resolve(data)
      })
      .catch(e => {
        reject(e)
      })
  })

}


let index = 0
let maxindex = 3
let time = 0
let touchDot = [0, 0]
let interval = ''

Page({
  data: {
    BASE_URL,
    toastError: '',
    toastMessage: "",
    slideClass: 0,
    islogin: false,
    issure: false,
    isshool: false,
    isload: [0, 0, 0, 0],
    isloadSpan: false,
    playButtonClass: true,
    locationId: 0,
    locationPickText: '',
    schoolPickText: "",
    schoolPickid: '',
    objectlocationArray: [],
    objectschoolArray: [],
    maxHeight: ''
  },
  onLoadImg(e) {
    let {
      index
    } = e.target.dataset
    let temp = this.data.isload
    temp[index] = 1
    this.setData({
      isload: temp
    })

  },
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.mainHeight = res.windowHeight
        that.setData({
          maxHeight: res.windowHeight + 'px'
        })
      }
    })
    if (app.globalData.secret_key) 
      wx.switchTab({ url: '../index/index' })
  },
  onShow() {
    index = 0;
  },
  onGotUserInfo(e) {
    let that = this
    let res = e.detail.userInfo
    showRepeatMsg(that, '', "正在登陆")
    if (res) {
      app.globalData.userInfo.nickName = res.nickName
      app.globalData.userInfo.avatarUrl = res.avatarUrl
      postCode(app).then(data => {
        showRepeatMsg(that, '', "登陆成功", {
          islogin: true
        })
        getUserInfo(app.globalData.secret_key).then(data => {
          app.globalData.userInfo = Object.assign({}, app.globalData.userInfo, data.result[0])
        })
        request('school.php', {
          action: 'check_school',
          secret_key: app.globalData.secret_key
        }, {}, 'GET', 0, 1)
          .then(data => {
            if (data.state) {
              wx.switchTab({ url: '../index/index' })
              return
            }
            getType('school.php', { action: 'get_location' }, 'objectlocationArray', this, 0, 0).then(data => {
              that.setData({
                isloadSpan: false
              })
            })
          })
      })
    }
  },
  onTapPlay() {
    if (index < maxindex) {
      index++;
      if (index == maxindex) {
        this.setData({
          slideClass: '-' + (25 * index) + '%',
          playButtonClass: false,
          issure: true
        })
      } else {
        this.setData({
          slideClass: '-' + (25 * index) + '%',
          issure: false
        })
      }
    } else {
      this.onGoIndex()
    }
  },
  onShowSlectSchool(e) {
    let that = this
    if (!this.data.locationId) {
      showRepeatMsg(that, 'gg', "登陆成功")
      return;
    }
    this.setData({
      isshowselct: [0, 1]
    })
  },
  onBlurSelect(e) {
    let that = this;
    if (that.data.isshowselct[0] || that.data.isshowselct[1]) {
      that.setData({
        isshowselct: [0, 0]
      })
    }
  },
  onShowSlectLocation() {
    this.setData({
      isshowselct: [1, 0]
    })
  },
  onSlectSchool(e) {
    let id = e.target.dataset.sid
    id && selctType(id, 'schoolPickid', 'objectschoolArray', this, 'sID', 'school_name', 'isshowselct', [1, 1], 'schoolPickText')
    if (this.data.locationId && this.data.schoolPickid) {
      this.setData({
        playButtonClass: true,
        isschool: true
      })
    }
  },
  onSlectlocation(e) {
    let that = this
    let id = e.target.dataset.lid
    id && selctType(id, 'locationId', 'objectlocationArray', this, 'location_id', 'location_name', 'isshowselct', [1, 0], 'locationPickText')
    let targetURL = 'school.php'
    let params = {
      action: 'get_school',
      location_id: this.data.locationId
    }
    this.setData({
      isloadSpan: true
    })
    getType(targetURL, params, 'objectschoolArray', this, 0, 0).then(data => {
      that.setData({
        isloadSpan: false
      })
    })
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
    if (touchMove[0] - touchDot[0] <= -80 && time < 10 && tempY < 50) {
      if (index < maxindex && this.data.islogin) {
        index++;
        if (index === maxindex) {
          this.setData({
            slideClass: '-' + (25 * index) + '%',
            playButtonClass: false,
            issure: true
          })
        } else {
          this.setData({
            slideClass: '-' + (25 * index) + '%',
            issure: false
          })
        }
      }
    }
    if (touchMove[0] - touchDot[0] >= 80 && time < 10 && tempY <= 50) {
      if (index >= 1) {
        index--;
        if (!this.data.playButtonClass) {
          this.setData({
            slideClass: index == 0 ? 0 : '-' + (25 * index) + '%',
            playButtonClass: true,
            issure: false
          })
        } else {
          this.setData({
            slideClass: index == 0 ? 0 : '-' + (25 * index) + '%',
            issure: false
          })
        }

      }
    }
    clearInterval(interval);
    time = 0;
  },
  onGoIndex() {
    if (this.data.isschool) {
      let that = this;
      let id = this.data.schoolPickid
      let targetURL = 'school.php'
      console.log(app.globalData.secret_key)
      let params = {
        action: 'set_school',
        secret_key: app.globalData.secret_key
      }
      let data = {
        school_id: +id
      }
      setSchool(targetURL, params, data).then(data => {
        console.log(data)
        if (data.state) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          showRepeatMsg(that, 'gg', "网络出了问题＞﹏＜")
        }

      })
    }
  }
})