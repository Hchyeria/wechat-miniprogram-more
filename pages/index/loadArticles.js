import { request } from '../../utils/request.js'

const targetURL = 'articles.php'
export function loadArticles(that, tid, mode, limit = 15, page = 1) {
  request(targetURL, {
    secondType: 'select_article_by_type',
    typeID: tid,
    mode: mode,
    limit: limit,
    page: page
  }).then(data => {
    that.setData({
      contentList: data.result
    })
  })
}