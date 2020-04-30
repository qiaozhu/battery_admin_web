import mutations from './mutations';
import actions from './actions';
// 导出全局配置
import g_config from './global';

// 定义vuex
const state = {
  g_config: g_config, // 全局布局配置
  noticeData: [], // 消息数据
  menuTree: [], // 导航菜单树结构
  permission: [], // 用户权限
  sideAction: '', // 侧栏选中项
  tabViewsList: [], // 标签页数据
  tabActive: '' // 选中的标签页
};

export default {
  state,
  mutations,
  actions
};
