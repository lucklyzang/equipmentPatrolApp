import { getDefaultPatrolTaskState } from '@/common/js/resetStore'
import { setStore, getStore } from '@/common/js/utils'
export default {
    state: getDefaultPatrolTaskState(),

    getters: {
        enterPatrolAbnormalRecordPageSource: (state) => {
            return state.enterPatrolAbnormalRecordPageSource
        },

        patrolTaskListMessage: (state) => {
            return state.patrolTaskListMessage
        },

        currentElectronicSignature: (state) => {
            return state.currentElectronicSignature
        },

        originalSignature: (state) => {
            return state.originalSignature
        },

        patrolTaskDeviceChecklist: (state) => {
            state.patrolTaskDeviceChecklist = getStore('patrolTaskDeviceChecklist') ? JSON.parse(getStore('patrolTaskDeviceChecklist')) : [];
            return state.patrolTaskDeviceChecklist
        },

        devicePatrolDetailsSelectMessage: (state) => {
            return state.devicePatrolDetailsSelectMessage
        },

        patrolTaskAbnormalCheckItemEventList: (state) => {
            state.patrolTaskAbnormalCheckItemEventList = getStore('patrolTaskAbnormalCheckItemEventList') ? JSON.parse(getStore('patrolTaskAbnormalCheckItemEventList')) : [];
            return state.patrolTaskAbnormalCheckItemEventList
        },

        historyPatrolTaskAbnormalCheckItemEventList: (state) => {
            state.patrolTaskAbnormalCheckItemEventList = getStore('historyPatrolTaskAbnormalCheckItemEventList') ? JSON.parse(getStore('historyPatrolTaskAbnormalCheckItemEventList')) : [];
            return state.historyPatrolTaskAbnormalCheckItemEventList
        },
        
        historyPatrolTaskDetails: (state) => { 
            state.historyPatrolTaskDetails = getStore('historyPatrolTaskDetails') ? JSON.parse(getStore('historyPatrolTaskDetails')) : [];
            return state.historyPatrolTaskDetails
        },

        historyPatrolTaskDeviceChecklist: (state) => { 
            state.historyPatrolTaskDeviceChecklist = getStore('historyPatrolTaskDeviceChecklist') ? JSON.parse(getStore('historyPatrolTaskDeviceChecklist')) : [];
            return state.historyPatrolTaskDeviceChecklist
        }

    },

    mutations: {
        // 保存巡查任务列表页的信息
        changePatrolTaskListMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.patrolTaskListMessage = playLoad
            }
        },

        // 保存工单完成时的电子签名信息
        changeCurrentElectronicSignature(state, payLoad) {
            state.currentElectronicSignature = payLoad.DtMsg
        },

        // 保存工单完成时原始电子签名信息
        changeOriginalSignature(state, payLoad) {
            state.originalSignature = payLoad
        },

        // 保存进入异常记录页的来源页面
        changeEnterPatrolAbnormalRecordPageSource (state, playLoad) {
            state.enterPatrolAbnormalRecordPageSource = playLoad
        },

        //保存离开设备巡检详情页时选中的任务集名称和时间点信息
        changeDevicePatrolDetailsSelectMessage (state, playLoad) {
            state.devicePatrolDetailsSelectMessage = playLoad
        },

        // 保存进入设备检查单页面的信息
        changePatrolTaskDeviceChecklist (state, playLoad) {
            setStore('patrolTaskDeviceChecklist', playLoad);
            state.patrolTaskDeviceChecklist = playLoad
        },

        // 保存进入异常检查项事件列表页面的信息
        changePatrolTaskAbnormalCheckItemEventList (state, playLoad) {
            setStore('patrolTaskAbnormalCheckItemEventList', playLoad);
            state.patrolTaskAbnormalCheckItemEventList = playLoad
        },

        // 保存进入历史异常检查项事件列表页面的信息
         changeHistoryPatrolTaskAbnormalCheckItemEventList (state, playLoad) {
            setStore('historyPatrolTaskAbnormalCheckItemEventList', playLoad);
            state.historyPatrolTaskAbnormalCheckItemEventList = playLoad
        },


        // 保存进入历史巡检任务详情页面的信息
        changeHistoryPatrolTaskDetails (state, playLoad) {
            setStore('historyPatrolTaskDetails', playLoad);
            state.historyPatrolTaskDetails = playLoad
        },

        // 保存进入历史设备检查单页面的信息
        changePatrolHistoryTaskDeviceChecklist (state, playLoad) {
            setStore('historyPatrolTaskDeviceChecklist', playLoad);
            state.historyPatrolTaskDeviceChecklist = playLoad
        },


        //重置巡更任务状态
        resetPatrolTaskState(state) {
            Object.assign(state, getDefaultPatrolTaskState())
        }
    },

    actions: {
        resetPatrolTaskStore({ commit }) {
            commit('resetPatrolTaskState')
        }
    }
}