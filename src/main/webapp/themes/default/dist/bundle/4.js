webpackJsonp([4,8,9],{213:function(t,e,a){var n,s;a(402),n=a(264);var r=a(393);s=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(s=n=n.default),"function"==typeof s&&(s=s.options),s.render=r.render,s.staticRenderFns=r.staticRenderFns,s._scopeId="data-v-736c335d",t.exports=n},217:function(t,e){e.f={}.propertyIsEnumerable},218:function(t,e){e.f=Object.getOwnPropertySymbols},219:function(t,e,a){"use strict";e.default={name:"sg-body",props:{col:{type:Number,default:20}}}},220:function(t,e,a){t.exports={default:a(222),__esModule:!0}},221:function(t,e,a){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var s=a(220),r=n(s);e.default=r.default||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n])}return t}},222:function(t,e,a){a(224),t.exports=a(7).Object.assign},223:function(t,e,a){"use strict";var n=a(108),s=a(218),r=a(217),c=a(109),o=a(110),i=Object.assign;t.exports=!i||a(41)(function(){var t={},e={},a=Symbol(),n="abcdefghijklmnopqrst";return t[a]=7,n.split("").forEach(function(t){e[t]=t}),7!=i({},t)[a]||Object.keys(i({},e)).join("")!=n})?function(t,e){for(var a=c(t),i=arguments.length,l=1,d=s.f,u=r.f;i>l;)for(var f,p=o(arguments[l++]),_=d?n(p).concat(d(p)):n(p),v=_.length,b=0;v>b;)u.call(p,f=_[b++])&&(a[f]=p[f]);return a}:i},224:function(t,e,a){var n=a(40);n(n.S+n.F,"Object",{assign:a(223)})},225:function(t,e,a){e=t.exports=a(22)(),e.push([t.i,".sg-body{margin-top:10px}",""])},226:function(t,e,a){var n,s;a(228),n=a(219);var r=a(227);s=n=n||{},"object"!=typeof n.default&&"function"!=typeof n.default||(s=n=n.default),"function"==typeof s&&(s=s.options),s.render=r.render,s.staticRenderFns=r.staticRenderFns,t.exports=n},227:function(t,e){t.exports={render:function(){var t=this;return t._c("el-row",{staticClass:"sg-body",attrs:{type:"flex",justify:"center"}},[t._c("el-col",{attrs:{span:t.col}},[t._t("default")],2)],1)},staticRenderFns:[]}},228:function(t,e,a){var n=a(225);"string"==typeof n&&(n=[[t.i,n,""]]);a(23)(n,{});n.locals&&(t.exports=n.locals)},264:function(t,e,a){"use strict";var n=a(221),s=a.n(n),r=a(226),c=a.n(r),o=a(15);a.n(o);e.default={name:"userInfo",data:function(){return{siteName:preLoadData.siteName,avatarUrl:preLoadData.userImg,id:this.$route.params.id,activeTab:"topics",tabLoading:!1,user:{}}},created:function(){this.getData()},methods:s()({getData:function(){var t=this;this.tabLoading=!0,this.post({url:"/i/"+t.id}).then(function(e){t.tabLoading=!1,e.result?t.user=e.data.user:t.$message.error("获取用户信息失败,请检查网络连接或刷新页面")})},tabClick:function(t,e){this.loadArea(t)},loadArea:function(t){switch(t){case"topics":break;case"":}},getAvatar:function(t){return this.avatarUrl.replace("{md5}",t?t:"84fe01dba7e12fbae34fd2b7ea3b18a6").replace("s=48","s=100")}},a.i(o.mapActions)(["post"])),components:{"sg-body":c.a}}},320:function(t,e,a){e=t.exports=a(22)(),e.push([t.i,".userTabs[data-v-736c335d]{min-height:300px;width:100%}.userInfoTable[data-v-736c335d]{width:100%;border-spacing:0;margin-bottom:1rem}.signTd[data-v-736c335d]{vertical-align:top;background:#fff;border-radius:.3em}.signTd>p[data-v-736c335d]{text-align:left;padding:0 1rem}.imgTd[data-v-736c335d]{text-align:center;vertical-align:middle;width:60px}.sysuserinfo[data-v-736c335d]{text-align:center;font-size:12px;color:grey;padding:4px 0;border:1px dashed grey}",""])},393:function(t,e){t.exports={render:function(){var t=this;return t._c("sg-body",[t._t("default",[t._c("el-row",{attrs:{type:"flex",justify:"center"}},[t._c("el-col",{attrs:{span:23,offset:1}},[t._c("el-row",[t._c("el-col",{attrs:{span:24}},[t._c("table",{staticClass:"userInfoTable"},[t._c("tr",[t._c("td",{staticClass:"imgTd",attrs:{rowspan:"4"}},[t._c("img",{attrs:{src:t.getAvatar(t.user.img)}})]),t._v(" "),t._c("td",{attrs:{width:"200px"}},[t._v("登录名:"+t._s(t.user.name))]),t._v(" "),t._c("td",{staticClass:"signTd",attrs:{width:"300px",rowspan:"4"}},[t._c("p",[t._v(t._s(t.user.sign))])])]),t._v(" "),t._c("tr",[t._c("td",[t._v("昵称:"+t._s(t.user.nick))])]),t._v(" "),t._c("tr",[t._c("td",[t._v("邮箱:"+t._s(t.user.mail))])]),t._v(" "),t._c("tr",[t._c("td",[t._v("\n                                    金币:"+t._s(t.user.balance)+"\n                                ")])]),t._v(" "),t._c("tr",[t._c("td",{attrs:{height:"10px"}})]),t._v(" "),t._c("tr",[t._c("td",{staticClass:"sysuserinfo",attrs:{colspan:"3"}},[t._v(t._s(t.siteName)+"的第"+t._s(t.user.id)+"个会员")])])])]),t._v(" "),t._c("el-col",{attrs:{span:24}},[t._c("el-tabs",{directives:[{name:"loading",rawName:"v-loading",value:t.tabLoading,expression:"tabLoading"}],staticClass:"userTabs",attrs:{"active-name":t.activeTab,type:"border-card"},on:{"tab-click":t.tabClick}},[t._c("el-tab-pane",{attrs:{label:"主题列表",name:"topics"}},[t._v("\n                                主题列表\n                            ")]),t._v(" "),t._c("el-tab-pane",{attrs:{label:"回复列表",name:"comments"}},[t._v("\n                                回复列表\n                            ")]),t._v(" "),t._c("el-tab-pane",{attrs:{label:"收藏区域",name:"collectArea"}},[t._v("\n                                收藏区域\n                            ")]),t._v(" "),t._c("el-tab-pane",{attrs:{label:"收藏主题",name:"collectTopic"}},[t._v("\n                                收藏主题\n                            ")]),t._v(" "),t._c("el-tab-pane",{attrs:{label:"点赞主题主题",name:"supportTopic"}},[t._v("\n                                点赞主题主题\n                            ")]),t._v(" "),t._c("el-tab-pane",{attrs:{label:"社会化",name:"social"}},[t._v("\n                                社会化\n                            ")])],1)],1)],1)],1)],1)])],2)},staticRenderFns:[]}},402:function(t,e,a){var n=a(320);"string"==typeof n&&(n=[[t.i,n,""]]);a(23)(n,{});n.locals&&(t.exports=n.locals)}});