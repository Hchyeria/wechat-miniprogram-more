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