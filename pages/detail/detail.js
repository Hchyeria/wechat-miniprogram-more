import {
  request
} from '../../utils/request.js'

import { toCrab } from '../../utils/crab.js'
import { onShare } from '../../utils/share.js'

function getContent(that, Id, type) {
  return new Promise((resolve, reject) => {
    let params = {
      secondType: `select_${type}_by_id`,
      ID: Id
    }
    request(`${type}s.php`, params).then(data => {
      that.setData({
        content: data.result[0],
        type,
        Id
      })
      resolve()
    })
  })
}

function getComments(that) {
  return new Promise(resolve => {
    request('comments.php', {
      secondType: 'select_comment_by_pointerID',
      cType: that.data.type === 'article' ? 1 : 2,
      pointerID: that.data.Id,
      page,
      limit
    }).then(data => {
      that.setData({
        list: page === 1 ? data.result : that.data.list.concat(data.result)
      })
      wx.stopPullDownRefresh()
      resolve(data.result.length)
    })
  })
}

const app = getApp()
let page = 1
let limit = 4

////generalizing
Page({
  data: {
    list: [],
    attation: 0,
    isReply: false,
    Id: 0,
    secret_key: app.globalData.secret_key,
    type:'',
    out:'',
    article: "article",
    status: 'user',
    from: 'inner',
    isLoad: true,
    toastError: 0,
    toastMessage: ""
  },
  onShareAppMessage(res) {
    return onShare(res)
  },
  onLoad(option) {
   this.setData({
     type: option.type,
     out:option.isout === "true" ? "ggg":'' 
   })
    page = 1
    console.log('detail', option.type, option.Id)
    getContent(this, option.Id, option.type).then(() => getComments(this))
    if (option.from && option.from === 'share') {
      let status = 'stranger';
      if (app.globalData.secret_key !== '') {
        status = 'user'
      }
      console.log(status)
      this.setData({
        status,
        from: 'outer'
      })
    }
  },
  onShow(){
    this.setData({
      isLoad: ''
    })
  },
  onReady() {
    
  },
  onPullDownRefresh() {
    getContent(this, this.data.Id, this.data.type)
    page = 1
    getComments(this)
  },
  onReachBottom() {
    page++
    let that = this
    getComments(this)
      .then(length => {
        if (length !== 0)
          that.setData({
            toastError: '',
            toastMessage: `已为您加载${length}条内容`
          })
      })
  },
  toReply(e) {
    this.setData({
      isReply: true,
      attention: e.detail.attention,
      cid: e.detail.cid
    })
  },
  replySuccess() {
    page = 1
    wx.startPullDownRefresh()
    that.setData({
      toastError: '',
      toastMessage: `回复成功！`
    })
  },
  goToCrab() {
    toCrab({
      type: this.data.type[0] === 'a' ? 1 : 2,
      from_openID: app.globalData.openID,
      to_openID: app.globalData.openID,
      pointerID: this.data.Id
    })
  },
  onLoadPictrue() {
    this.setData({
      isLoad: ''
    })
  },
  goBack() {
    let url = this.data.status === 'user' ? '/pages/index/item' : '/pages/index/index'
    wx.switchTab({ url })
  }
})