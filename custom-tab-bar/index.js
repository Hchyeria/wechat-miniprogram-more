
let app = getApp()

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    isshow: true,
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/assets/home-line.png",
      selectedIconPath: "/assets/home-fill.png",
    }, {
      pagePath: "/pages/index/item",
      iconPath: "/assets/coin-line.png",
      selectedIconPath: "/assets/coin-full.png",
    }, {
      pagePath: "/pages/testpage1/testpage1",
      iconPath: "/assets/user-line.png",
      selectedIconPath: "/assets/user-full.png",
    }]
  },
  attached() { },
  methods: {
    switchTab(e) {
      let { path } = e.currentTarget.dataset
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      let url = currentPage.route
      if (path.slice(1) === url){
        wx.pageScrollTo({
          scrollTop: 0
        })
        pages[0].onPullDownRefresh();
      }
      else{
        wx.switchTab({ url: path })
      }
    }
  }
})