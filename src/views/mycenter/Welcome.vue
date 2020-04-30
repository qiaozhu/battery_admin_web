<template>
  <Layout navActive="mycenter">
    <div class="welcome-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>工作台</el-breadcrumb-item>
        <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="segment welcome-segment">
        <div class="segment-area">
          <el-row>
            <el-col :span="24">
              <div class="segment-content">
                欢迎您，<span class="font-default">{{ userData.userName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="segment-label">当前时间</div>
              <div class="segment-content">{{ loginTime }}</div>
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
  methods: {}
};
</script>
<style lang="postcss">
.welcome-page {
  .segment.welcome-segment {
    border: none;
    .segment-label {
      width: 80px;
    }
  }
  .user-avatar {
    width: 100px;
    height: 100px;
    /* border-radius: 50%;
    border: 1px solid #e6e4e4;
    overflow: hidden; */
    img {
      width: 100%;
    }
  }
}
</style>

