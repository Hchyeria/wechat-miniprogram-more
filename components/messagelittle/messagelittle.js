import { BASE_URL, parseTimeStamp,request } from '../../utils/request.js'

const app = getApp()

function navigateToDetail(that) {
  wx.navigateTo({
    url: `../../pages/detail/detail?Id=${that.data.article.ID || that.data.article.aID || that.data.article.iID}&type=${that.data.type}&isout=${that.data.isout}`,
  })
}
function searchart(that,php,secondType){
  return request(php, {
    secondType: secondType ,
    ID: that.data.ID,
    secret_key:app.globalData.secret_key
  }).then(data=>{
    console.log(data.result[0])
    that.setData({
      pictures: data.result[0].pictures
    })
  })
}
Component({
  properties: {
    toDetail: Boolean,
    isdelete:Boolean,
    isItem: Boolean, 
    art:String,
    iscol:Boolean,
    article: {
      type: Object,
      value: {},
      observer(val) {
        this.setData({
          timestamp: parseTimeStamp(val.time),
          isout: val.status == 1 ? true : false,
          ID:val.ID
        })
      }
    },
    post:Boolean,
  },
  
  data: {
    BASE_URL,
    isclick:false,
    text1:"Delete Your Article",
    ID: undefined,
    type: undefined,
    timestamp:'',
    text2: "Delete Your Collection",
    aID:'',
    isout:false,
    pictures:''
  },
  attached(){

    if (this.data.post){
      let that = this;
      if (this.data.isItem)
        searchart(that, 'items.php','select_item_by_id')
      else
        searchart(that, 'articles.php','select_article_by_id')
  
    }
  },
  methods: {
    onTap() {
      console.log(this.data.art)
      if(this.data.art=="item"){
        this.setData({
          type: this.data.art
        })
      }
       else {this.setData({
        type: (this.data.isItem && "item") || ("article")
      })
       }

      if (!this.data.toDetail) {
        return
      }
      else navigateToDetail(this)
    },
    toReply() {
      if (!this.data.toDetail) {
        this.triggerEvent('toReply', { attention: '', cid: -1 })
        return
      }
      navigateToDetail(this)
    },
    click(){
      this.setData({
        isclick:!this.data.isclick,
        ID: this.data.article.ID || this.data.article.aID
      })
      
    },
    isEXIT(e) {
      this.setData({
        isclick: !this.data.isclick
      })
    },
    preview(e) {
      console.log(this.data.out)
      let {
        index
      } = e.currentTarget.dataset
      let urls = this.data.pictures.map(e => `https://${BASE_URL}${e.pURL}`)
      console.log('Image Preview', index, urls)
      wx.previewImage({
        current: urls[index],
        urls
      })
    },
  }
})
