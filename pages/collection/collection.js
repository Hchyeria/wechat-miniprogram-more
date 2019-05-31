import { request } from '../../utils/request.js'

export function loadNewCollection(that) {
  request('collections.php', {
    secondType: 'select_item_collection',
    secret_key: app.globalData.secret_key,
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


export function loadCollection(that) {
  request('collections.php', {
    secondType: 'select_article_collection',
    secret_key: app.globalData.secret_key,
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

const app = getApp()

Page({
  data: {
    articleListlittle: {},
    articleListNewlittle: {},
    isNot: true,
    isnot: false,
    new: String,
    all: String,
    isanull: false,
    isinull: false
  },
  onLoad(option) {
    loadCollection(this),
      loadNewCollection(this),
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