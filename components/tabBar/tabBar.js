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
    },
    isRenderS:{
      type: Boolean,
      value: true
    },
    isOverlay:{
      type: Boolean,
      observer(val) {
        if (!val){
          setTimeout(() => {
            this.setData({
              sortSectionClass: "displayHide"
            })
          }, 50)
          this.setData({
            sortSectionClass: "slide-up",
            isSelect: [false, false]
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
    sortMode: '',
    sortList: ['热度', '时间', '就近'],
    selected: 0,
    isSelect: [false, false],
    sortSectionClass: "displayHide",
    isOnlySchool: 0
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
    },
    switchChange(e){
      let { value } = e.detail
      if (value){
        this.triggerEvent('chooseMode', { id: this.data.sortMode, isOnlySchool: 1 })
        this.setData({
          isOnlySchool: 1
        })
      }
      else {
        this.triggerEvent('chooseMode', { id: this.data.sortMode, isOnlySchool: 0 })
        this.setData({
          isOnlySchool: 0
        })
      }
    },
    chooseSelect(e, flag){
      let that = this;
      let isOpen = this.data.isSelect[0] || this.data.isSelect[1]
      let { sid } = e.target.dataset || e
      if (isOpen){
        setTimeout(() => {
          that.setData({
            sortSectionClass: "displayHide"
          })
        }, 50)
      }
      if(+sid){
        this.setData({
          sortSectionClass: isOpen ? "slide-up" : "slide-down",
          isSelect: this.data.isSelect[0] ? [false, false] : [false, !this.data.isSelect[1]]
        })
        !flag && this.triggerEvent('changeOverlay', { isOverlay: this.data.isSelect[1] })
      }
      else{
        this.setData({
          sortSectionClass: isOpen ? "slide-up" : "slide-down",
          isSelect: this.data.isSelect[1] ? [false, false] : [!this.data.isSelect[0], false]
        })
        !flag && this.triggerEvent('changeOverlay', { isOverlay: this.data.isSelect[0] })
      }
    },
    chooseMode(e) {
      let { id } = e.target.dataset
      this.setData({
        sortSectionClass: this.data.isSelectSchool ? "slide-up" : "slide-down",
        isSelectSort: !this.data.isSelectSchool,
        sortMode: id
      })
      this.triggerEvent('chooseMode', { id, isOnlySchool: this.data.isOnlySchool })
    }
  }
})
