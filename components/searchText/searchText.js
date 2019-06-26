Component({
  properties: {
    keywords:{
      type:Array,
      value:[],
      observer(val){
        console.log('keywords',val)
      }
    },
    innerText:{
      type:String,
      value:'',
      observer(val){
        this.data.keywords.forEach(key => val = val.replace(new RegExp(`${key}`, 'g'), `%%=${key}%%`))
        this.setData({content:val.split('%%')})
        console.log(this.data.content)
      }
    }
  },
  data: {
    content:[]
  },
})
