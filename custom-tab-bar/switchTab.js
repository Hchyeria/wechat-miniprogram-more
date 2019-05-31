export function forTabBar(target, pageIndex) {
  if (typeof target.getTabBar === 'function' &&
    target.getTabBar()) {
    target.getTabBar().setData({
      selected: pageIndex
    })
  }
}