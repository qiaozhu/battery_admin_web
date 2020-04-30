import store from '../store';

// 查询对应模块下的第一个路由
export default moudle => {
  // 默认跳转到侧栏菜单第一个 找不到则404
  const menuTree = store.state.menuTree || [];
  if (menuTree.length === 0) return '/error/404';

  let sideData = menuTree.filter(el => el.href === '/' + moudle);
  sideData = sideData[0] || {};
  sideData = sideData.children || [];
  let redirectPath = '';

  // 循环匹配 找到第一个以"/"开头的path
  function loopTree(sideArray) {
    if (redirectPath) return;
    sideArray.some(item => {
      if (item.href.indexOf('/') === 0) {
        redirectPath = item.href;
        return true;
      } else {
        item.children = item.children || [];
        if (item.children.length > 0) loopTree(item.children);
      }
    });
  }
  loopTree(sideData);
  redirectPath = redirectPath || '/error/404';
  return redirectPath;
};
