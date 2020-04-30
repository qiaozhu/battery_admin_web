<template>
  <Layout navActive="setting">
    <div class="menumng-page">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <el-button type="primary" @click="onAddMenu" v-has="'setting:sys:menu:add'"
            >添加菜单</el-button
          >
        </div>
      </div>
      <div class="menu-tree-table">
        <div class="tree-th-header">
          <span class="tree-th-name">名称</span>
          <span class="tree-th-content">
            <el-row class="tree-th">
              <el-col :span="5">链接</el-col>
              <el-col :span="2">排序</el-col>
              <el-col :span="2">默认</el-col>
              <el-col :span="4">图标</el-col>
              <el-col :span="5">权限标识</el-col>
              <el-col :span="6">操作</el-col>
            </el-row>
          </span>
        </div>
        <el-tree
          :data="treeNode"
          node-key="menuId"
          :default-expand-all="true"
          ref="tree"
          highlight-current
          :filter-node-method="filterNode"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="custom-node-name">{{ data.name }}</span>
            <span class="custom-node-content">
              <el-row>
                <el-col :span="5" :title="data.href">
                  <span>{{ data.href || '-' }}</span>
                </el-col>
                <el-col :span="2">
                  <span>{{ data.sort || '-' }}</span>
                </el-col>
                <el-col :span="2">
                  <span v-if="data.isDefault === '1'">是</span>
                  <span v-else>否</span>
                </el-col>
                <el-col :span="4" :title="data.icon">
                  <span>{{ data.icon || '-' }}</span>
                </el-col>
                <el-col :span="5" :title="data.permission">
                  <span>{{ data.permission || '-' }}</span>
                </el-col>
                <el-col :span="6">
                  <span>
                    <el-button
                      type="text"
                      size="mini"
                      v-has="'setting:sys:menu:edit'"
                      @click="onEditMenu(data)"
                    >
                      修改
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      v-has="'setting:sys:menu:del'"
                      @click.stop="onDelMenu(data)"
                    >
                      删除
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      v-has="'setting:sys:menu:add'"
                      @click="onAddSubMenu(data)"
                    >
                      添加下级菜单
                    </el-button>
                  </span>
                </el-col>
              </el-row>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
  </Layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/setting.api';
import permission from '@/utils/permission';
import Layout from '@/components/Layout';

export default {
  components: { Layout },
  data() {
    return {
      treeNode: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultKeys: []
    };
  },
  created() {
    this.initTree();
  },
  methods: {
    async initTree() {
      let result = await axios.get(api.getMenuTreeAll);
      this.treeNode = result.data || [];
    },
    onAddMenu() {
      this.$router.push({ path: '/menu/add' });
    },
    onAddSubMenu(node) {
      this.$router.push({ path: `/menu/add/${node.menuId}` });
    },
    onEditMenu(node) {
      this.$router.push({ path: `/menu/edit/${node.menuId}` });
    },
    async onDelMenu(node) {
      if (node.children && node.children.length > 0) {
        this.$message.error('当前节点存在叶子节点，请先删除子节点');
        return;
      }
      await axios.get(api.delMenu, { params: { menuId: node.menuId } });
      this.$message.success('删除成功');

      // 修改菜单后 重新获取菜单及权限
      let result = await permission.getData();
      await permission.setData(this.$store, result.menu, result.list);
      this.initTree();
    },
    filterNode(value, data) {
      // return data.isForbidden === 0;
      return true;
    }
  }
};
</script>
<style lang="postcss">
.menu-tree-table {
  border: 1px solid #ebeef5;
  border-bottom: none;
  color: #606266;
  .el-tree__empty-block {
    border-bottom: 1px solid #ebeef5;
  }
  .tree-th-header {
    height: 40px;
    line-height: 40px;
    background: #f7f9fb;
    position: relative;
    border-bottom: 1px solid #ebeef5;
    font-size: 12px;
    .tree-th-name {
      padding-left: 10px;
    }
    .tree-th-content {
      position: absolute;
      left: 25%;
      width: 75%;
      .el-col {
        border-left: 1px solid #ebeef5;
        padding: 0 10px;
      }
    }
  }
  .el-tree-node__content {
    position: relative;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
    padding: 8px 0;
    box-sizing: border-box;
    .el-col {
      border-left: 1px solid #ebeef5;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .custom-tree-node {
    font-size: 12px;
    padding-right: 8px;
    .custom-node-content {
      position: absolute;
      left: 25%;
      width: 75%;
    }
  }
}
</style>

