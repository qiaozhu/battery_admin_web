import Vue from 'vue';
import Vuex from 'vuex';

import global from '@/store/global/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...global.state
  },
  mutations: {
    ...global.mutations
  },
  actions: {
    ...global.actions
  }
});
