/**
 * Created by teddyzhu on 2016/11/12.
 */
import Vue from 'vue'

export default {
    state: JSON.parse(sessionStorage.getItem("user")) || {},
    mutations: {},
    actions: {
        signin({state}, form) {
            return new Promise((resolve, reject)=> {
                Vue.http.post("/u/signin", form, {emulateJSON: true}).then((response)=> {
                    if (response.data.result) {
                        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
                        Vue.set(state, 'id', response.data.data.user.id);
                        Vue.set(state, 'nick', response.data.data.user.nick);
                    }
                    resolve(response.data);
                }, (response)=> {
                    reject(response);
                });
            })
        },
        signout({state}) {
            return new Promise((resolve, reject)=> {
                Vue.http.post("/u/signout").then((response)=> {
                    sessionStorage.removeItem('user');
                    Vue.set(state, 'id', "");
                    Vue.set(state, 'nick', "");
                    resolve(response.data);
                }, (response)=> {
                    reject(response);
                });
            })
        }
    }
}