import { BASE_URL, parseTimeStamp,request } from '../../utils/request.js'
function navigateToDetail(that) {
  wx.navigateTo({
    url: `../../pages/detail/detail?Id=${that.data.mail.article_ID}&type=${that.data.type}`,
  })
}
Component({
  properties: {
    toDetail: Boolean,
    first:Boolean,
    isItem: Boolean,
    mail: {
      type: Object,
      value: {},
      observer(val) {
        this.setData({
          timestamp: parseTimeStamp(val.time),
        })
      }
    },
  },

  data: {
    attation: 0,
    isReply: false,
    BASE_URL,
    isclick: false,
    text1: "Delete Your Message",
    mail:"mail",
    type: undefined,
  },
  methods: {
    onTap() {
      this.setData({
        type: (this.data.isItem && "item") || ("article")
      })
      if (!this.data.toDetail) {
        return
      }
      else {
        request('message.php', {
          secondType: 'set_had_read',
          mID: this.data.mail.mID
        })
        navigateToDetail(this)
      }
    },
    toReply() {
      if (!this.data.toDetail) {
        this.triggerEvent('toReply', { attention: '', cid: -1 })
        return
      }
      navigateToDetail(this)
    },
    click() {
      console.log(this.data.mail.mID)
      this.setData({
        isclick: !this.data.isclick,
        mID: this.data.mail.mID
      })

    },
    isEXIT(e) {
      this.setData({
        isclick: !this.data.isclick
      })
    },
    
  }
})
