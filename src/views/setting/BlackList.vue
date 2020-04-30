<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>短信业务</el-breadcrumb-item>
      <el-breadcrumb-item>黑名单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">手机号</span>
        <el-input
          v-model.trim="tableOptions.phoneNumber"
          :maxlength="20"
          placeholder="请输入手机号"
          clearable
        ></el-input>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
      <div class="toolbar-item">
        <el-button @click="onReset">重置</el-button>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="onAddWhiteUser">新增黑名单</el-button>
      </div>
    </div>

    <el-table :data="tableData.list" border>
      <el-table-column
        label="手机号"
        prop="phoneNumber"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="创建时间" prop="createTime" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | timesplit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark"
        min-width="150"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import listMixin from '@/utils/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      tableOptions: { phoneNumber: '' },
      tableData: {}
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    onAddWhiteUser() {
      this.$router.push({ path: '/black/add' });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该条黑名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.onConfirmDelete(row.phoneNumber);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    onSearch() {
      this.handleSearch();
    },
    onReset() {
      this.tableOptions = { phoneNumber: '' };
      this.onSearch();
    },
    async onConfirmDelete(phoneNumber) {
      await axios.post(api.deleteSmsBlacklist, { phoneNumber: phoneNumber });
      this.$message.success('删除成功');
      this.onReset();
    },
    async fetchData(opts) {
      const options = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.sendOptions,
        ...opts
      };
      let res = await axios.post(api.findSmsBlacklist, options);
      this.tableData = res.data;
    }
  }
};
</script>
