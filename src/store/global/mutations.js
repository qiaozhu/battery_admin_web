import * as types from './types';
// 由mutation来修改state
const mutations = {
  [types.CHANGE_GLOBAL]: function(state, data) {
    state.g_config = data;
  },
  [types.CHANGE_LAYOUT]: function(state, data) {
    console.log(data);
    state.layout = data;
  },
  [types.CHANGE_SIDEACTION]: function(state, data) {
    state.sideAction = data;
  },
  [types.CHANGE_REGION]: function(state, data) {
    state.regionData = data;
  },
  [types.CHANGE_PERMISSION]: function(state, data) {
    state.permission = data;
  },
  [types.CHANGE_MENUTREE]: function(state, data) {
    state.menuTree = data;
  },
  [types.SET_NOTICE_DATA]: function(state, data) {
    state.noticeData = data;
  },
  [types.ADD_TAB_VIEW]: function(state, data) {
    let idx = state.tabViewsList.findIndex(item => item.name === data.name);
    if (idx === -1) {
      if (data.meta && data.meta.onetab) {
        idx = state.tabViewsList.findIndex(item => item.meta.onetab === data.meta.onetab);
        if (idx === -1) {
          state.tabViewsList.push(data);
        } else {
          state.tabViewsList.splice(idx, 1, data);
        }
      } else {
        state.tabViewsList.push(data);
      }
    } else {
      state.tabViewsList.splice(idx, 1, data);
    }
  },
  [types.REMOVE_TAB_VIEW]: function(state, data) {
    const idx = state.tabViewsList.findIndex(item => item.name === data);
    if (idx !== -1) {
      state.tabViewsList.splice(idx, 1);
    }
  },
  [types.SET_TAB_ACTIVE]: function(state, data) {
    state.tabActive = data;
  }
};
export default mutations;
