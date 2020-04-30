import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';
import * as routerHook from '@/router/routerHook';

import publicRouter from '@/router/publicRouter';
import index from '@/router/index';
import mycenter from '@/router/mycenter';
import warehouse from '@/router/warehouse';
import goods from '@/router/goods';
import setting from '@/router/setting';

Vue.use(VueRouter);

const routes = [...index, ...mycenter, ...warehouse, ...goods, ...setting, ...publicRouter];

// 初始化一个空路由对象 当权限获取完成后 动态添加路由地址
const router = new VueRouter({ routes: [] });

// 路由钩子 判断页面访问权限
routerHook.permissionHook(router, store);
// 路由钩子 设置页面title
routerHook.setTitleHook(router);
// 路由钩子 设置侧栏选中
routerHook.sideActionHook(router, store);
// 路由钩子 查询消息
routerHook.queryNoticeHook(router, store);

export { router, routes };
