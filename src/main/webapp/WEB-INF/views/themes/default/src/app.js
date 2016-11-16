/**
 * Created by teddyzhu on 15/12/5.
 */

import Vue from 'vue'
import router from './route'
import resource from 'vue-resource'
import store from './store'
import App from './app.vue'
import ElementUI from 'element-ui'
import VueSmoothScrollWebSites from 'vue-smoothscroll-websites';

Vue.use(ElementUI)
Vue.use(resource)
Vue.use(VueSmoothScrollWebSites)

const app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

Vue.config.silent = false;
Vue.config.devtools = true;
