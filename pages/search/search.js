import {
  request, BASE_URL
} from '../../utils/request.js'

const app = getApp()

function loadSearch(that) {
  return new Promise((resolve, reject) => {
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
function searchitem(that, type, searchTarget) {
  request('search.php', {
    type: type,
    keys: searchTarget,
    page: 1,
    limit: 5,
    secret_key: app.globalData.secret_key,
  }).then(data => {
    that.setData({
      searchitemlist: data.result,
      length: data.result.length
    })
    if (0 == data.result.length) {
      console.log('a')
      that.setData({
        isnull: true,
      })
    }
    else {
      console.log('n')
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
    item: "item"
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    if (this.data.type == "article") {
      this.setData({
        type: 1,
        art: "article"
      })
    }
    else {
      this.setData({
        type: 2,
        art: "item"
      })
    }
    if (this.data.searchTarget != null) {
      searchitem(this, this.data.type, this.data.searchTarget);
      this.setData({
        issearch: false
      })
    }

  },
  history(e) {
    if (this.data.type == "article") {
      this.setData({
        type: 1,
        art: "article"
      })
    }
    else {
      this.setData({
        type: 2,
        art: "item"
      })
    }
    searchitem(this, this.data.type, e._relatedInfo.anchorTargetText)
    this.setData({
      issearch: false
    })
  }
})