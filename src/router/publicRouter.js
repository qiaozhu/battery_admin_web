// 所有模块公用路由
const HttpError = function(resolve) {
  require(['@/components/HttpError'], resolve);
};
const publicRouter = [
  {
    path: '/error/:code',
    name: 'Error',
    meta: { title: 'Error' },
    component: HttpError
  },
  { path: '*', redirect: '/error/404' }
];
export default publicRouter;
