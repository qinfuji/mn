(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{665:function(e,t,a){"use strict";a.r(t);a(174);var n,r=a(52),o=(a(327),a(633)),i=a(53),l=a(18),c=a.n(l),s=a(17),p=a(29),u=a(37),d=a(38),m=a(40),f=a(39),h=a(41),g=(a(235),a(118)),v=(a(631),a(632)),y=(a(635),a(636)),b=a(1),w=a.n(b),k=a(236),C=a(645),P=a(646),E=a(647),x=a(28),M=a(648),O=a(637),S=(a(238),a(165)),j=(a(654),a(660)),A=function(e){function t(){return Object(u.a)(this,t),Object(m.a)(this,Object(f.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(d.a)(t,[{key:"componentWillUnmount",value:function(){console.log("SearchResultList componentWillUnmount")}},{key:"render",value:function(){var e=this.props,t=e.poiList,a=t.pois,n=t.count,r=t.pageIndex,o=(t.pageSize,e.onItemSelected),i=e.onPageChange;return w.a.createElement("div",{className:"",style:{width:"100%"}},w.a.createElement(j.a,{dataSource:a,renderItem:function(e){return w.a.createElement(j.a.Item,{key:e.id},w.a.createElement(j.a.Item.Meta,{style:{margin:"0 10px",cursor:"pointer"},title:w.a.createElement("span",{onClick:function(){o&&o(e)}},e.name),description:"\u5730\u5740\uff1a".concat(e.address)}))}}),a&&a.length&&w.a.createElement(S.a,{size:"small",onChange:i,current:r,total:n}))}}]),t}(w.a.Component),I=(a(649),a(651)),D=(a(329),a(161)),N=(a(650),a(12)),F=(a(638),a(642)),V=a(328),z=a(639),L=a(634),T=g.a.Option,R=F.a.confirm,B=v.a.create({mapPropsToFields:function(e){return{lnglat:e.lnglat}},onValuesChange:function(e,t){t.labels&&(t.labels=t.labels.join(",")),console.log(t),e.onChange(t)}})(n=function(e){function t(){var e,a;Object(u.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(m.a)(this,(e=Object(f.a)(t)).call.apply(e,[this].concat(r)))).state={treeData:[]},a.submit=function(e){var t=a.props,n=t.form.validateFields,r=t.onSubmit,o=t.pointer.adCodeInfo;n(function(e,t){if(!e){var n=Object(s.a)({},a.props.pointer,t,o);r&&r(n)}})},a.save=function(){var e=a.props,t=e.form.validateFields,n=e.onSave,r=e.pointer.adCodeInfo;t(function(e,t){if(!e){var o=Object(s.a)({},a.props.pointer,t,r);n&&n(o)}})},a.onRevoke=function(){var e=a.props.onRevoke;e&&e()},a.onDelete=function(){var e=a.props,t=e.onDelete,n=e.pointer;R({title:"\u4f60\u786e\u8ba4\u8981\u5220\u9664\u70b9\u5740\u4fe1\u606f?",onOk:function(){t&&t(n)},onCancel:function(){}})},a.onChange=function(e){console.log("onChange ",e),a.setState({value:e})},a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=this;setTimeout(Object(p.a)(c.a.mark(function t(){var a;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(z.c)();case 2:a=t.sent,e.setState({treeData:a});case 4:case"end":return t.stop()}},t)})),100)}},{key:"getNewTreeData",value:function(e,t,a){return function e(n){n&&n.forEach(function(n){t===n.id?n.children=a:e(n.children)})}(e),e}},{key:"render",value:function(){var e=this.props,t=e.form.getFieldDecorator,a=e.pointer,n=void 0===a?{}:a,i=e.onRelocation,l=e.onCreateFence,c=e.onRemoveFence,s=e.onBack;return console.log(n),w.a.createElement("div",{className:"pointerCreate"},w.a.createElement(v.a,null,w.a.createElement(v.a.Item,{label:"\u7c7b\u522b"},t("type",{initialValue:n&&n.type?n.type:"",rules:[{required:!0,message:"\u8bf7\u9009\u62e9"}]})(w.a.createElement(g.a,{placeholder:"\u8bf7\u9009\u62e9"},Object.keys(V.Constant.typeLabel).map(function(e){return w.a.createElement(T,{key:e,value:e},V.Constant.typeLabel[e])})))),w.a.createElement(v.a.Item,{label:"\u540d\u79f0"},t("name",{initialValue:n&&n.name?n.name:"",rules:[{required:!0,message:"\u8bf7\u586b\u5199"}]})(w.a.createElement(o.a,null))),w.a.createElement(v.a.Item,{label:"\u7ecf\u7eac\u5ea6"},t("lnglat",{initialValue:n&&n.lnglat?n.lnglat.lng+","+n.lnglat.lat:"",rules:[{required:!0,message:"\u8bf7\u586b\u5199"}]})(w.a.createElement(o.a,{readOnly:!0,addonAfter:w.a.createElement(D.a,{title:"\u70b9\u51fb\u5b9a\u4f4d\u4e2d\u5fc3"},w.a.createElement(N.a,{type:"environment",onClick:function(){return i(n.lnglat)}}))}))),w.a.createElement(v.a.Item,{label:"\u8be6\u7ec6\u5730\u5740",extra:n&&n.refAddress?"\u53c2\u8003\u5730\u5740\uff1a"+n.refAddress:""},t("address",{initialValue:n&&n.address?n.address:"",rules:[{required:!0,message:"\u8bf7\u586b\u5199"}]})(w.a.createElement(o.a,null))),w.a.createElement(v.a.Item,{label:"\u56f4\u680f"},t("fence",{initialValue:n&&n.fence?n.fence:""})(w.a.createElement(o.a,{suffix:n&&n.fence&&w.a.createElement(D.a,{title:"\u5220\u9664\u56f4\u680f"},w.a.createElement(N.a,{type:"delete",style:{color:"rgba(0,0,0,.45)"},onClick:function(){c&&c(n.fenceId)}})),addonAfter:w.a.createElement(D.a,{title:"\u5efa\u7acb\u56f4\u680f"},w.a.createElement(N.a,{type:"table",onClick:function(){return l(n.lnglat)}}))}))),w.a.createElement(v.a.Item,{label:"\u6807\u7b7e(\u4e1a\u6001)"},t("labels",{initialValue:n&&n.labels?n.labels.split(","):[],rules:[{required:!0,message:"\u8bf7\u586b\u5199"}]})(w.a.createElement(I.a,{dropdownStyle:{maxHeight:400,overflow:"auto"},placeholder:"\u8bf7\u9009\u62e9",allowClear:!0,multiple:!0,treeData:this.state.treeData})))),w.a.createElement("div",{id:"btnbar",style:{marginTop:"20px"}},n&&!n.id&&w.a.createElement(r.a,{size:"small",type:"primary",onClick:this.onRevoke},"\u653e\u5f03"),"\xa0",(!n.id||n.state===V.Constant.status.STATUS_WAIT_SUBMIT)&&w.a.createElement(L.a,{authority:"/createPointAddress/save"},w.a.createElement(r.a,{size:"small",type:"primary",onClick:this.save},"\u4fdd\u5b58"),w.a.createElement(r.a,{size:"small",type:"primary",onClick:this.submit},"\u4fdd\u5b58\u5e76\u63d0\u4ea4")),n&&n.id&&w.a.createElement(L.a,{authority:"/createPointAddress/delete"},w.a.createElement(r.a,{size:"small",type:"primary",onClick:this.onDelete},"\u5220\u9664")),w.a.createElement(r.a,{size:"small",type:"primary",onClick:s},"\u8fd4\u56de\u5217\u8868")))}}]),t}(w.a.Component))||n;function Z(e){for(var t=parseInt(e),a=e-e%100,n=e-e%1e4,r="",o=0;o<O.province.length;o++){var i=O.province[o];i&&i.key===n&&(r=i.label)}var l="",c=O.city[n];if(c)for(var s=0;s<c.length;s++)c[s].key===a&&(l=c[s].label);var p="",u=O.district[a];if(u)for(var d=0;d<u.length;d++)u[d].key===t&&(p=u[d].label);return{district:t,districtName:p,cityName:l,city:a,province:n,provinceName:r}}var W,U=a(138),_=a(237),q=y.a.Header,H=y.a.Content,G=(y.a.Footer,y.a.Sider),J=(v.a.Item,g.a.Option);function K(){var e=(new Date).getTime();return window.performance&&"function"===typeof window.performance.now&&(e+=performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var a=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"===t?a:3&a|8).toString(16)})}var Q="createPointer",X="poiList",Y="createMarker",$="mapDraw",ee="polygon",te={strokeColor:"#F33",strokeOpacity:.05,strokeWeight:.05,fillColor:"#ee2200",fillOpacity:.05,bubble:!0},ae={strokeWeight:2,strokeOpacity:.2,fillColor:"#ee2200",fillOpacity:.1,strokeStyle:"solid"},ne=["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac"],re=Object(k.connect)(function(e){return{pointer:e.pointer}})(W=v.a.create()(W=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(m.a)(this,Object(f.a)(t).call(this,e))).setMapInstance=function(){var e=Object(p.a)(c.a.mark(function e(t){var n,r,o,i,l,p,u,d,m;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=2;break}return e.abrupt("return");case 2:if(n=a.props.currentAdCode,r=void 0===n?1e5:n,a.map=t,!(o=a.props.match.params).id){e.next=20;break}return e.next=8,Object(_.b)({id:o.id});case 8:return i=e.sent,l=i.data,p={adCodeInfo:{district:l.district,districtName:l.districtName,cityName:l.cityName,city:l.city,province:l.province,provinceName:l.provinceName},lnglat:{lng:l.lng,lat:l.lat},fence:l.fence,address:l.address,name:l.name,labels:l.labels,type:l.type,id:l.id,state:l.state,version:l.version},e.next=13,a.createPointerMarker({lnglat:{lng:l.lng,lat:l.lat}},l.state);case 13:return u=e.sent,e.next=16,a.createFencePolygon(p);case 16:d=e.sent,a.setState(Object(s.a)({},a.state,u,{currentPointer:Object(s.a)({},u.currentPointer,p,{fenceId:d?d.id:""}),rightViewMode:Q,mapPolygons:d?[d]:[],showSearchBar:!1})),e.next=28;break;case 20:return e.next=22,Object(x.l)(["ui/geo/DistrictExplorer","ui/misc/PositionPicker","ui/misc/PointSimplifier"]);case 22:m=e.sent,a.DistrictExplorer=m[0],a.PositionPicker=m[1],a.PointSimplifier=m[2],a.districtExplorer=window.districtExplorer=new a.DistrictExplorer({eventSupport:!0,map:t}),a.switch2AreaNode(r);case 28:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.renderAreaPolygons=function(e){a.map.setBounds(e.getBounds(),null,null,!0),a.districtExplorer.clearFeaturePolygons(),a.districtExplorer.renderSubFeatures(e,function(e,t){var a=ne[t%ne.length];return{cursor:"default",bubble:!0,strokeColor:ne[ne.length-1-t%ne.length],strokeOpacity:1,strokeWeight:1,fillColor:a,fillOpacity:.35}}),a.districtExplorer.renderParentFeature(e,{cursor:"default",bubble:!0,strokeColor:"black",strokeOpacity:1,strokeWeight:1,fillColor:e.getSubFeatures().length?null:ne[0],fillOpacity:.35})},a.loadAreaNode=function(e,t){a.districtExplorer.loadAreaNode(e,function(e,a){if(e)return t&&t(e),void console.error(e);t&&t(null,a)})},a.refreshAreaNode=function(e){a.districtExplorer.setHoverFeature(null),a.renderAreaPolygons(e)},a.switch2AreaNode=function(e,t){a.currentAreaNode&&""+a.currentAreaNode.getAdcode()===""+e||a.loadAreaNode(e,function(e,n){e?t&&t(e):(a.currentAreaNode=n,a.districtExplorer.setAreaNodesForLocating([a.currentAreaNode]),a.refreshAreaNode(n),t&&t(null,n))})},a.provinceChange=function(e){a.props.form.setFieldsValue({city:null,district:null}),e&&(a.switch2AreaNode(e),a.setState({mapCircles:[],mapMarkers:[],mapPolygons:[],rightViewMode:null,mapZoom:a.map.getZoom(),currentPointer:null,mapDrawMode:null,mapActionMode:Y}))},a.cityChange=function(e){a.props.form.setFieldsValue({district:null}),e&&(a.switch2AreaNode(e),a.setState({mapCircles:[],mapMarkers:[],mapPolygons:[],rightViewMode:null,mapZoom:a.map.getZoom(),currentPointer:null,mapDrawMode:null,mapActionMode:Y}))},a.districtChange=function(e){e&&(a.switch2AreaNode(e),a.setState({mapCircles:[],mapMarkers:[],mapPolygons:[],rightViewMode:null,mapZoom:a.map.getZoom(),currentPointer:null,mapDrawMode:null,mapActionMode:Y}))},a.onSearch=function(){var e=Object(p.a)(c.a.mark(function e(t){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault(),a.keywordSearch({});case 2:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.keywordSearch=function(e){var t=e.pageIndex,n=void 0===t?1:t,r=e.pageSize,o=void 0===r?20:r,l=Object(i.a)(e,["pageIndex","pageSize"]),c=a.props.form;if(a.addressEle){var s=a.addressEle.input.value,p=c.getFieldValue("province"),u=c.getFieldValue("city"),d=c.getFieldValue("district")||u||p,m=Object.assign({pageSize:o,pageIndex:n,extensions:"all",type:"\u6c7d\u8f66\u670d\u52a1|\u6c7d\u8f66\u9500\u552e|\u6c7d\u8f66\u7ef4\u4fee|\u6469\u6258\u8f66\u670d\u52a1|\u9910\u996e\u670d\u52a1|\u8d2d\u7269\u670d\u52a1|\u751f\u6d3b\u670d\u52a1|\u4f53\u80b2\u4f11\u95f2\u670d\u52a1|\u533b\u7597\u4fdd\u5065\u670d\u52a1|\u4f4f\u5bbf\u670d\u52a1|\u98ce\u666f\u540d\u80dc|\u5546\u52a1\u4f4f\u5b85|\u653f\u5e9c\u673a\u6784\u53ca\u793e\u4f1a\u56e2\u4f53|\u79d1\u6559\u6587\u5316\u670d\u52a1|\u4ea4\u901a\u8bbe\u65bd\u670d\u52a1|\u91d1\u878d\u4fdd\u9669\u670d\u52a1|\u516c\u53f8\u4f01\u4e1a|\u9053\u8def\u9644\u5c5e\u8bbe\u65bd|\u5730\u540d\u5730\u5740\u4fe1\u606f|\u516c\u5171\u8bbe\u65bd"},l);d&&(m.city=d,m.citylimit=!0);var f=new window.AMap.PlaceSearch(m);return new Promise(function(e,t){f.search(s,function(n,r){return"error"===n?t(r):(a.setState({poiList:r.poiList,rightViewMode:X,mapZoom:a.map.getZoom(),center:a.map.getCenter(),mapDrawMode:null,currentPointer:null,mapActionMode:Y}),e(r))})})}},a.onRevokePointer=function(){a.setState({rightViewMode:null,currentPointer:null,mapCircles:[],mapMarkers:[],mapPolygons:[],mapActionMode:Y})},a.onSavePointer=function(){var e=Object(p.a)(c.a.mark(function e(t){var n;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.lnglat.split(","),t.lng=n[0],t.lat=n[1],t.labels=t.labels.join(","),e.next=6,Object(_.a)(t);case 6:e.sent&&U.a.push({pathname:"/listPointAddress",search:a.props.location.search});case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.onSubmitPointer=function(){var e=Object(p.a)(c.a.mark(function e(t){var n;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.lnglat.split(","),t.lng=n[0],t.lat=n[1],t.labels=t.labels.join(","),e.next=6,Object(_.f)(t);case 6:e.sent&&U.a.push({pathname:"/listPointAddress",search:a.props.location.search});case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.onBackList=function(){U.a.push({pathname:"/listPointAddress",search:a.props.location.search})},a.onDeletePointer=function(){var e=Object(p.a)(c.a.mark(function e(t){return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(_.e)(t);case 2:e.sent&&U.a.push({pathname:"/listPointAddress",search:a.props.location.search});case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.renderSearch=function(){var e=a.props.form,t=e.getFieldDecorator,n=e.getFieldValue,i=n("province"),l=n("city"),c=O.city[i]||[],s=O.district[l]||[];return w.a.createElement(v.a,{layout:"inline"},w.a.createElement(v.a.Item,{label:"\u7701"},t("province",{initialValue:i||1e5})(w.a.createElement(g.a,{size:"small",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9",style:{width:100},onChange:a.provinceChange},O.province.map(function(e){return w.a.createElement(J,{key:e.key,value:e.key},e.label)})))),w.a.createElement(v.a.Item,{label:"\u5e02"},t("city",{})(w.a.createElement(g.a,{size:"small",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9",style:{width:100},onChange:a.cityChange},c.map(function(e){return w.a.createElement(J,{key:e.key,value:e.key},e.label)})))),w.a.createElement(v.a.Item,{label:"\u533a\u53bf"},t("district",{})(w.a.createElement(g.a,{size:"small",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9",style:{width:100},onChange:a.districtChange},s.map(function(e){return w.a.createElement(J,{key:e.key,value:e.key},e.label)})))),w.a.createElement(v.a.Item,{label:"\u5730\u5740"},w.a.createElement(o.a,{size:"small",ref:function(e){a.addressEle=e},onChange:function(){}})),w.a.createElement(v.a.Item,null,w.a.createElement("div",{id:"btnbar"},w.a.createElement(r.a,{type:"primary",size:"small",onClick:a.onSearch},"\u67e5\u8be2"),w.a.createElement(r.a,{type:"primary",size:"small",onClick:a.onBackList},"\u8fd4\u56de\u5217\u8868"))))},a.onPoiListPageChange=function(e){a.keywordSearch({pageIndex:e})},a.onPoiListItemSelected=function(e){var t=e.location,n=[t.lng,t.lat],r={id:K(),options:Object(s.a)({},te,{center:n,radius:20})},o={id:K(),options:Object(s.a)({},te,{center:n,radius:500})},i={id:K(),options:Object(s.a)({},te,{center:n,radius:1500})};a.map.clearMap();var l=[r,o,i];a.setState({mapCircles:l,mapCenter:n,mapZoom:15,mapDrawMode:null,currentPointer:{}})},a.createPointer=function(){a.setState({mapActionMode:Y,rightViewMode:Q})},a.onCreatePointerMarkerHandler=function(){var e=Object(p.a)(c.a.mark(function e(t){var n;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.createPointerMarker({lnglat:t.lnglat});case 2:n=e.sent,a.setState(n);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.createPointerMarker=function(){var e=Object(p.a)(c.a.mark(function e(t,n){var r,o,i,l,p;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.lnglat,o={id:t.id||K(),options:{type:"new",position:[r.lng,r.lat],offset:new window.AMap.Pixel(-13,-30),draggable:!n||n===V.Constant.status.STATUS_WAIT_SUBMIT,cursor:"move"},events:{dragend:function(e){var t=e.target.getPosition(),n=Object(s.a)({},o,{options:Object(s.a)({},o.options)}),r=Object(s.a)({},l,{options:Object(s.a)({},l.options)}),i=[t.lng,t.lat];n.options.position=i,r.options.center=i,(new window.AMap.Geocoder).getAddress(i,function(e,o){var l={mapMarkers:[n],mapCircles:[r],mapZoom:15,mapNeedClear:!1,mapCenter:i,rightViewMode:Q,mapActionMode:null,mapDrawMode:null};if("complete"===e&&"OK"===o.info){var c=Z(o.regeocode.addressComponent.adcode),p=o.regeocode.formattedAddress;a.setState(Object(s.a)({},a.state,l,{currentPointer:Object(s.a)({},a.state.currentPointer||{},{adCodeInfo:c,refAddress:p,lnglat:{lng:t.lng,lat:t.lat}})}))}else a.setState(l)})}}},i=[r.lng,r.lat],l={id:K(),options:Object(s.a)({},te,{center:i,radius:1500,editable:!0})},a.map.clearMap(),p=new window.AMap.Geocoder,e.abrupt("return",new Promise(function(e,t){p.getAddress(i,function(t,n){var r={mapMarkers:[o],mapCircles:[l],mapZoom:15,mapCenter:i,rightViewMode:Q,mapActionMode:null,mapDrawMode:null};if("complete"===t&&"OK"===n.info){var c=Z(n.regeocode.addressComponent.adcode),p=n.regeocode.formattedAddress;r=Object(s.a)({},a.state,r,{currentPointer:{adCodeInfo:c,refAddress:p,lnglat:{lng:i[0],lat:i[1]}}})}e(r)})}));case 7:case"end":return e.stop()}},e)}));return function(t,a){return e.apply(this,arguments)}}(),a.onRelocation=function(e){if(e){Math.ceil(10*Math.random());a.setState({mapCenter:[e.lng,e.lat],mapDrawMode:null})}},a.createFencePolygon=function(e){var t=e.id||K(),n=e.fence;if(n){var r=n.split(";"),o=[];return r.forEach(function(e){o.push(e.split(","))}),{id:t,options:Object(s.a)({},ae,{id:t,path:o,editable:e.state&&e.state!==V.Constant.status.STATUS_WAIT_SUBMIT?null:{events:{adjust:function(e){var n=a.state.currentPointer,r=e.target.getPath();n.fence=r.join(";");var o=a.createFencePolygon(n);a.setState({mapPolygons:o?[o]:[],mapActionMode:null,mapDrawMode:!1,currentPointer:Object(s.a)({},n,{fenceId:t})})}}}})}}},a.onRemoveCurrentFence=function(e){var t=a.state.mapPolygons;if(t&&t.length){var n=t.reduce(function(t,a){return console.log(e,a.id),a.id!==e&&t.push(a),t},[]);a.setState({mapPolygons:n,mapActionMode:null,mapDrawMode:!1,currentPointer:Object(s.a)({},a.state.currentPointer,{fence:null})})}},a.pointerInfoChange=function(e){a.setState({currentPointer:Object(s.a)({},a.state.currentPointer,e),mapNeedClear:!1})},a.onCreateFence=function(){a.setState({mapActionMode:$,mapDrawMode:{mode:ee,options:{},events:[function(e){var t=e.obj.getPath(),n=a.state.currentPointer;n.fence=t.join(";");var r=a.createFencePolygon(n);e.obj.getMap().remove(e.obj),a.setState({mapPolygons:[r],mapActionMode:null,mapDrawMode:!1,currentPointer:Object(s.a)({},n,{fenceId:r.id})})}]},mapNeedClear:!1})},a.state={mapCenter:null,mapCircles:[],mapMarkers:[],mapPolygons:[],mapZoom:4,mapNeedClear:!1,mapActionMode:Y,currentPointer:{},showSearchBar:!0},a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this.state,t=e.poiList,a=void 0===t?[]:t,n=e.rightViewMode,r=e.mapCenter,o=e.mapNeedClear,i=e.mapZoom,l=void 0===i?4:i,c=e.mapCircles,s=e.mapMarkers,p=e.mapPolygons,u=e.currentPointer,d=e.mapDrawMode,m=e.mapActionMode,f=e.showSearchBar;return w.a.createElement(y.a,{style:{width:"100%",height:"100%"}},f&&w.a.createElement(q,null,w.a.createElement("div",{style:{float:"left"}},this.renderSearch())),w.a.createElement(y.a,{style:{width:"100%",height:"100%"}},w.a.createElement(H,null,w.a.createElement(M.a,{refer:this.setMapInstance,style:{width:"100%",height:"100%"},events:{click:m===Y?this.onCreatePointerMarkerHandler:null},options:{center:r,drawMode:d,zoom:l,clear:o}},c&&c.length&&c.map(function(e){return w.a.createElement(E.a,{key:e.id,options:e.options,events:e.events})}),s&&s.length&&s.map(function(e){return w.a.createElement(C.a,{key:e.id,options:e.options,events:e.events})}),p&&p.length&&p.map(function(e){return w.a.createElement(P.a,{key:e.id,options:e.options,events:e.events})}))),w.a.createElement(G,{theme:"light",width:n?"25%":"1px",style:{height:"100%",overflow:"auto"}},n===X&&w.a.createElement(A,{poiList:a,onPageChange:this.onPoiListPageChange,onItemSelected:this.onPoiListItemSelected}),n===Q&&w.a.createElement(B,{pointer:u,onRemoveFence:this.onRemoveCurrentFence,onCreateFence:this.onCreateFence,onRelocation:this.onRelocation,onChange:this.pointerInfoChange,onRevoke:this.onRevokePointer,onSave:this.onSavePointer,onDelete:this.onDeletePointer,onSubmit:this.onSubmitPointer,onBack:this.onBackList}))))}}]),t}(w.a.Component))||W)||W;t.default=re}}]);