webpackJsonp([10],{104:function(t,e,a){"use strict";e.default={name:"sg-body",props:{col:{type:Number,default:20}}}},105:function(t,e,a){e=t.exports=a(8)(),e.push([t.i,".sg-body{margin-top:10px}",""])},106:function(t,e,a){var i,r;a(108),i=a(104);var o=a(107);r=i=i||{},"object"!=typeof i.default&&"function"!=typeof i.default||(r=i=i.default),"function"==typeof r&&(r=r.options),r.render=o.render,r.staticRenderFns=o.staticRenderFns,t.exports=i},107:function(t,e){t.exports={render:function(){var t=this;return t._h("el-row",{staticClass:"sg-body",attrs:{type:"flex",justify:"center"}},[t._h("el-col",{attrs:{span:t.col}},[t._t("default")])])},staticRenderFns:[]}},108:function(t,e,a){var i=a(105);"string"==typeof i&&(i=[[t.i,i,""]]);a(9)(i,{});i.locals&&(t.exports=i.locals)},109:function(t,e,a){"use strict";var i=a(14),r=a.n(i);e.default={name:"sg-topic-Line",data:function(){return{avatarUrl:preLoadData.userImg}},props:{data:{type:Object}},methods:{getAreaUrl:function(t){return"/a/"+t},getTopicUrl:function(t){return"/t/"+t},getUserUrl:function(t){return"/i/"+t},getAvatar:function(t){return this.avatarUrl.replace("{md5}",r()(t))},splitText:function(t){return t?t.split(","):[]},getDate:function(t){return new Date(t).toLocaleString()}},components:{}}},110:function(t,e,a){e=t.exports=a(8)(),e.push([t.i,".el-tag-mini{height:12px;line-height:12px}.topic-author-img-a{display:inline-block;margin:0 5px}.el-tag.clickable{cursor:pointer}.topic-line-img{width:3em;height:3em}.topic-table{width:100%}.topic-line{padding:.3em 0;border-bottom:1px solid #c2c8dc;border-left:0 solid #505c6f;transition:box-shadow .5s,border-left 70ms}.topic-line:hover{background-color:#fff;border-left:5px solid #505c6f;box-shadow:2px 4px 6px rgba(29,26,26,.3)}.topic-line-title{word-break:break-all;word-wrap:break-word;display:inline-block;text-align:left;cursor:pointer;font-size:1.1em;line-height:1.1em}.topic-line-title:after{width:100%;height:2px;background-color:#4183c4;content:'';-webkit-transition:all .2s;-webkit-backface-visibility:hidden;transition:all .2s;backface-visibility:hidden;transform:scaleX(0);clear:both;display:block}.topic-line-title:hover:after{transform:scaleX(1)}.topic-line-meta{margin-top:.2em}",""])},114:function(t,e,a){var i,r;a(116),i=a(109);var o=a(115);r=i=i||{},"object"!=typeof i.default&&"function"!=typeof i.default||(r=i=i.default),"function"==typeof r&&(r=r.options),r.render=o.render,r.staticRenderFns=o.staticRenderFns,t.exports=i},115:function(t,e){t.exports={render:function(){var t=this;return t._h("el-row",{staticClass:"topic-line"},[t._h("el-col",{attrs:{span:24}},[t._h("table",{staticClass:"topic-table"},[t._h("tr",[t._h("td",{attrs:{align:"center",width:"10%"}},[t._h("a",{staticClass:"topic-author-img-a"},[t._h("img",{staticClass:"topic-line-img",attrs:{src:t.getAvatar(t.data.authorMail)}})])])," ",t._h("td",{attrs:{align:"left",width:"75%"}},[t._h("router-link",{staticClass:"topic-line-title",attrs:{to:t.getTopicUrl(t.data.url),tag:"div"}},["\n                        "+t._s(t.data.title)+"\n                    "])," ",t._h("div",{staticClass:"topic-line-meta"},[t._h("el-breadcrumb",{attrs:{separator:"/"}},[t._h("el-breadcrumb-item",{attrs:{to:{path:t.getAreaUrl(t.data.areaAbbr)}}},[t._h("el-tag",{staticClass:"el-tag-mini",attrs:{type:"primary"}},[t._h("i",{staticClass:"iconfont icon-area"}),t._s(t.data.areaAbbr)+"\n                                "])])," ",t._h("el-breadcrumb-item",{attrs:{to:{path:t.getUserUrl(t.data.authorId)}}},[t._h("el-tag",{staticClass:"clickable el-tag-mini",attrs:{type:"gray"}},[t._h("i",{staticClass:"iconfont icon-people"}),t._s(t.data.authorNick)+"\n                                "])])," ",t._h("el-breadcrumb-item",[t._h("el-tag",{staticClass:"clickable el-tag-mini",attrs:{type:"gray"}},[t._h("i",{staticClass:"iconfont icon-cmt"}),t._s(t.data.commentCount)+"\n                                "])])," ",t._h("el-breadcrumb-item",[t._h("el-tag",{staticClass:"el-tag-mini",attrs:{type:"gray"}},[t._h("i",{staticClass:"iconfont icon-time"}),t._s(t.getDate(t.data.createTime))+"\n                                "])])])])])," ",t._h("td",{attrs:{align:"right"}},[t._l(t.splitText(t.data.texts),function(e){return t._h("el-tag",{attrs:{type:"warning"}},[t._s(e)+"\n                    "])})])])])])])},staticRenderFns:[]}},116:function(t,e,a){var i=a(110);"string"==typeof i&&(i=[[t.i,i,""]]);a(9)(i,{});i.locals&&(t.exports=i.locals)},128:function(t,e,a){"use strict";var i=a(106),r=a.n(i),o=a(114),s=a.n(o),n=a(4);a.n(n);e.default={name:"index",data:function(){return{topics:[],page:this.$route.params.page?parseInt(this.$route.params.page):1,size:20,total:0,orderNow:this.$route.params.order?this.$route.params.order:"1",hots:[{area:"c++",link:"/asd",title:"xx"},{area:"c++",link:"/asd",title:"casasdassss"},{area:"c++",link:"/asd",title:"asds"},{area:"c++",link:"/asd",title:"asds"}]}},computed:a.i(n.mapState)({orders:function(t){return t.order}}),created:function(){this.getData()},watch:{$route:function(){this.updateBaseData(),this.getData()},page:function(t,e){this.getData()},orderNow:function(t,e){this.getData()}},methods:{pageChange:function(t){this.page=t},updateBaseData:function(){this.page=this.$route.params.page?this.$route.params.page:1,this.orderNow=this.$route.params.order?this.$route.params.order:"1"},getData:function(){var t=this,e="/a/all/"+this.page+"/"+this.orderNow;this.$http.post(e).then(function(e){e.data.result?(t.topics=e.data.data.topics.result,t.page=e.data.data.topics.pageNumber,t.total=e.data.data.topics.totalCount,t.size=e.data.data.topics.pageSize):t.$message.error(e.data.message.length>40?e.data.message.substring(0,40)+"...":e.data.message)},function(e){t.$message.error("数据获取错误")})},nextPage:function(){this.page=this.page+1},prevPage:function(){this.page=this.page-1}},components:{"sg-body":r.a,"sg-topic-Line":s.a}}},140:function(t,e,a){e=t.exports=a(8)(),e.push([t.i,".topic-hot-line{margin:5px 0;border-bottom:1px solid #c2c8dc;padding-left:5px;padding-bottom:5px}.topic-hot-line a{display:inline}.topic-hot div:first-child h3{text-align:center;margin:.4em 0}.topic-hot{min-height:100px;padding:10px 0;border-radius:.2em;box-shadow:0 2px 3px rgba(0,0,0,.1);border-bottom:1px solid hsla(0,0%,64%,.31)}.topic-hot-line a{text-decoration:none;color:#000}.el-select-mini{margin:4px 0;display:inline-block}.el-select-mini .el-input input{height:24px;line-height:23px;background-color:#f2f3f5}.pager-center{text-align:center;margin-top:10px;margin-bottom:10px}.inline-block{display:inline-block}.br-path{margin:10px 0}.el-pagination{background-color:#f2f3f5}",""])},29:function(t,e,a){var i,r;a(394),i=a(128);var o=a(386);r=i=i||{},"object"!=typeof i.default&&"function"!=typeof i.default||(r=i=i.default),"function"==typeof r&&(r=r.options),r.render=o.render,r.staticRenderFns=o.staticRenderFns,t.exports=i},386:function(t,e){t.exports={render:function(){var t=this;return t._h("sg-body",[t._t("default",[t._h("el-row",[t._h("el-col",{attrs:{span:15}},[t._h("el-row",{attrs:{type:"flex",justify:"space-between"}},[t._h("el-col",{staticClass:"br-path",attrs:{span:13}},[t._h("el-breadcrumb",{attrs:{separator:">"}},[t._h("el-breadcrumb-item",{attrs:{to:{path:"/"}}},["首页"])])])," ",t._h("el-col",{attrs:{span:5}},[t._h("el-select",{directives:[{name:"model",rawName:"v-model",value:t.orderNow,expression:"orderNow"}],staticClass:"el-select-mini",attrs:{size:"mini"},domProps:{value:t.orderNow},on:{input:function(e){t.orderNow=e}}},[t._l(t.orders,function(e){return t._h("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})])])])," ",t._h("el-row",[t._h("el-col",{attrs:{span:24}},[t._l(t.topics,function(e){return t._h("sg-topic-Line",{attrs:{data:e}})})])])," ",t._h("el-row",{attrs:{type:"flex",justify:"center"}},[t._h("el-col",{staticClass:"pager-center",attrs:{span:24}},[t._h("el-pagination",{staticClass:"inline-block",attrs:{"current-page":t.page,"page-size":t.size,layout:"prev, pager, next, jumper",total:t.total},on:{"current-change":t.pageChange}})])])])," ",t._h("el-col",{attrs:{span:7,offset:1}},[t._h("el-row",{staticClass:"topic-hot"},[t._h("el-col",{attrs:{span:24}},[t._h("h3",["Topic Hot"])])," ",t._l(t.hots,function(e){return t._h("el-col",{staticClass:"topic-hot-line",attrs:{span:24}},[t._h("el-tag",{attrs:{type:"primary"}},[t._h("router-link",{attrs:{tag:"a",to:"/a/"+e.area}},[t._s(e.area)])])," ",t._h("router-link",{attrs:{tag:"a",to:e.link}},[t._s(e.title)])])})])])])])])},staticRenderFns:[]}},394:function(t,e,a){var i=a(140);"string"==typeof i&&(i=[[t.i,i,""]]);a(9)(i,{});i.locals&&(t.exports=i.locals)}});
//# sourceMappingURL=10.js.map