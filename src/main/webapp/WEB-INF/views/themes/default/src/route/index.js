/**
 * Created by teddyzhu on 2016/10/15.
 */
import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/index.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => ( savedPosition || {x: 0, y: 0}),
    routes: [
        {
            path: '/',
            component: index
        },
        {
            path: "/all",
            name: 'index',
            component: index
        },
        {
            path: '*',
            component: index
        }
    ]
})
