<template>
  <Layout navActive="warehouse">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
        <el-breadcrumb-item>仓库列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">仓库编号</span>
          <el-input
            v-model.trim="tableOptions.warehouseNo"
            :maxlength="20"
            clearable
            placeholder="请输入仓库编号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">仓库名称</span>
          <el-input
            v-model.trim="tableOptions.name"
            :maxlength="40"
            clearable
            placeholder="请输入仓库名称"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">仓库类型</span>
          <el-select
            v-model="tableOptions.warehouseType"
            size="small"
            clearable
            placeholder="请选择"
            style="width:120px;"
          >
            <el-option
              v-for="item in warehouseTypeArr"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
        <!-- <div class="toolbar-item">
          <span class="item-label">状态</span>
          <el-select
            v-model="tableOptions.state"
            size="small"
            clearable
            placeholder="请选择"
            style="width:120px;"
          >
            <el-option
              v-for="item in warehouseTypeStateArr"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </div> -->
        <div class="toolbar-item">
          <el-button @click="handleSearch" size="small" type="primary">查询</el-button>
          <el-button @click="handleReset" size="small">重置</el-button>
          <router-link to="/warehouse/add">
            <el-button type="primary" v-has="'warehouse:warehouse:list:ctrl'" class="ml-10"
              >新增仓库</el-button
            >
          </router-link>
        </div>
      </div>
      <div>
        <el-table border :data="tableData.list">
          <el-table-column label="仓库编号" prop="warehouseNo" min-width="110">
            <template slot-scope="scope">
              <span class="font-default pointer" @click="onJumpDetail(scope.row)">
                {{ scope.row.warehouseNo }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="仓库名称"
            min-width="140"
            prop="name"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="仓库类型" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.warehouseType | valueToLabel(warehouseTypeArr) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="createTime"
            min-width="140"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="备注"
            prop="remark"
            min-width="140"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="状态" min-width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 0" class="font-green">{{
                scope.row.state | valueToLabel(warehouseTypeStateArr)
              }}</span>
              <span v-else class="font-red">{{
                scope.row.state | valueToLabel(warehouseTypeStateArr)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
            prop="updateTime"
            min-width="140"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" min-width="125">
            <template slot-scope="scope">
              <span v-has="'warehouse:warehouse:list:ctrl'">
                <span class="font-default pointer" @click="handleEdit(scope.row)">编辑</span>
                <!-- <span
                  v-if="scope.row.state === 0"
                  class="font-red pointer ml-5"
                  @click="handleVisible(scope.row, 1)"
                  >禁用</span
                >
                <span
                  v-if="scope.row.state === 1"
                  class="font-green pointer ml-5"
                  @click="handleVisible(scope.row, 0)"
                  >启用</span
                > -->
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-fix">
        <el-pagination
          :page-size="pageSize"
          :current-page.sync="pageNo"
          :total="tableData.count"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </Layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/warehouse.api';
import utils from '@/utils/utils';
import biz from '@/utils/biz';
import listMixin from '@/utils/listMixin';
import Layout from '@/components/Layout';

export default {
  components: { Layout },
  mixins: [listMixin],
  data() {
    return {
      warehouseTypeArr: [],
      warehouseTypeStateArr: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
      tableData: {}, // 表格数据
      // 工具栏筛选字段
      tableOptions: {
        warehouseNo: '',
        name: '',
        warehouseType: '',
        state: ''
      },
      // 发送请求实际字段
      sendOptions: {}
    };
  },
  async created() {
    this.warehouseTypeArr = (await biz.getDict('warehouse_type')) || [];
    this.handleSearch();
  },
  async activated() {},
  methods: {
    handleReset() {
      this.tableOptions = {
        warehouseNo: '',
        name: '',
        warehouseType: '',
        state: ''
      };
      this.handleSearch();
    },
    onJumpDetail(row) {
      this.$router.push({ path: '/warehouse/detail/list/' + row.warehouseId });
    },
    handleEdit(row) {
      this.$router.push({ path: '/warehouse/edit/' + row.warehouseId });
    },
    handleVisible(row, type) {},
    handleDelete(row) {},
    // 删除
    handleDelete(row) {
      this.$confirm('确定要删除此商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios({
          method: 'GET',
          url: api.goodsDelete,
          params: {
            goodsId: row.goodsId
          }
        }).then(response => {
          if (response.status == 0) {
            this.$message.success('删除成功');
            this.handleSearch();
          }
        });
      });
    },
    async fetchData(opts) {
      const options = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.sendOptions,
        ...opts
      };
      let result = await axios.post(api.getWarehouseList, options);
      this.tableData = result.data;
    }
  }
};
</script>
<style lang="postcss">
</style>
