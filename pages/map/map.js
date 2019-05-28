Page({
  data: {
    latitude: '',
    longitude: '',
    markers: [],
    address: '',
    callout:[]
  },
  onLoad(option) {
    this.setData({
      latitude: option.latitude,
      longitude: option.longitude,
      address: option.address,
      markers: [{
        id: 1,
        latitude: option.latitude,
        longitude: option.longitude,
        iconPath: '../../assets/location.png',
        callout: {
          content: option.address,
          color: "#537cbc",
          fontSize: "16",
          borderRadius: "10",
          bgColor: "#ffffff",
          padding: "30",
          display: "ALWAYS"
         }
      }]
    })
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },
})
