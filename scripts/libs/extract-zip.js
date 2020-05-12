// extract-zip@2.0.0
//
// Copyright (c) 2014 Max Ogden and other contributors
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.
//
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).extractZip=e()}}((function(){return function e(t,r,n){function i(s,a){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(o)return o(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var f=r[s]={exports:{}};t[s][0].call(f.exports,(function(e){return i(t[s][1][e]||e)}),f,f.exports,e,t,r,n)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(e,t,r){const n=e("debug")("extract-zip"),{createWriteStream:i,promises:o}=e("fs"),s=e("get-stream"),a=e("path"),{promisify:c}=e("util"),u=e("stream"),f=e("yauzl"),l=c(f.open),d=c(u.pipeline);class p{constructor(e,t){this.zipPath=e,this.opts=t}async extract(){return n("opening",this.zipPath,"with opts",this.opts),this.zipfile=await l(this.zipPath,{lazyEntries:!0}),this.canceled=!1,new Promise((e,t)=>{this.zipfile.on("error",e=>{this.canceled=!0,t(e)}),this.zipfile.readEntry(),this.zipfile.on("close",()=>{this.canceled||(n("zip extraction complete"),e())}),this.zipfile.on("entry",async e=>{if(this.canceled)return void n("skipping entry",e.fileName,{cancelled:this.canceled});if(n("zipfile entry",e.fileName),e.fileName.startsWith("__MACOSX/"))return void this.zipfile.readEntry();const r=a.dirname(a.join(this.opts.dir,e.fileName));try{await o.mkdir(r,{recursive:!0});const t=await o.realpath(r);if(a.relative(this.opts.dir,t).split(a.sep).includes(".."))throw new Error(`Out of bound path "${t}" found while processing file ${e.fileName}`);await this.extractEntry(e),n("finished processing",e.fileName),this.zipfile.readEntry()}catch(e){this.canceled=!0,this.zipfile.close(),t(e)}})})}async extractEntry(e){if(this.canceled)return void n("skipping entry extraction",e.fileName,{cancelled:this.canceled});this.opts.onEntry&&this.opts.onEntry(e,this.zipfile);const t=a.join(this.opts.dir,e.fileName),r=e.externalFileAttributes>>16&65535,u=40960==(61440&r);let f=16384==(61440&r);!f&&e.fileName.endsWith("/")&&(f=!0);const l=e.versionMadeBy>>8;f||(f=0===l&&16===e.externalFileAttributes),n("extracting entry",{filename:e.fileName,isDir:f,isSymlink:u});const p=~process.umask(),h=this.getExtractedMode(r,f)&p,m=f?t:a.dirname(t),y={recursive:!0};if(f&&(y.mode=h),n("mkdir",{dir:m,...y}),await o.mkdir(m,y),f)return;n("opening read stream",t);const g=await c(this.zipfile.openReadStream.bind(this.zipfile))(e);if(u){const e=await s(g);n("creating symlink",e,t),await o.symlink(e,t)}else await d(g,i(t,{mode:h}))}getExtractedMode(e,t){let r=e;return 0===r&&(t?(this.opts.defaultDirMode&&(r=parseInt(this.opts.defaultDirMode,10)),r||(r=493)):(this.opts.defaultFileMode&&(r=parseInt(this.opts.defaultFileMode,10)),r||(r=420))),r}}t.exports=async function(e,t){if(n("creating target directory",t.dir),!a.isAbsolute(t.dir))throw new Error("Target directory is expected to be absolute");return await o.mkdir(t.dir,{recursive:!0}),t.dir=await o.realpath(t.dir),new p(e,t).extract()}},{debug:5,fs:void 0,"get-stream":10,path:void 0,stream:void 0,util:void 0,yauzl:16}],2:[function(e,t,r){var n=e("buffer").Buffer,i=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];function o(e){if(n.isBuffer(e))return e;var t="function"==typeof n.alloc&&"function"==typeof n.from;if("number"==typeof e)return t?n.alloc(e):new n(e);if("string"==typeof e)return t?n.from(e):new n(e);throw new Error("input must be buffer, number, or string, received "+typeof e)}function s(e){var t=o(4);return t.writeInt32BE(e,0),t}function a(e,t){e=o(e),n.isBuffer(t)&&(t=t.readUInt32BE(0));for(var r=-1^~~t,s=0;s<e.length;s++)r=i[255&(r^e[s])]^r>>>8;return-1^r}function c(){return s(a.apply(null,arguments))}"undefined"!=typeof Int32Array&&(i=new Int32Array(i)),c.signed=function(){return a.apply(null,arguments)},c.unsigned=function(){return a.apply(null,arguments)>>>0},t.exports=c},{buffer:void 0}],3:[function(e,t,r){r.log=function(...e){return"object"==typeof console&&console.log&&console.log(...e)},r.formatArgs=function(e){if(e[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+e[0]+(this.useColors?"%c ":" ")+"+"+t.exports.humanize(this.diff),!this.useColors)return;const r="color: "+this.color;e.splice(1,0,r,"color: inherit");let n=0,i=0;e[0].replace(/%[a-zA-Z%]/g,e=>{"%%"!==e&&(n++,"%c"===e&&(i=n))}),e.splice(i,0,r)},r.save=function(e){try{e?r.storage.setItem("debug",e):r.storage.removeItem("debug")}catch(e){}},r.load=function(){let e;try{e=r.storage.getItem("debug")}catch(e){}!e&&"undefined"!=typeof process&&"env"in process&&(e=process.env.DEBUG);return e},r.useColors=function(){if("undefined"!=typeof window&&window.process&&("renderer"===window.process.type||window.process.__nwjs))return!0;if("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},r.storage=function(){try{return localStorage}catch(e){}}(),r.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],t.exports=e("./common")(r);const{formatters:n}=t.exports;n.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}},{"./common":4}],4:[function(e,t,r){t.exports=function(t){function r(e){let t=0;for(let r=0;r<e.length;r++)t=(t<<5)-t+e.charCodeAt(r),t|=0;return n.colors[Math.abs(t)%n.colors.length]}function n(e){let t;function s(...e){if(!s.enabled)return;const r=s,i=Number(new Date),o=i-(t||i);r.diff=o,r.prev=t,r.curr=i,t=i,e[0]=n.coerce(e[0]),"string"!=typeof e[0]&&e.unshift("%O");let a=0;e[0]=e[0].replace(/%([a-zA-Z%])/g,(t,i)=>{if("%%"===t)return t;a++;const o=n.formatters[i];if("function"==typeof o){const n=e[a];t=o.call(r,n),e.splice(a,1),a--}return t}),n.formatArgs.call(r,e),(r.log||n.log).apply(r,e)}return s.namespace=e,s.enabled=n.enabled(e),s.useColors=n.useColors(),s.color=r(e),s.destroy=i,s.extend=o,"function"==typeof n.init&&n.init(s),n.instances.push(s),s}function i(){const e=n.instances.indexOf(this);return-1!==e&&(n.instances.splice(e,1),!0)}function o(e,t){const r=n(this.namespace+(void 0===t?":":t)+e);return r.log=this.log,r}function s(e){return e.toString().substring(2,e.toString().length-2).replace(/\.\*\?$/,"*")}return n.debug=n,n.default=n,n.coerce=function(e){if(e instanceof Error)return e.stack||e.message;return e},n.disable=function(){const e=[...n.names.map(s),...n.skips.map(s).map(e=>"-"+e)].join(",");return n.enable(""),e},n.enable=function(e){let t;n.save(e),n.names=[],n.skips=[];const r=("string"==typeof e?e:"").split(/[\s,]+/),i=r.length;for(t=0;t<i;t++)r[t]&&("-"===(e=r[t].replace(/\*/g,".*?"))[0]?n.skips.push(new RegExp("^"+e.substr(1)+"$")):n.names.push(new RegExp("^"+e+"$")));for(t=0;t<n.instances.length;t++){const e=n.instances[t];e.enabled=n.enabled(e.namespace)}},n.enabled=function(e){if("*"===e[e.length-1])return!0;let t,r;for(t=0,r=n.skips.length;t<r;t++)if(n.skips[t].test(e))return!1;for(t=0,r=n.names.length;t<r;t++)if(n.names[t].test(e))return!0;return!1},n.humanize=e("ms"),Object.keys(t).forEach(e=>{n[e]=t[e]}),n.instances=[],n.names=[],n.skips=[],n.formatters={},n.selectColor=r,n.enable(n.load()),n}},{ms:11}],5:[function(e,t,r){"undefined"==typeof process||"renderer"===process.type||!0===process.browser||process.__nwjs?t.exports=e("./browser.js"):t.exports=e("./node.js")},{"./browser.js":3,"./node.js":6}],6:[function(e,t,r){const n=e("tty"),i=e("util");r.init=function(e){e.inspectOpts={};const t=Object.keys(r.inspectOpts);for(let n=0;n<t.length;n++)e.inspectOpts[t[n]]=r.inspectOpts[t[n]]},r.log=function(...e){return process.stderr.write(i.format(...e)+"\n")},r.formatArgs=function(e){const{namespace:n,useColors:i}=this;if(i){const r=this.color,i="[3"+(r<8?r:"8;5;"+r),o=`  ${i};1m${n} [0m`;e[0]=o+e[0].split("\n").join("\n"+o),e.push(i+"m+"+t.exports.humanize(this.diff)+"[0m")}else e[0]=function(){if(r.inspectOpts.hideDate)return"";return(new Date).toISOString()+" "}()+n+" "+e[0]},r.save=function(e){e?process.env.DEBUG=e:delete process.env.DEBUG},r.load=function(){return process.env.DEBUG},r.useColors=function(){return"colors"in r.inspectOpts?Boolean(r.inspectOpts.colors):n.isatty(process.stderr.fd)},r.colors=[6,2,3,4,5,1];try{const t=e("supports-color");t&&(t.stderr||t).level>=2&&(r.colors=[20,21,26,27,32,33,38,39,40,41,42,43,44,45,56,57,62,63,68,69,74,75,76,77,78,79,80,81,92,93,98,99,112,113,128,129,134,135,148,149,160,161,162,163,164,165,166,167,168,169,170,171,172,173,178,179,184,185,196,197,198,199,200,201,202,203,204,205,206,207,208,209,214,215,220,221])}catch(e){}r.inspectOpts=Object.keys(process.env).filter(e=>/^debug_/i.test(e)).reduce((e,t)=>{const r=t.substring(6).toLowerCase().replace(/_([a-z])/g,(e,t)=>t.toUpperCase());let n=process.env[t];return n=!!/^(yes|on|true|enabled)$/i.test(n)||!/^(no|off|false|disabled)$/i.test(n)&&("null"===n?null:Number(n)),e[r]=n,e},{}),t.exports=e("./common")(r);const{formatters:o}=t.exports;o.o=function(e){return this.inspectOpts.colors=this.useColors,i.inspect(e,this.inspectOpts).replace(/\s*\n\s*/g," ")},o.O=function(e){return this.inspectOpts.colors=this.useColors,i.inspect(e,this.inspectOpts)}},{"./common":4,"supports-color":void 0,tty:void 0,util:void 0}],7:[function(e,t,r){var n=e("once"),i=function(){},o=function(e,t,r){if("function"==typeof t)return o(e,null,t);t||(t={}),r=n(r||i);var s=e._writableState,a=e._readableState,c=t.readable||!1!==t.readable&&e.readable,u=t.writable||!1!==t.writable&&e.writable,f=!1,l=function(){e.writable||d()},d=function(){u=!1,c||r.call(e)},p=function(){c=!1,u||r.call(e)},h=function(t){r.call(e,t?new Error("exited with error code: "+t):null)},m=function(t){r.call(e,t)},y=function(){process.nextTick(g)},g=function(){if(!f)return(!c||a&&a.ended&&!a.destroyed)&&(!u||s&&s.ended&&!s.destroyed)?void 0:r.call(e,new Error("premature close"))},v=function(){e.req.on("finish",d)};return!function(e){return e.setHeader&&"function"==typeof e.abort}(e)?u&&!s&&(e.on("end",l),e.on("close",l)):(e.on("complete",d),e.on("abort",y),e.req?v():e.on("request",v)),function(e){return e.stdio&&Array.isArray(e.stdio)&&3===e.stdio.length}(e)&&e.on("exit",h),e.on("end",p),e.on("finish",d),!1!==t.error&&e.on("error",m),e.on("close",y),function(){f=!0,e.removeListener("complete",d),e.removeListener("abort",y),e.removeListener("request",v),e.req&&e.req.removeListener("finish",d),e.removeListener("end",l),e.removeListener("close",l),e.removeListener("finish",d),e.removeListener("exit",h),e.removeListener("end",p),e.removeListener("error",m),e.removeListener("close",y)}};t.exports=o},{once:12}],8:[function(e,t,r){var n=e("fs"),i=e("util"),o=e("stream"),s=o.Readable,a=o.Writable,c=o.PassThrough,u=e("pend"),f=e("events").EventEmitter;function l(e,t){t=t||{},f.call(this),this.fd=e,this.pend=new u,this.pend.max=1,this.refCount=0,this.autoClose=!!t.autoClose}function d(e,t){t=t||{},s.call(this,t),this.context=e,this.context.ref(),this.start=t.start||0,this.endOffset=t.end,this.pos=this.start,this.destroyed=!1}function p(e,t){t=t||{},a.call(this,t),this.context=e,this.context.ref(),this.start=t.start||0,this.endOffset=null==t.end?1/0:+t.end,this.bytesWritten=0,this.pos=this.start,this.destroyed=!1,this.on("finish",this.destroy.bind(this))}function h(e,t){f.call(this),t=t||{},this.refCount=0,this.buffer=e,this.maxChunkSize=t.maxChunkSize||Number.MAX_SAFE_INTEGER}r.createFromBuffer=function(e,t){return new h(e,t)},r.createFromFd=function(e,t){return new l(e,t)},r.BufferSlicer=h,r.FdSlicer=l,i.inherits(l,f),l.prototype.read=function(e,t,r,i,o){var s=this;s.pend.go((function(a){n.read(s.fd,e,t,r,i,(function(e,t,r){a(),o(e,t,r)}))}))},l.prototype.write=function(e,t,r,i,o){var s=this;s.pend.go((function(a){n.write(s.fd,e,t,r,i,(function(e,t,r){a(),o(e,t,r)}))}))},l.prototype.createReadStream=function(e){return new d(this,e)},l.prototype.createWriteStream=function(e){return new p(this,e)},l.prototype.ref=function(){this.refCount+=1},l.prototype.unref=function(){var e=this;if(e.refCount-=1,!(e.refCount>0)){if(e.refCount<0)throw new Error("invalid unref");e.autoClose&&n.close(e.fd,(function(t){t?e.emit("error",t):e.emit("close")}))}},i.inherits(d,s),d.prototype._read=function(e){var t=this;if(!t.destroyed){var r=Math.min(t._readableState.highWaterMark,e);if(null!=t.endOffset&&(r=Math.min(r,t.endOffset-t.pos)),r<=0)return t.destroyed=!0,t.push(null),void t.context.unref();t.context.pend.go((function(e){if(t.destroyed)return e();var i=new Buffer(r);n.read(t.context.fd,i,0,r,t.pos,(function(r,n){r?t.destroy(r):0===n?(t.destroyed=!0,t.push(null),t.context.unref()):(t.pos+=n,t.push(i.slice(0,n))),e()}))}))}},d.prototype.destroy=function(e){this.destroyed||(e=e||new Error("stream destroyed"),this.destroyed=!0,this.emit("error",e),this.context.unref())},i.inherits(p,a),p.prototype._write=function(e,t,r){var i=this;if(!i.destroyed){if(i.pos+e.length>i.endOffset){var o=new Error("maximum file length exceeded");return o.code="ETOOBIG",i.destroy(),void r(o)}i.context.pend.go((function(t){if(i.destroyed)return t();n.write(i.context.fd,e,0,e.length,i.pos,(function(e,n){e?(i.destroy(),t(),r(e)):(i.bytesWritten+=n,i.pos+=n,i.emit("progress"),t(),r())}))}))}},p.prototype.destroy=function(){this.destroyed||(this.destroyed=!0,this.context.unref())},i.inherits(h,f),h.prototype.read=function(e,t,r,n,i){var o=n+r,s=o-this.buffer.length,a=s>0?s:r;this.buffer.copy(e,t,n,o),setImmediate((function(){i(null,a)}))},h.prototype.write=function(e,t,r,n,i){e.copy(this.buffer,n,t,t+r),setImmediate((function(){i(null,r,e)}))},h.prototype.createReadStream=function(e){var t=new c(e=e||{});t.destroyed=!1,t.start=e.start||0,t.endOffset=e.end,t.pos=t.endOffset||this.buffer.length;for(var r=this.buffer.slice(t.start,t.pos),n=0;;){var i=n+this.maxChunkSize;if(i>=r.length){n<r.length&&t.write(r.slice(n,r.length));break}t.write(r.slice(n,i)),n=i}return t.end(),t.destroy=function(){t.destroyed=!0},t},h.prototype.createWriteStream=function(e){var t=this,r=new a(e=e||{});return r.start=e.start||0,r.endOffset=null==e.end?this.buffer.length:+e.end,r.bytesWritten=0,r.pos=r.start,r.destroyed=!1,r._write=function(e,n,i){if(!r.destroyed){var o=r.pos+e.length;if(o>r.endOffset){var s=new Error("maximum file length exceeded");return s.code="ETOOBIG",r.destroyed=!0,void i(s)}e.copy(t.buffer,r.pos,0,e.length),r.bytesWritten+=e.length,r.pos=o,r.emit("progress"),i()}},r.destroy=function(){r.destroyed=!0},r},h.prototype.ref=function(){this.refCount+=1},h.prototype.unref=function(){if(this.refCount-=1,this.refCount<0)throw new Error("invalid unref")}},{events:void 0,fs:void 0,pend:13,stream:void 0,util:void 0}],9:[function(e,t,r){"use strict";const{PassThrough:n}=e("stream");t.exports=e=>{e={...e};const{array:t}=e;let{encoding:r}=e;const i="buffer"===r;let o=!1;t?o=!(r||i):r=r||"utf8",i&&(r=null);const s=new n({objectMode:o});r&&s.setEncoding(r);let a=0;const c=[];return s.on("data",e=>{c.push(e),o?a=c.length:a+=e.length}),s.getBufferedValue=()=>t?c:i?Buffer.concat(c,a):c.join(""),s.getBufferedLength=()=>a,s}},{stream:void 0}],10:[function(e,t,r){"use strict";const n=e("pump"),i=e("./buffer-stream");class o extends Error{constructor(){super("maxBuffer exceeded"),this.name="MaxBufferError"}}async function s(e,t){if(!e)return Promise.reject(new Error("Expected a stream"));t={maxBuffer:1/0,...t};const{maxBuffer:r}=t;let s;return await new Promise((a,c)=>{const u=e=>{e&&(e.bufferedData=s.getBufferedValue()),c(e)};s=n(e,i(t),e=>{e?u(e):a()}),s.on("data",()=>{s.getBufferedLength()>r&&u(new o)})}),s.getBufferedValue()}t.exports=s,t.exports.default=s,t.exports.buffer=(e,t)=>s(e,{...t,encoding:"buffer"}),t.exports.array=(e,t)=>s(e,{...t,array:!0}),t.exports.MaxBufferError=o},{"./buffer-stream":9,pump:14}],11:[function(e,t,r){var n=1e3,i=6e4,o=36e5,s=24*o;function a(e,t,r,n){var i=t>=1.5*r;return Math.round(e/r)+" "+n+(i?"s":"")}t.exports=function(e,t){t=t||{};var r=typeof e;if("string"===r&&e.length>0)return function(e){if((e=String(e)).length>100)return;var t=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);if(!t)return;var r=parseFloat(t[1]);switch((t[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*r;case"weeks":case"week":case"w":return 6048e5*r;case"days":case"day":case"d":return r*s;case"hours":case"hour":case"hrs":case"hr":case"h":return r*o;case"minutes":case"minute":case"mins":case"min":case"m":return r*i;case"seconds":case"second":case"secs":case"sec":case"s":return r*n;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r;default:return}}(e);if("number"===r&&isFinite(e))return t.long?function(e){var t=Math.abs(e);if(t>=s)return a(e,t,s,"day");if(t>=o)return a(e,t,o,"hour");if(t>=i)return a(e,t,i,"minute");if(t>=n)return a(e,t,n,"second");return e+" ms"}(e):function(e){var t=Math.abs(e);if(t>=s)return Math.round(e/s)+"d";if(t>=o)return Math.round(e/o)+"h";if(t>=i)return Math.round(e/i)+"m";if(t>=n)return Math.round(e/n)+"s";return e+"ms"}(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}},{}],12:[function(e,t,r){var n=e("wrappy");function i(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function o(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},r=e.name||"Function wrapped with `once`";return t.onceError=r+" shouldn't be called more than once",t.called=!1,t}t.exports=n(i),t.exports.strict=n(o),i.proto=i((function(){Object.defineProperty(Function.prototype,"once",{value:function(){return i(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return o(this)},configurable:!0})}))},{wrappy:15}],13:[function(e,t,r){function n(){this.pending=0,this.max=1/0,this.listeners=[],this.waiting=[],this.error=null}function i(e){e.pending+=1;var t=!1;return function(n){if(t)throw new Error("callback called twice");if(t=!0,e.error=e.error||n,e.pending-=1,e.waiting.length>0&&e.pending<e.max)o(e,e.waiting.shift());else if(0===e.pending){var i=e.listeners;e.listeners=[],i.forEach(r)}};function r(t){t(e.error)}}function o(e,t){t(i(e))}t.exports=n,n.prototype.go=function(e){this.pending<this.max?o(this,e):this.waiting.push(e)},n.prototype.wait=function(e){0===this.pending?e(this.error):this.listeners.push(e)},n.prototype.hold=function(){return i(this)}},{}],14:[function(e,t,r){var n=e("once"),i=e("end-of-stream"),o=e("fs"),s=function(){},a=/^v?\.0/.test(process.version),c=function(e){return"function"==typeof e},u=function(e,t,r,u){u=n(u);var f=!1;e.on("close",(function(){f=!0})),i(e,{readable:t,writable:r},(function(e){if(e)return u(e);f=!0,u()}));var l=!1;return function(t){if(!f&&!l)return l=!0,function(e){return!!a&&(!!o&&((e instanceof(o.ReadStream||s)||e instanceof(o.WriteStream||s))&&c(e.close)))}(e)?e.close(s):function(e){return e.setHeader&&c(e.abort)}(e)?e.abort():c(e.destroy)?e.destroy():void u(t||new Error("stream was destroyed"))}},f=function(e){e()},l=function(e,t){return e.pipe(t)};t.exports=function(){var e,t=Array.prototype.slice.call(arguments),r=c(t[t.length-1]||s)&&t.pop()||s;if(Array.isArray(t[0])&&(t=t[0]),t.length<2)throw new Error("pump requires two streams per minimum");var n=t.map((function(i,o){var s=o<t.length-1;return u(i,s,o>0,(function(t){e||(e=t),t&&n.forEach(f),s||(n.forEach(f),r(e))}))}));return t.reduce(l)}},{"end-of-stream":7,fs:void 0,once:12}],15:[function(e,t,r){t.exports=function e(t,r){if(t&&r)return e(t)(r);if("function"!=typeof t)throw new TypeError("need wrapper function");return Object.keys(t).forEach((function(e){n[e]=t[e]})),n;function n(){for(var e=new Array(arguments.length),r=0;r<e.length;r++)e[r]=arguments[r];var n=t.apply(this,e),i=e[e.length-1];return"function"==typeof n&&n!==i&&Object.keys(i).forEach((function(e){n[e]=i[e]})),n}}},{}],16:[function(e,t,r){var n=e("fs"),i=e("zlib"),o=e("fd-slicer"),s=e("buffer-crc32"),a=e("util"),c=e("events").EventEmitter,u=e("stream").Transform,f=e("stream").PassThrough,l=e("stream").Writable;function d(e,t,r){"function"==typeof t&&(r=t,t=null),null==t&&(t={}),null==t.autoClose&&(t.autoClose=!1),null==t.lazyEntries&&(t.lazyEntries=!1),null==t.decodeStrings&&(t.decodeStrings=!0),null==t.validateEntrySizes&&(t.validateEntrySizes=!0),null==t.strictFileNames&&(t.strictFileNames=!1),null==r&&(r=L),n.fstat(e,(function(n,i){if(n)return r(n);p(o.createFromFd(e,{autoClose:!0}),i.size,t,r)}))}function p(e,t,r,n){"function"==typeof r&&(n=r,r=null),null==r&&(r={}),null==r.autoClose&&(r.autoClose=!0),null==r.lazyEntries&&(r.lazyEntries=!1),null==r.decodeStrings&&(r.decodeStrings=!0);var i=!!r.decodeStrings;if(null==r.validateEntrySizes&&(r.validateEntrySizes=!0),null==r.strictFileNames&&(r.strictFileNames=!1),null==n&&(n=L),"number"!=typeof t)throw new Error("expected totalSize parameter to be a number");if(t>Number.MAX_SAFE_INTEGER)throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");e.ref();var o=Math.min(65557,t),s=F(o),a=t-s.length;C(e,s,0,o,a,(function(c){if(c)return n(c);for(var u=o-22;u>=0;u-=1)if(101010256===s.readUInt32LE(u)){var f=s.slice(u),l=f.readUInt16LE(4);if(0!==l)return n(new Error("multi-disk zip files are not supported: found disk number: "+l));var d=f.readUInt16LE(10),p=f.readUInt32LE(16),m=f.readUInt16LE(20),y=f.length-22;if(m!==y)return n(new Error("invalid comment length. expected: "+y+". found: "+m));var g=i?z(f,22,f.length,!1):f.slice(22);if(65535!==d&&4294967295!==p)return n(null,new h(e,p,t,d,g,r.autoClose,r.lazyEntries,i,r.validateEntrySizes,r.strictFileNames));var v=F(20),w=a+u-v.length;return void C(e,v,0,v.length,w,(function(o){if(o)return n(o);if(117853008!==v.readUInt32LE(0))return n(new Error("invalid zip64 end of central directory locator signature"));var s=S(v,8),a=F(56);C(e,a,0,a.length,s,(function(o){return o?n(o):101075792!==a.readUInt32LE(0)?n(new Error("invalid zip64 end of central directory record signature")):(d=S(a,32),p=S(a,48),n(null,new h(e,p,t,d,g,r.autoClose,r.lazyEntries,i,r.validateEntrySizes,r.strictFileNames)))}))}))}n(new Error("end of central directory record signature not found"))}))}function h(e,t,r,n,i,o,s,a,u,f){var l=this;c.call(l),l.reader=e,l.reader.on("error",(function(e){y(l,e)})),l.reader.once("close",(function(){l.emit("close")})),l.readEntryCursor=t,l.fileSize=r,l.entryCount=n,l.comment=i,l.entriesRead=0,l.autoClose=!!o,l.lazyEntries=!!s,l.decodeStrings=!!a,l.validateEntrySizes=!!u,l.strictFileNames=!!f,l.isOpen=!0,l.emittedError=!1,l.lazyEntries||l._readEntry()}function m(e,t){e.autoClose&&e.close(),y(e,t)}function y(e,t){e.emittedError||(e.emittedError=!0,e.emit("error",t))}function g(){}function v(e,t){return new Date(1980+(e>>9&127),(e>>5&15)-1,31&e,t>>11&31,t>>5&63,2*(31&t),0)}function w(e){return-1!==e.indexOf("\\")?"invalid characters in fileName: "+e:/^[a-zA-Z]:/.test(e)||/^\//.test(e)?"absolute path: "+e:-1!==e.split("/").indexOf("..")?"invalid relative path: "+e:null}function C(e,t,r,n,i,o){if(0===n)return setImmediate((function(){o(null,F(0))}));e.read(t,r,n,i,(function(e,t){return e?o(e):t<n?o(new Error("unexpected EOF")):void o()}))}function E(e){u.call(this),this.actualByteCount=0,this.expectedByteCount=e}function b(){c.call(this),this.refCount=0}function x(e){f.call(this),this.context=e,this.context.ref(),this.unreffedYet=!1}r.open=function(e,t,r){"function"==typeof t&&(r=t,t=null);null==t&&(t={});null==t.autoClose&&(t.autoClose=!0);null==t.lazyEntries&&(t.lazyEntries=!1);null==t.decodeStrings&&(t.decodeStrings=!0);null==t.validateEntrySizes&&(t.validateEntrySizes=!0);null==t.strictFileNames&&(t.strictFileNames=!1);null==r&&(r=L);n.open(e,"r",(function(e,i){if(e)return r(e);d(i,t,(function(e,t){e&&n.close(i,L),r(e,t)}))}))},r.fromFd=d,r.fromBuffer=function(e,t,r){"function"==typeof t&&(r=t,t=null);null==t&&(t={});t.autoClose=!1,null==t.lazyEntries&&(t.lazyEntries=!1);null==t.decodeStrings&&(t.decodeStrings=!0);null==t.validateEntrySizes&&(t.validateEntrySizes=!0);null==t.strictFileNames&&(t.strictFileNames=!1);p(o.createFromBuffer(e,{maxChunkSize:65536}),e.length,t,r)},r.fromRandomAccessReader=p,r.dosDateTimeToDate=v,r.validateFileName=w,r.ZipFile=h,r.Entry=g,r.RandomAccessReader=b,a.inherits(h,c),h.prototype.close=function(){this.isOpen&&(this.isOpen=!1,this.reader.unref())},h.prototype.readEntry=function(){if(!this.lazyEntries)throw new Error("readEntry() called without lazyEntries:true");this._readEntry()},h.prototype._readEntry=function(){var e=this;if(e.entryCount!==e.entriesRead){if(!e.emittedError){var t=F(46);C(e.reader,t,0,t.length,e.readEntryCursor,(function(r){if(r)return m(e,r);if(!e.emittedError){var n=new g,i=t.readUInt32LE(0);if(33639248!==i)return m(e,new Error("invalid central directory file header signature: 0x"+i.toString(16)));if(n.versionMadeBy=t.readUInt16LE(4),n.versionNeededToExtract=t.readUInt16LE(6),n.generalPurposeBitFlag=t.readUInt16LE(8),n.compressionMethod=t.readUInt16LE(10),n.lastModFileTime=t.readUInt16LE(12),n.lastModFileDate=t.readUInt16LE(14),n.crc32=t.readUInt32LE(16),n.compressedSize=t.readUInt32LE(20),n.uncompressedSize=t.readUInt32LE(24),n.fileNameLength=t.readUInt16LE(28),n.extraFieldLength=t.readUInt16LE(30),n.fileCommentLength=t.readUInt16LE(32),n.internalFileAttributes=t.readUInt16LE(36),n.externalFileAttributes=t.readUInt32LE(38),n.relativeOffsetOfLocalHeader=t.readUInt32LE(42),64&n.generalPurposeBitFlag)return m(e,new Error("strong encryption is not supported"));e.readEntryCursor+=46,t=F(n.fileNameLength+n.extraFieldLength+n.fileCommentLength),C(e.reader,t,0,t.length,e.readEntryCursor,(function(r){if(r)return m(e,r);if(!e.emittedError){var i=0!=(2048&n.generalPurposeBitFlag);n.fileName=e.decodeStrings?z(t,0,n.fileNameLength,i):t.slice(0,n.fileNameLength);var o=n.fileNameLength+n.extraFieldLength,a=t.slice(n.fileNameLength,o);n.extraFields=[];for(var c=0;c<a.length-3;){var u=a.readUInt16LE(c+0),f=a.readUInt16LE(c+2),l=c+4,d=l+f;if(d>a.length)return m(e,new Error("extra field length exceeds extra field buffer size"));var p=F(f);a.copy(p,0,l,d),n.extraFields.push({id:u,data:p}),c=d}if(n.fileComment=e.decodeStrings?z(t,o,o+n.fileCommentLength,i):t.slice(o,o+n.fileCommentLength),n.comment=n.fileComment,e.readEntryCursor+=t.length,e.entriesRead+=1,4294967295===n.uncompressedSize||4294967295===n.compressedSize||4294967295===n.relativeOffsetOfLocalHeader){var h=null;for(c=0;c<n.extraFields.length;c++){if(1===(g=n.extraFields[c]).id){h=g.data;break}}if(null==h)return m(e,new Error("expected zip64 extended information extra field"));var y=0;if(4294967295===n.uncompressedSize){if(y+8>h.length)return m(e,new Error("zip64 extended information extra field does not include uncompressed size"));n.uncompressedSize=S(h,y),y+=8}if(4294967295===n.compressedSize){if(y+8>h.length)return m(e,new Error("zip64 extended information extra field does not include compressed size"));n.compressedSize=S(h,y),y+=8}if(4294967295===n.relativeOffsetOfLocalHeader){if(y+8>h.length)return m(e,new Error("zip64 extended information extra field does not include relative header offset"));n.relativeOffsetOfLocalHeader=S(h,y),y+=8}}if(e.decodeStrings)for(c=0;c<n.extraFields.length;c++){var g;if(28789===(g=n.extraFields[c]).id){if(g.data.length<6)continue;if(1!==g.data.readUInt8(0))continue;var v=g.data.readUInt32LE(1);if(s.unsigned(t.slice(0,n.fileNameLength))!==v)continue;n.fileName=z(g.data,5,g.data.length,!0);break}}if(e.validateEntrySizes&&0===n.compressionMethod){var C=n.uncompressedSize;if(n.isEncrypted()&&(C+=12),n.compressedSize!==C){var E="compressed/uncompressed size mismatch for stored file: "+n.compressedSize+" != "+n.uncompressedSize;return m(e,new Error(E))}}if(e.decodeStrings){e.strictFileNames||(n.fileName=n.fileName.replace(/\\/g,"/"));var b=w(n.fileName,e.validateFileNameOptions);if(null!=b)return m(e,new Error(b))}e.emit("entry",n),e.lazyEntries||e._readEntry()}}))}}))}}else setImmediate((function(){e.autoClose&&e.close(),e.emittedError||e.emit("end")}))},h.prototype.openReadStream=function(e,t,r){var n=this,o=0,s=e.compressedSize;if(null==r)r=t,t={};else{if(null!=t.decrypt){if(!e.isEncrypted())throw new Error("options.decrypt can only be specified for encrypted entries");if(!1!==t.decrypt)throw new Error("invalid options.decrypt value: "+t.decrypt);if(e.isCompressed()&&!1!==t.decompress)throw new Error("entry is encrypted and compressed, and options.decompress !== false")}if(null!=t.decompress){if(!e.isCompressed())throw new Error("options.decompress can only be specified for compressed entries");if(!1!==t.decompress&&!0!==t.decompress)throw new Error("invalid options.decompress value: "+t.decompress)}if(null!=t.start||null!=t.end){if(e.isCompressed()&&!1!==t.decompress)throw new Error("start/end range not allowed for compressed entry without options.decompress === false");if(e.isEncrypted()&&!1!==t.decrypt)throw new Error("start/end range not allowed for encrypted entry without options.decrypt === false")}if(null!=t.start){if((o=t.start)<0)throw new Error("options.start < 0");if(o>e.compressedSize)throw new Error("options.start > entry.compressedSize")}if(null!=t.end){if((s=t.end)<0)throw new Error("options.end < 0");if(s>e.compressedSize)throw new Error("options.end > entry.compressedSize");if(s<o)throw new Error("options.end < options.start")}}if(!n.isOpen)return r(new Error("closed"));if(e.isEncrypted()&&!1!==t.decrypt)return r(new Error("entry is encrypted, and options.decrypt !== false"));n.reader.ref();var a=F(30);C(n.reader,a,0,a.length,e.relativeOffsetOfLocalHeader,(function(c){try{if(c)return r(c);var u=a.readUInt32LE(0);if(67324752!==u)return r(new Error("invalid local file header signature: 0x"+u.toString(16)));var f,l=a.readUInt16LE(26),d=a.readUInt16LE(28),p=e.relativeOffsetOfLocalHeader+a.length+l+d;if(0===e.compressionMethod)f=!1;else{if(8!==e.compressionMethod)return r(new Error("unsupported compression method: "+e.compressionMethod));f=null==t.decompress||t.decompress}var h=p,m=h+e.compressedSize;if(0!==e.compressedSize&&m>n.fileSize)return r(new Error("file data overflows file bounds: "+h+" + "+e.compressedSize+" > "+n.fileSize));var y=n.reader.createReadStream({start:h+o,end:h+s}),g=y;if(f){var v=!1,w=i.createInflateRaw();y.on("error",(function(e){setImmediate((function(){v||w.emit("error",e)}))})),y.pipe(w),n.validateEntrySizes?(g=new E(e.uncompressedSize),w.on("error",(function(e){setImmediate((function(){v||g.emit("error",e)}))})),w.pipe(g)):g=w,g.destroy=function(){v=!0,w!==g&&w.unpipe(g),y.unpipe(w),y.destroy()}}r(null,g)}finally{n.reader.unref()}}))},g.prototype.getLastModDate=function(){return v(this.lastModFileDate,this.lastModFileTime)},g.prototype.isEncrypted=function(){return 0!=(1&this.generalPurposeBitFlag)},g.prototype.isCompressed=function(){return 8===this.compressionMethod},a.inherits(E,u),E.prototype._transform=function(e,t,r){if(this.actualByteCount+=e.length,this.actualByteCount>this.expectedByteCount){var n="too many bytes in the stream. expected "+this.expectedByteCount+". got at least "+this.actualByteCount;return r(new Error(n))}r(null,e)},E.prototype._flush=function(e){if(this.actualByteCount<this.expectedByteCount){var t="not enough bytes in the stream. expected "+this.expectedByteCount+". got only "+this.actualByteCount;return e(new Error(t))}e()},a.inherits(b,c),b.prototype.ref=function(){this.refCount+=1},b.prototype.unref=function(){var e=this;if(e.refCount-=1,!(e.refCount>0)){if(e.refCount<0)throw new Error("invalid unref");e.close((function(t){if(t)return e.emit("error",t);e.emit("close")}))}},b.prototype.createReadStream=function(e){var t=e.start,r=e.end;if(t===r){var n=new f;return setImmediate((function(){n.end()})),n}var i=this._readStreamForRange(t,r),o=!1,s=new x(this);i.on("error",(function(e){setImmediate((function(){o||s.emit("error",e)}))})),s.destroy=function(){i.unpipe(s),s.unref(),i.destroy()};var a=new E(r-t);return s.on("error",(function(e){setImmediate((function(){o||a.emit("error",e)}))})),a.destroy=function(){o=!0,s.unpipe(a),s.destroy()},i.pipe(s).pipe(a)},b.prototype._readStreamForRange=function(e,t){throw new Error("not implemented")},b.prototype.read=function(e,t,r,n,i){var o=this.createReadStream({start:n,end:n+r}),s=new l,a=0;s._write=function(r,n,i){r.copy(e,t+a,0,r.length),a+=r.length,i()},s.on("finish",i),o.on("error",(function(e){i(e)})),o.pipe(s)},b.prototype.close=function(e){setImmediate(e)},a.inherits(x,f),x.prototype._flush=function(e){this.unref(),e()},x.prototype.unref=function(e){this.unreffedYet||(this.unreffedYet=!0,this.context.unref())};var F;function z(e,t,r,n){if(n)return e.toString("utf8",t,r);for(var i="",o=t;o<r;o++)i+="\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "[e[o]];return i}function S(e,t){var r=e.readUInt32LE(t);return 4294967296*e.readUInt32LE(t+4)+r}function L(e){if(e)throw e}F="function"==typeof Buffer.allocUnsafe?function(e){return Buffer.allocUnsafe(e)}:function(e){return new Buffer(e)}},{"buffer-crc32":2,events:void 0,"fd-slicer":8,fs:void 0,stream:void 0,util:void 0,zlib:void 0}]},{},[1])(1)}));