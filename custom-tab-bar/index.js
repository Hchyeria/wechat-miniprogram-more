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
      pagePath: "/pages/person/person",
      iconPath: "/assets/user-line.png",
      selectedIconPath: "/assets/user-full.png",
    }]
  },
  attached() { },
  methods: {
    switchTab(e) {
      let { path } = e.currentTarget.dataset
      wx.switchTab({ url: path })
    }
  }
})