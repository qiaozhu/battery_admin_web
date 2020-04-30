import firstRouter from './firstRouter';
const router = [
  {
    path: '/goods',
    redirect: to => firstRouter('goods')
  },
  {
    path: '/goods/list',
    name: 'GoodsList',
    component: () => import('@/views/goods/GoodsList'),
    meta: {
      active: '/goods/list',
      title: '材料列表',
      permission: 'goods:goods:list:view'
    }
  },
  {
    path: '/goods/add',
    name: 'GoodsAdd',
    component: () => import('@/views/goods/GoodsForm'),
    meta: {
      active: '/goods/list',
      title: '新增材料',
      permission: 'goods:goods:list:ctrl'
    }
  },
  {
    path: '/goods/edit/:goodsId',
    name: 'GoodsEdit',
    component: () => import('@/views/goods/GoodsForm'),
    meta: {
      active: '/goods/list',
      title: '编辑材料',
      permission: 'goods:goods:list:ctrl'
    }
  }
];
export default router;
