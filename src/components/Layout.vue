<template>
  <div class="layout">
    <div class="header-wrap">
      <header-nav :nav-active="navActive"></header-nav>
    </div>
    <div class="layout-content" :style="styleObject">
      <el-container>
        <el-aside
          :class="{
            menuWidthLarge: g_config.fullScreen && !g_config.isCollapse,
            menuWidthSmall: !g_config.fullScreen && !g_config.isCollapse,
            menuWidthMini: g_config.isCollapse
          }"
        >
          <side-menu :nav-active="navActive"></side-menu>
        </el-aside>
        <el-main>
          <div class="layout-content-main">
            <el-tabs
              class="layout-tab-card"
              :value="tabActive"
              type="card"
              :closable="tabViewsList.length > 1"
              @tab-remove="onRemoveTab"
              @tab-click="onClickTab"
            >
              <el-tab-pane
                :key="item.name"
                v-for="item in tabViewsList"
                :label="item.meta.title || '标签'"
                :name="item.name"
              >
              </el-tab-pane>
            </el-tabs>
            <slot></slot>
          </div>
        </el-main>
      </el-container>
    </div>
    <div class="layout-footer">&copy; 2019 煤链社 版权所有</div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import HeaderNav from '@/components/HeaderNav';
import SideMenu from '@/components/SideMenu';

export default {
  props: {
    navActive: {
      type: String,
      required: true,
      default: ''
    }
  },
  data: function() {
    return {};
  },
  components: {
    HeaderNav,
    SideMenu
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  computed: {
    styleObject() {
      return this.g_config.fullScreen
        ? 'width: auto;min-width: 100%;max-width: 100%;'
        : 'width:1300px';
    },
    ...mapState({
      g_config: state => state.g_config,
      tabViewsList: state => state.tabViewsList,
      tabActive: state => state.tabActive
    })
  },
  methods: {
    // 删除tab
    onRemoveTab(tabName) {
      if (this.tabViewsList.length === 1) return;
      this.$store.dispatch('removeTabView', tabName);

      // 删除当前tab 跳转至第一个tab
      if (this.tabActive === tabName) {
        this.$router.push({
          name: this.tabViewsList[0].name,
          params: this.tabViewsList[0].params,
          query: this.tabViewsList[0].query
        });
      }
    },
    // 点击tab
    onClickTab(tab) {
      const selected = this.tabViewsList.filter(item => item.name === tab.name);
      this.$router.push({
        name: selected[0].name,
        params: selected[0].params,
        query: selected[0].query
      });
    },
    handleResize() {
      var _w = document.documentElement.clientWidth;
      var g_config = { ...this.$store.state.g_config };
      if (_w >= 1300) {
        g_config.isCollapse = false;
        this.$store.dispatch('changeGlobal', g_config);
        localStorage.setItem('g_config', JSON.stringify(g_config));
      } else {
        g_config.isCollapse = true;
        this.$store.dispatch('changeGlobal', g_config);
        localStorage.setItem('g_config', JSON.stringify(g_config));
      }
    }
  }
};
</script>
<style>
@import '../assets/css/layout.css';
</style>
