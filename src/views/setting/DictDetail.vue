<template>
  <Layout navActive="setting">
    <div class="dictionary-detail-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item to="/dictionary/list">字典管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pageView.desc }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form
        ref="dictForm"
        :model="dictForm"
        label-width="80px"
        :rules="rules"
        :disabled="formDisabled"
        class="dictionary-form-panel"
      >
        <el-form-item label="类型值" prop="type">
          <el-input
            v-model="dictForm.type"
            :disabled="isAddValue"
            maxlength="30"
            placeholder="请输入类型值"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型标签" prop="typeLabel">
          <el-input
            v-model="dictForm.typeLabel"
            :disabled="isAddValue"
            maxlength="30"
            placeholder="请输入类型标签"
          ></el-input>
        </el-form-item>
        <el-form-item label="键值" prop="value">
          <el-input
            v-model="dictForm.value"
            type="textarea"
            autosize
            maxlength="80"
            placeholder="请输入键值"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="label">
          <el-input
            v-model="dictForm.label"
            type="textarea"
            autosize
            maxlength="80"
            placeholder="请输入标签"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dictForm.sort" maxlength="10" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="dictForm.remark"
            type="textarea"
            maxlength="100"
            :autosize="{ minRows: 1, maxRows: 3 }"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-left:60px;">
        <el-button v-if="pageView.isShowSaveBtn" type="primary" class="mr-10" @click="onSaveMenu"
          >保存</el-button
        >
        <router-link to="/dict/list">
          <el-button>{{ pageView.isShowSaveBtn ? '返回' : '返回列表' }}</el-button>
        </router-link>
      </div>
    </div>
  </Layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import Validator from '@/utils/Validator';
import utils from '@/utils/utils';
import biz from '@/utils/biz';
import Layout from '@/components/Layout';

export default {
  components: { Layout },
  data() {
    // 数字验证
    var validateNumber = (rule, value, callback) => {
      if (!Validator.isNumber(value)) {
        callback(new Error('请输入有效的排序数'));
      }
      callback();
    };

    return {
      dictForm: {
        id: '',
        parentId: '', // 父级编号
        label: '', // 标签名
        value: '', // 键值
        typeLabel: '', // 类型名
        type: '', // 类型键值
        remark: '', // 备注信息
        sort: 1 // 排序
      },
      rules: {
        value: [{ required: true, message: '请输入键值', trigger: 'blur' }],
        label: [{ required: true, message: '请输入标签名', trigger: 'blur' }],
        type: [{ required: true, message: '请输入类型值', trigger: 'blur' }],
        typeLabel: [{ required: true, message: '请输入类型标签', trigger: 'blur' }],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      },
      formDisabled: false, // 禁用表单
      isAddValue: false, // 是否是新增键值
      pageView: {
        desc: '',
        isShowSaveBtn: true
      }
    };
  },
  async created() {
    const routeName = this.$route.name;
    const params = this.$route.params;
    let detailData = {};

    if (routeName !== 'DictAdd') {
      // 获取单个字典详情
      detailData = await biz.getDict(params.type, true);
      detailData = detailData || [];
      if (routeName === 'DictAddValue') {
        // 新增键值  取最后一个  最大序号
        detailData = detailData[detailData.length - 1] || {};
      } else {
        // 编辑和详情 取对应dictId
        detailData = detailData.filter(el => el.dictId === params.dictId);
        detailData = detailData[0] || {};
      }
    }
    switch (routeName) {
      case 'DictDetail':
        this.formDisabled = true;
        this.pageView = { desc: '字典详情', isShowSaveBtn: false };
        this.dictForm = detailData;
        break;
      case 'DictEdit':
        this.pageView.desc = '编辑字典';
        this.dictForm = detailData;
        break;
      case 'DictAdd':
        this.pageView.desc = '新增字典';
        break;
      case 'DictAddValue':
        this.isAddValue = true;
        this.pageView.desc = '新增键值';
        this.dictForm.type = detailData.type;
        this.dictForm.typeLabel = detailData.typeLabel;
        this.dictForm.sort = detailData.sort ? detailData.sort + 1 : 1;
        break;
    }
  },
  methods: {
    onSaveMenu() {
      this.$refs.dictForm.validate(async valid => {
        if (valid) {
          await axios.post(api.saveDict, { ...this.dictForm });
          this.$message.success('操作成功');
          await biz.getDict('', true);

          if (this.$route.name === 'DictAddValue') {
            // 新增字典返回带类型自动筛选
            this.$router.push({
              name: 'DictList',
              params: { type: this.dictForm.type }
            });
          } else {
            this.$router.push({ name: 'DictList' });
          }
        }
      });
    }
  }
};
</script>
<style lang="postcss">
.dictionary-detail-page {
  .dictionary-form-panel {
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
}
</style>

