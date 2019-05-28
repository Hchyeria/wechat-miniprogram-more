import { request } from '../../utils/request.js'

 function deleteart(that,ID,icon) {
  request('articles.php', {
    secondType: 'delete_article',
    secret_key: app.globalData.secret_key,
    ID:ID
  }).then(data => {
    if (data.result === "delete success!") that.setData({ toastError: ''});
    else that.setData({ toastError: 'ggg'})
    that.setData({
      toastMessage: `data.result！`
    })
    })
}
function deleteitem(that, ID, icon) {
  request('items.php', {
    secondType: 'delete_item',
    secret_key: app.globalData.secret_key,
    ID: ID
  }).then(data => {
    if (data.result === "delete success!") that.setData({ toastError: '' });
    else that.setData({ toastError: 'ggg'})
    that.setData({
      toastMessage: data.result
    })
  })
}
function deletemail(that,mID,icon) {
  request('message.php', {
    secondType: 'delete_message',
    secret_key: app.globalData.secret_key,
    mID: mID
  }).then(data => {
    if (data.result === "delete success!") that.setData({ toastError: ''});
    else that.setData({ toastError: 'ggg' })
    that.setData({
      toastError: 0,
      toastMessage: data.result
    })
  })
}
const app = getApp()
Component({
  properties: {
    text1:String,
    isclick: Boolean,
    mID:String,
    ID:String,
    mail:String,
    iscol:Boolean,
    isItem:Boolean
  },

  data: {
   isEXIT:true,
   icon: String,
  },
  methods: {
    delete(){
      if(!this.data.iscol){
        if (this.data.isItem) {
          deleteitem(this, this.data.ID, this.data.icon)
        }
        else{
          if(this.data.mID)deletemail(this, this.data.mID, this.data.icon)
          else deleteart(this,this.data.ID,this.data.icon)
          }
      }
      else{
          request('collections.php', {
            secondType: 'insert_collection',
            secret_key: app.globalData.secret_key,
            type: this.data.isItem ? 2 : 1,
            id: this.data.ID
          })
        
      }
    }
  }
})
