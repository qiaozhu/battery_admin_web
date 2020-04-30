import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------仓库管理---------- */

// 仓库列表
api.getGoodsList = baseURL + '/goods/getGoodsList';
// 仓库详情
api.getGoodsDetail = baseURL + '/goods/getGoodsDetail';
// 新增仓库
api.addGoods = baseURL + '/goods/addGoods';
// 编辑仓库
api.editGoods = baseURL + '/goods/editGoods';

export default api;
