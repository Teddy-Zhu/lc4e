webpackJsonp([5],{101:function(e,r,t){var o,a;t(400),o=t(132);var s=t(391);a=o=o||{},"object"!=typeof o.default&&"function"!=typeof o.default||(a=o=o.default),"function"==typeof a&&(a=a.options),a.render=s.render,a.staticRenderFns=s.staticRenderFns,e.exports=o},105:function(e,r,t){"use strict";r.default={name:"sg-body",props:{col:{type:Number,default:20}}}},106:function(e,r,t){r=e.exports=t(8)(),r.push([e.i,".sg-body{margin-top:10px}",""])},107:function(e,r,t){var o,a;t(109),o=t(105);var s=t(108);a=o=o||{},"object"!=typeof o.default&&"function"!=typeof o.default||(a=o=o.default),"function"==typeof a&&(a=a.options),a.render=s.render,a.staticRenderFns=s.staticRenderFns,e.exports=o},108:function(e,r){e.exports={render:function(){var e=this;return e._h("el-row",{staticClass:"sg-body",attrs:{type:"flex",justify:"center"}},[e._h("el-col",{attrs:{span:e.col}},[e._t("default")])])},staticRenderFns:[]}},109:function(e,r,t){var o=t(106);"string"==typeof o&&(o=[[e.i,o,""]]);t(9)(o,{});o.locals&&(e.exports=o.locals)},132:function(e,r,t){"use strict";var o=t(107),a=t.n(o),s=t(4),n=(t.n(s),Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e});r.default={name:"register",data:function(){var e=this,r=function(r,t,o){""===t?o(new Error("请再次输入密码")):t!==e.form.password?o(new Error("两次输入密码不一致!")):o()},t=function(r,t,o){e.validate("name",t,o)},o=function(r,t,o){e.validate("nick",t,o)},a=function(r,t,o){return new RegExp("^([0-9a-z_.-]+)@([0-9a-z.-]+).([a-z]{2,6})$").test(t)?void e.validate("mail",t,o):void o(new Error("邮箱格式不正确"))};return{validateInterval:void 0,form:{webPre:"https://",name:"",mail:"",nick:"",password:"",rpassword:"",captcha:"",webBody:"",phone:"",birth:"",web:""},rules:{name:[{required:!0,message:"请输入用户名称",trigger:"blur"},{min:4,max:10,message:"长度在 4 到 10 个字符",trigger:"blur"},{validator:t}],nick:[{required:!0,message:"请输入用户昵称",trigger:"blur"},{min:4,max:10,message:"长度在 4 到 10 个字符",trigger:"blur"},{validator:o,trigger:"blur"}],mail:[{required:!0,message:"请输入用户邮箱",trigger:"blur"},{validator:a,trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,max:20,message:"长度在 6 到 20 个字符",trigger:"blur"}],rpassword:[{required:!0,message:"请再次输入密码",trigger:"blur"},{validator:r}],captcha:[{min:4,max:4,message:"长度只能为4",trigger:"blur"}]},captcha:this.$store.state.config.captcha}},methods:n({reset:function(){this.$refs.form.resetFields()},getFormData:function(){var e=this.form;return e.web=e.webPre+e.webBody,e},onSubmit:function(e){var r=this;this.$refs.form.validate(function(e){return e?void r.post({url:"/u/register",data:r.getFormData()}).then(function(e){e.result?(r.$router.push("/u/login"),r.$notify({title:"注册成功",message:"感谢注册,请继续登陆",type:"success"})):r.$message.error(response.data.message.length>40?response.data.message.substring(0,40)+"...":response.data.message)}):(this.$message({message:"请填写必要信息",type:"warning"}),!1)})}},t.i(s.mapActions)(["post"]),{validate:function(e,r,t){var o=this;o.validateInterval&&clearTimeout(o.validateInterval),o.validateInterval=setTimeout(function(){o.post({url:"/su/"+e,data:{name:r}}).then(function(e){e.result?t():t(new Error(e.message.length>40?e.message.substring(0,40)+"...":e.message))})},400)}}),components:{"sg-body":a.a}}},144:function(e,r,t){r=e.exports=t(8)(),r.push([e.i,".web-select .el-input{width:95px}.formStyle{background:#fff;box-shadow:0 2px 4px 1px rgba(0,0,0,.25);padding:3rem 3rem 1.1rem;margin:2rem;border-radius:.2rem}",""])},391:function(e,r){e.exports={render:function(){var e=this;return e._h("sg-body",[e._t("default",[e._h("el-row",{attrs:{type:"flex",justify:"center"}},[e._h("el-col",{staticClass:"formStyle",attrs:{span:10}},[e._h("el-form",{ref:"form",attrs:{rules:e.rules,model:e.form,"label-position":"left","label-width":"6rem"}},[e._h("el-form-item",{attrs:{label:"用户名",prop:"name"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.name,expression:"form.name"}],domProps:{value:e.form.name},on:{input:function(r){e.form.name=r}}})])," ",e._h("el-form-item",{attrs:{label:"密码",prop:"password"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.password,expression:"form.password"}],attrs:{type:"password"},domProps:{value:e.form.password},on:{input:function(r){e.form.password=r}}})])," ",e._h("el-form-item",{attrs:{label:"重复密码",prop:"rpassword"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.rpassword,expression:"form.rpassword"}],attrs:{type:"password"},domProps:{value:e.form.rpassword},on:{input:function(r){e.form.rpassword=r}}})])," ",e._h("el-form-item",{attrs:{label:"昵称",prop:"nick"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.nick,expression:"form.nick"}],domProps:{value:e.form.nick},on:{input:function(r){e.form.nick=r}}})])," ",e._h("el-form-item",{attrs:{label:"邮箱",prop:"mail"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.mail,expression:"form.mail"}],domProps:{value:e.form.mail},on:{input:function(r){e.form.mail=r}}})])," ",e.captcha?e._h("el-form-item",{attrs:{label:"验证码",prop:"captcha"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.captcha,expression:"form.captcha"}],domProps:{value:e.form.captcha},on:{input:function(r){e.form.captcha=r}}})]):e._e()," ",e._h("el-form-item",{attrs:{label:"个人网页",prop:"web"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.webBody,expression:"form.webBody"}],domProps:{value:e.form.webBody},on:{input:function(r){e.form.webBody=r}}},[e._h("el-select",{directives:[{name:"model",rawName:"v-model",value:e.form.webPre,expression:"form.webPre"}],staticClass:"web-select",domProps:{value:e.form.webPre},on:{input:function(r){e.form.webPre=r}},slot:"prepend"},[e._h("el-option",{key:"https://",attrs:{label:"https://",value:"https://"}})," ",e._h("el-option",{key:"http://",attrs:{label:"http://",value:"http://"}})])])])," ",e._h("el-form-item",{attrs:{label:"电话",prop:"phone"}},[e._h("el-input",{directives:[{name:"model",rawName:"v-model",value:e.form.phone,expression:"form.phone"}],domProps:{value:e.form.phone},on:{input:function(r){e.form.phone=r}}})])," ",e._h("el-form-item",{attrs:{label:"生日",prop:"birth"}},[e._h("el-date-picker",{directives:[{name:"model",rawName:"v-model",value:e.form.birth,expression:"form.birth"}],staticStyle:{width:"100%"},attrs:{type:"date",placeholder:"选择日期"},domProps:{value:e.form.birth},on:{input:function(r){e.form.birth=r}}})])," ",e._h("el-form-item",[e._h("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},["注册"])," ",e._h("el-button",{on:{click:e.reset}},["重置"])])])])])])])},staticRenderFns:[]}},400:function(e,r,t){var o=t(144);"string"==typeof o&&(o=[[e.i,o,""]]);t(9)(o,{});o.locals&&(e.exports=o.locals)}});
//# sourceMappingURL=5.js.map