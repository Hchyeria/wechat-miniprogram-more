// utils/toggleIcon/index.js
Component({
  properties: {
    image:String,
    status:Boolean
  },
  methods: {
    toggle(e){
      this.setData({
        status:!this.data.status
      })
      this.triggerEvent({
        
      })
    }
  }
})
