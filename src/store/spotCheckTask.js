import { getSpotCheckTaskState } from '@/common/js/resetStore'
export default {
    state: getSpotCheckTaskState(),

    getters: {
    },

    mutations: {
        //重置点检任务状态
        resetSpotCheckTaskState(state) {
            Object.assign(state, getSpotCheckTaskState())
        }
    },

    actions: {
        resetSpotCheckTaskStore({ commit }) {
            commit('resetSpotCheckTaskState')
        }
    }
}