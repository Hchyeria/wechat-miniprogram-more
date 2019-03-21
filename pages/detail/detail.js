import { request } from '../../utils/request.js'

function getArticle(that,aid){
  return new Promise((resolve,reject)=>{
    request('articles.php', {
      secondType: 'select_article_by_id',
      aID: aid
    }).then(data => {
      that.setData({
        article: data.result[0],
        pictures: data.result.pictures,
        aid: aid
      })
      resolve()
    },()=>{
      reject()
    })
  })
}

function getComments(that){
  request('comments.php', {
    secondType: 'select_comment_by_pointerID',
    cType: 1,
    pointerID: that.data.aid
  }).then(data => {
    that.setData({
      list: data.result
    })
    wx.stopPullDownRefresh()
  })
}

const app =getApp()

Page({
  data: {
    list: [],
    attation: 0,
    isReply: false,
    aid:0,
    openid:app.globalData.openid
  },
  onLoad(option) {
    getArticle(this,option.aid).then(()=>{
      getComments(this)
    })
  },
  onPullDownRefresh(){
    getArticle(this, this.data.aid)
    getComments(this)
  },
  toReply(e) {
    this.setData({
      isReply: true,
      attention:e.detail.attention
    })
  },
  replySuccess(){
    wx.startPullDownRefresh()
  }
})