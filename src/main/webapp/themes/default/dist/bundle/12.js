webpackJsonp([12],{402:function(n,t){function e(n,t,e){var i=n.attrIndex(t),c=[t,e];i<0?n.attrPush(c):n.attrs[i]=c}function i(n,t){for(var e=n[t].level-1,i=t-1;i>=0;i--)if(n[i].level===e)return i;return-1}function c(n,t){return s(n[t])&&a(n[t-1])&&f(n[t-2])&&h(n[t])}function r(n,t){n.children.unshift(o(n,t)),n.children[1].content=n.children[1].content.slice(3),n.content=n.content.slice(3),p&&(n.children.unshift(l(t)),n.children.push(u(t)))}function o(n,t){var e=new t("html_inline","",0),i=d?' disabled="" ':"";return 0===n.content.indexOf("[ ] ")?e.content='<input class="task-list-item-checkbox"'+i+'type="checkbox">':0!==n.content.indexOf("[x] ")&&0!==n.content.indexOf("[X] ")||(e.content='<input class="task-list-item-checkbox" checked=""'+i+'type="checkbox">'),e}function l(n){var t=new n("html_inline","",0);return t.content="<label>",t}function u(n){var t=new n("html_inline","",0);return t.content="</label>",t}function s(n){return"inline"===n.type}function a(n){return"paragraph_open"===n.type}function f(n){return"list_item_open"===n.type}function h(n){return 0===n.content.indexOf("[ ] ")||0===n.content.indexOf("[x] ")||0===n.content.indexOf("[X] ")}var d=!0,p=!1;n.exports=function(n,t){t&&(d=!t.enabled,p=!!t.label),n.core.ruler.after("inline","github-task-lists",function(n){for(var t=n.tokens,o=2;o<t.length;o++)c(t,o)&&(r(t[o],n.Token),e(t[o-2],"class","task-list-item"),e(t[i(t,o-2)],"class","task-list"))})}}});
//# sourceMappingURL=12.js.map