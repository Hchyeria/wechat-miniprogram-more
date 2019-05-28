// utils/toggleIcon/index.js
Component({
  properties: {
    image:String,
    status:Boolean,
    ok:Boolean,
    openType:String,
    sharence: {
      type: Object,
      value: {}
    }
  },
  methods: {
    toggle(e){
      this.setData({
        status:!this.data.status
      })
      this.triggerEvent('toggle', {})
    }
  }
})
