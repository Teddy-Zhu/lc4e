/**
 * Created by teddyzhu on 2016/11/15.
 */
import Vue from 'vue'
export default {
    state: {},
    mutations: {},
    actions: {
        post({state}, data){
            return new Promise((resolve, reject)=> {
                Vue.http.post(data["url"], data["data"], {emulateJSON: true}).then((response)=> {
                    resolve(response.data);
                }, (response)=> {
                    this.$message.error(data["errorMsg"] ? data["errorMsg"] : '数据获取错误');
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
                        this.$message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + "..." : response.data.message);
                    }
                }, (response)=> {
                    this.$message.error(data["errorMsg"] ? data["errorMsg"] : '数据获取错误');
                    reject(response);
                });
            })
        }
    }
}