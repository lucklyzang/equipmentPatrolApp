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
        path: '/patrolAbnormalRecord',
        name: 'patrolAbnormalRecord',
        component: PatrolAbnormalRecord
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