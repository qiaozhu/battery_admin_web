import firstRouter from './firstRouter';
const router = [
  {
    path: '/warehouse',
    redirect: to => firstRouter('warehouse')
  },
  {
    path: '/warehouse/list',
    name: 'WareHouseList',
    component: () => import('@/views/warehouse/WareHouseList'),
    meta: {
      active: '/warehouse/list',
      title: '仓库列表',
      permission: 'warehouse:warehouse:list:view'
    }
  },
  {
    path: '/warehouse/add',
    name: 'WareHouseAdd',
    component: () => import('@/views/warehouse/WareHouseForm'),
    meta: {
      active: '/warehouse/list',
      title: '新增仓库',
      permission: 'warehouse:warehouse:list:ctrl'
    }
  },
  {
    path: '/warehouse/edit/:warehouseId',
    name: 'WareHouseEdit',
    component: () => import('@/views/warehouse/WareHouseForm'),
    meta: {
      active: '/warehouse/list',
      title: '编辑仓库',
      permission: 'warehouse:warehouse:list:ctrl'
    }
  },
  {
    path: '/warehouse/detail/list/:warehouseId',
    name: 'WareHouseDetailList',
    component: () => import('@/views/warehouse/WareHouseDetailList'),
    meta: {
      active: '/warehouse/list',
      title: '仓库列表',
      permission: 'warehouse:warehouse:detail:view'
    }
  }
];
export default router;
