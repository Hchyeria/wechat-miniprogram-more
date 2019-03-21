import { request } from '../../utils/request.js'

Component({
  properties: {
    openID:String,
    isShow:Boolean,
    aid:Number,
    attention:{
      type:String,
      value:'',
      observer(val){
        if(val != ''){
          this.setData({
            input: `@${val} `
          })
        }
      }
    }
  },
  data: {
    input:''
  },
  methods: {
    submit(e) {
      this.setData({
        isShow: false,
        input: '',
        attention: ''
      })
      request('comments.php',{
        secondType:'insert_comment',
        cType:1,
        pointerID: this.data.aid,
        openID: this.data.openID,
        content: e.detail.value,
      }).then(data=>{
        this.triggerEvent('replySuccess')
        wx.showModal({
          title: 'Comment',
          content: data.result,
        })
      })
    },
    blur() {
      this.setData({
        isShow: false, 
        input: '',
        attention: ''
      })
    },
    focus() {
      // not a elegant solution
      this.setData({
        isShow:true
      })
    }
  },
})