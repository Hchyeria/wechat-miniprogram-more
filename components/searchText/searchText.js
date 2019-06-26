Component({
  properties: {
    keywords:{
      type:Array,
      value:[]
    },
    innerText:{
      type:String,
      value:'',
      observer(val){
        this.data.keywords.forEach(key => val = val.replace(new RegExp(`${key}`, 'g'), `%%=${key}%%`))
        this.setData({content:val.split('%%')})
      }
    }
  },
  data: {
    content:[]
  },
})
