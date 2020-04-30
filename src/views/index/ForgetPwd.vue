<template>
  <div>
    <el-alert class="account-tip" type="success" :closable="false" style="">
      <span slot="title"><i class="el-icon-info"></i>忘记密码</span>
    </el-alert>
    <el-form :model="pwdEdit" :rules="rules" ref="editForm">
      <div v-show="step === 1">
        <el-form-item label="" prop="account">
          <el-input
            type="text"
            v-model="pwdEdit.account"
            autocomplete="off"
            :maxlength="11"
            placeholder="请输入登录手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="email">
          <el-input
            type="text"
            v-model="pwdEdit.email"
            autocomplete="off"
            :maxlength="64"
            placeholder="请输入绑定邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input
            placeholder="请输入验证码"
            :maxlength="8"
            autocomplete="off"
            v-model="pwdEdit.code"
          >
            <el-button slot="append" @click="getCode" class="getcode" :disabled="countdown.isSend">
              获取验证码
            </el-button>
          </el-input>
        </el-form-item>
        <div class="vcode-tips" v-if="countdown.isSend">
          <span class="font-default ml-5">{{ countdown.second }}</span>
          秒后可重发验证码
        </div>
        <div class="vcode-tips" v-if="!countdown.isSend"></div>

        <el-form-item label="" prop="newpwd">
          <el-input
            v-model="pwdEdit.newpwd"
            type="text"
            @focus="onClearInput"
            autocomplete="off"
            :maxlength="32"
            placeholder="请输入新的登录密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="newpwd2">
          <el-input
            v-model="pwdEdit.newpwd2"
            type="text"
            @focus="onClearInput"
            autocomplete="off"
            :maxlength="32"
            placeholder="再次确认登录密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="login-button-item">
          <el-button type="primary" @click="submitForm">确定</el-button>
        </el-form-item>
      </div>
      <div v-show="step === 2" class="successContent">
        <img class="success-img" src="../../assets/img/success-large.png" alt="" />
        <div class="success-title" style="margin-top:20px;">密码修改成功！</div>
        <div class="succrss-text">请使用新密码登录，注意保管好您的密码，不要告诉他人。</div>
      </div>
    </el-form>
  </div>
</template>
<script>
import JSEncrypt from '@/utils/JSEncrypt';
import axios from '@/utils/axios';
import api from '@/api/index.api.js';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';

export default {
  data: function() {
    const valiPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'));
      } else if (!Validator.phone(value)) {
        callback(new Error('电话号码格式不正确'));
      } else {
        callback();
      }
    };
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
        account: '',
        email: '',
        code: '',
        newpwd: '',
        newpwd2: ''
      },
      rules: {
        account: [{ validator: valiPhone, trigger: 'blur' }],
        email: [
          { required: true, message: '请输入绑定邮箱地址', trigger: 'blur' },
          { type: 'email', max: 64, message: '邮箱格式错误', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: validateYzm, message: '验证码必须为8位字符', trigger: 'blur' }
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
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          if (!this.countdown.first) {
            this.$message.error('请先获取验证码');
            return;
          }
          let params = { ...this.pwdEdit };
          params.newpwd = JSEncrypt.encrypt(params.newpwd);
          params.newpwd2 = JSEncrypt.encrypt(params.newpwd2);
          await axios.post(api.forgetPwdSet, params);
          this.step = 2;
        }
      });
    },
    onClearInput(event) {
      event.target.type = 'password';
    }, // 获取验证码
    async getCode() {
      if (!this.pwdEdit.account || !this.pwdEdit.email) {
        this.$message.error('请先输入登录帐号和邮箱');
        return;
      }
      await axios.post(api.forgetPwdSend, {
        account: this.pwdEdit.account,
        email: this.pwdEdit.email
      });
      this.countdown.isSend = true;
      this.countdown.first = true;
      this.countDown();
    },
    // 倒计时
    countDown() {
      if (this.countdown.second == 0) {
        this.countdown.isSend = false;
        this.countdown.second = 60;
      } else {
        this.countdown.second--;
        setTimeout(() => {
          this.countDown();
        }, 1000);
      }
    },
    // 倒计时 重置
    clearDown() {
      this.countdown.isSend = false;
      this.countdown.second = 60;
    }
  }
};
</script>
<style lang="postcss">
</style>
