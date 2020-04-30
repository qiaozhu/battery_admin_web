/* 业务公用处理脚本 */
import api from '@/api/base.api';
import axios from '@/utils/axios';
import utils from '@/utils/utils';

const biz = {
  // 获取用户基本信息
  getUserInfo(token = '') {
    return new Promise(async (resolve, reject) => {
      let options = {
        method: 'GET',
        url: api.getUserInfo
      };
      if (token) {
        options.headers = { Authorization: token };
      }
      let userData = await axios(options);
      // 存储用户信息
      localStorage.setItem('userData', JSON.stringify(userData.data));
      resolve(userData);
    });
  },
  // 获取字典数据 若不指定key则返回所有字典 reload:重新读取
  getDict(key = '', reload = false) {
    return new Promise(async (resolve, reject) => {
      let _dict = utils.getLocalItem('sysDict');
      if (reload || !Object.keys(_dict).length > 0) {
        let result = await axios.get(api.getAllDict);
        utils.setLocalItem('sysDict', result.data);
        _dict = result.data;
      }
      resolve(key ? _dict[key] : _dict);
    });
  }
};
export default biz;
