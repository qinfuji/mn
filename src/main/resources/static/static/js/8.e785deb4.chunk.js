(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{662:function(e,t,a){},666:function(e,t,a){"use strict";a.r(t);a(644);var n=a(641),r=(a(327),a(633)),s=a(17),l=(a(174),a(52)),i=a(37),c=a(38),o=a(40),d=a(39),p=a(41),u=(a(631),a(632)),h=(a(235),a(118)),m=(a(635),a(636)),y=a(1),f=a.n(y),C=a(236),E=a(15),b=a.n(E),S=a(138),w=a(637),v=(a(643),a(640)),g=a(53),T=a(662),A=a.n(T);function I(e){var t=[];return e.forEach(function(e){e.needTotal&&t.push(Object(s.a)({},e,{total:0}))}),t}var k,O=function(e){function t(e){var a;Object(i.a)(this,t),(a=Object(o.a)(this,Object(d.a)(t).call(this,e))).handleRowSelectChange=function(e,t){var n=a.state.needTotalList;n=n.map(function(e){return Object(s.a)({},e,{total:t.reduce(function(t,a){return t+parseFloat(a[e.dataIndex],30)},0)})});var r=a.props.onSelectRow;r&&r(t),a.setState({selectedRowKeys:e,needTotalList:n})},a.handleTableChange=function(e,t,n){var r=a.props.onChange;r&&r(e,t,n)},a.cleanSelectedKeys=function(){a.handleRowSelectChange([],[])};var n=I(e.columns);return a.state={selectedRowKeys:[],needTotalList:n},a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.state,t=e.selectedRowKeys,a=(e.needTotalList,this.props),n=a.data,r=n.list,l=n.pagination,i=a.rowKey,c=Object(g.a)(a,["data","rowKey"]),o=Object(s.a)({showSizeChanger:!0,showQuickJumper:!0},l),d={selectedRowKeys:t,onChange:this.handleRowSelectChange,getCheckboxProps:function(e){return{disabled:e.disabled}}};return f.a.createElement("div",{className:A.a.standardTable},f.a.createElement(v.a,Object.assign({size:"middle",rowKey:i||"key",rowSelection:d,dataSource:r,pagination:o,onChange:this.handleTableChange},c)))}}],[{key:"getDerivedStateFromProps",value:function(e){return 0===e.selectedRows.length?{selectedRowKeys:[],needTotalList:I(e.columns)}:null}}]),t}(y.PureComponent),j=a(328),x=a(634),z=m.a.Header,_=m.a.Content,L=(m.a.Footer,m.a.Sider,h.a.Option),R=Object(C.connect)(function(e){return{pointerAddress:e.pointerAddress}})(k=u.a.create()(k=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(o.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(r)))).state={},a.entryCreatePointer=function(){S.a.push({pathname:"/createPointAddress",search:a.props.location.search})},a.enterCreatePointer=function(e){S.a.push({pathname:"/createPointAddress/"+e,search:a.props.location.search})},a.enterCreateConclusion=function(e){S.a.push({pathname:"/createAppraise/pointerAddressId/".concat(e,"/conclusion"),search:a.props.location.search})},a.enterCreateAppraise=function(e){S.a.push({pathname:"/createAppraise/pointerAddressId/".concat(e,"/appraise"),search:a.props.location.search})},a.columns=[{title:"\u70b9\u5740\u540d\u79f0",dataIndex:"name"},{title:"\u7c7b\u522b",width:"80px",dataIndex:"type",render:function(e){return f.a.createElement("span",null,j.Constant.typeLabel[e])}},{title:"\u7701",width:"80px",dataIndex:"provinceName"},{title:"\u5e02",width:"120px",dataIndex:"cityName"},{title:"\u533a\u53bf",width:"100px",dataIndex:"districtName"},{title:"\u5730\u5740",dataIndex:"address"},{title:"\u72b6\u6001",width:"90px",sorter:!0,dataIndex:"state",render:function(e){var t="state "+e;return f.a.createElement("span",{className:t},j.Constant.statusLabels[e])}},{title:"\u521b\u5efa\u65f6\u95f4",sorter:!0,dataIndex:"createdTime",render:function(e){return f.a.createElement("span",null,b()(e).format("YYYY-MM-DD HH:mm:ss"))}},{title:"\u64cd\u4f5c",render:function(e,t){return f.a.createElement(f.a.Fragment,null,t.state!==j.Constant.status.STATUS_DELETE&&f.a.createElement(x.a,{authority:"/pointAddressManager"},f.a.createElement(l.a,{className:"operationBtn",size:"small",onClick:function(){return a.enterCreatePointer(t.id)}},"\u70b9\u5740\u7ba1\u7406")),f.a.createElement(x.a,{authority:"/appraiseManager"},t.state===j.Constant.status.STATUS_NOT_ESTIMATE&&t.state!==j.Constant.status.STATUS_DELETE&&f.a.createElement(l.a,{type:"primary",size:"small",onClick:function(){return a.enterCreateAppraise(t.id)}},"\u8bf7\u6c42\u8bc4\u4f30"),t.state!==j.Constant.status.STATUS_NOT_ESTIMATE&&t.state!==j.Constant.status.STATUS_WAIT_SUBMIT&&t.state!==j.Constant.status.STATUS_DELETE&&f.a.createElement(l.a,{type:"primary",size:"small",onClick:function(){return a.enterCreateAppraise(t.id)}},"\u8bc4\u4f30\u7ba1\u7406")),(t.state===j.Constant.status.STATUS_ESTIMATE_FINISH||t.state===j.Constant.status.STATUS_ALL_FINISH)&&f.a.createElement(x.a,{authority:"/conclusionManager"},f.a.createElement(l.a,{className:"operationBtn",size:"small",onClick:function(){return a.enterCreateConclusion(t.id)}},"\u4efb\u52a1\u7ed3\u8bba")))}}],a.onSearchHandler=function(e){e.preventDefault();var t=a.props,n=t.dispatch;t.form.validateFields(function(e,t){if(!e){delete t.password;var r=Object(s.a)({},t);r.district?(r.scope="district",r.adcode=r.district):r.city?(r.scope="city",r.adcode=r.city):r.province&&1e5!==r.province&&(r.scope="province",r.adcode=r.province),r.orderby="created_time desc",a.setState({formValues:r}),n({type:"pointerAddress/fetch",payload:Object(s.a)({pageSize:20,pageIndex:1},r)})}})},a.handleStandardTableChange=function(e,t,n){var r=a.props.dispatch,l=a.state.formValues,i=Object(s.a)({pageIndex:e.current,pageSize:e.pageSize},l);if(n.field){var c=n.order.replace(/end$/g,""),o=n.field;"createdTime"===n.field&&(o="created_time"),i.orderby="".concat(o," ").concat(c)}else i.orderby="created_time desc";r({type:"pointerAddress/fetch",payload:i})},a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"renderSearch",value:function(){var e=this.props.form,t=e.getFieldDecorator,a=e.getFieldValue,n=a("province"),s=a("city"),i=w.city[n]||[],c=w.district[s]||[];return f.a.createElement(u.a,{layout:"inline"},f.a.createElement(u.a.Item,{label:"\u7701\u4efd"},t("province",{initialValue:n||1e5})(f.a.createElement(h.a,{size:"small",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9",style:{width:100},onChange:this.provinceChange},w.province.map(function(e){return f.a.createElement(L,{key:e.key,value:e.key},e.label)})))),f.a.createElement(u.a.Item,{label:"\u5e02"},t("city",{})(f.a.createElement(h.a,{size:"small",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9",style:{width:100},onChange:this.cityChange},i.map(function(e){return f.a.createElement(L,{key:e.key,value:e.key},e.label)})))),f.a.createElement(u.a.Item,{label:"\u533a\u53bf"},t("district",{})(f.a.createElement(h.a,{size:"small",allowClear:!0,placeholder:"\u8bf7\u9009\u62e9",style:{width:100},onChange:this.districtChange},c.map(function(e){return f.a.createElement(L,{key:e.key,value:e.key},e.label)})))),f.a.createElement(u.a.Item,{label:"\u5730\u5740"},t("address",{})(f.a.createElement(r.a,{size:"small",style:{width:100}}))),f.a.createElement(u.a.Item,{label:"\u72b6\u6001"},t("state",{})(f.a.createElement(h.a,{allowClear:!0,style:{width:120},size:"small"},Object.keys(j.Constant.statusLabels).map(function(e){return f.a.createElement(L,{key:e,value:e},j.Constant.statusLabels[e])})))),f.a.createElement(u.a.Item,null,f.a.createElement(l.a,{type:"primary",size:"small",onClick:this.onSearchHandler},"\u67e5\u8be2"),"\xa0\xa0",f.a.createElement(x.a,{authority:"/pointAddressManager/save"},f.a.createElement(l.a,{type:"primary",onClick:this.entryCreatePointer,size:"small"},"\u65b0\u5efa\u70b9\u5740"))))}},{key:"componentDidMount",value:function(){(0,this.props.dispatch)({type:"pointerAddress/fetch",payload:{pageSize:20,pageIndex:1,orderby:"created_time desc"}})}},{key:"render",value:function(){var e=this.props.pointerAddress.data;return f.a.createElement(m.a,{style:{width:"100%",height:"100%"}},f.a.createElement(z,null,f.a.createElement("div",null,this.renderSearch())),f.a.createElement(m.a,{style:{width:"100%",height:"100%"}},f.a.createElement(_,null,f.a.createElement(n.a,null,f.a.createElement(O,{size:"middle",bordered:!0,selectedRows:[],data:e,columns:this.columns,onSelectRow:this.handleSelectRows,onChange:this.handleStandardTableChange,rowKey:"id",rowSelection:void 0})))))}}]),t}(f.a.Component))||k)||k;t.default=R}}]);