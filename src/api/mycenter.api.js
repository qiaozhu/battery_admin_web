import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------个人中心---------- */

// 修改用户基本信息
api.editUserInfo = baseURL + '/user/editUserInfo';

// 修改登录密码
api.editAccountPwd = baseURL + '/user/editAccountPwd';

export default api;
