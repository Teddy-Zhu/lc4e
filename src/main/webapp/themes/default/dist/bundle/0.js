webpackJsonp([0,8,9],{119:function(t,e,a){var r,i;a(398),r=a(254);var o=a(389);i=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(i=r=r.default),"function"==typeof i&&(i=i.options),i.render=o.render,i.staticRenderFns=o.staticRenderFns,t.exports=r},215:function(t,e){e.f={}.propertyIsEnumerable},216:function(t,e){e.f=Object.getOwnPropertySymbols},217:function(t,e,a){"use strict";e.default={name:"sg-body",props:{col:{type:Number,default:20}}}},218:function(t,e,a){t.exports={default:a(220),__esModule:!0}},219:function(t,e,a){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var i=a(218),o=r(i);e.default=o.default||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(t[r]=a[r])}return t}},220:function(t,e,a){a(222),t.exports=a(6).Object.assign},221:function(t,e,a){"use strict";var r=a(108),i=a(216),o=a(215),n=a(109),s=a(110),c=Object.assign;t.exports=!c||a(41)(function(){var t={},e={},a=Symbol(),r="abcdefghijklmnopqrst";return t[a]=7,r.split("").forEach(function(t){e[t]=t}),7!=c({},t)[a]||Object.keys(c({},e)).join("")!=r})?function(t,e){for(var a=n(t),c=arguments.length,l=1,p=i.f,u=o.f;c>l;)for(var d,f=s(arguments[l++]),g=p?r(f).concat(p(f)):r(f),h=g.length,m=0;h>m;)u.call(f,d=g[m++])&&(a[d]=f[d]);return a}:c},222:function(t,e,a){var r=a(40);r(r.S+r.F,"Object",{assign:a(221)})},223:function(t,e,a){e=t.exports=a(21)(),e.push([t.i,".sg-body{margin-top:10px}",""])},224:function(t,e,a){var r,i;a(226),r=a(217);var o=a(225);i=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(i=r=r.default),"function"==typeof i&&(i=i.options),i.render=o.render,i.staticRenderFns=o.staticRenderFns,t.exports=r},225:function(t,e){t.exports={render:function(){var t=this;return t._c("el-row",{staticClass:"sg-body",attrs:{type:"flex",justify:"center"}},[t._c("el-col",{attrs:{span:t.col}},[t._t("default")],2)],1)},staticRenderFns:[]}},226:function(t,e,a){var r=a(223);"string"==typeof r&&(r=[[t.i,r,""]]);a(22)(r,{});r.locals&&(t.exports=r.locals)},227:function(t,e,a){"use strict";e.default={name:"sg-topic-Line",data:function(){return{avatarUrl:preLoadData.userImg}},props:{data:{type:Object}},methods:{getAreaUrl:function(t){return"/a/"+t},getTopicUrl:function(t){return"/t/"+t},getUserUrl:function(t){return"/i/"+t},getAvatar:function(t){return this.avatarUrl.replace("{md5}",t?t:"84fe01dba7e12fbae34fd2b7ea3b18a6")},splitText:function(t){return t?t.split(","):[]},getDate:function(t){return new Date(t).toLocaleString()}},components:{}}},230:function(t,e,a){e=t.exports=a(21)(),e.push([t.i,".el-tag-mini{height:15px;line-height:13px}.topic-author-img-a{display:inline-block;margin:0 5px}.el-tag.clickable{cursor:pointer}.topic-line-img{width:3em;height:3em;cursor:pointer}.topic-table{width:100%}.topic-line{padding:.3em 0;border-bottom:1px solid #c2c8dc;border-left:0 solid #505c6f;transition:box-shadow .5s,border-left 70ms}.topic-line:hover{background-color:#fff;border-left:5px solid #505c6f;box-shadow:0 2px 4px 0 rgba(0,0,0,.12),0 0 6px 0 rgba(0,0,0,.04)}.topic-line-title{word-break:break-all;word-wrap:break-word;display:inline-block;text-align:left;cursor:pointer;font-size:1.1em;line-height:1.1em}.topic-line-title:after{width:100%;height:2px;background-color:#4183c4;content:'';-webkit-transition:all .2s;-webkit-backface-visibility:hidden;transition:all .2s;backface-visibility:hidden;transform:scaleX(0);clear:both;display:block}.topic-line-title:hover:after{transform:scaleX(1)}.topic-line-meta{margin-top:.2em}",""])},234:function(t,e,a){var r,i;a(236),r=a(227);var o=a(235);i=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(i=r=r.default),"function"==typeof i&&(i=i.options),i.render=o.render,i.staticRenderFns=o.staticRenderFns,t.exports=r},235:function(t,e){t.exports={render:function(){var t=this;return t._c("el-row",{staticClass:"topic-line"},[t._c("el-col",{attrs:{span:24}},[t._c("table",{staticClass:"topic-table"},[t._c("tr",[t._c("td",{attrs:{align:"center",width:"10%"}},[t._c("a",{staticClass:"topic-author-img-a"},[t._c("router-link",{staticClass:"topic-line-img",attrs:{to:t.getUserUrl(t.data.authorId),src:t.getAvatar(t.data.authorImg),tag:"img"}})],1)]),t._v(" "),t._c("td",{attrs:{align:"left",width:"75%"}},[t._c("router-link",{staticClass:"topic-line-title",attrs:{to:t.getTopicUrl(t.data.url),tag:"div"}},[t._v("\n                        "+t._s(t.data.title)+"\n                    ")]),t._v(" "),t._c("div",{staticClass:"topic-line-meta"},[t._c("el-breadcrumb",{attrs:{separator:"/"}},[t._c("el-breadcrumb-item",{attrs:{to:{path:t.getAreaUrl(t.data.areaAbbr)}}},[t._c("el-tag",{staticClass:"el-tag-mini",attrs:{type:"primary"}},[t._c("i",{staticClass:"iconfont icon-area"}),t._v(t._s(t.data.areaAbbr)+"\n                                ")])],1),t._v(" "),t._c("el-breadcrumb-item",{attrs:{to:{path:t.getUserUrl(t.data.authorId)}}},[t._c("el-tag",{staticClass:"clickable el-tag-mini",attrs:{type:"gray"}},[t._c("i",{staticClass:"iconfont icon-people"}),t._v(t._s(t.data.authorNick)+"\n                                ")])],1),t._v(" "),t._c("el-breadcrumb-item",[t._c("el-tag",{staticClass:"clickable el-tag-mini",attrs:{type:"gray"}},[t._c("i",{staticClass:"iconfont icon-cmt"}),t._v(t._s(t.data.commentCount)+"\n                                ")])],1),t._v(" "),t._c("el-breadcrumb-item",[t._c("el-tag",{staticClass:"el-tag-mini",attrs:{type:"gray"}},[t._c("i",{staticClass:"iconfont icon-time"}),t._v(t._s(t.getDate(t.data.createTime))+"\n                                ")])],1)],1)],1)],1),t._v(" "),t._c("td",{attrs:{align:"right"}},t._l(t.splitText(t.data.texts),function(e){return t._c("el-tag",{attrs:{type:"warning"}},[t._v(t._s(e)+"\n                    ")])}))])])])],1)},staticRenderFns:[]}},236:function(t,e,a){var r=a(230);"string"==typeof r&&(r=[[t.i,r,""]]);a(22)(r,{});r.locals&&(t.exports=r.locals)},254:function(t,e,a){"use strict";var r=a(219),i=a.n(r),o=a(224),n=a.n(o),s=a(234),c=a.n(s),l=a(14);a.n(l);e.default={name:"area",data:function(){return{topics:[],page:this.$route.params.page?this.$route.params.page:1,area:this.$route.params.area,size:30,total:0,areaDescription:"",orderNow:this.$route.params.order?this.$route.params.order:"1"}},created:function(){this.getData()},computed:a.i(l.mapState)({orders:function(t){return t.order},user:function(t){return t.user}}),watch:{$route:function(t,e){this.updateBaseData(),this.getData()},page:function(t,e){this.getData()}},methods:i()({newTopic:function(){this.$router.push("/t/new/"+this.area)},pageChange:function(t){this.page=t},updateBaseData:function(){this.page=this.$route.params.page?this.$route.params.page:1,this.area=this.$route.params.area,this.orderNow=this.$route.params.order?this.$route.params.order:"1"}},a.i(l.mapActions)(["post"]),{getData:function(){var t="/a/"+this.area+"/"+this.page+"/"+this.orderNow,e=this;e.post({url:"/a/"+this.area+"/info"}).then(function(t){t.result&&(e.areaDescription=t.data.area.description)}),e.post({url:t}).then(function(t){t.result?(e.topics=t.data.topics.result,e.page=t.data.topics.pageNumber,e.total=t.data.topics.totalCount,e.size=t.data.topics.pageSize):e.$message.error(t.message.length>40?t.message.substring(0,40)+"...":t.message)},function(){e.$message.error("数据获取错误")})},nextPage:function(){this.page=this.page+1},prevPage:function(){this.page=this.page-1}}),components:{"sg-body":n.a,"sg-topic-Line":c.a}}},315:function(t,e,a){e=t.exports=a(21)(),e.push([t.i,".el-pagination{background-color:#f2f3f5}.topic-hot-line{margin:5px 0;border-bottom:1px solid #c2c8dc;padding-left:5px;padding-bottom:5px}.topic-hot-line a{display:inline}.topic-hot div:first-child h3{text-align:center;margin:.4em 0}.topic-hot{min-height:100px;padding:10px 0;background-color:#fff;margin-bottom:1rem;border-radius:.2em;box-shadow:0 2px 3px rgba(0,0,0,.1);border-bottom:1px solid hsla(0,0%,64%,.31)}.topic-hot-line a{text-decoration:none;color:#000}.el-select-mini{margin:4px 0;display:inline-block}.el-select-mini .el-input .el-input__inner{height:23px;line-height:24px;background-color:#f2f3f5}.pager-center{text-align:center;margin-top:10px;margin-bottom:10px}.inline-block{display:inline-block;background:#f2f3f5}.br-path{margin:10px 0}.el-col-right{text-align:right;line-height:26px}",""])},389:function(t,e){t.exports={render:function(){var t=this;return t._c("sg-body",[t._t("default",[t._c("el-row",[t._c("el-col",{attrs:{span:15}},[t._c("el-row",{attrs:{type:"flex",justify:"space-between"}},[t._c("el-col",{staticClass:"br-path",attrs:{span:13}},[t._c("el-breadcrumb",{attrs:{separator:">"}},[t._c("el-breadcrumb-item",{attrs:{to:{path:"/"}}},[t._v("首页")]),t._v(" "),t._c("el-breadcrumb-item",{attrs:{to:{path:"/a/"+t.area}}},[t._v(t._s(t.area))])],1)],1),t._v(" "),t._c("el-col",{attrs:{span:10}},[t._c("el-row",{attrs:{type:"flex",justify:"end"}},[t._c("el-col",{staticClass:"el-col-right",attrs:{span:11}},[t.user.id?t._c("el-button",{attrs:{type:"primary",size:"mini",icon:"edit"},on:{click:t.newTopic}},[t._v("\n                                    发布主题\n                                ")]):t._e()],1),t._v(" "),t._c("el-col",{attrs:{span:12,offset:1}},[t._c("el-select",{directives:[{name:"model",rawName:"v-model",value:t.orderNow,expression:"orderNow"}],staticClass:"el-select-mini",domProps:{value:t.orderNow},on:{input:function(e){t.orderNow=e}}},t._l(t.orders,function(e){return t._c("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1)],1)],1)],1),t._v(" "),t._c("el-row",[t._c("el-col",{attrs:{span:24}},t._l(t.topics,function(e){return t._c("sg-topic-Line",{attrs:{data:e}})}))],1),t._v(" "),t._c("el-row",{attrs:{type:"flex",justify:"center"}},[t._c("el-col",{staticClass:"pager-center",attrs:{span:24}},[t._c("el-pagination",{staticClass:"inline-block",attrs:{"current-page":t.page,"page-size":t.size,layout:"prev, pager, next, jumper",total:t.total},on:{"current-change":t.pageChange}})],1)],1)],1),t._v(" "),t._c("el-col",{attrs:{span:7,offset:1}},[t._c("el-row",{staticClass:"topic-hot"},[t._c("el-col",{attrs:{span:24}},[t._c("h3",[t._v(t._s(t.area))])]),t._v(" "),t._c("el-col",{staticClass:"topic-hot-line",attrs:{span:24}},[t._c("p",[t._v(t._s(t.areaDescription))])])],1)],1)],1)])],2)},staticRenderFns:[]}},398:function(t,e,a){var r=a(315);"string"==typeof r&&(r=[[t.i,r,""]]);a(22)(r,{});r.locals&&(t.exports=r.locals)}});