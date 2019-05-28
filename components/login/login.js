import { request, BASE_URL } from '../../utils/request.js'
import { postCode } from '../../utils/authorize.js'

import { getType, selctType } from '../../utils/pick.js'

const app = getApp()

function setSchool(targetURL, params, data){
  return new Promise((resolve, reject) =>{
    request(targetURL, params, data, 'POST', 0, 1)
    .then(data => {
      resolve(data)
    })
    .catch(e =>{
      reject(e)
    })
  })
}

function checkSchool(targetURL, params){
  return new Promise((resolve, reject) => {
    request(targetURL, params, {}, 'GET', 0, 1)
      .then(data => {
        resolve(data)
      })
      .catch(e => {
        reject(e)
      })
  })
}

Component({
  properties: {
  },
  data: {
    BASE_URL,
    containHeight: '100px',
    buttonWidth: {
      left: '50%',
      right: '50%'
    },
    paddingChange: false,
    goindexClass: '',
    isload: true,
    islogin: false,
    issure: false,
    isfinalsure: false,
    isshowselct: [0, 0],
    isselect: [0 ,0],
    locationId: 0,
    locationPickText:'',
    schoolPickText: "",
    schoolPickid: '',
    objectlocationArray: [],
    objectschoolArray: [],
    isschool: false,
    toastError: '',
    toastMessage: "",
    istoast:false
  },
  pageLifetimes: {
    show() {
      if (app.globalData.secret_key !== '') {
        this.onGoindex()
        return
      }
      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          app.globalData.deviceH = res.windowHeight
          app.globalData.deviceW = res.windowWidth
          that.setData({
            containHeight: res.windowHeight,
            isload: false
          })
        }
      })

    }
  },
  methods: {
    onTapButton(e){
      let that = this;
      if (e.type === 'tap'){
        this.setData({
          buttonWidth: { 
            right: '80%', 
            left: '20%' 
          },
          paddingChange: false
        })
        setTimeout(() =>{
          that.setData({
            goindexClass: 'goindex-active'
          })
          that.triggerEvent('Goindex', that)
        }, 1000)
  
      }
      else{
        this.setData({
          buttonWidth: { 
            left: '80%', 
            right: '20%' 
          },
          paddingChange: true
          })
      }
    },
    onGotUserInfo(e) {
      let that = this;
      let res = e.detail.userInfo
      if (res){
        this.onTapButton(e)
        app.globalData.userInfo.nickName = res.nickName
        app.globalData.userInfo.avatarUrl = res.avatarUrl
        if(!this.data.issure){
          that.setData({
            isload: true
          })
          postCode(app).then(data =>{
            let targetURL = 'school.php'
            let params = { 
              action: 'check_school',
              secret_key: app.globalData.secret_key
            }
            checkSchool(targetURL, params).then(data =>{
              if (!data.state){
                let params = {
                  action: 'get_location'
                }
                getType(targetURL, params, 'objectlocationArray', this, 0, 0).then(data =>{
                  that.setData({
                    issure: true,
                    isload: false
                  })
                })
              }
              else{
                that.setData({
                  islogin: 1,
                  isschool: true
                })
              }
            })
          })
        }

      }
    },
    onShowSlectSchool(e){
      if(!this.data.locationId){
        that.setData({
          istoast:true,
          toastError: '',
          toastMessage: `请先选择省份！`
        })

        return;
      }
      this.setData({
        isshowselct: [0, 1]
      })
    },
    onShowSlectLocation(){
      this.setData({
        isshowselct: [1, 0]
      })
    },
    onSlectSchool(e){
      let id = e.target.dataset.sid
      id && selctType(id, 'schoolPickid', 'objectschoolArray', this, 'sID', 'school_name', 'isshowselct', [1, 1], 'schoolPickText')
      if(this.data.locationId && this.data.schoolPickid){
        this.setData({
          islogin: 1
        })
      }
    },
    onSlectlocation(e){
      let that = this
      let id = e.target.dataset.lid
      id && selctType(id, 'locationId', 'objectlocationArray', this, 'location_id', 'location_name', 'isshowselct', [1, 0], 'locationPickText')
      let targetURL = 'school.php'
      let params = { 
        action: 'get_school',
        location_id: this.data.locationId
      }
      this.setData({
        isload: true
      })
      getType(targetURL, params, 'objectschoolArray', this, 0, 0).then(data => {
        that.setData({
          isload: false
        })
      })
    },
    onLoadIndex(){
      this.triggerEvent('onLoadIndex', this)
    },
    onGoindex(){
      if(!this.data.isschool){
      let that = this;
      let id = this.data.schoolPickid
      let targetURL = 'school.php'
      let params = { 
        action: 'set_school',
        secret_key: app.globalData.secret_key
      }
      let data = {
        school_id: +id
      }
      setSchool(targetURL, params, data).then(data =>{
        that.setData({
          goindexClass: 'goindex-active'
        })
        setTimeout(() =>{
          that.setData({
            goindexClass: 'displayHide',
          })
        }, 500)
        that.triggerEvent('Goindex', that)
      })
      }
      else{
        let that = this;
        that.setData({
          goindexClass: 'goindex-active'
        })
        setTimeout(() => {
          that.setData({
            goindexClass: 'displayHide',
          })
        }, 500)
        that.triggerEvent('Goindex', that)
      }
    }
  }
})