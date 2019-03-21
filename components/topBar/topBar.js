const app =getApp()

Component({
  properties: {

  },
  data: {
    searchTarget: '',
    searchList:['aaaaaa','bbbbbb','cccccc','dddddd'],
    status:false,
    statusBarHeight: app.globalData.statusBarHeight,
    system:app.globalData.system
  },
  lifetimes:{
    created(){
    }
  },
  methods: {
    getInput(e) {
      console.log(e.detail.value)
      this.setData({
        searchTarget : e.detail.value
      })
    },
    toggle() {
     this.setData({
       status : !this.data.status
     })
    }
  }
})