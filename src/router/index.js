import Vue from 'vue'
import Router from 'vue-router'
import { getStore } from '@/common/js/utils.js'
import store from '@/store'
const Home = () =>
    import ('@/pages/Home')
const Login = () =>
    import ('@/pages/Login')
const MyInfo = () =>
    import ('@/pages/MyInfo')
const PatrolTaskElectronicSignaturePage = () =>
    import ('@/pages/patrolTask/PatrolTaskElectronicSignaturePage')
const EquipmentPatrolDetails = () =>
    import ('@/pages/patrolTask/EquipmentPatrolDetails')
const EquipmentChecklist = () =>
    import ('@/pages/patrolTask/EquipmentChecklist')
const PatrolAbnormalCheckItemEventList = () =>
    import ('@/pages/patrolTask/PatrolAbnormalCheckItemEventList')
const PatrolAbnormalRecord = () =>
    import ('@/pages/patrolTask/PatrolAbnormalRecord')
const HistoryEquipmPatroLTaskList = () =>
    import ('@/pages/patrolTask/HistoryEquipmPatroLTaskList')
const HistoryEquipmentPatrolDetails = () =>
    import ('@/pages/patrolTask/HistoryEquipmentPatrolDetails')
const HistoryEquipmentChecklist = () =>
    import ('@/pages/patrolTask/HistoryEquipmentChecklist')
const HistoryPatrolAbnormalCheckItemEventList = () =>
    import ('@/pages/patrolTask/HistoryPatrolAbnormalCheckItemEventList')
const HistoryPatrolAbnormalRecord = () =>
    import ('@/pages/patrolTask/HistoryPatrolAbnormalRecord')
const EquipmentSpotCheck = () =>
    import ('@/pages/spotCheckTask/EquipmentSpotCheck')
const EquipmentSpotCheckTaskDetails = () =>
    import ('@/pages/spotCheckTask/EquipmentSpotCheckTaskDetails')
const SpotAbnormalRecord = () =>
    import ('@/pages/spotCheckTask/SpotAbnormalRecord')
const SpotAbnormalCheckItemEventList = () =>
    import ('@/pages/spotCheckTask/SpotAbnormalCheckItemEventList')
const HistoryEquipmSpotTaskList = () =>
    import ('@/pages/spotCheckTask/HistoryEquipmSpotTaskList')
const HistoryEquipmentSpotCheckTaskDetails = () =>
    import ('@/pages/spotCheckTask/HistoryEquipmentSpotCheckTaskDetails')
const HistorySpotAbnormalCheckItemEventList = () =>
    import ('@/pages/spotCheckTask/HistorySpotAbnormalCheckItemEventList')
const HistorySpotAbnormalRecord = () =>
    import ('@/pages/spotCheckTask/HistorySpotAbnormalRecord')
const EquipmentSpotList = () =>
    import ('@/pages/spotTaskDispatchingManagement/EquipmentSpotList')
const CreateSpotTask = () =>
    import ('@/pages/spotTaskDispatchingManagement/CreateSpotTask')
const EquipmentList = () =>
    import ('@/pages/equipmentStatusManagement/EquipmentList')
Vue.use(Router)
let baseRoute = [{
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/patrolTaskElectronicSignaturePage',
        name: 'patrolTaskElectronicSignaturePage',
        component: PatrolTaskElectronicSignaturePage
    },
    {
        path: '/myInfo',
        name: 'myInfo',
        component: MyInfo
    },
    {
        path: '/equipmentPatrolDetails',
        name: 'equipmentPatrolDetails',
        component: EquipmentPatrolDetails
    },
    {
        path: '/equipmentChecklist',
        name: 'equipmentChecklist',
        component: EquipmentChecklist
    },
    {
        path: '/patrolAbnormalCheckItemEventList',
        name: 'patrolAbnormalCheckItemEventList',
        component: PatrolAbnormalCheckItemEventList
    },
    {
        path: '/historyEquipmPatroLTaskList',
        name: 'historyEquipmPatroLTaskList',
        component: HistoryEquipmPatroLTaskList
    },
    {
        path: '/historyEquipmentPatrolDetails',
        name: 'historyEquipmentPatrolDetails',
        component: HistoryEquipmentPatrolDetails
    },
    {
        path: '/historyEquipmentChecklist',
        name: 'historyEquipmentChecklist',
        component: HistoryEquipmentChecklist
    },
    {
        path: '/historyPatrolAbnormalCheckItemEventList',
        name: 'historyPatrolAbnormalCheckItemEventList',
        component: HistoryPatrolAbnormalCheckItemEventList
    },
    {
        path: '/historyPatrolAbnormalRecord',
        name: 'historyPatrolAbnormalRecord',
        component: HistoryPatrolAbnormalRecord
    },
    {
        path: '/patrolAbnormalRecord',
        name: 'patrolAbnormalRecord',
        component: PatrolAbnormalRecord
    },
    {
        path: '/equipmentSpotCheck',
        name: 'equipmentSpotCheck',
        component: EquipmentSpotCheck
    },
    {
        path: '/equipmentSpotCheckTaskDetails',
        name: 'equipmentSpotCheckTaskDetails',
        component: EquipmentSpotCheckTaskDetails
    },
    {
        path: '/spotAbnormalRecord',
        name: 'spotAbnormalRecord',
        component: SpotAbnormalRecord
    },
    {
        path: '/spotAbnormalCheckItemEventList',
        name: 'spotAbnormalCheckItemEventList',
        component: SpotAbnormalCheckItemEventList
    },
    {
        path: '/historyEquipmSpotTaskList',
        name: 'historyEquipmSpotTaskList',
        component: HistoryEquipmSpotTaskList
    },
    {
        path: '/historyEquipmentSpotCheckTaskDetails',
        name: 'historyEquipmentSpotCheckTaskDetails',
        component: HistoryEquipmentSpotCheckTaskDetails
    },
    {
        path: '/historySpotAbnormalCheckItemEventList',
        name: 'historySpotAbnormalCheckItemEventList',
        component: HistorySpotAbnormalCheckItemEventList
    },
    {
        path: '/historySpotAbnormalRecord',
        name: 'historySpotAbnormalRecord',
        component: HistorySpotAbnormalRecord
    },
    {
        path: '/equipmentSpotList',
        name: 'equipmentSpotList',
        component: EquipmentSpotList
    },
    {
        path: '/createSpotTask',
        name: 'createSpotTask',
        component: CreateSpotTask
    },
    {
        path: '/equipmentList',
        name: 'equipmentList',
        component: EquipmentList
    }
];
let router = new Router({
    routes: baseRoute,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            // return {
            //     x: 0,
            //     y: 0
            // }
        }
    }
});
router.beforeEach((to, from, next) => {
    let login = getStore('isLogin');
    let name = to.name;
    if (name === 'login') {
        if (login) {
            next({ path: '/home' })
        } else {
            next()
        }
    } else {
        if (login) {
            next()
        } else {
            next({ path: '/' })
        }
    }
});
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
export default router