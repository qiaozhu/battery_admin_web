<template>
  <Layout navActive="mycenter">
    <div class="myinfo-editpwd-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>工作台</el-breadcrumb-item>
        <el-breadcrumb-item>个人资料</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="edit-form-content">
        <el-form :model="pwdEdit" :rules="rules" ref="editForm" label-position="top">
          <div v-show="step === 1">
            <el-form-item label="当前登录密码" prop="oldpwd">
              <el-input
                v-model="pwdEdit.oldpwd"
                type="text"
                @focus="onClearInput"
                autocomplete="off"
                :maxlength="32"
                style="width:320px"
                placeholder="请输入当前登录密码"
              ></el-input>
            </el-form-item>

            <el-form-item label="新的登录密码" prop="newpwd">
              <el-input
                v-model="pwdEdit.newpwd"
                type="text"
                @focus="onClearInput"
                autocomplete="off"
                :maxlength="32"
                style="width:320px"
                placeholder="请输入新的登录密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="再次确认登录密码" prop="newpwd2">
              <el-input
                v-model="pwdEdit.newpwd2"
                type="text"
                @focus="onClearInput"
                autocomplete="off"
                :maxlength="32"
                style="width:320px"
                placeholder="再次确认登录密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">确定</el-button>
              <el-button @click="cancelForm">取消</el-button>
            </el-form-item>
          </div>
          <div v-show="step === 2" class="successContent" style="margin-left:20px">
            <img class="success-img" src="../../assets/img/success-large.png" alt="" />
            <div class="success-title" style="margin-top:20px;">密码修改成功！</div>
            <div class="succrss-text">请妥善保管您的登录密码，切勿告诉他人！</div>
            <router-link :to="{ path: '/myinfo/detail' }">
              <el-button type="text">返 回</el-button>
            </router-link>
          </div>
        </el-form>
      </div>
    </div>
  </Layout>
</template>
<script>
import JSEncrypt from '@/utils/JSEncrypt';
import axios from '@/utils/axios';
import api from '@/api/mycenter.api.js';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';
import Layout from '@/components/Layout';

export default {
  components: { Layout },
  data: function() {
    // 验证码
    const validateYzm = (rule, value, callback) => {
      value.length === 8 ? callback() : callback(new Error());
    };
    const validPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新的密码'));
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度必须是6~20位字符'));
      } else {
        callback();
      }
    };
    const validConfirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次确认登录密码'));
      } else if (value !== this.pwdEdit.newpwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      step: 1,
      countdown: {
        first: false,
        isSend: false,
        second: 60
      },
      pwdEdit: {
        oldpwd: '',
        newpwd: '',
        newpwd2: ''
      },
      rules: {
        oldpwd: [
          { required: true, message: '请输入原登录密码', trigger: 'blur' },
          { validator: validPwd, message: '密码长度必须是6~20位字符', trigger: 'blur' }
        ],
        newpwd: [
          { required: true, message: '请输入新的登录密码', trigger: 'blur' },
          { validator: validPwd, message: '密码长度必须是6~20位字符', trigger: 'blur' }
        ],
        newpwd2: [
          { required: true, message: '请再次确认登录密码', trigger: 'blur' },
          { validator: validPwd, message: '密码长度必须是6~20位字符', trigger: 'blur' },
          { validator: validConfirmPwd, message: '两次输入密码不一致', trigger: 'blur' }
        ]
      }
    };
  },
  created() {},
  methods: {
    submitForm() {
      // 修改密码-修改支付密码
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let params = { ...this.pwdEdit };
          params.oldpwd = JSEncrypt.encrypt(params.oldpwd);
          params.newpwd = JSEncrypt.encrypt(params.newpwd);
          params.newpwd2 = JSEncrypt.encrypt(params.newpwd2);
          await axios.post(api.editAccountPwd, params);
          this.step = 2;
        }
      });
    },
    cancelForm() {
      this.$router.push({ path: '/myinfo/detail' });
    },
    onClearInput(event) {
      event.target.type = 'password';
    }
  }
};
</script>
<style lang="postcss">
.myinfo-editpwd-page {
  .edit-form-content {
    width: 600px;
  }
  .el-form {
    margin-left: 150px;
    margin-top: 50px;
    .el-form-item--small .el-form-item__label {
      line-height: 1;
    }
  }
}
</style>
