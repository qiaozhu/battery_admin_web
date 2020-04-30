<template>
  <Layout navActive="mycenter">
    <div class="myinfo-edit-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>工作台</el-breadcrumb-item>
        <el-breadcrumb-item>编辑个人资料</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form
        class="edit-form"
        ref="editForm"
        label-width="80px"
        :model="editForm"
        status-icon
        :rules="rules"
        :validate-on-rule-change="false"
      >
        <div class="item-header mb-20">基本信息</div>
        <el-form-item label="头像">
          <avatar-upload ref="avatar" :default-files="avatarImg"></avatar-upload>
        </el-form-item>
        <el-form-item label="账号" prop="account" class="account-item">
          <el-input
            v-model.trim="editForm.account"
            :maxlength="20"
            placeholder="请输入账号"
            :disabled="true"
            autocomplete="off"
            style="width:350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input
            v-model.trim="editForm.userName"
            placeholder="请输入姓名"
            autocomplete="off"
            style="width:350px"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model.trim="editForm.email"
            placeholder="请输入邮箱地址"
            autocomplete="off"
            style="width:350px"
            :maxlength="64"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            style="width:350px"
            v-model="editForm.remark"
            type="textarea"
            maxlength="100"
            :row="3"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="onSubmitForm">保存</el-button>
          <el-button @click="onCancelBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </Layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api.js';
import utils from '@/utils/utils';
import biz from '@/utils/biz';
import Validator from '@/utils/Validator';

import Layout from '@/components/Layout';
import AvatarUpload from '@/components/AvatarUpload';
import defaultAvatar from '@/assets/img/default.png';

export default {
  components: { Layout, AvatarUpload },
  data() {
    // 邮箱验证
    var validateEmail = (rule, value, callback) => {
      if (!Validator.email(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    return {
      avatarImg: '',
      editForm: {
        userId: '',
        userName: '',
        account: '',
        email: '',
        avatar: '',
        remark: ''
      },
      rules: {
        userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        email: [
          {
            required: true,
            validator: validateEmail,
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ]
      },
      state: 'add',
      roleArr: []
    };
  },
  async created() {
    const userData = utils.getLocalItem('userData');

    this.avatarImg = userData.avatar || '';
    this.editForm.userId = userData.userId;
    this.editForm.userName = userData.userName;
    this.editForm.account = userData.account;
    this.editForm.email = userData.email || '';
    this.editForm.remark = userData.remark || '';
    this.editForm.avatar = userData.avatar || '';
  },
  methods: {
    onSubmitForm() {
      const avatar = this.$refs.avatar.getUploadFiles();
      if (!avatar) {
        this.$message.error('请上传用户头像');
        return;
      }
      this.editForm.avatar = avatar;

      this.$refs.editForm.validate(async valid => {
        if (valid) {
          await axios.post(api.editUserInfo, this.editForm);
          // 获取用户信息
          await biz.getUserInfo();
          this.$message.success('修改成功');
          this.$router.push({ path: '/myinfo/detail' });
        }
      });
    },
    onCancelBack() {
      this.$router.push({ path: '/myinfo/detail' });
    }
  }
};
</script>
<style lang="postcss">
.myinfo-edit-page {
  .edit-form {
    margin: 20px 0 0 0;
  }
  .account-item {
    position: relative;
    .account-tips {
      display: inline-block;
      margin-left: 20px;
    }
  }

  .roles-item .el-checkbox {
    margin-right: 30px;
    margin-left: 0px;
  }

  .datapre-redio-group {
    .el-radio {
      display: inline-block;
      line-height: 30px;
    }
    .el-radio + .el-radio {
      margin-left: 0;
    }
  }
}
</style>
