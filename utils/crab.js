import { BASE_URL, toString } from './request.js'

const itemList = ['涉及违法行为', '不健康内容', '反动', '虚假信息', '非本校人员', '水贴']

export function toCrab(crabData) {
  areYouSure(crabData)
}

function areYouSure(crabData) {
  wx.showModal({
    title: '举报',
    content: `你真的要举报这位吗？举报会使其信用度降低！确认？`,
    success(res) {
      res.confirm && chooseACrab(crabData)
    }
  })
}

function chooseACrab(crabData) {
  wx.showActionSheet({
    itemList,
    success(res) {
      crabData.reason = itemList[res.tapIndex]
      
      crabIt(crabData)
    }
  })
}

function crabIt(crabData) {
  wx.request({
    url: `https://${BASE_URL}/report.php?${toString(crabData)}`,
    success() {
      that.setData({
        toastError: '',
        toastMessage: `这位已被举报!！`
      })
    }
  })
}