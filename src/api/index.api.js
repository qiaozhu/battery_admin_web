import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------首页---------- */

// 企业登入
api.login = baseURL + '/user/login';
// 忘记密码-发送验证码
api.forgetPwdSend = baseURL + '/user/forgetPwdSend';
// 忘记密码-设置新密码
api.forgetPwdSet = baseURL + '/user/forgetPwdSet';

export default api;
