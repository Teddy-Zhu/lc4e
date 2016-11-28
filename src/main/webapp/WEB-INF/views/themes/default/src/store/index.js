/**
 * Created by teddyzhu on 2016/11/12.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import menu from './menu'
import order from './order'
import config from './config'
import ajax from './ajax'
import route from './route'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        menu,
        order,
        config,
        ajax,
        route
    }
})