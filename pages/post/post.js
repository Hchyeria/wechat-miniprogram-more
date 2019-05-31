import { request } from '../../utils/request.js'


const app = getApp()
export function loadPost(that) {
  request('articles.php', {
    secondType: 'select_article_by_author',
    secret_key: app.globalData.secret_key,
    limit: 5,
    page: 1,
  }).then(data => {
    
    that.setData({
      articleListlittle: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isanull: true,
      })
    }
    else {
      that.setData({
        isanull: false,
      })
    }

  })
}


export function loadItemPost(that) {
  request('items.php', {
    secondType: 'select_item_by_author',
    secret_key: app.globalData.secret_key,
    limit: 5,
    page: 1,
  }).then(data => {
    
    that.setData({
      articleListNewlittle: data.result
    })
    if (0 == data.result.length) {
      that.setData({
        isinull: true,
      })
    }
    else {
      that.setData({
        isinull: false,
      })
    }

  })
}

Page({
  data: {
    articleListlittle: {},
    articleListNewlittle: {},
    new: String,
    all: String,
    isNot: true,
    isnot: false,
    isinull: false,
    isanull: false,
  },
  onLoad() {
    loadPost(this),
    loadItemPost(this),
      this.setData({
        new: "button-not",
        all: "button-all"
      })
  },
  turntoup() {
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