<template>
  <div id="app">
    <template v-if="!isLoading">
      <keep-alive :max="20" :include="keepAliveRouter">
        <router-view></router-view>
      </keep-alive>
    </template>
    <template v-else>
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </template>
  </div>
</template>

<script>
import permission from '@/utils/permission';
import { routes } from './router';

export default {
  data: function() {
    return {
      isLoading: true,
      keepAliveRouter: [], // 要缓存的页面 注意这些页面文件加name
      notTokenRouter: ['/', '/login'] // 不需要权限的页面
    };
  },
  created: async function() {
    if (!this.notTokenRouter.includes(this.$route.path)) {
      // 获取用户权限
      let result = await permission.getData(true);
      this.isLoading = false;
      if (result.error) return;

      // 数据存到store
      await permission.setData(this.$store, result.menu, result.list);
    } else {
      this.isLoading = false;
    }
    // 加载路由地址
    this.$router.addRoutes(routes);
  }
};
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/common.css';
</style>
