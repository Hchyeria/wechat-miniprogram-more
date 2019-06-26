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

function searchitem(that, type, searchTarget) {
  page++
  request('search.php', {
    type: type,
    keys: searchTarget,
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
    searchitem(this, this.data.type, e._relatedInfo.anchorTargetText)
    this.setData({
      issearch: false,
      searchTarget: e._relatedInfo.anchorTargetText
    })
  }
})