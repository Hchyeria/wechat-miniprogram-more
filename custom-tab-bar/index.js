Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/assets/home-line.png",
      selectedIconPath: "/assets/home-fill.png",
    }, {
      pagePath: "/pages/testpage/testpage",
      iconPath: "/assets/coin-line.png",
      selectedIconPath: "/assets/coin-full.png",
    }, {
      pagePath: "/pages/testpage1/testpage1",
      iconPath: "/assets/user-line.png",
      selectedIconPath: "/assets/user-full.png",
    }]
  },
  attached() {},
  methods: {
    switchTab(e) {
      wx.switchTab({
        url: e.currentTarget.dataset.path
      })
    }
  }
})