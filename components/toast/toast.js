
Component({
  properties: {
    isError: Boolean,
    message: {
      type: String,
      value: '',
      observer(val) {
        let that = this
        if (val) {
          if (this.data.isDisappear){
            this.setData({
              isDisappear: 0
            })
          }
          setTimeout(() => {
            if (!that.data.isDisappear) {
              that.setData({
                isDisappear: 1
              })
            }
          }, 3000)
        }
      }
    }
  },
  data: {
    isDisappear: 1
  },
  pageLifetimes: {
  
  },
  lifetimes: {
    attached() {
    },
    detached() {

    },
  },
  methods: {
    
  }
})