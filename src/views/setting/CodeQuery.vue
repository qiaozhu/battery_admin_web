<template>
  <div class="layout-content-list">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>短信业务</el-breadcrumb-item>
      <el-breadcrumb-item>验证码查询</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="toolbar-panel">
      <div class="toolbar-item">
        <span class="item-label">手机号</span>
        <el-input
          v-model.trim="phoneNumber"
          :maxlength="20"
          placeholder="请输入手机号"
          clearable
        ></el-input>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
    </div>

    <el-table :data="tableList" border>
      <el-table-column
        label="手机号"
        prop="phoneNumber"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="重发时间" prop="retryDate" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.retryDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="短信内容" prop="code" min-width="350" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :ref="scope.row.retryDate" class="mr-20">{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" prop="retryDate" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            v-if="scope.row.code"
            @click="onCopyCode(scope.row.retryDate)"
            class="font-default copy-code"
          >
            复制验证码
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import Validator from '@/utils/Validator';
export default {
  data() {
    return {
      phoneNumber: '',
      tableList: []
    };
  },
  methods: {
    async onSearch() {
      if (!this.phoneNumber) {
        this.$message.error('请先输入手机号');
        return;
      }
      if (!Validator.phone(this.phoneNumber)) {
        this.$message.error('请输入正确的手机号');
        return;
      }
      let res = await axios.get(api.querySmsBlacklistCode, {
        params: { phoneNumber: this.phoneNumber }
      });
      this.tableList = res.data;
    },
    onCopyCode(key) {
      if (!key) return;

      let copyVal = this.$refs[key].innerText;
      let oInput = document.createElement('input');
      oInput.value = copyVal;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.style.display = 'none';
      this.$message.success('复制成功');
    }
  }
};
</script>

<style lang="postcss" scoped>
.copy-code {
  cursor: pointer;
}
</style>

