/**
 * Created by teddyzhu on 2016/10/15.
 */
import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/page/index.vue'
import area from '../views/page/area.vue'
import login from '../views/page/login.vue'
import register from '../views/page/register.vue'
import signout from '../views/page/signout.vue'
import newTopic from '../views/page/newtopic.vue'
import topic from '../views/page/topic.vue'
Vue.use(Router);

export default new Router({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => ( savedPosition || {x: 0, y: 0}),
    routes: [
        {
            path: '/',
            component: index
        },
        {
            path: "/:page(\\d+)/:order(\\d+)",
            name: 'index2',
            component: index
        }, {
            path: '/a/:area',
            name: 'area1',
            component: area
        },
        {
            path: "/a/:area/:page(\\d+)/:order(\\d+)",
            name: 'area2',
            component: area
        }, {
            path: "/t/:topic",
            name: "topic1",
            component: topic
        }, {
            path: "/t/:topic/:page(\\d+)",
            name: "topic2",
            component: topic
        }, {
            path: "/u/login",
            name: "login",
            component: login
        }, {
            path: "/u/register",
            name: "register",
            component: register
        }, {
            path: "/u/signout",
            name: 'signout',
            component: signout
        }, {
            path: "/t/new",
            name: 'new',
            component: newTopic
        }, {
            path: "/t/new/:area",
            name: 'new2',
            component: newTopic
        }
    ]
})
