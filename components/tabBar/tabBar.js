import { request } from '../../utils/request.js'

const targetURL = 'types.php'

//generalized
Component({
  properties: {
    type: String,
    index: {
      type: Number,
      value: 0,
      observer(val) {
        if (val >= 1 && val <= this.data.tabList.length) {
          this.setData({
            selected: val - 1
          })
        }
      }
    }
  },
  data: {
    tabList: [
      {
        "type_id": "1",
        "type_name": "搜索结果"
      }
    ],
    selected: 0
  },
  pageLifetimes: {
    show() {
      let params = { secondType: `get_${this.data.type}_types` }
      request(targetURL, params).then(data => {
        this.setData({
          tabList: data.result
        })

        this.triggerEvent('storeLeng', { len: data.result.length })
      })

    },

  },
  methods: {
    onTap(e) {
      this.setData({
        selected: e.target.id.charAt(4)
      })
      this.triggerEvent('tabTap', { tid: e.currentTarget.dataset.tid, leng: this.data.tabList.length })
    }
  }
})
