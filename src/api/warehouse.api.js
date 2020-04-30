import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------仓库管理---------- */

// 仓库列表
api.getWarehouseList = baseURL + '/warehouse/getWarehouseList';
// 仓库基本信息
api.getWarehouseInfo = baseURL + '/warehouse/getWarehouseInfo';
// 新增仓库
api.addWarehouse = baseURL + '/warehouse/addWarehouse';
// 编辑仓库
api.editWarehouse = baseURL + '/warehouse/editWarehouse';

// 仓库明细列表
api.getWarehouseDetailList = baseURL + '/warehouse/getWarehouseDetailList';

export default api;
