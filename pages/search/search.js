import {
  request
} from '../../utils/request.js'

const app = getApp()

function loadSearch(that) {
  return new Promise(() => {
    request('search.php', {
      secondType: 'history',
      secret_key: app.globalData.secret_key,
      num: 5
    }).then(data => {
      that.setData({
        searchList: data.result
      })
    })
  })
}

let page  = 0

function formatKey(text){
  let arr = [...new Set(text.split(' '))]
  return arr.filter(item => item !== '').join(',')
}

function searchitem(that, type, searchTarget) {
  page++
  request('search.php', {
    type: type,
    keys: formatKey(searchTarget),
    page,
    limit: 5,
    secret_key: app.globalData.secret_key,
  }).then(data => {
    that.setData({
      searchitemlist: [...that.data.searchitemlist,...data.result],
      length: that.data.length + data.result.length
    })
    console.log(that.data.searchitemlist, that.data.length)
    if (0 == data.result.length) {
      that.setData({
        isnull: true,
      })
    }
    else {
      that.setData({
        isnull: false,
      })
    }
  })
}

Page({
  data: {
    type: undefined,
    searchList: Object,
    searchlist: Object,
    issearch: true,
    isnull: false,
    length: 0,
    art: String,
    article: "article",
    item: "item",
    keywords:[]
  },
  onReachBottom(){
    console.log('search refresh')
    searchitem(this, this.data.type, this.data.searchTarget)
  },
  onLoad(option) {
    loadSearch(this),
      this.setData({
        type: option.type
      })
  },
  getInput(e) {
    this.setData({
      searchTarget: e.detail.value
    })
  },
  search() {
    page = 0
    this.setData({
      searchitemlist: [],
      length: 0
    })
    let type = 1
    if (this.data.type == "article" || this.data.type == 1) {
      this.setData({
        type,
        art: "article"
      })
    } else {
      type  = 2
      this.setData({
        type,
        art: "item"
      })
    }
    if (this.data.searchTarget != null) {
      searchitem(this, this.data.type, this.data.searchTarget)
      this.setData({
        keywords: this.data.searchTarget.split(' '),
        issearch: false
      })
    }
  },
  history(e) {
    page = 0
    this.setData({
      searchitemlist: [],
      length: 0
    })
    let type = 1
    if (this.data.type == "article") {
      this.setData({
        type,
        art: "article"
      })
    }
    else {
      type = 2
      this.setData({
        type,
        art: "item"
      })
    }
    let {history} = e.currentTarget.dataset
    console.log(history)
    this.setData({
      issearch: false,
      searchTarget: history,
      keywords: history.split(',')
    })
    searchitem(this, this.data.type, history)
  }
})