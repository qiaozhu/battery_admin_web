import 'es6-promise/auto';
import Vue from 'vue';
import ElementUI from 'element-ui';
import '@/utils/extend';

import '@/assets/css/element-theme.scss';
import App from './App.vue';

import store from './store';
import { router } from './router';

Vue.config.productionTip = false;
// 设置element尺寸
Vue.use(ElementUI, { size: 'small' });

// 注册自定义指令 判断权限
Vue.directive('has', {
  bind(el, binding, vnode) {
    // 获取按钮权限
    const allPer = store.state.permission || [];
    if (binding.value) {
      if (allPer.indexOf(binding.value) === -1) {
        Vue.nextTick(() => vnode.elm.parentNode.removeChild(el));
      }
    } else {
      Vue.nextTick(() => vnode.elm.parentNode.removeChild(el));
    }
  }
});

new Vue({
  router,
  store,
  mounted() {
    // 同页面hash变化 使用window.location.href在ie下会出现  页面地址变了  router并没有触发
    // https://github.com/vuejs/vue-router/issues/1849

    if (
      '-ms-scroll-limit' in document.documentElement.style &&
      '-ms-ime-align' in document.documentElement.style
    ) {
      window.addEventListener(
        'hashchange',
        function() {
          const currentPath = window.location.hash.slice(1);
          // 若页面地址跟当前router不匹配 则手动push
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        },
        false
      );
    }
  },
  render: h => h(App)
}).$mount('#app');
