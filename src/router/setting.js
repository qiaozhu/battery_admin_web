import firstRouter from './firstRouter';

const router = [
  {
    path: '/setting',
    redirect: to => firstRouter('setting')
  },
  {
    path: '/menu/mng',
    name: 'MenuMng',
    component: () => import('@/views/setting/MenuMng'),
    meta: {
      active: '/menu/mng',
      title: '菜单管理',
      permission: 'setting:sys:menu:view'
    }
  },
  {
    path: '/menu/add',
    name: 'MenuAdd',
    component: () => import('@/views/setting/MenuEdit'),
    meta: {
      active: '/menu/mng',
      title: '添加菜单',
      permission: 'setting:sys:menu:add'
    }
  },
  {
    path: '/menu/add/:parentId',
    name: 'MenuSubAdd',
    component: () => import('@/views/setting/MenuEdit'),
    meta: {
      active: '/menu/mng',
      title: '添加菜单',
      permission: 'setting:sys:menu:add'
    }
  },
  {
    path: '/menu/edit/:menuid',
    name: 'MenuEdit',
    component: () => import('@/views/setting/MenuEdit'),
    meta: {
      active: '/menu/mng',
      title: '修改菜单',
      permission: 'setting:sys:menu:edit'
    }
  },
  {
    path: '/role/list',
    name: 'RoleList',
    component: () => import('@/views/setting/RoleList'),
    meta: {
      active: '/role/list',
      title: '角色管理',
      permission: 'setting:sys:role:view'
    }
  },
  {
    path: '/role/add',
    name: 'RoleAdd',
    component: () => import('@/views/setting/RoleEdit'),
    meta: {
      active: '/role/list',
      title: '添加角色',
      permission: 'setting:sys:role:add'
    }
  },
  {
    path: '/role/edit/:id',
    name: 'RoleEdit',
    component: () => import('@/views/setting/RoleEdit'),
    meta: {
      active: '/role/list',
      title: '修改角色',
      permission: 'setting:sys:role:edit'
    }
  },
  {
    path: '/role/view/:id',
    name: 'RoleView',
    component: () => import('@/views/setting/RoleEdit'),
    meta: {
      active: '/role/list',
      title: '角色详情',
      permission: 'setting:sys:role:view'
    }
  },
  {
    path: '/user/list',
    name: 'UserList',
    component: () => import('@/views/setting/UserList'),
    meta: {
      active: '/user/list',
      title: '用户管理',
      permission: 'setting:sys:user:view'
    }
  },
  {
    path: '/user/view/:userId',
    name: 'UserView',
    component: () => import('@/views/setting/UserEdit'),
    meta: {
      active: '/user/list',
      title: '用户信息',
      permission: 'setting:sys:user:view'
    }
  },
  {
    path: '/user/add',
    name: 'userAdd',
    component: () => import('@/views/setting/UserEdit'),
    meta: {
      active: '/user/list',
      title: '添加用户',
      permission: 'setting:sys:user:add'
    }
  },
  {
    path: '/user/edit/:userId',
    name: 'UserEdit',
    component: () => import('@/views/setting/UserEdit'),
    meta: {
      active: '/user/list',
      title: '修改用户信息',
      permission: 'setting:sys:user:edit'
    }
  },
  {
    path: '/layoutset',
    name: 'LayoutSet',
    component: () => import('@/views/setting/LayoutSet'),
    meta: {
      active: '/layoutset',
      title: '布局设置',
      permission: 'setting:sys:layout:view'
    }
  },
  {
    path: '/dict/list',
    name: 'DictList',
    component: () => import('@/views/setting/DictList'),
    meta: {
      active: '/dict/list',
      title: '字典管理',
      permission: 'setting:sys:dict:view'
    }
  },
  {
    path: '/dict/detail/:type/:dictId',
    name: 'DictDetail',
    component: () => import('@/views/setting/DictDetail'),
    meta: {
      active: '/dict/list',
      title: '字典详情',
      permission: 'setting:sys:dict:view'
    }
  },
  {
    path: '/dict/edit/:type/:dictId',
    name: 'DictEdit',
    component: () => import('@/views/setting/DictDetail'),
    meta: {
      active: '/dict/list',
      title: '编辑字典',
      permission: 'setting:sys:dict:view'
    }
  },
  {
    path: '/dict/add/value/:type',
    name: 'DictAddValue',
    component: () => import('@/views/setting/DictDetail'),
    meta: {
      active: '/dict/list',
      title: '新增键值',
      permission: 'setting:sys:dict:view'
    }
  },
  {
    path: '/dict/add',
    name: 'DictAdd',
    component: () => import('@/views/setting/DictDetail'),
    meta: {
      active: '/dict/list',
      title: '新增字典',
      permission: 'setting:sys:dict:view'
    }
  },
  {
    path: '/black/list',
    name: 'BlackList',
    component: () => import('@/views/setting/BlackList'),
    meta: {
      active: '/black/list',
      title: '黑名单管理',
      permission: 'setting:sms:blacklist:view'
    }
  },
  {
    path: '/black/add',
    name: 'BlackAdd',
    component: () => import('@/views/setting/BlackAdd'),
    meta: {
      active: '/black/list',
      title: '新增黑名单',
      permission: 'setting:sms:blacklist:view'
    }
  },
  {
    path: '/code/query',
    name: 'CodeQuery',
    component: () => import('@/views/setting/CodeQuery'),
    meta: {
      active: '/code/query',
      title: '验证码查询',
      permission: 'setting:sms:codequery:view'
    }
  }
];
export default router;
