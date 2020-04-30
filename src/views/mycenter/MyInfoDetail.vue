<template>
  <Layout navActive="mycenter">
    <div class="myinfo-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>工作台</el-breadcrumb-item>
        <el-breadcrumb-item>个人资料</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="segment myinfo-segment">
        <div class="segment-area">
          <el-row class="h-auto">
            <el-col :span="24">
              <div class="user-avatar">
                <img :src="userData.avatar" alt="" />
              </div>
            </el-col>
          </el-row>
          <el-row class="mt-20">
            <el-col :span="24">
              <div class="segment-content">
                <div class="segment-label">用户名</div>
                <span class="font-default">{{ userData.userName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="segment-label">登录帐号</div>
              <div class="segment-content">{{ userData.account }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="segment-label">公司名称</div>
              <div class="segment-content">{{ belongCompany }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="segment-label">邮箱</div>
              <div class="segment-content">{{ userData.email }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="segment-label">密码</div>
              <div class="segment-content">
                <el-link type="primary" :underline="false" @click="onEditPwd">点击修改</el-link>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="segment-label">备注</div>
              <div class="segment-content">{{ userData.remark || '无' }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="onJumpEdit">修改资料</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import dayjs from 'dayjs';
import axios from '@/utils/axios';
import utils from '@/utils/utils';
import biz from '@/utils/biz';
import Layout from '@/components/Layout';
import defaultAvatar from '@/assets/img/default.png';

export default {
  components: { Layout },
  data() {
    return {
      loginTime: '',
      belongCompany: {},
      userData: {}
    };
  },
  async created() {
    this.loginTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const userData = utils.getLocalItem('userData');
    userData.avatar = userData.avatar || defaultAvatar;
    if (userData) this.userData = userData;
    if (userData.isAdmin) {
      this.belongCompany = '管理员';
    } else {
      let belongCompany = await biz.getDict('belong_company');
      belongCompany = belongCompany || [];
      belongCompany = belongCompany.filter(el => el.dictId === userData.companyId);
      belongCompany = belongCompany[0] || {};
      this.belongCompany = belongCompany.label || '';
    }
  },
  methods: {
    onJumpEdit() {
      this.$router.push('/myinfo/edit');
    },
    onEditPwd() {
      this.$router.push('/myinfo/editpwd');
    }
  }
};
</script>
<style lang="postcss">
.myinfo-page {
  .segment.myinfo-segment {
    border: none;
    .segment-label {
      width: 80px;
    }
  }
  .user-avatar {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
    }
  }
}
</style>

