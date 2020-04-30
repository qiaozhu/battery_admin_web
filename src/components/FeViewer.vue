<template>
  <ul :id="viewerDomId">
    <li v-for="(el, index) in source" :key="index">
      <img :src="el.url" :alt="el.title ? `${title}-${el.title}` : el.title" style="display:none" />
    </li>
  </ul>
</template>
<script>
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import utils from '@/utils/utils';

export default {
  props: {
    title: {
      type: String,
      default: '照片'
    },
    source: {
      type: Array
    }
  },
  data: function() {
    return {
      viewer: null
    };
  },
  computed: {
    viewerDomId() {
      return 'viewer' + utils.randomName();
    }
  },
  methods: {
    show() {
      if (this.source.length > 0) {
        this.$nextTick(() => {
          const dom = document.getElementById(this.viewerDomId);
          this.viewer = new Viewer(dom);
          this.viewer.show();
          dom.addEventListener('hidden', () => {
            this.$emit('update:show', false);
            this.viewer.destroy(); // 关闭时销毁实例
          });
        });
      } else {
        this.$message.error('暂无图片');
      }
    }
  }
};
</script>
<style lang="postcss">
</style>
