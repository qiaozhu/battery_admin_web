// 配置文件
import publicKey from './publicKey';
const NODE_ENV = process.env.NODE_ENV;
console.log('this node_env is ' + NODE_ENV);

const config = {
  // 内网配置
  dev: {
    publicKey: publicKey.dev,
    baseURL: 'http://192.168.12.77:7500',
    uploadURL: 'http://192.168.6.12:8155',
    env: 'dev'
  },
  // 测试配置
  test: {
    publicKey: publicKey.test,
    baseURL: 'http://running1-test.coalscc.com/gyl-bop-web',
    uploadURL: 'http://boot-service.sijibao.co',
    env: 'test'
  },
  // 生产配置
  prod: {
    publicKey: publicKey.prod,
    baseURL: 'https://www.qiaodev.com/api/battery',
    uploadURL: 'https://boot-service.sijibao.com',
    env: 'prod'
  }
};

// 根据环境变量 导出对应配置
let envConfig = null;
if (NODE_ENV === 'development' || process.env.VUE_APP_OUTPUTDIR === 'dev') {
  /**
   * debug_server -> 调试服务器
   * 在开发模式下 为方便调试  开发者可自行修改debug_server 用本地项目连接不同的目标服务器
   * debug_server：dev  开发服务器(默认)
   * debug_server：test 测试服务器
   * debug_server：prod 生产服务器
   */

  let envkey = localStorage.getItem('debug_server') || 'dev';
  if (envkey != 'dev' && envkey != 'test' && envkey != 'prod') envkey = 'dev';

  envConfig = { ...config[envkey] };

  if (envkey === 'dev') {
    // 本机开发模式默认连接内网服务器
    // 若本地localStorage存在dev_host 则覆盖默认目标
    const dev_host = localStorage.getItem('dev_host') || '';
    // const dev_host = 'http://192.168.12.57:8088/gyl-bop-web'; //袁思晨
    // const dev_host = 'http://192.168.12.14:8081/gyl-bop-web'; //徐冰洋
    // const dev_host = 'http://192.168.12.74:8080/gyl-bop-web'; //祝愿

    if (dev_host) envConfig.baseURL = dev_host;
  }
} else {
  envConfig = process.env.VUE_APP_OUTPUTDIR === 'test' ? { ...config.test } : { ...config.prod };
}

export default envConfig;
