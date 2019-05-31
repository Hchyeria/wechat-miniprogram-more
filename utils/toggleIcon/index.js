Component({
  properties: {
    image: String,
    status: Boolean,
    ok: Boolean,
    openType: String,
    sharence: {
      type: Object,
      value: {}
    }
  },
  methods: {
    toggle() {
      this.setData({
        status: !this.data.status
      })
      this.triggerEvent('toggle', {})
    }
  }
})
