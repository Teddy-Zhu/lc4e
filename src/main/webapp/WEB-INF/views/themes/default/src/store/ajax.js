/**
 * Created by teddyzhu on 2016/11/15.
 */
import Vue from 'vue';
import {Message} from 'element-ui';

export default {
    state: {},
    mutations: {},
    actions: {
        post({state}, data){
            return new Promise((resolve, reject)=> {
                Vue.http.post(data["url"], data["data"], {
                    emulateJSON: true,
                    before: function (request) {
                        request.headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    }
                }).then((response)=> {
                    resolve(response.data);
                }, (response)=> {
                    Message.error(data["errorMsg"] ? data["errorMsg"] : '数据处理错误');
                    reject(response);
                });
            })
        },
        get({}, data){
            return new Promise((resolve, reject)=> {
                Vue.http.get(data["url"]).then((response)=> {
                    if (response.data.result) {
                        resolve(response.data);
                    } else {
                        Message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + "..." : response.data.message);
                    }
                }, (response)=> {
                    Message.error(data["errorMsg"] ? data["errorMsg"] : '数据获取错误');
                    reject(response);
                });
            })
        }
    }
}