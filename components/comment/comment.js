Component({
  properties: {
    comment:Object
  },
  methods: {
    reply(){
      this.triggerEvent('toReply', { attention: this.data.comment.username})
    }
  }
})
