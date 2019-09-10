import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
import axios from 'axios';
import home from '../components/home.vue'
import login from '../components/Login.vue'
let router = new VueRouter({
    routes: [{
        name: 'itemlist',
        path: '/itemlist',
        component: home,
    }, {
        name: 'additem',
        path: '/additem',
        component: home,
    }, {
        name: 'adduser',
        path: '/adduser',
        component: home,
    }, {
        name: 'userlist',
        path: '/userlist',
        component: home,
    }, {
        path: '/',
        redirect: '/login'

    }, {
        name: 'login',
        path: '/login',
        component: login
    }]
})


// 路由拦截
router.beforeEach(function (to, from, next) {
    if (to.matched.some(item => item.meta.requiresAuth)) {
        // 判断是否已登录
        let authorization = localStorage.getItem('Authorization');
        if (authorization) {
            // 发起校验
            axios.get('http://localhost:1906/verify', {
                headers: {
                    Authorization: authorization
                }
            }).then(res => {
                window.console.log('then', res)
            })
            next();
        } else {
            next({
                path: '/login',
                query: {
                    targetUrl: to.fullPath
                }
            })
        }
    } else {
        next();
    }
})


export default router