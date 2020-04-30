const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: './',
  outputDir: process.env.VUE_APP_OUTPUTDIR,
  assetsDir: '',
  devServer: {
    open: true,
    port: 8199,
    proxy: {
      '/staging': {
        target: 'http://192.168.12.133:3100',
        changeOrigin: true,
        pathRewrite: {
          '^/staging': ''
        }
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
          })
        ]
      };
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: config => {
    // 这里可以修改webpack配置
    // 移除预加载
    config.plugins.delete('prefetch');
  }
};
