/**
 * Created by teddyzhu on 2016/10/15.
 */
import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/index.vue'
import area from '../views/area.vue'
import topic from '../views/topic.vue'
Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => ( savedPosition || {x: 0, y: 0}),
    routes: [
        {
            path: '/',
            component: index
        }, {
            path: '/a/:area',
            name: 'area1',
            component: area
        },
        {
            path: "/a/:area-:page(\\d+)-:order(\\d+)",
            name: 'area2',
            component: area
        }, {
            path: "/t/:topic",
            name: "topic1",
            component: topic
        }, {
            path: "/t/:topic-:page(\\d+)-:order(\\d+)",
            name: "topic2",
            component: topic
        }
    ]
})
