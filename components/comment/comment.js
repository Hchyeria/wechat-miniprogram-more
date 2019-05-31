//generalized

import { parseTimeStamp } from '../../utils/request.js'
Component({
  properties: {
    comment: {
      type: Object,
      value: {},
      observer(val) {
        this.setData({
          timestamp: parseTimeStamp(val.time),
        })
      }
    },
    status: {
      type: String,
      value: 'user'
    }
  },
  methods: {
    data: {
      timestamp: '',
    },
    reply() {
      this.triggerEvent('toReply', {
        attention: this.data.comment.username,
        cid: this.data.comment.ID
      })
    }
  }
})
