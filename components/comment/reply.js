import { request, parseTimeStamp } from '../../utils/request.js'
const app = getApp()
//generalizing
Component({
  properties: {
    secret_key: String,
    isShow: Boolean,
    type: String,
    Id: Number,
    mID:String,
    attention: {
      type: String,
      value: '',
      observer(val) {
        if (val !== '') {
          this.setData({
            input: `@${val} `,
          })
        }
      }
    },
    cid: {
      type: Number,
      value: -1,
      observer(val) {
        if (val !== -1) {
          this.setData({
            cid: val
          })
        }
      }
    }
  },
  data: {
    input: '',
    timestamp: '',
  },
  methods: {
    submit(e) {
      this.setData({
        isShow: false,
        input: '',
        attention: ''
      })
      let params;
      if (this.data.cid !== -1) {
        console.log('reply to', this.data.type, this.data.Id, 'comment', this.data.cid)
        params = {
          secondType: 'insert_comment_secondType',
          cType: this.data.type[0] === 'a' ? 3 : 4,
          pointerID: this.data.Id,
          pointerID2: this.data.cid,
          secret_key: app.globalData.secret_key,
          content: e.detail.value,
        }
      } else {
        console.log('reply to', this.data.type, this.data.Id)
        params = {
          secondType: 'insert_comment',
          cType: this.data.type[0] === 'a' ? 1 : 2,
          pointerID: this.data.Id,
          secret_key: app.globalData.secret_key,
          content: e.detail.value,
        }
      }
      request('comments.php', params).then(data => {
        this.triggerEvent('replySuccess')
      })
    },
    blur() {
      this.setData({
        isShow: false,
        input: '',
        attention: ''
      })
    },
    focus() {
      // not a elegant solution
      this.setData({
        isShow: true
      })
    }
  },
})