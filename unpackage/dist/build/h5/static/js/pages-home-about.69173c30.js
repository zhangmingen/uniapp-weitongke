(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-home-about"],{"13c8":function(t,a,n){t.exports=n.p+"static/img/logo.1b00572b.png"},"4eeb":function(t,a,n){var e=n("7c37");"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var i=n("4f06").default;i("1184dce8",e,!0,{sourceMap:!1,shadowMode:!1})},"692a":function(t,a,n){"use strict";var e=n("4eeb"),i=n.n(e);i.a},"79b7":function(t,a,n){"use strict";var e;n.d(a,"b",(function(){return i})),n.d(a,"c",(function(){return o})),n.d(a,"a",(function(){return e}));var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-uni-view",{staticClass:"about"},[e("v-uni-view",{staticClass:"text-center about-top"},[e("v-uni-image",{staticClass:"about-logo",attrs:{src:n("13c8"),mode:"aspectFill"}})],1),e("v-uni-view",{staticClass:"text-df padding"},[e("v-uni-view",{staticClass:"padding-bottom-xs text-indent"},[t._v(t._s(t.showData||""))])],1)],1)},o=[]},"7c37":function(t,a,n){var e=n("24fb");a=e(!1),a.push([t.i,".about-top[data-v-e0d2f142]{padding:%?129?% 0 %?72?%}.about-logo[data-v-e0d2f142]{width:%?270?%;height:%?114?%}",""]),t.exports=a},"9d7f":function(t,a,n){"use strict";(function(t){Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n={data:function(){return{showData:null}},onShow:function(){this.getData()},methods:{getData:function(){var a=this;uni.showLoading({title:"加载中..."}),this.$api.post(t.apiUrls.publicGetAgreement).then((function(t){t=t.data;setTimeout((function(){uni.hideLoading()}),500),1==t.code&&(a.showData=t.data.about_us)}))}}};a.default=n}).call(this,n("c8ba"))},d509:function(t,a,n){"use strict";n.r(a);var e=n("9d7f"),i=n.n(e);for(var o in e)"default"!==o&&function(t){n.d(a,t,(function(){return e[t]}))}(o);a["default"]=i.a},e2e5:function(t,a,n){"use strict";n.r(a);var e=n("79b7"),i=n("d509");for(var o in i)"default"!==o&&function(t){n.d(a,t,(function(){return i[t]}))}(o);n("692a");var u,s=n("f0c5"),c=Object(s["a"])(i["default"],e["b"],e["c"],!1,null,"e0d2f142",null,!1,e["a"],u);a["default"]=c.exports}}]);