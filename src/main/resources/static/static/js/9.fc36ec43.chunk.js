(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{667:function(t,a,e){"use strict";e.r(a);var r=e(37),n=e(38),u=e(40),c=e(39),i=e(41),o=e(17),h=e(1),m=e.n(h),s=e(634),p=e(305),b=function(){return m.a.createElement(p.a,{type:"403",desc:"\u62b1\u6b49\uff0c\u4f60\u65e0\u6743\u8bbf\u95ee\u8be5\u9875\u9762"})},f=e(164),d=e.n(f),l=e(653),v=e(652),M=e.n(v);var j=Object(l.a)(function t(a,e){return a.map(function(a){if(!a.path)return null;var r=Object(o.a)({},a,{authority:a.authority||e});if(a.routes){var n=t(a.routes,a.authority);r.children=n}return delete r.routes,r}).filter(function(t){return t})},d.a),y=function(t){function a(t){var e;return Object(r.a)(this,a),(e=Object(u.a)(this,Object(c.a)(a).call(this,t))).getBreadcrumbNameMap=function(){var t={};return function a(e){e.forEach(function(e){e.children&&a(e.children),t[e.path]=e})}(e.getMenuData()),t},e.matchParamsPath=function(t){var a=Object.keys(e.breadcrumbNameMap).find(function(a){return M()(a).test(t)});return e.breadcrumbNameMap[a]},e.getMenuData=function(){var t=e.props.route.routes;return j(t)},e.breadcrumbNameMap=e.getBreadcrumbNameMap(),e.matchParamsPath=Object(l.a)(e.matchParamsPath,d.a),e}return Object(i.a)(a,t),Object(n.a)(a,[{key:"componentDidUpdate",value:function(){this.breadcrumbNameMap=this.getBreadcrumbNameMap()}},{key:"render",value:function(){var t=this.props,a=t.children,e=t.location.pathname,r=this.matchParamsPath(e);return m.a.createElement(s.a,{authority:r&&r.authority,noMatch:m.a.createElement(b,null)},a)}}]),a}(h.Component);a.default=y}}]);