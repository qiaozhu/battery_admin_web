// 公用部分api

import config from '@/config/config';
let api = {};

const baseURL = config.baseURL;
api.baseURL = baseURL;

/* ----------公共接口---------- */

// 获取所有字典
api.getAllDict = baseURL + '/system/getAllDict';
// 获取用户菜单
api.getUserMenuTree = baseURL + '/system/getUserMenuTree';
// 获取当前登录用户信息
api.getUserInfo = baseURL + '/user/getUserInfo';

// 文件上传
api.upload = baseURL + '/file/upload';
export default api;
