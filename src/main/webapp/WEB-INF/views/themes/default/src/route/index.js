/**
 * Created by teddyzhu on 2016/10/15.
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => ( savedPosition || {x: 0, y: 0}),
    routes: [
        {
            path: '/',
            component: (resolve, reject)=> {
                require(['../views/page/index.vue'], resolve);
            }
        },
        {
            path: "/:page(\\d+)/:order(\\d+)",
            name: 'index2',
            component: (resolve, reject)=> {
                require(['../views/page/index.vue'], resolve);
            }
        }, {
            path: '/a/:area',
            name: 'area1',
            component: (resolve, reject)=> {
                require(['../views/page/area.vue'], resolve);
            }
        },
        {
            path: "/a/:area/:page(\\d+)/:order(\\d+)",
            name: 'area2',
            component: (resolve, reject)=> {
                require(['../views/page/area.vue'], resolve);
            }
        }, {
            path: "/t/:topic([0-9a-zA-Z]{4,})",
            name: "topic1",
            component: (resolve, reject)=> {
                require(['../views/page/topic.vue'], resolve);
            }
        }, {
            path: "/t/:topic([0-9a-zA-Z]{4,})/:page(\\d+)",
            name: "topic2",
            component: (resolve, reject)=> {
                require(['../views/page/topic.vue'], resolve);
            }
        }, {
            path: "/u/login",
            name: "login",
            component: (resolve, reject)=> {
                require(['../views/page/login.vue'], resolve);
            }
        }, {
            path: "/u/register",
            name: "register",
            component: (resolve, reject)=> {
                require(['../views/page/register.vue'], resolve);
            }
        }, {
            path: "/u/signout",
            name: 'signout',
            component: (resolve, reject)=> {
                require(['../views/page/signout.vue'], resolve);
            }
        }, {
            path: "/t/new",
            name: 'new',
            component: (resolve, reject)=> {
                require(['../views/page/newtopic.vue'], resolve);
            }
        }, {
            path: "/t/new/:area",
            name: 'new2',
            component: (resolve, reject)=> {
                require(['../views/page/newtopic.vue'], resolve);
            }
        }, {
            path: "/i/:id",
            name: 'userInfo',
            component: (resolve, reject)=> {
                require(['../views/page/user.vue'], resolve)
            }
        }
    ]
})
