export function onShare(res) {
  console.log(res)
  let {
    sharence
  } = res.target.dataset
  console.log(sharence.text)
  return res.from === 'button' ? {
    title: sharence.text,
    path: sharence.url
  } : {
    title: '一个超酷的APP',
    path: '/pages/login/login'
  }
}