<template>
  <Layout navActive="warehouse">
    <div class="warehouse-edit-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ state === 'add' ? '新增仓库' : '编辑仓库' }}</el-breadcrumb-item>
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
        <el-form-item label="仓库名称" prop="name">
          <el-input
            v-model.trim="editForm.name"
            :maxlength="32"
            placeholder="请输入仓库名称"
            autocomplete="off"
            style="width:350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="仓库类型" prop="warehouseType">
          <el-select
            v-model="editForm.warehouseType"
            placeholder="请选择仓库类型"
            style="width:350px"
          >
            <el-option
              v-for="item in typeArr"
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
import api from '@/api/warehouse.api.js';
import utils from '@/utils/utils';
import biz from '@/utils/biz';
import Validator from '@/utils/Validator';

import Layout from '@/components/Layout';

export default {
  components: { Layout },
  data() {
    return {
      editForm: {
        warehouseId: '',
        name: '',
        warehouseType: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
        warehouseType: [{ required: true, message: '请选择仓库类型', trigger: 'blur' }]
      },
      state: 'add',
      typeArr: []
    };
  },
  async created() {
    this.typeArr = (await biz.getDict('warehouse_type')) || [];
    if (this.$route.name === 'WareHouseEdit') {
      this.state = 'edit';
      this.editForm.warehouseId = this.$route.params.warehouseId;

      const detial = await axios.get(api.getWarehouseInfo, {
        params: { warehouseId: this.editForm.warehouseId }
      });

      this.editForm.name = detial.data.name;
      this.editForm.warehouseType = detial.data.warehouseType;
      this.editForm.remark = detial.data.remark;
    }
  },
  methods: {
    onSubmitForm() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          if (this.state === 'add') {
            await axios.post(api.addWarehouse, this.editForm);
            this.$message.success('新增成功');
            this.$router.push({ path: '/warehouse/list' });
          } else {
            await axios.post(api.editWarehouse, this.editForm);
            this.$message.success('修改成功');
            this.$router.push({ path: '/warehouse/list' });
          }
        }
      });
    },
    onCancelBack() {
      this.$router.push({ path: '/warehouse/list' });
    }
  }
};
</script>
<style lang="postcss">
.warehouse-edit-page {
  .edit-form {
    margin: 20px 0 0 0;
  }
}
</style>
