import Vue from 'vue';
import Vuex from 'vuex';
import login from './login.js';
import patrolTask from './patrolTask.js';
import spotCheckTask from './spotCheckTask.js';
import spotTaskDispatchingManagement from './spotTaskDispatchingManagement.js';
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        login,
        patrolTask,
        spotCheckTask,
        spotTaskDispatchingManagement
    }
});