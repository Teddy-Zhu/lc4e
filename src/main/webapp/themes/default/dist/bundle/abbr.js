webpackJsonp([15],{193:function(e,n){"use strict";e.exports=function(e){function n(e,n,t,r){var i,a,s,o,c,l=e.bMarks[n]+e.tShift[n],b=e.eMarks[n];if(l+2>=b)return!1;if(42!==e.src.charCodeAt(l++))return!1;if(91!==e.src.charCodeAt(l++))return!1;for(o=l;l<b;l++){if(s=e.src.charCodeAt(l),91===s)return!1;if(93===s){c=l;break}92===s&&l++}return!(c<0||58!==e.src.charCodeAt(c+1))&&(!!r||(i=e.src.slice(o,c).replace(/\\(.)/g,"$1"),a=e.src.slice(c+2,b).trim(),0!==i.length&&(0!==a.length&&(e.env.abbreviations||(e.env.abbreviations={}),"undefined"==typeof e.env.abbreviations[":"+i]&&(e.env.abbreviations[":"+i]=a),e.line=n+1,!0))))}function t(e){var n,t,c,l,b,u,f,p,h,v,g,d,k,x=e.tokens;if(e.env.abbreviations)for(d=new RegExp("(?:"+Object.keys(e.env.abbreviations).map(function(e){return e.substr(1)}).sort(function(e,n){return n.length-e.length}).map(r).join("|")+")"),g="(^|"+s+"|"+o+"|["+a.split("").map(r).join("")+"])("+Object.keys(e.env.abbreviations).map(function(e){return e.substr(1)}).sort(function(e,n){return n.length-e.length}).map(r).join("|")+")($|"+s+"|"+o+"|["+a.split("").map(r).join("")+"])",h=new RegExp(g,"g"),t=0,c=x.length;t<c;t++)if("inline"===x[t].type)for(l=x[t].children,n=l.length-1;n>=0;n--)if(k=l[n],"text"===k.type&&(p=0,u=k.content,h.lastIndex=0,f=[],d.test(u))){for(;v=h.exec(u);)(v.index>0||v[1].length>0)&&(b=new e.Token("text","",0),b.content=u.slice(p,v.index+v[1].length),f.push(b)),b=new e.Token("abbr_open","abbr",1),b.attrs=[["title",e.env.abbreviations[":"+v[2]]]],f.push(b),b=new e.Token("text","",0),b.content=v[2],f.push(b),b=new e.Token("abbr_close","abbr",-1),f.push(b),h.lastIndex-=v[3].length,p=h.lastIndex;f.length&&(p<u.length&&(b=new e.Token("text","",0),b.content=u.slice(p),f.push(b)),x[t].children=l=i(l,n,f))}}var r=e.utils.escapeRE,i=e.utils.arrayReplaceAt,a=" \r\n$+<=>^`|~",s=e.utils.lib.ucmicro.P.source,o=e.utils.lib.ucmicro.Z.source;e.block.ruler.before("reference","abbr_def",n,{alt:["paragraph","reference"]}),e.core.ruler.after("linkify","abbr_replace",t)}}});