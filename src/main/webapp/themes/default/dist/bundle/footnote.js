webpackJsonp([14],{195:function(e,o){"use strict";function t(e,o,t,n){var r=Number(e[o].meta.id+1).toString(),s="";return"string"==typeof n.docId&&(s="-"+n.docId+"-"),s+r}function n(e,o){var t=Number(e[o].meta.id+1).toString();return e[o].meta.subId>0&&(t+=":"+e[o].meta.subId),"["+t+"]"}function r(e,o,t,n,r){var s=r.rules.footnote_anchor_name(e,o,t,n,r),f=r.rules.footnote_caption(e,o,t,n,r),a=s;return e[o].meta.subId>0&&(a+=":"+e[o].meta.subId),'<sup class="footnote-ref"><a href="#fn'+s+'" id="fnref'+a+'">'+f+"</a></sup>"}function s(e,o,t){return(t.xhtmlOut?'<hr class="footnotes-sep" />\n':'<hr class="footnotes-sep">\n')+'<section class="footnotes">\n<ol class="footnotes-list">\n'}function f(){return"</ol>\n</section>\n"}function a(e,o,t,n,r){var s=r.rules.footnote_anchor_name(e,o,t,n,r);return e[o].meta.subId>0&&(s+=":"+e[o].meta.subId),'<li id="fn'+s+'" class="footnote-item">'}function l(){return"</li>\n"}function c(e,o,t,n,r){var s=r.rules.footnote_anchor_name(e,o,t,n,r);return e[o].meta.subId>0&&(s+=":"+e[o].meta.subId),' <a href="#fnref'+s+'" class="footnote-backref">↩︎</a>'}e.exports=function(e){function o(e,o,t,n){var r,s,f,a,l,c,u,i,p,d,k,b=e.bMarks[o]+e.tShift[o],_=e.eMarks[o];if(b+4>_)return!1;if(91!==e.src.charCodeAt(b))return!1;if(94!==e.src.charCodeAt(b+1))return!1;for(l=b+2;l<_;l++){if(32===e.src.charCodeAt(l))return!1;if(93===e.src.charCodeAt(l))break}if(l===b+2)return!1;if(l+1>=_||58!==e.src.charCodeAt(++l))return!1;if(n)return!0;for(l++,e.env.footnotes||(e.env.footnotes={}),e.env.footnotes.refs||(e.env.footnotes.refs={}),c=e.src.slice(b+2,l-2),e.env.footnotes.refs[":"+c]=-1,u=new e.Token("footnote_reference_open","",1),u.meta={label:c},u.level=e.level++,e.tokens.push(u),r=e.bMarks[o],s=e.tShift[o],f=e.sCount[o],a=e.parentType,k=l,i=p=e.sCount[o]+l-(e.bMarks[o]+e.tShift[o]);l<_&&(d=e.src.charCodeAt(l),h(d));)9===d?p+=4-p%4:p++,l++;return e.tShift[o]=l-k,e.sCount[o]=p-i,e.bMarks[o]=k,e.blkIndent+=4,e.parentType="footnote",e.sCount[o]<e.blkIndent&&(e.sCount[o]+=e.blkIndent),e.md.block.tokenize(e,o,t,!0),e.parentType=a,e.blkIndent-=4,e.tShift[o]=s,e.sCount[o]=f,e.bMarks[o]=r,u=new e.Token("footnote_reference_close","",-1),u.level=--e.level,e.tokens.push(u),!0}function u(e,o){var t,n,r,s,f,a=e.posMax,l=e.pos;return!(l+2>=a)&&(94===e.src.charCodeAt(l)&&(91===e.src.charCodeAt(l+1)&&(t=l+2,n=d(e,l+1),!(n<0)&&(o||(e.env.footnotes||(e.env.footnotes={}),e.env.footnotes.list||(e.env.footnotes.list=[]),r=e.env.footnotes.list.length,e.md.inline.parse(e.src.slice(t,n),e.md,e.env,f=[]),s=e.push("footnote_ref","",0),s.meta={id:r},e.env.footnotes.list[r]={tokens:f}),e.pos=n+1,e.posMax=a,!0))))}function i(e,o){var t,n,r,s,f,a=e.posMax,l=e.pos;if(l+3>a)return!1;if(!e.env.footnotes||!e.env.footnotes.refs)return!1;if(91!==e.src.charCodeAt(l))return!1;if(94!==e.src.charCodeAt(l+1))return!1;for(n=l+2;n<a;n++){if(32===e.src.charCodeAt(n))return!1;if(10===e.src.charCodeAt(n))return!1;if(93===e.src.charCodeAt(n))break}return n!==l+2&&(!(n>=a)&&(n++,t=e.src.slice(l+2,n-1),"undefined"!=typeof e.env.footnotes.refs[":"+t]&&(o||(e.env.footnotes.list||(e.env.footnotes.list=[]),e.env.footnotes.refs[":"+t]<0?(r=e.env.footnotes.list.length,e.env.footnotes.list[r]={label:t,count:0},e.env.footnotes.refs[":"+t]=r):r=e.env.footnotes.refs[":"+t],s=e.env.footnotes.list[r].count,e.env.footnotes.list[r].count++,f=e.push("footnote_ref","",0),f.meta={id:r,subId:s,label:t}),e.pos=n,e.posMax=a,!0)))}function p(e){var o,t,n,r,s,f,a,l,c,u,i=!1,p={};if(e.env.footnotes&&(e.tokens=e.tokens.filter(function(e){return"footnote_reference_open"===e.type?(i=!0,c=[],u=e.meta.label,!1):"footnote_reference_close"===e.type?(i=!1,p[":"+u]=c,!1):(i&&c.push(e),!i)}),e.env.footnotes.list)){for(f=e.env.footnotes.list,a=new e.Token("footnote_block_open","",1),e.tokens.push(a),o=0,t=f.length;o<t;o++){for(a=new e.Token("footnote_open","",1),a.meta={id:o,label:f[o].label},e.tokens.push(a),f[o].tokens?(l=[],a=new e.Token("paragraph_open","p",1),a.block=!0,l.push(a),a=new e.Token("inline","",0),a.children=f[o].tokens,a.content="",l.push(a),a=new e.Token("paragraph_close","p",-1),a.block=!0,l.push(a)):f[o].label&&(l=p[":"+f[o].label]),e.tokens=e.tokens.concat(l),s="paragraph_close"===e.tokens[e.tokens.length-1].type?e.tokens.pop():null,r=f[o].count>0?f[o].count:1,n=0;n<r;n++)a=new e.Token("footnote_anchor","",0),a.meta={id:o,subId:n,label:f[o].label},e.tokens.push(a);s&&e.tokens.push(s),a=new e.Token("footnote_close","",-1),e.tokens.push(a)}a=new e.Token("footnote_block_close","",-1),e.tokens.push(a)}}var d=e.helpers.parseLinkLabel,h=e.utils.isSpace;e.renderer.rules.footnote_ref=r,e.renderer.rules.footnote_block_open=s,e.renderer.rules.footnote_block_close=f,e.renderer.rules.footnote_open=a,e.renderer.rules.footnote_close=l,e.renderer.rules.footnote_anchor=c,e.renderer.rules.footnote_caption=n,e.renderer.rules.footnote_anchor_name=t,e.block.ruler.before("reference","footnote_def",o,{alt:["paragraph","reference"]}),e.inline.ruler.after("image","footnote_inline",u),e.inline.ruler.after("footnote_inline","footnote_ref",i),e.core.ruler.after("inline","footnote_tail",p)}}});