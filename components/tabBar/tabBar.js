import { request } from '../../utils/request.js'

const targetURL = 'types.php'
let params = { secondType: 'get_article_types' }

//generalized
Component({
  properties: {
    type: String
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
      })

    }
  },
  methods: {
    onTap(e) {
      this.setData({
        selected: e.target.id.charAt(4)
      })
      this.triggerEvent('tabTap', { tid: e.currentTarget.dataset.tid })
    }
  }
})
