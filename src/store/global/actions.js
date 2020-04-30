import * as types from './types';

// 这是修改state的入口
// 定义方法  读取type   提交conmit
// conmit操作对象指向mutation  mutation修改state
export default {
  // 修改全局配置
  changeGlobal({ commit }, data) {
    commit(types.CHANGE_GLOBAL, data);
  },
  // 修改layout设置
  changeLayout({ commit }, data) {
    commit(types.CHANGE_LAYOUT, data);
  },
  // 修改侧栏选中项
  changeSideAction({ commit }, data) {
    commit(types.CHANGE_SIDEACTION, data);
  },
  // 修改省市区数据
  changeRegion({ commit }, data) {
    commit(types.CHANGE_REGION, data);
  },
  // 修改权限数据
  changePermission({ commit }, data) {
    commit(types.CHANGE_PERMISSION, data);
  },
  // 修改导航菜单数据
  changeMenuTree({ commit }, data) {
    commit(types.CHANGE_MENUTREE, data);
  },
  // 设置消息数据
  setNoticeData({ commit }, data) {
    commit(types.SET_NOTICE_DATA, data);
  },
  // 添加标签页
  addTabView({ commit }, data) {
    commit(types.ADD_TAB_VIEW, data);
  },
  // 移除标签页
  removeTabView({ commit }, data) {
    commit(types.REMOVE_TAB_VIEW, data);
  },
  // 设置标签页选中
  setTabActive({ commit }, data) {
    commit(types.SET_TAB_ACTIVE, data);
  }
};
