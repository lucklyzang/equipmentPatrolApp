import { getDefaultPatrolTaskState } from '@/common/js/resetStore'
export default {
    state: getDefaultPatrolTaskState(),

    getters: {
        enterProblemRecordMessage: (state) => {
            return state.enterProblemRecordMessage
        },

        enterPatrolAbnormalRecordPageSource: (state) => {
            return state.enterPatrolAbnormalRecordPageSource
        },

        patrolTaskListMessage: (state) => {
            return state.patrolTaskListMessage
        },

        taskType: (state) => {
            return state.taskType
        },

        taskOrderType: (state) => {
            return state.taskOrderType
        },

        currentElectronicSignature: (state) => {
            return state.currentElectronicSignature
        },

        departmentCheckList: (state) => {
            return state.departmentCheckList
        },

        originalSignature: (state) => {
            return state.originalSignature
        },

        patrolTaskDeviceChecklist: (state) => {
            return state.patrolTaskDeviceChecklist
        }

    },

    mutations: {
        // 保存进入问题记录页时携带的信息
        changeEnterProblemRecordMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.enterProblemRecordMessage = playLoad
            }
        },

        // 保存巡查任务列表页的信息
        changePatrolTaskListMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.patrolTaskListMessage = playLoad
            }
        },

        // 保存扫码后的检查项信息
        changeDepartmentCheckList(state, playLoad) {
            state.departmentCheckList = playLoad
        },
        // 保存工单完成时的电子签名信息
        changeCurrentElectronicSignature(state, payLoad) {
            state.currentElectronicSignature = payLoad.DtMsg
        },

        // 保存工单完成时原始电子签名信息
        changeOriginalSignature(state, payLoad) {
            state.originalSignature = payLoad
        },

        // 保存任务切换类型
        changeTaskType (state, payLoad) {
            state.taskType = payLoad
        },

        // 保存任务工单列表切换类型
        changeTaskOrderType (state, payLoad) {
            state.taskOrderType = payLoad
        },

        // 保存进入异常记录页的来源页面
        changeEnterPatrolAbnormalRecordPageSource (state, playLoad) {
            state.enterPatrolAbnormalRecordPageSource = playLoad
        },

        // 保存进入设备检查单页面的信息
        changePatrolTaskDeviceChecklist (state, playLoad) {
            state.patrolTaskDeviceChecklist = playLoad
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