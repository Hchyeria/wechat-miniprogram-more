import {
  BASE_URL,
  request,
  parseTimeStamp
} from '../../utils/request.js'

function navigateToDetail(that) {
  wx.navigateTo({
    url: `../../pages/detail/detail?Id=${that.data.content.ID}&type=${that.data.type}`,
  })
}

function navigateToMap(that) {
  wx.navigateTo({
    url: `../../pages/map/map?latitude=${that.data.content.latitude}&longitude=${that.data.content.longitude}&address=${that.data.content.address}`,
  })
}

function item(that) {
  return request('items.php', {
    secondType: 'update_status',
    secret_key: app.globalData.secret_key,
    status: 1,
    ID: that.data.content.ID
  }).then(data => {
    if (data.result === "delete success!") that.setData({
      toastError: '',
    });
    else that.setData({
      toastError: 'ggg'
    })
    that.setData({
      isToast: true,
      toastMessage: data.result
    })
  })
}

function addAccountType(type) {
  let temp;
  switch (type) {
    case '0': temp = ''
      break
    case '1': temp = '社团组织'
      break
    case '2': temp = '商家企业'
      break
    default: temp = ''
  }
  return temp
}

const app = getApp()


////generalized
Component({
  properties: {
    content: {
      type: Object,
      value: {},
      observer(val) {
        if (val && val.time) {
          this.setData({
            isdelete: val.openID == app.globalData.openID
          })
          if (val.address !== 'hhh') {
            this.setData({
              isadd: true
            })
          }
          if(val.hot>=30){
            this.setData({
              isfire: true
            })
          }
          this.setData({
            timestamp: parseTimeStamp(val.time),
            imgUrls: val.pictures.map(e => `https://${BASE_URL}${e.pURL}`),
            ID: val.ID,
            collected: val.is_collection,
            labels: val.labels ? val.labels.split(',') : null,
            sharence: {
              text: val.content,
              url: `/pages/detail/detail?Id=${val.ID}&type=${this.data.type}&from=share`,
              imgUrls: val.pictures.map(e => `https://${BASE_URL}${e.pURL}`)
            },
            accountType: addAccountType(val.account_type)
          })
        }
      }
    },
    toDetail: Boolean,
    type: String,
    isde: Boolean,
    detail: Boolean,
    itemdetail: Boolean,
    status: {
      type: String,
      value: 'user'
    }
  },
  data: {
    BASE_URL,
    timestamp: '',
    ok: true,
    collected: false,
    imgUrls: '',
    isdelete: false,
    isclick: false,
    text1: "Delete Your Article",
    ID: '',
    isItem: '',
    heart: true,
    show: false,
    icon: '',
    sharence: {},
    ismore: false,
    isadd: false,
    toastError: 0,
    toastMessage: "",
    isToast: false,
    isfire:false,
    accountType: ''
  },
  methods: {
    onTap() {
      if (!this.data.toDetail) {
        return
      }
      navigateToDetail(this)
    },
    toReply() {
      if (!this.data.toDetail) {
        this.triggerEvent('toReply', {
          attention: '',
          cid: -1
        })
        return
      }
      navigateToDetail(this)
    },
    preview(e) {
      let {
        index
      } = e.currentTarget.dataset
      let urls = this.data.content.pictures && this.data.content.pictures.map(e => `https://${BASE_URL}${e.pURL}`)
      wx.previewImage({
        current: urls[index],
        urls
      })
    },
    favorite(e) {
      request('collections.php', {
        secondType: 'insert_collection',
        secret_key: app.globalData.secret_key,
        type: this.data.type[0] === 'a' ? 1 : 2,
        id: this.data.content.ID
      })
    },
    share(e) {
      request('share.php', {
        secondType: 'hotter',
        type: this.data.type[0] === 'a' ? 1 : 2,
        id: this.data.content.ID
      })
    },
    click() {
      this.setData({
        isclick: !this.data.isclick,
        ID: this.data.content.ID || this.data.content.aID,
        isItem: this.data.type[0] === 'a' ? false : true,
        heart: !this.data.heart
      })

    },
    isEXIT(e) {
      this.setData({
        isclick: !this.data.isclick,
        heart: !this.data.heart
      })
    },
    download() {
      let that = this
      wx.showModal({
        content: `确定要下架此商品吗`,
        success(res) {
          res.confirm && item(that, that.data.icon)
        }
      })
    },
    more() {
      this.setData({
        ismore: !this.data.ismore
      })
    },
    onLoadImage() {
      this.triggerEvent('onLoadPictrue', this)
    },
    map() {
      navigateToMap(this)
    }
  },

})