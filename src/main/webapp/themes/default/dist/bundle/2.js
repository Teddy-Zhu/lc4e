webpackJsonp([2],{169:function(e,t,r){"use strict";t.default={name:"sg-body",props:{col:{type:Number,default:20}}}},170:function(e,t,r){e.exports={default:r(172),__esModule:!0}},171:function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o=r(170),a=n(o);t.default=a.default||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}},172:function(e,t,r){r(176),e.exports=r(5).Object.assign},173:function(e,t,r){"use strict";var n=r(60),o=r(174),a=r(175),s=r(61),i=r(59),c=Object.assign;e.exports=!c||r(34)(function(){var e={},t={},r=Symbol(),n="abcdefghijklmnopqrst";return e[r]=7,n.split("").forEach(function(e){t[e]=e}),7!=c({},e)[r]||Object.keys(c({},t)).join("")!=n})?function(e,t){for(var r=s(e),c=arguments.length,u=1,l=o.f,f=a.f;c>u;)for(var p,d=i(arguments[u++]),h=l?n(d).concat(l(d)):n(d),m=h.length,g=0;m>g;)f.call(d,p=h[g++])&&(r[p]=d[p]);return r}:c},174:function(e,t){t.f=Object.getOwnPropertySymbols},175:function(e,t){t.f={}.propertyIsEnumerable},176:function(e,t,r){var n=r(33);n(n.S+n.F,"Object",{assign:r(173)})},177:function(e,t,r){t=e.exports=r(20)(),t.push([e.i,".sg-body{margin-top:10px}",""])},178:function(e,t,r){var n,o;r(180),n=r(169);var a=r(179);o=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(o=n=n.default),"function"==typeof o&&(o=o.options),o.render=a.render,o.staticRenderFns=a.staticRenderFns,e.exports=n},179:function(e,t){e.exports={render:function(){var e=this;return e._h("el-row",{staticClass:"sg-body",attrs:{type:"flex",justify:"center"}},[e._h("el-col",{attrs:{span:e.col}},[e._t("default")])])},staticRenderFns:[]}},180:function(e,t,r){var n=r(177);"string"==typeof n&&(n=[[e.i,n,""]]);r(21)(n,{});n.locals&&(e.exports=n.locals)},202:function(e,t,r){"use strict";var n=r(171),o=r.n(n),a=r(178),s=r.n(a),i=r(9);r.n(i);t.default={name:"newTopic",data:function(){return{area:this.$route.params.area,areas:[],captcha:this.$store.state.config.captcha,preview:!1,buttonLoading:!1,form:{title:"",content:"",captcha:"",areaId:void 0},rules:{areaId:[{type:"number",required:!0,message:"请选择区域",trigger:"change"}],title:[{required:!0,message:"请输入文章标题",trigger:"blur"},{min:1,max:20,message:"长度在 1 到 20 个字符",trigger:"blur"}],content:[{required:!0,message:"请输入文章内容",trigger:"blur"},{min:1,message:"长度大于1",trigger:"blur"}]}}},computed:{previewButton:function(){return this.preview?"关闭预览":"实时预览"}},methods:o()({},r.i(i.mapActions)(["post"]),{onSubmit:function(e){var t=this;this.$refs.form.validate(function(e){return e?void t.post({url:"/t/new",data:t.form}).then(function(e){e.result?(t.$router.push("/t/"+e.data.topic.url),t.$message({message:"恭喜你，主题已发布",type:"success"})):t.$message({message:e.message,type:"warning"})}):(t.$message({message:"请填写必要信息",type:"warning"}),!1)})},getData:function(){var e=this;this.post({url:"/base/area"}).then(function(t){t.result?e.areas=t.data.areaList:e.$message.error("请填写必要信息")})},changeAreaChoosed:function(){for(var e=0;e<this.areas.length;e++)if(this.areas[e].abbr==this.area)return void(this.form.areaId=this.areas[e].id);this.$message.error("不存在此区域或此区域无法无法发布主题,请选择其他区域")},shouldChange:function(){return this.area&&this.areas.length>0},showPreview:function(){this.preview=!this.preview,this.preview&&(this.buttonLoading=!0)},rendered:function(){this.buttonLoading=!1}}),watch:{area:function(e,t){this.shouldChange()&&this.changeAreaChoosed()},areas:function(e,t){this.shouldChange()&&this.changeAreaChoosed()}},created:function(){this.getData()},components:{"sg-body":s.a,"sg-markdown":function(e,t){r.e(9).then(function(){var t=[r(197)];e.apply(null,t)}.bind(this)).catch(r.oe)}}}},213:function(e,t,r){t=e.exports=r(20)(),t.push([e.i,".publish{min-height:100px;padding:10px 0;border-radius:.2em;background-color:#fff;margin-bottom:1rem;box-shadow:0 2px 3px rgba(0,0,0,.1);border-bottom:1px solid hsla(0,0%,64%,.31)}.topicContent .el-textarea__inner{min-height:150px}",""])},460:function(e,t){e.exports={render:function(){var e=this;return e._h("sg-body",[e._t("default",[e._h("el-row",{attrs:{type:"flex",justify:"center"}},[e._h("el-col",{attrs:{span:15}},[e._h("el-form",{ref:"form",attrs:{rules:e.rules,"label-position":"left",model:e.form,"label-width":"100px"}},[e._h("el-form-item",{attrs:{label:"区域名称",prop:"areaId"}},[e._h("el-select",{directives:[{name:"model",rawName:"v-model",value:e.form.areaId,expression:"form.areaId"}],attrs:{placeholder:"请选择区域"},domProps:{value:e.form.areaId},on:{input:function(t){e.form.areaId=t}}},[e._l(e.areas,function(t){return e._h("el-option",{attrs:{label:t.name,value:t.id}})})])])," ",e._h("el-form-item",{attrs:{label:"标题",prop:"title"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.title,expression:"form.title"}],domProps:{value:e.form.title},on:{input:function(t){e.form.title=t}}})])," ",e._h("el-form-item",{attrs:{label:"内容",prop:"content"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.content,expression:"form.content"}],staticClass:"topicContent",attrs:{type:"textarea"},domProps:{value:e.form.content},on:{input:function(t){e.form.content=t}}})," ",e.preview?e._h("sg-markdown",{attrs:{sourceOut:e.form.content},on:{rendered:e.rendered}}):e._e()])," ",e.captcha?e._h("el-form-item",{attrs:{label:"验证码",prop:"captcha"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.captcha,expression:"form.captcha"}],domProps:{value:e.form.captcha},on:{input:function(t){e.form.captcha=t}}})]):e._e()," ",e._h("el-form-item",[e._h("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},["立即创建"])," ",e._h("el-button",{attrs:{loading:e.buttonLoading},on:{click:e.showPreview}},[e._s(e.previewButton)])])])])," ",e._h("el-col",{attrs:{span:7,offset:1}},[e._h("el-row",{staticClass:"publish"},[e._h("el-row",{attrs:{col:24}},["\n                        主题发布公告\n                    "])])])])])])},staticRenderFns:[]}},469:function(e,t,r){var n=r(213);"string"==typeof n&&(n=[[e.i,n,""]]);r(21)(n,{});n.locals&&(e.exports=n.locals)},64:function(e,t,r){var n,o;r(469),n=r(202);var a=r(460);o=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(o=n=n.default),"function"==typeof o&&(o=o.options),o.render=a.render,o.staticRenderFns=a.staticRenderFns,e.exports=n}});
//# sourceMappingURL=2.js.map