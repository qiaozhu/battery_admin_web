import firstRouter from './firstRouter';
const router = [
  {
    path: '/mycenter',
    redirect: to => firstRouter('mycenter')
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/mycenter/Welcome'),
    meta: {
      active: '/welcome',
      permission: 'my:workplace:wlecome:view'
    }
  },
  {
    path: '/myinfo/detail',
    name: 'MyInfoDetail',
    component: () => import('@/views/mycenter/MyInfoDetail'),
    meta: {
      active: '/myinfo/detail',
      permission: 'my:workplace:myinfo:view'
    }
  },
  {
    path: '/myinfo/edit',
    name: 'MyInfoEdit',
    component: () => import('@/views/mycenter/MyInfoEdit'),
    meta: {
      active: '/myinfo/detail',
      permission: 'my:workplace:myinfo:view'
    }
  },
  {
    path: '/myinfo/editpwd',
    name: 'MyInfoEditPwd',
    component: () => import('@/views/mycenter/EditPwd'),
    meta: {
      active: '/myinfo/detail',
      permission: 'my:workplace:myinfo:view'
    }
  }
];
export default router;
