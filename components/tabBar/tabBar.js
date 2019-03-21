import { request } from '../../utils/request.js'

const targetURL = 'types.php'
const params = { secondType:'get_article_types' }

Component({
  properties: {

  },
  data: {
    tabList: [
      {
        "type_id": "1",
        "type_name": "学校信息"
      },
      {
        "type_id": "2",
        "type_name": "食堂资讯"
      },
      {
        "type_id": "3",
        "type_name": "社团活动"
      }
    ],
    selected:0
  },
  lifetimes: {
    created() {
      request(targetURL, params).then(data => {
        this.setData({
          tabList:data.result
        })
      })
    }
  },
  methods: {
    onTap(e){
      this.setData({
        selected:e.target.id.charAt(4)
      })
      this.triggerEvent('tabTap', { tid: e.currentTarget.dataset.tid})
    }
  }
})
