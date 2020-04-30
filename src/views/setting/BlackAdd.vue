<template>
  <div class="black-add-page">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>短信业务</el-breadcrumb-item>
      <el-breadcrumb-item to="/black/list">黑名单管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增黑名单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="whiteForm" :model="whiteForm" label-width="70px" :rules="rules" class="">
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="whiteForm.phoneNumber"
          maxlength="20"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="whiteForm.remark"
          type="textarea"
          maxlength="100"
          :autosize="{ minRows: 1, maxRows: 2 }"
          placeholder="请输入备注"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left:60px;">
      <el-button type="primary" class="mr-10" @click="onSaveBlackUser">保存</el-button>
      <router-link to="/black/list">
        <el-button>返回</el-button>
      </router-link>
    </div>
  </div>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import Validator from '@/utils/Validator';

export default {
  data() {
    // 手机号验证
    var validateMoble = (rule, value, callback) => {
      if (!Validator.phone(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };

    return {
      whiteForm: {
        phoneNumber: '', // 手机号
        remark: '' // 备注信息
      },
      rules: {
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMoble, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    };
  },
  created() {},
  methods: {
    onSaveBlackUser() {
      this.$refs.whiteForm.validate(async valid => {
        if (valid) {
          await axios.post(api.saveSmsBlacklist, { ...this.whiteForm });
          this.$message.success('操作成功');
          this.$router.push({ path: '/black/list' });
        }
      });
    }
  }
};
</script>
<style lang="postcss">
.black-add-page {
  .el-input__inner {
    width: 300px;
  }
  .el-input__inner.pointer-input {
    cursor: pointer;
  }
  .el-textarea {
    width: 300px;
  }
}
</style>
