import { forTabBar } from '../../custom-tab-bar/switchTab.js'
import { loadArticles } from './loadArticles.js'

const app = getApp()

Page({
  data: {
    articleList:{}
  },
  onShow(){
    forTabBar(this, 0)
  },
  onLoad(){
    loadArticles(this,1,2)
  },
  tabTap(e){
    loadArticles(this, e.detail.tid, 2)
  }
})
