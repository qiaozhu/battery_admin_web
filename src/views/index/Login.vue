<template>
  <div class="login-page">
    <div class="content-flex">
      <div class="login-header">
        <img class="login-logo" src="../../assets/img/logo.png" />
        <div class="header-title">煤链社运营管理系统</div>
      </div>
      <div v-if="!showForget" class="login-panel">
        <el-alert class="account-tip" type="success" :closable="false">
          <span slot="title"><i class="el-icon-info"></i>用户登录</span>
        </el-alert>
        <el-form :model="loginForm" :rules="rules" size="medium" ref="loginForm" class="login-form">
          <el-form-item label="" prop="account">
            <el-input
              type="text"
              v-model="loginForm.account"
              autocomplete="off"
              placeholder="请输入用户名"
              :maxlength="20"
            >
              <i slot="prefix" class="iconfont icon-username input-prefix"></i>
            </el-input>
          </el-form-item>
          <!-- 模拟密码框 -->
          <el-form-item label="" prop="password">
            <div class="mock-pwd-panel">
              <div class="mock-pwd-content">
                <template v-if="pwdLength > 0">
                  <span class="mock-dot" v-for="(el, index) in pwdLength" :key="index"></span>
                  <span v-show="showMockMouse" class="mock-mouse"></span>
                </template>
                <template v-else>
                  <span v-show="showMockMouse" class="mock-mouse mock-mouse-position"></span>
                  <span class="mock-placeholder" :class="{ 'ie-placeholder': isIE }"
                    >请输入密码</span
                  >
                </template>
              </div>
              <el-input
                ref="pwdInput"
                id="pwdInput"
                v-model="loginForm.password"
                class="pwd-input"
                type="text"
                autocomplete="off"
                :maxlength="20"
                placeholder="请输入密码"
                @focus="onMockFocusBlur(true)"
                @blur="onMockFocusBlur(false)"
                @keyup.left.native="onMockKeyup"
                @keyup.right.native="onMockKeyup"
                @keyup.enter.native="submitForm"
              >
                <i slot="prefix" class="iconfont icon-mima input-prefix"></i>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item class="login-button-item">
            <el-button type="primary" @click="submitForm">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <forget-pwd class="login-panel" v-else></forget-pwd>

      <div class="forget-link">
        <el-link v-if="!showForget" type="primary" @click="showForget = true" :underline="false"
          >忘记密码</el-link
        >
        <el-link v-else type="primary" @click="showForget = false" :underline="false"
          >返回登录</el-link
        >
      </div>
      <div class="login-footer">
        <!-- <a class="login-link" href="https://www.sijibao.com" target="__blank">关于司机宝</a> -->
        <a class="login-link" href="http://www.coalscc.com" target="__blank">煤链社商城</a>
        <!-- <a class="login-link" href="https://www.sijibao.com" target="__blank">admin登录</a> -->
      </div>
    </div>
    <div class="footer-flex">&copy; 2019 湖北煤链容达物流科技有限公司 版权所有</div>
  </div>
</template>

<script>
import JSEncrypt from '@/utils/JSEncrypt';
import biz from '@/utils/biz';
import axios from '@/utils/axios';
import api from '@/api/index.api';
import permission from '@/utils/permission';
import ForgetPwd from './ForgetPwd';

export default {
  components: { ForgetPwd },
  data() {
    return {
      showForget: false,
      showMockMouse: false,
      isIE: false,
      pwdInputType: 'text',
      loginForm: {
        account: '',
        password: '',
      },
      rules: {
        account: [{ required: true, message: '请输入ldap用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入ldap用户密码', trigger: 'blur' }],
      },
    };
  },
  computed: {
    pwdLength() {
      return this.loginForm.password.length;
    },
  },
  created() {
    // zhu.qiao
    // var encrypted = JSEncrypt.encrypt('Sjb@2019');
    // console.log(encrypted);
    this.isIE = IEtag !== -1 && IEtag !== 'edge' ? true : false;
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 登录
          let result = await axios.post(api.login, {
            account: this.loginForm.account,
            password: this.loginForm.password, // 密码rsa加密
            // password: JSEncrypt.encrypt(this.loginForm.password) // 密码rsa加密
          });
          // 存储登录凭证
          localStorage.setItem('Authorization', result.data);

          // 获取用户信息
          await biz.getUserInfo(result.data);

          // 查询字典数据 并存储
          await biz.getDict('', true);
          let per = await permission.getData(true);

          if (per.error) return;

          // 数据存到store
          await permission.setData(this.$store, per.menu, per.list);

          this.$router.push({ path: '/welcome' });
        }
      });
    },
    // 模拟聚焦
    onMockFocusBlur(type) {
      this.showMockMouse = type;
    },
    onMockKeyup(e) {
      // 当输入左右箭头键时  强行将光标设到最后
      // 否则还要将模拟框的光标移动到对应位置  做起来复杂 尝试过实现 功能没问题 但光标反应慢半拍 字符间距不好控制
      // 这里还有个问题  使用鼠标点击选取光标位置 或者选中文本进行删除 模拟框没有同步
      const elInput = document.getElementById('pwdInput');
      elInput.focus();
      if (!this.isIE) {
        // 非IE浏览器
        elInput.selectionStart = this.pwdLength;
        elInput.selectionEnd = this.pwdLength;
      } else {
        // IE
        var range = document.selection.createRange();
        range.move('character', this.pwdLength);
        range.select();
      }
    },
  },
};
</script>
<style lang="postcss">
@import '../../assets/css/theme.css';
.login-page {
  flex: 1 1 auto;
  width: 100%;
  height: auto;
  min-height: 100%;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  .content-flex {
    flex: 1 1 auto;
  }
  .footer-flex {
    flex: 0 0 auto;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: var(--base-darkgray-color);
  }
  .login-header {
    padding: 120px 0 80px;
    text-align: center;
    .login-logo {
      width: 60px;
      height: auto;
    }
  }
  .header-title {
    font-size: 22px;
    margin-top: 12px;
    color: var(--base-color);
  }

  .login-footer {
    text-align: center;
    padding-top: 60px;
    .login-link {
      color: var(--base-darkgray-color);
      text-align: center;
      cursor: pointer;
      padding: 0 10px;
      transition: all 0.2s ease-in-out;
      text-decoration: none;
    }
    .login-link:hover {
      color: var(--base-color);
    }
  }
  .forget-link {
    text-align: center;
    margin-top: 20px;
  }
}

.login-panel {
  width: 320px;
  margin: 0 auto;
  height: auto;
  padding: 20px;
  border-radius: 5px;
  .account-tip {
    margin-bottom: 20px;
    background-color: rgb(234, 246, 253);
    color: var(--base-color);
    i {
      font-size: 16px;
      width: 16px;
      margin-right: 8px;
      position: relative;
      top: 1px;
    }
  }
  .input-prefix {
    height: 100%;
    line-height: 37.5px;
    width: 25px;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
  }

  .login-button-item .el-button {
    width: 100%;
    margin-top: 6px;
    font-size: 14px;
  }

  .login-button-item.el-form-item {
    margin-bottom: 0;
  }
}
</style>

