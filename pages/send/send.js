import {
  request, API_URL
} from '../../utils/request.js'

import { getType, selctType, showRepeatMsg } from '../../utils/pick.js'

const app = getApp()

function chooseLocation(that) {
  wx.chooseLocation({
    success: function (res) {
      console.log('LocationSelct Success')
      that.setData({
        name: res.name,
        latitude: res.latitude,
        longitude: res.longitude
      })
    },
    fail(res) {
      console.log(res)
      that.setData({
        toastError: 'selct location error',
        toastMessage: `emm,unknown error`
      })
    }
  })
}

function sendMsgWithoutimg(type, param, data, that) {
  request(type, param, data, 'POST', 1, 1).then(data => {
    showRepeatMsg(that, '', '发布成功')
    that.onBack();
  })
}

function sendMsg(targetURL, data, path, that, tempData = {}) {
  let url = `${API_URL}/${targetURL}`
  return new Promise(() => {
    let i = tempData.i ? tempData.i : 0,
      success = tempData.success ? tempData.success : 0,
      fail = tempData.fail ? tempData.fail : 0,
      type_id = tempData.iID ? tempData.iID : (tempData.aID ? tempData.aID : undefined);
    let path_img = path[i];
    let file_name = '';
    let img_data = {}
    let isimg = typeof type_id !== 'undefined'
    if (isimg) {
      let type_id_name = tempData.iID ? 'iID' : 'aID'
      img_data[type_id_name] = type_id
      img_data.order = ++i
      file_name = 'file'
    }
    else {
      file_name = 'file' + ++i;
    }
    if (!isimg && i !== 1) {
      return;
    }
    wx.uploadFile({
      url,
      filePath: path_img,
      name: file_name,
      header: { "Content-Type": "multipart/form-data" },
      formData: isimg ? img_data : data,
      success: function (res) {
        if (res.data) {
          console.log(res)
          console.log(res.data)
          console.log(JSON.parse(res.data))
          let resData = JSON.parse(res.data)
          if (resData.result.hasOwnProperty('iID')) {
            tempData.iID = resData.result.iID
          }
          else {
            tempData.aID = resData.result.aID
          }
        }
        if (res.statusCode != 200) {
          fail++;
        }
        success++;
      },
      fail: function (e) {
        fail++;
        showRepeatMsg(that, 'gg', '上传失败')
      },
      complete: function () {
        if (i === path.length) {
          showRepeatMsg(that, '', '发布成功')
          that.onBack();
        } else {
          tempData.i = i;
          tempData.success = success;
          tempData.fail = fail;
          let targetURL = tempData.aID ? 'articles.php?secondType=insert_article_picture&openID=' + app.globalData.openID
            : 'items.php?secondType=insert_item_picture&openID=' + app.globalData.openID
          sendMsg(targetURL, data, path, that, tempData);
        }
      }
    })
  })
}
let time = 0
let touchDot = 0
let touchMove = 0
let interval = ''

Page({
  data: {
    mainHeight: '',
    topHeight: '64px',
    seltextTop: '240px',
    title: '发布',
    isactive: [0, 0],
    isselct: false,
    isbackToother: true,
    isfocus: [0, 0, 0, 0],
    switchColor: '#adebf6',
    msgContentStyle: 'displayHide',
    dealContentStyle: 'displayHide',
    msgClass: 'send-msg',
    dealClass: 'send-deal',
    textareaVal: '',
    tabList: [],
    objectList: [],
    imgList: [],
    typeText: '',
    articleType: '',
    itemType: '',
    content: '',
    expectPrice: '',
    contactWay: '',
    toastError: 0,
    toastMessage: "",
    name: '',
    latitude: '',
    longitude: '',
    ta: false,
    labelList: [],
    labVal: ''
  },
  onLoad: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.mainHeight = res.windowHeight
        that.setData({
          mainHeight: res.windowHeight,
          topHeight: res.windowHeight * (64 / 568) + 'px'
        })
      }
    })
    var query = wx.createSelectorQuery();
    query.select('.send-msg').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        seltextTop: res[0].height + 'px'
      })
    })
    let targetURL = 'types.php'
    let params = { secondType: 'get_article_types' }
    getType(targetURL, params, 'tabList', this)
    params.secondType = 'get_item_types'
    getType(targetURL, params, 'objectList', this, 1, 0)
  },
  onShow() {
    clearInterval(interval)
    time = 0
  },
  onBack: function () {
    let that = this;
    wx.pageScrollTo({
      scrollTop: 0
    })
    if (!this.data.isbackToother) {
      this.setData({
        isactive: [0, 0],
        msgClass: this.data.isactive[1] ? 'send-msg' : 'send-msg send-msg-reverse',
        dealClass: this.data.isactive[1] ? '' : 'fadeIndelay',
        isbackToother: true,
        msgContentStyle: 'displayHide',
        isselct: false,
        typeText: '',
        imgList: [],
        textareaVal: '',
        isfocus: [0, 0, 0, 0]
      })
      setTimeout(() => {
        that.setData({
          switchColor: '#adebf6'
        })
      }, 1000)
    }
    else {
      this.setData({
        textareaVal: ''
      })
      wx.navigateBack({
        delta: 1
      })
    }

  },
  onTapmsg: function () {
    let that = this;
    this.setData({
      isactive: [1, 0],
      msgClass: 'send-msg-active',
      dealClass: 'fadeOutdelayHeight',
      isbackToother: false,
      msgContentStyle: 'fadeIndelay'
    })
    setTimeout(() => {
      that.setData({
        dealClass: 'displayHide'
      })
    }, 1000)
  },
  onTapdeal: function () {
    this.setData({
      isactive: [0, 1],
      msgClass: 'send-msg-unactive',
      dealClass: 'send-deal-active',
      isbackToother: false,
      msgContentStyle: 'fadeIndelay'
    })
    let that = this;
    setTimeout(() => {
      that.setData({
        switchColor: '#f77b55'
      })
    }, 1000)
  },
  onShowType: function () {
    this.setData({
      isselct: true
    })
  },
  onTapSelctType: function (e) {
    let id = e.target.dataset.tid
    this.data.isactive[0] ? selctType(id, 'articleType', 'tabList', this) : selctType(id, 'itemType', 'objectList', this)
  },
  onCancelType: function () {
    this.setData({
      isselct: false
    })
  },
  onSureType() {
    let type = this.data[this.data.isactive[0] ? 'articleType' : 'itemType']
    let list = this.data[this.data.isactive[0] ? 'tabList' : 'objectList']
    if (type) {
      let tempName = list.filter(it => it.type_id == type)[0].type_name
      this.setData({
        isselct: false,
        typeText: tempName
      })
    }
  },
  bindPriceInput(e) {
    this.setData({
      expectPrice: e.detail.value
    })
  },
  bindContactInput(e) {
    this.setData({
      contactWay: e.detail.value
    })
  },
  Uploadimg: function () {
    let that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        that.setData({
          imgList: tempFilePaths
        })
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  onSetFocus: function (e) {
    let index = e.target.dataset.id
    let temp = [0, 0, 0]
    temp[index] = 1
    this.setData({
      isfocus: temp
    })
  },
  onSetContextTap(e) {
    let { isfocus } = this.data
    if (isfocus[0]) {
      isfocus[0] = 0
    } else {
      isfocus = [1, 0, 0]
    }
    this.setData({ isfocus })
  },
  onSetContextBlur() {
    let { isfocus } = this.data
    isfocus[0] = 0
    this.setData({ isfocus })
  },
  onSetContext: function (e) {
    this.setData({
      content: e.detail.value,
      textareaVal: e.detail.value
    })
  },
  onSendMsg: function () {
    let that = this
    let istypeMsg = !!this.data.isactive[0]
    if (!this.data.content || !this.data.typeText) {
      showRepeatMsg(that, 'ggg', '请填写完整！')
      return;
    }
    if (istypeMsg ? !this.data.articleType : !this.data.itemType) {
      showRepeatMsg(that, 'ggg', '请填写完整！')
      return;
    }
    let msgtargetURL = 'articles.php?secondType=insert_article&openID=' + app.globalData.openID
    let dealtargetURL = 'items.php?secondType=insert_item&openID=' + app.globalData.openID
    let path = this.data.imgList
    if (this.data.name === '')
      this.setData({
        name: 'hhh',
        longitude: 100000.0000,
        latitude: 100000.0000
      })
    let data = istypeMsg ?
      {
        'article_type': this.data.articleType,
        content: this.data.content,
        address: this.data.name,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      } :
      {
        'item_type': this.data.itemType,
        item_info: this.data.content,
        expect_price: this.data.expectPrice,
        contact_way: this.data.contactWay,
        address: this.data.name,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      }
    data = { ...data, labels: that.data.labelList.join(",") }
    showRepeatMsg(that, '', '正在发布')
    if (!path.length) {
      istypeMsg ? sendMsgWithoutimg('articles.php', {
        secondType: 'insert_article',
        openID: app.globalData.openID
      }, data, this) :
        showRepeatMsg(that, '1', '至少选择一张图片')
      return;
    }
    istypeMsg ? sendMsg(msgtargetURL, data, path, this) : sendMsg(dealtargetURL, data, path, this)
  },
  onLocation() {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              chooseLocation(that)
            },
            fail(res) {
              showRepeatMsg(that, 'selct location error', '授权后方可选择地址')
            }
          })
        } else {
          chooseLocation(that)
        }
      }
    })
  },
  onLabelBlur(e) {
    let val = e.detail.value.trim()
    if (val === '') return
    let { isfocus, labelList } = this.data
    if (labelList.indexOf(val) !== -1) {
      showRepeatMsg(this, 'ggg', `自定义标签${val}重复`, { labVal: '' })
      return
    }
    isfocus[3] = 0
    this.setData({
      labelList: [...labelList, val],
      labVal: '',
      isfocus
    })
  },
  ondelectLab(e) {
    let index = e.target.dataset.lid
    if (index !== undefined) {
      this.setData({
        labelList: [...this.data.labelList.slice(0, index), ...this.data.labelList.slice(index + 1)]
      })
    }
  },
  touchStart(e) {
    if (!this.data.isactive[0] && !this.data.isactive[1]) {
      touchDot = e.touches[0].clientY;
      time = 0;
      interval = setInterval(() => {
        time++;
        if (time > 10) {
          clearInterval(interval);
        }
      }, 100);
    }
  },
  touchEnd(e) {
    if (!this.data.isactive[0] && !this.data.isactive[1]) {
      touchMove = e.changedTouches[0].clientY;
      if (touchMove - touchDot <= -80 && time < 10) {
        this.onTapdeal()
      }
      if (touchMove - touchDot >= 80 && time < 10) {
        this.onTapmsg()
      }
    }
    clearInterval(interval);
    time = 0;
  }
})