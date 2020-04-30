<template>
  <Layout navActive="warehouse">
    <div class="goods-edit-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ state === 'add' ? '新增商品' : '编辑商品' }}</el-breadcrumb-item>
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
        <el-form-item label="商品名称" prop="goodsName">
          <el-input
            v-model.trim="editForm.goodsName"
            :maxlength="32"
            placeholder="请输入商品名称"
            autocomplete="off"
            style="width:350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="goodsType">
          <el-select v-model="editForm.goodsType" placeholder="请选择商品类型" style="width:350px">
            <el-option
              v-for="item in typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格" prop="goodsSku">
          <el-select v-model="editForm.goodsSku" placeholder="请选择商品规格" style="width:350px">
            <el-option
              v-for="item in skuArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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

        <el-form-item label="附件">
          <img-upload ref="goodsImg" :limit="2" :default-files="editForm.imgList"></img-upload>
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
import api from '@/api/goods.api.js';
import utils from '@/utils/utils';
import biz from '@/utils/biz';
import Validator from '@/utils/Validator';

import Layout from '@/components/Layout';
import ImgUpload from '@/components/ImgUpload';

export default {
  components: { Layout, ImgUpload },
  data() {
    return {
      editForm: {
        goodsId: '',
        goodsName: '',
        goodsType: '',
        goodsSku: '',
        remark: '',
        imgList: []
      },
      rules: {
        goodsName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goodsType: [{ required: true, message: '请选择商品类型', trigger: 'blur' }]
      },
      state: 'add',
      typeArr: [],
      skuArr: []
    };
  },
  async created() {
    this.typeArr = (await biz.getDict('goods_type')) || [];
    this.skuArr = (await biz.getDict('goods_sku')) || [];
    if (this.$route.name === 'GoodsEdit') {
      this.state = 'edit';
      this.editForm.goodsId = this.$route.params.goodsId;

      const detial = await axios.get(api.getGoodsDetail, {
        params: { goodsId: this.editForm.goodsId }
      });

      this.editForm.goodsName = detial.data.goodsName;
      this.editForm.goodsType = detial.data.goodsType;
      this.editForm.goodsSku = detial.data.goodsSku;
      this.editForm.remark = detial.data.remark;
      this.editForm.imgList = detial.data.imgList ? detial.data.imgList.split(',') : [];
    }
  },
  methods: {
    onSubmitForm() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let params = { ...this.editForm };
          let goodsImgList = this.$refs.goodsImg.getUploadFiles() || [];
          goodsImgList = goodsImgList.join(',');
          params.imgList = goodsImgList;
          if (this.state === 'add') {
            await axios.post(api.addGoods, params);
            this.$message.success('新增成功');
            this.$router.push({ path: '/goods/list' });
          } else {
            await axios.post(api.editGoods, params);
            this.$message.success('修改成功');
            this.$router.push({ path: '/goods/list' });
          }
        }
      });
    },
    onCancelBack() {
      this.$router.push({ path: '/goods/list' });
    }
  }
};
</script>
<style lang="postcss">
.goods-edit-page {
  .edit-form {
    margin: 20px 0 0 0;
  }
}
</style>
