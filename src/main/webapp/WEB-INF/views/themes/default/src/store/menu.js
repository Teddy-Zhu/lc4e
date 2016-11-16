/**
 * Created by teddyzhu on 2016/11/12.
 */
import Vue from 'vue';

export default {
    state: JSON.parse(sessionStorage.getItem('menu')) || undefined,
    mutations: {},
    actions: {
        getMenu({state}, callback){
            if (state.menu) {
                Vue.http.post("/basic/menu").then((response)=> {
                    sessionStorage.setItem('menu', {id: user.id});
                    if (response.data.result) {
                        sessionStorage.setItem('menu', JSON.stringify(response.data.data.menu));
                        callback(response.data.data.menu);
                    }
                }, (response)=> {

                });
            }
        }
    }
}