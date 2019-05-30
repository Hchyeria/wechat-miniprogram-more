import {
  request
} from 'request.js'


function objAddStyle(obj) {
  return obj && obj.map(ele =>
    Object.keys(ele).reduce((aac, val) => {
      aac[val] = ele[val];
      aac['style'] = '';
      return aac;
    }, {})
  )
}

export function getType(targetURL, params, typeList, that, ishasapi = 1, slice_num = 1) {
  return new Promise((resolve, reject) => {
    request(targetURL, params, {}, 'GET', ishasapi).then(data => {
      if (slice_num) {
        that.setData({
          [typeList]: objAddStyle(data.result.slice(slice_num))
        })
      }
      else {
        that.setData({
          [typeList]: ishasapi ? objAddStyle(data.result) : objAddStyle(data)
        })
      }
      resolve(data)
    })
  })
}

export function selctType(id, typeNum, typeList, that, id_type = 'type_id', type_name = '', isshowselect = '', isselect = [0, 0], PickText = '') {
  let tempList = that.data[typeList]
  let type_text = ''
  let resList = tempList.map(ele => {
    if (ele[id_type] === id) {
      ele.style = 'active'
      type_text = isshowselect ? ele[type_name] : ''
    }
    else ele.style = ''
    return ele
  })
  if (!isshowselect) {
    that.setData({
      [typeNum]: id,
      [typeList]: resList
    })
    return;
  }
  that.setData({
    [typeNum]: id,
    [typeList]: resList,
    [isshowselect]: [0, 0],
    isselect,
    [PickText]: type_text
  })
}
export function getIsoTime(){
  let date = new Date();
  let y = date.getFullYear();
  let m = date.getMonth()+1 >= 10 ? m+1 : "0" + (m+1);
  let d = date.getDate() >= 10 ? d : "0" + d;
  let h = date.getHours() >= 10 ? h : "0" + h;
  let min = date.getMinutes() >= 10 ? min : "0" + min;
  let s = date.getSeconds() >= 10 ? s : "0" + s;
  return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s
}

export function getCurrentPageUrl() {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var url = currentPage.route
  return url
}

export function showRepeatMsg(that, toastError, toastMessage, otherSetData) {
  let oldMessage = that.data.toastMessage
  if (otherSetData){
    if (toastMessage === oldMessage) {
      that.setData({
        toastError,
        toastMessage: oldMessage + '!',
        ...otherSetData
      })
    }
    else {
      that.setData({
        toastError,
        toastMessage,
        ...otherSetData
      })
    }
  }
  else{
    if (toastMessage === oldMessage) {
      that.setData({
        toastError,
        toastMessage: oldMessage + '!'
      })
    }
    else {
      that.setData({
        toastError,
        toastMessage
      })
    }
  }
  
}