import {
  request
} from '../../utils/request.js'

import { toCrab } from '../../utils/crab.js'
import { onShare } from '../../utils/share.js'
import { getIsoTime, showRepeatMsg } from '../../utils/pick.js'

function getContent(that, Id, type) {
  return new Promise(resolve => {
    let params = {
      secondType: `select_${type}_by_id`,
      ID: Id,
      secret_key: app.globalData.secret_key
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

function getComments(that, id, type) {
  return new Promise(resolve => {
    request('comments.php', {
      secondType: 'select_comment_by_pointerID',
      cType: type === 'article' ? 1 : 2,
      pointerID: id,
      page,
      limit
    }).then(data => {
      that.setData({
        list: page === 1 ? data.result : that.data.list.concat(data.result)
      })
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
    type: '',
    out: '',
    article: "article",
    status: 'user',
    from: 'inner',
    isLoad: true,
    toastError: 0,
    toastMessage: "",
    isloadDown: false
  },
  onShareAppMessage(res) {
    return onShare(res)
  },
  onLoad(option) {
    this.setData({
      type: option.type,
      out: option.isout === "true" ? "ggg" : ''
    })
    page = 1
    getContent(this, option.Id, option.type)
    getComments(this, option.Id, option.type)
    if (option.from && option.from === 'share') {

      let status = 'stranger';
      if (app.globalData.secret_key !== '') {
        status = 'user'
      }
      this.setData({
        status,
        from: 'outer'
      })
    }
  },
  onShow() {
    this.setData({
      isLoad: ''
    })
  },
  onPullDownRefresh() {
    getContent(this, this.data.Id, this.data.type)
    page = 1
    getComments(this, this.data.Id, this.data.type)
  },
  onReachBottom(e, noToast = 0) {
    page++
    let that = this
    that.setData({
      isloadDown: true
    })
    getComments(this, this.data.Id, this.data.type)
      .then(length => {
        if (length !== 0 && !noToast) {
        }
        else {
          page--
        }
        that.setData({
          isloadDown: false
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
  replySuccess(e) {
    let that = this;

    if (that.data.list.length % limit !== 0) {
      showRepeatMsg(that, '', `回复成功！`, { list: [...that.data.list, { ...app.globalData.userInfo, time: getIsoTime(), content: e.detail }] })

      return;
    }
    showRepeatMsg(that, '', `回复成功！`)
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
    this.data.status === 'user' ? wx.switchTab({ url: '/pages/index/index' }) : wx.navigateTo({ url: '/pages/login/login' })
  },
})