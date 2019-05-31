import { BASE_URL, toString } from './request.js'

const itemList = ['水贴', '不健康内容', '反党', '右倾机会主义', '怼钟登华', '敢有刁民怼黄老师']

export function toCrab(crabData) {
  areYouSure(crabData)
}

function areYouSure(crabData) {
  wx.showModal({
    title: '🦀河蟹',
    content: `你真的要"和谐"这位吗？"和谐"会使其信用度降低！确认？`,
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
        toastMessage: `这位已被🦀"和谐"!！`
      })
    }
  })
}