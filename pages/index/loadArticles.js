import { request } from '../../utils/request.js'

const targetURL = 'articles.php'

export function loadArticles(that,tid,mode){
  request(targetURL, {
    secondType: 'select_article_by_type',
    typeID: tid,
    mode: mode
  }).then(data=>{
    that.setData({
      articleList:data.result
    })
  })
}