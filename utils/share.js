export function onShare(res) {

  let {
    sharence
  } = res.target.dataset

  return res.from === 'button' ? {
    title: sharence.text,
    path: sharence.url
  } : {
      title: '一个超酷的APP',
      path: '/pages/login/login'
    }
}