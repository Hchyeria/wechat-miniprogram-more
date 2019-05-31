import { request } from '../../utils/request.js'

export function loadNOTAMail(that) {
  request('message.php', {
    secondType: 'get_message_by_type',
    secret_key: app.globalData.secret_key,
    limit:3,
    page:1,
    mode:2,//新
    typeID: 1//对文章的评论
  }).then(data => {
    
    that.setData({
      mailnotA: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isnnull: that.data.isnnull &&true,
      })
    }
    else {
      that.setData({
        isnnull: that.data.isnnull &&false,
      })
    }
  })
}
export function loadNOTBMail(that) {
  request('message.php', {
    secondType: 'get_message_by_type',
    secret_key: app.globalData.secret_key,
    limit: 3,
    page: 1,
    mode: 2,//新
    typeID: 2//对商品的评论
  }).then(data => {
    
    that.setData({
      mailnotB: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isnnull: that.data.isnnull &&true,
      })
    }
    else {
      that.setData({
        isnnull: that.data.isnnull &&false,
      })
    }
  })
}

export function loadALLAMail(that) {
  request('message.php', {
    secondType: 'get_message_by_type',
    secret_key: app.globalData.secret_key,
    limit: 3,
    page: 1,
    mode: 1,//新
    typeID: 1//对商品的评论
  }).then(data => {
    
    that.setData({
      mailallA: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isanull: that.data.isanull &&true,
      })
    }
    else {
      that.setData({
        isanull: that.data.isanull &&false,
      })
    }
  })
}

export function loadALLBMail(that) {
  request('message.php', {
    secondType: 'get_message_by_type',
    secret_key: app.globalData.secret_key,
    limit: 3,
    page: 1,
    mode: 1,//新
    typeID: 2//对商品的评论
  }).then(data => {
    
    that.setData({
      mailallB: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isanull: that.data.isanull &&true,
      })
    }
    else {
      that.setData({
        isanull: that.data.isanull &&false,
      })
    }
  })
}
export function loadALLCMail(that) {
  request('message.php', {
    secondType: 'get_message_by_type',
    secret_key: app.globalData.secret_key,
    limit: 3,
    page: 1,
    mode: 1,//新
    typeID: 3//对商品的评论
  }).then(data => {
    
    that.setData({
      mailallC: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isanull: that.data.isanull &&true,
      })
    }
    else {
      that.setData({
        isanull: that.data.isanull &&false,
      })
    }
  })
}
export function loadALLDMail(that) {
  request('message.php', {
    secondType: 'get_message_by_type',
    secret_key: app.globalData.secret_key,
    limit: 3,
    page: 1,
    mode: 1,//新
    typeID: 4//对商品的评论
  }).then(data => {
    
    that.setData({
      mailallD: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isanull: that.data.isanull &&true,
      })
    }
    else {
      that.setData({
        isanull: that.data.isanull &&false,
      })
    }
  })
}
export function loadNOTCMail(that) {
  request('message.php', {
    secondType: 'get_message_by_type',
    secret_key: app.globalData.secret_key,
    limit: 3,
    page: 1,
    mode: 2,//新
    typeID: 3//对商品的评论
  }).then(data => {
    
    that.setData({
      mailnotC: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isnnull: that.data.isnnull &&true,
      })
    }
    else {
      that.setData({
        isnnull: that.data.isnnull &&false,
      })
    } 
  })
}
export function loadNOTDMail(that) {
  request('message.php', {
    secondType: 'get_message_by_type',
    secret_key: app.globalData.secret_key,
    limit: 3,
    page: 1,
    mode: 2,
    typeID: 4
  }).then(data => {
    
    that.setData({
      mailallD: data.result,
    })
    if (0 == data.result.length) {
      that.setData({
        isnnull: that.data.isnnull &&true,
      })
    }
    else {
      that.setData({
        isnnull:that.data.isnnull&&false,
      })
    }
  })
}
const app = getApp()

Page({
  data: {
    mailnotA: {},
    mailnotB: {},
    mailallA: {},
    mailallB: {},
    mailallC: {},
    mailallD: {},
    mailnotC: {},
    mailnotD: {},
    isNot:true,
    isnot:false,
    new: String,
    all: String,
    isanull: false,
    isnnull: false,
  },
  onLoad(option) {
    loadNOTDMail(this),
    loadNOTCMail(this),
    loadNOTBMail(this),
    loadNOTAMail(this),
    loadALLDMail(this),
    loadALLCMail(this),
    loadALLBMail(this),
    loadALLAMail(this),
      this.setData({
        new: "button-not",
        all: "button-all"
      })
  },
  turntoup(){
    this.setData({
      isNot: true,
      isnot: false,
      new: "button-not",
      all: "button-all"
    })
  },
  turntonext() {
    this.setData({
      isNot: false,
      isnot: true,
      new: "button-all",
      all: "button-not"
    })
  }
})