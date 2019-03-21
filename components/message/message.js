import { HOST } from '../../utils/request.js'
Component({
  properties: {
    article:Object,
    toDetail:Boolean
  },
  data:{
    baseURL: HOST
  },
  methods: {
    onTap(){
      if(!this.data.toDetail){
        return
      }
      wx.navigateTo({
        url: `../../pages/detail/detail?aid=${this.data.article.aid}`,
      })
    },
    toReply(){
      if(!this.data.toDetail){
        this.triggerEvent('toReply',{attention:''})
        return
      }
      wx.navigateTo({
        url: `../../pages/detail/detail?aid=${this.data.article.aid}`,
      })
    }
  }
})
