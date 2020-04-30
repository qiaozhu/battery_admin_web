// 获取权限
import axios from '@/utils/axios';
import api from '@/api/base.api';

let permission = {
  // 获取权限list
  getData(entry = false) {
    return new Promise((resolve, reject) => {
      let options = {};
      if (entry) {
        options.silence = true; // silence是否静默加载
        options.backself = true; // backself请求出错是否resolve
      }
      let perResult = axios({ method: 'get', url: api.getUserMenuTree, params: {}, ...options });

      perResult.then(res => {
        if (res.status !== 0) resolve({ error: true, message: res.message });

        res = res.data || [];
        let perList = []; // 平行结构权限

        // 递归循环 获取permission
        function loopTree(list) {
          list.forEach(item => {
            if (item.permission) {
              perList.push(item.permission);
            }
            item.children = item.children || [];
            if (item.children.length > 0) {
              loopTree(item.children);
            }
          });
        }
        loopTree(res);
        resolve({ menu: res, list: perList });
      });
      perResult.catch(error => {
        if (entry) {
          resolve({ error: true, message: error });
        } else {
          reject({ error: true, message: error });
        }
      });
    });
  },
  setData(store, menu, list) {
    return new Promise(async (resolve, reject) => {
      // 将菜单tree存入store
      await store.dispatch('changeMenuTree', menu);
      // 将权限存入store
      await store.dispatch('changePermission', list);
      resolve();
    });
  }
};
export default permission;
