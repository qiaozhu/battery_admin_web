<template>
  <Layout navActive="setting">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>机构用户</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">姓名</span>
          <el-input
            v-model.trim="tableOptions.userName"
            :maxlength="20"
            clearable
            style="width: 200px"
            placeholder="请输入姓名"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <span class="item-label">账号</span>
          <el-input
            v-model.trim="tableOptions.account"
            :maxlength="20"
            clearable
            style="width: 200px"
            placeholder="请输入账号"
            @keyup.enter.native="handleSearch"
          ></el-input>
        </div>
        <div class="toolbar-item">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button v-has="'setting:sys:user:add'" @click="onAddUser" plain>添加用户</el-button>
        </div>
      </div>
      <el-table :data="tableData.list" border>
        <el-table-column label="名称" prop="userName" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.isAdmin">
              {{ scope.row.userName }}
              <i class="iconfont icon-me font-default mr-5"></i>
            </span>
            <span v-else>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="account" min-width="150"></el-table-column>
        <el-table-column label="状态" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0" class="font-green">可登录</span>
            <span v-else class="font-red">禁止登录</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <!-- 不可修改自己 不可修改管理员账号 -->
            <div class="handle-stock ml-10">
              <i
                title="详情"
                v-has="'setting:sys:user:edit'"
                class="el-icon-view font-size20 pointer font-default mr-10 icon-t1"
                @click="onViewUser(scope.row)"
              ></i>
              <template v-if="!scope.row.isAdmin && scope.row.account !== loginName">
                <i
                  title="编辑"
                  v-has="'setting:sys:user:edit'"
                  class="el-icon-edit font-size20 pointer font-default mr-10"
                  @click="onEditUser(scope.row)"
                ></i>
                <i
                  class="el-icon-circle-check font-size20 pointer font-green mr-10"
                  title="可登录，点击按钮禁止登录"
                  v-has="'setting:sys:user:enabled'"
                  v-if="scope.row.state === 0"
                  @click="onSetDisable(scope.row.userId, 1)"
                ></i>
                <i
                  class="el-icon-circle-close font-size20 pointer font-red mr-10"
                  title="禁止登录、点击按钮允许登录"
                  v-has="'setting:sys:user:enabled'"
                  v-if="scope.row.state === 1"
                  @click="onSetDisable(scope.row.userId, 0)"
                ></i>
                <i
                  title="删除"
                  v-has="'setting:sys:user:del'"
                  class="el-icon-delete font-size20 pointer font-gray"
                  @click="onDeleteUser(scope.row.userId)"
                ></i>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="showDeleteDialog" width="400px">
        <span>确定删除该用户？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDeleteDialog = false">取 消</el-button>
          <el-button type="primary" @click="onConfirmDel">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="showDisabledDialog" width="400px">
        <span>{{ disabledText }}？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDisabledDialog = false">取 消</el-button>
          <el-button type="primary" @click="onConfirmDisable">确 定</el-button>
        </span>
      </el-dialog>
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
import api from '@/api/setting.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
import Layout from '@/components/Layout';

export default {
  components: { Layout },
  mixins: [listMixin],
  data() {
    return {
      size: 200,
      tableOptions: {
        userName: '',
        account: ''
      },
      sendOptions: {},
      tableData: {},
      showDeleteDialog: false,
      showDisabledDialog: false,
      disabledText: '',
      userId: '', // 选择的userid
      loginFlag: false, // 启用禁用标识
      loginName: '' // 当前登录帐号
    };
  },
  created() {
    const userData = utils.getLocalItem('userData');
    if (userData) this.loginName = userData.account || '';
    this.handleSearch();
  },

  methods: {
    // 查看
    onViewUser(row) {
      this.$router.push({ path: '/user/view/' + row.userId });
    },
    // 添加
    onAddUser() {
      this.$router.push({ path: '/user/add' });
    },
    // 编辑
    onEditUser(row) {
      this.$router.push({ path: '/user/edit/' + row.userId });
    },
    // 设置是否允许登录
    onSetDisable(userId, loginFlag) {
      this.showDisabledDialog = true;
      this.userId = userId;
      this.loginFlag = loginFlag;
      loginFlag === 0
        ? (this.disabledText = '是否允许该用户登录系统')
        : (this.disabledText = '是否禁止该用户登录系统');
    },
    // 设置是否允许登录confirm
    async onConfirmDisable() {
      await axios.post(api.disableAccount, { userId: this.userId, state: this.loginFlag });
      this.$message.success('设置成功');
      this.showDisabledDialog = false;
      this.handleSearch();
    },
    // 删除用户
    onDeleteUser(userId) {
      this.showDeleteDialog = true;
      this.userId = userId;
    },
    // 删除用户confirm
    async onConfirmDel() {
      await axios.post(api.delAccount, { userId: this.userId });
      this.$message.success('删除成功');
      this.showDeleteDialog = false;
      this.handleSearch();
    },
    async fetchData(opts) {
      const options = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.sendOptions,
        ...opts
      };
      let result = await axios.post(api.getUserList, options);
      this.tableData = result.data;
    }
  }
};
</script>
