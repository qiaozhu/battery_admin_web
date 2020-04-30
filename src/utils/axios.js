import axios from 'axios';
import { Loading, Message } from 'element-ui';

axios.defaults.timeout = 60000;
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = '';

let loading; // loading对象
let loadingCount = 0; // loading计数器

// 请求发出拦截器
axios.interceptors.request.use(
  config => {
    // default config
    config.headers['Authorization'] =
      config.headers['Authorization'] || (localStorage.getItem('Authorization') || '');
    config.silence = config.silence === true ? config.silence : false; // 是否静默加载
    config.backRes = config.backRes === true ? config.backRes : false; // 是否返回response
    config.showMsg = config.showMsg === false ? config.showMsg : true; // 是否弹出错误提示

    // 静默加载 不添加loading
    if (config.silence !== true) loadingCount++;
    if (loadingCount > 0) loading = Loading.service({ fullscreen: true });
    return config;
  },
  error => {
    Message.error({ message: '请求参数配置错误' });
    return Promise.reject(error);
  }
);

// 请求响应拦截器
axios.interceptors.response.use(
  res => {
    // 关闭loaading
    if (res.config.silence !== true && loadingCount > 0) loadingCount--;
    if (loading && loadingCount === 0) {
      // 间隔300毫秒内的loading合并
      setTimeout(() => loading.close(), 300);
    }
    if (res.data) {
      if (res.data.status !== 0) {
        if (res.data.status === 401) {
          localStorage.removeItem('Authorization');
          localStorage.removeItem('userData');
          window.location.href = './index.html#/login';
          return Promise.reject(res.data.message);
        } else {
          if (res.config.backRes === true) {
            /**
             * backRes
             * 如果此响应需要页面自己处理 请设置backRes为true
             * 否则这会拦截所有code != 0的响应
             */
            return res.data;
          } else {
            res.config.showMsg && Message.error(res.data.message);
            return Promise.reject(res.data.message);
          }
        }
      } else {
        return res.data;
      }
    } else {
      res.config.showMsg && Message.error('服务器未响应数据');
      return Promise.reject('服务器未响应数据');
    }
  },
  error => {
    console.log('error.config', error.config);
    // 关闭loaading
    if (loadingCount > 0) loadingCount--;
    if (loading && loadingCount === 0) {
      // 间隔300毫秒内的loading合并
      setTimeout(() => loading.close(), 300);
    }
    let message = '';
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '错误的请求';
          break;
        case 401:
          localStorage.removeItem('Authorization');
          localStorage.removeItem('userData');
          window.location.href = './index.html#/login';
          break;
        case 403:
          message = '请求资源无权访问';
          break;
        case 404:
          message = '请求资源不存在';
          break;
        case 500:
          message = '服务器错误';
          break;
        case 504:
          message = '网关超时';
          break;
        default:
          message = '服务器异常' + error.response.status;
          break;
      }
      if (error.config.showMsg && message) Message.error(message);
      return Promise.reject(error.response.data || '请求异常');
    } else if (error.request) {
      // 已正常发出请求 但未收到响应
      if (error.message == 'Network Error') {
        // Network Error
        error.config.showMsg && Message.error('无法连接服务器');
        return Promise.reject('无法连接服务器');
      } else if (error.message.indexOf('timeout of') > -1) {
        // timeout of 1000ms exceeded
        error.config.showMsg && Message.error('客户端请求超时');
        return Promise.reject('客户端请求超时');
      } else {
        error.config.showMsg && Message.error('未收到响应');
        return Promise.reject('未收到响应');
      }
    } else {
      console.log(error);
      // 请求未发出就已报错  前端请求配置出问题
      Message.error('无效的请求');
      return Promise.reject('无效的请求');
    }
  }
);

export default axios;
