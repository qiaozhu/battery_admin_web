<template>
  <Layout navActive="setting">
    <div class="user-edit-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>机构用户</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/user/list' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span v-if="state === 'add'">添加用户</span>
          <span v-else-if="state === 'edit'">修改用户信息</span>
          <span v-else>用户信息</span></el-breadcrumb-item
        >
      </el-breadcrumb>
      <el-form
        class="edit-form"
        ref="editForm"
        label-width="120px"
        :model="editForm"
        status-icon
        :disabled="isView"
        :rules="rules"
        :validate-on-rule-change="false"
      >
        <div class="item-header mb-20">基本信息</div>

        <el-form-item label="姓名" prop="userName">
          <el-input
            v-model.trim="editForm.userName"
            placeholder="请输入姓名"
            autocomplete="off"
            style="width:350px"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account" class="account-item">
          <el-input
            v-model.trim="editForm.account"
            :maxlength="20"
            placeholder="请输入手机号码"
            :disabled="state == 'edit'"
            autocomplete="off"
            style="width:350px"
          ></el-input>
          <div class="account-tips font-gray" v-if="state === 'add'">
            <i class="el-icon-info font-orange mr-10"></i>
            注意：只能输入手机号码
          </div>
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
        <el-form-item label="所属公司" prop="companyId">
          <el-radio-group v-model="editForm.companyId" class="datapre-redio-group">
            <el-radio v-for="(el, index) in belongCompany" :key="index" :label="el.dictId">{{
              el.label
            }}</el-radio>
          </el-radio-group>
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
        <el-form-item label=" " v-if="!isView">
          <el-button type="primary" @click="onSubmitForm">保存</el-button>
          <el-button @click="onCancelBack">返回</el-button>
        </el-form-item>
      </el-form>
      <div v-if="isView" style="margin-left:120px;">
        <el-button type="primary" @click="onCancelBack">返回</el-button>
      </div>
    </div>
  </Layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api.js';
import utils from '@/utils/utils';
import biz from '@/utils/biz';
import Validator from '@/utils/Validator';
import permission from '@/utils/permission';

import Layout from '@/components/Layout';

export default {
  components: { Layout },
  data() {
    // 手机号验证
    var validateMoble = (rule, value, callback) => {
      if (!Validator.phone(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 邮箱验证
    var validateEmail = (rule, value, callback) => {
      if (!Validator.email(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };

    return {
      isView: false,
      avatarImg: '',
      editForm: {
        userName: '',
        account: '',
        email: '',
        userId: '',
        remark: '',
        companyId: ''
      },

      rules: {
        userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        account: [
          { required: true, message: '账号不能为空' },
          { validator: validateMoble, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            validator: validateEmail,
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }
        ],
        companyId: [{ required: true, message: '所属公司不能为空' }]
      },
      state: 'add',
      belongCompany: []
    };
  },
  async created() {
    const belongCompany = await biz.getDict('belong_company');

    this.belongCompany = belongCompany || [];
    this.editForm.companyId = (belongCompany[0] || {}).dictId || '';

    if (this.$route.name === 'UserEdit' || this.$route.name === 'UserView') {
      this.state = 'edit';
      this.editForm.userId = this.$route.params.userId;

      let userDetail = await axios.get(api.getUserInfoById, {
        params: { userId: this.$route.params.userId }
      });
      this.editForm = userDetail.data || {};
    }
    if (this.$route.name === 'UserView') this.isView = true;
  },
  methods: {
    onSubmitForm() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          if (this.state === 'add') {
            await axios.post(api.addAccount, this.editForm);
            this.$message.success('添加成功');
            this.$router.push({ path: '/user/list' });
          } else {
            await axios.post(api.editAccount, this.editForm);
            this.$message.success('修改成功');
            // 修改菜单后 重新获取菜单及权限
            // let result = await permission.getData();
            // await permission.setData(this.$store, result.menu, result.list);
            this.$router.push({ path: '/user/list' });
          }
        }
      });
    },
    onCancelBack() {
      this.$router.push({ path: '/user/list' });
    },
    gotoRolelist() {
      this.$router.push({ path: '/role/list' });
    }
  }
};
</script>
<style lang="postcss">
.user-edit-page {
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
