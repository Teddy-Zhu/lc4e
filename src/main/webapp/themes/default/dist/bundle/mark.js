webpackJsonp([13],{196:function(e,n){"use strict";e.exports=function(e){function n(e,n){var t,o,r,s,k,i=e.pos,p=e.src.charCodeAt(i);if(n)return!1;if(61!==p)return!1;if(o=e.scanDelims(e.pos,!0),s=o.length,k=String.fromCharCode(p),s<2)return!1;for(s%2&&(r=e.push("text","",0),r.content=k,s--),t=0;t<s;t+=2)r=e.push("text","",0),r.content=k+k,e.delimiters.push({marker:p,jump:t,token:e.tokens.length-1,level:e.level,end:-1,open:o.can_open,close:o.can_close});return e.pos+=o.length,!0}function t(e){var n,t,o,r,s,k=[],i=e.delimiters,p=e.delimiters.length;for(n=0;n<p;n++)o=i[n],61===o.marker&&o.end!==-1&&(r=i[o.end],s=e.tokens[o.token],s.type="mark_open",s.tag="mark",s.nesting=1,s.markup="==",s.content="",s=e.tokens[r.token],s.type="mark_close",s.tag="mark",s.nesting=-1,s.markup="==",s.content="","text"===e.tokens[r.token-1].type&&"="===e.tokens[r.token-1].content&&k.push(r.token-1));for(;k.length;){for(n=k.pop(),t=n+1;t<e.tokens.length&&"mark_close"===e.tokens[t].type;)t++;t--,n!==t&&(s=e.tokens[t],e.tokens[t]=e.tokens[n],e.tokens[n]=s)}}e.inline.ruler.before("emphasis","mark",n),e.inline.ruler2.before("emphasis","mark",t)}}});