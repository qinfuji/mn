(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{657:function(e,a,t){"use strict";t.r(a);t(639);var n,r=t(636),l=(t(326),t(630)),c=t(17),o=(t(170),t(52)),i=(t(634),t(638)),s=t(18),u=t.n(s),d=t(33),p=t(41),b=t(42),h=t(44),m=t(43),f=t(45),y=(t(628),t(629)),C=(t(631),t(632)),w=t(1),E=t.n(w),v=t(635),k=C.a.Header,g=C.a.Content,x=(C.a.Footer,C.a.Sider,y.a.create()(n=function(e){function a(){var e,t;Object(p.a)(this,a);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(t=Object(h.a)(this,(e=Object(m.a)(a)).call.apply(e,[this].concat(r)))).state={showCreateModal:!1,parentCategroyLabel:null,categroyLabel:null,action:null,data:[],defaultExpandAllRows:[]},t.handldOnExpand=function(e,a){setTimeout(Object(d.a)(u.a.mark(function e(){var n,r;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a.loaded){e.next=6;break}return a.loaded=!0,e.next=4,Object(v.b)(a.id);case 4:(n=e.sent)&&(r=n.data)&&r.length&&(r.forEach(function(e){e.children=[],e.parent=a}),a.children=a.children.concat(r),t.setState({data:[].concat(t.state.data)}));case 6:case"end":return e.stop()}},e)})),100)},t.showCreateModal=function(e){t.props.form.setFieldsValue({labelName:""}),t.setState({showCreateModal:!0,parentCategroyLabel:e,action:"create"})},t.showUpdateModal=function(e){t.props.form.setFieldsValue({labelName:e.label}),t.setState({showCreateModal:!0,parentCategroyLabel:null,categroyLabel:e,action:"update"})},t.deleteLabel=function(e){i.a.confirm({title:"\u60a8\u786e\u5b9a\u8981\u5220\u9664<".concat(e.label,">\u6807\u7b7e?"),onOk:function(){var a=Object(d.a)(u.a.mark(function a(){var n,r,l,c;return u.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,Object(v.d)(e);case 2:n=a.sent,r=t.state.data,n&&(e.parent?((c=e.parent.children.indexOf(e))>=0&&e.parent.children.splice(c,1),t.setState({data:[].concat(r)})):(l=r.reduce(function(a,t){return t.id!==e.id&&a.push(t),a},[]),t.setState({data:[].concat(l)})));case 5:case"end":return a.stop()}},a)}));return function(){return a.apply(this,arguments)}}(),onCancel:function(){}})},t.hideCreateModal=function(){t.props.form.setFieldsValue({labelName:""}),t.setState({showCreateModal:!1,parentCategroyLabel:null,categroyLabel:null,action:null})},t.columns=[{title:"\u6807\u7b7e\u540d\u79f0",dataIndex:"label",key:"label"},{title:"\u64cd\u4f5c",width:"50%",render:function(e,a){return E.a.createElement("div",{id:"btnbar"},E.a.createElement(o.a,{size:"small",onClick:function(){t.showCreateModal(a)}},"\u521b\u5efa\u5b50\u6807\u7b7e"),E.a.createElement(o.a,{size:"small",onClick:function(){t.showUpdateModal(a)}},"\u4fee\u6539"),E.a.createElement(o.a,{size:"small",onClick:function(){t.deleteLabel(a)}},"\u4f5c\u5e9f"))}}],t.onSave=function(e){var a=t.state,n=a.parentCategroyLabel,r=a.categroyLabel,l=a.action,o=a.data,i=(a.defaultExpandAllRows,t.props.form),s=i.validateFields,p=i.setFieldsValue;s(["labelName"],function(){var a=Object(d.a)(u.a.mark(function a(i,s){var d,b,h;return u.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if(!i){a.next=2;break}return a.abrupt("return");case 2:return d={label:s.labelName},n&&"create"===l?(d.parentId=n.id,d.children=[]):"update"===l&&(d.id=r.id),a.next=6,Object(v.a)(d);case 6:(b=a.sent)&&"create"===l?(d.children=[],n?(d.id=b.data.id,d.parent=n,n.children.push(d)):o.push(d)):b&&"update"===l&&(r.label=d.label),h={},"close"===e&&(h={showCreateModal:!1,parentCategroyLabel:null,categroyLabel:null,action:null}),p({labelName:""}),b&&t.setState(Object(c.a)({data:[].concat(o)},h));case 12:case"end":return a.stop()}},a)}));return function(e,t){return a.apply(this,arguments)}}())},t.onSearch=Object(d.a)(u.a.mark(function e(){return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:setTimeout(Object(d.a)(u.a.mark(function e(){var a,n,r,l;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a=t.props.form,n=a.getFieldValue("rootParentName"),r=null,!n){e.next=9;break}return e.next=6,Object(v.e)(n);case 6:r=e.sent,e.next=12;break;case 9:return e.next=11,fetch();case 11:r=e.sent;case 12:r&&((l=r.data).forEach(function(e){e.children=[]}),t.setState({data:l}));case 13:case"end":return e.stop()}},e)})),100);case 1:case"end":return e.stop()}},e)})),t}return Object(f.a)(a,e),Object(b.a)(a,[{key:"componentDidMount",value:function(){var e=this;setTimeout(Object(d.a)(u.a.mark(function a(){var t,n;return u.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,Object(v.b)();case 2:(t=a.sent)&&((n=t.data).forEach(function(e){e.children=[]}),e.setState({data:n}));case 4:case"end":return a.stop()}},a)})),100)}},{key:"render",value:function(){var e=this,a=this.props.form.getFieldDecorator,t=this.state,n=t.data,c=t.action;return E.a.createElement(C.a,{style:{height:"100%"}},E.a.createElement(k,null,E.a.createElement(y.a,{layout:"inline"},E.a.createElement(y.a.Item,{label:"\u6839\u6807\u7b7e\u540d\u79f0"},a("rootParentName",{})(E.a.createElement(l.a,null))),E.a.createElement(y.a.Item,null,E.a.createElement(o.a,{type:"primary",onClick:this.onSearch},"\u67e5\u8be2")),E.a.createElement(y.a.Item,null,E.a.createElement(o.a,{type:"primary",onClick:function(){e.showCreateModal()}},"\u521b\u5efa\u6839\u6807\u7b7e")))),E.a.createElement(C.a,{style:{width:"100%",height:"100%",backgroundColor:"#fff"}},E.a.createElement(g,null,E.a.createElement("div",{id:"categroyLabelTable"},E.a.createElement(r.a,{size:"small",rowKey:"id",bordered:!0,columns:this.columns,dataSource:n,onExpand:this.handldOnExpand})))),E.a.createElement(i.a,{maskClosable:!1,title:"\u521b\u5efa\u73ed\u7ea7",visible:this.state.showCreateModal,onCancel:this.hideCreateModal,footer:[E.a.createElement(o.a,{key:"cancel",onClick:this.hideCreateModal},"\u53d6\u6d88"),E.a.createElement(o.a,{key:"save",type:"primary",onClick:this.onSave.bind(this,"close")},"create"===c?"\u521b\u5efa":"\u4fee\u6539"),"create"===c?E.a.createElement(o.a,{key:"saveContinue",type:"primary",onClick:this.onSave.bind(this,"continue")},"\u521b\u5efa\u5e76\u7ee7\u7eed"):null]},E.a.createElement(y.a,{labelCol:{span:6},wrapperCol:{span:14}},this.state.parentCategroyLabel&&E.a.createElement(y.a.Item,{label:"\u7236\u6807\u7b7e\u540d\u79f0"},this.state.parentCategroyLabel.label),E.a.createElement(y.a.Item,{label:"\u6807\u7b7e\u540d\u79f0"},a("labelName",{initialValue:this.state.categroyLabel?this.state.categroyLabel.label:""})(E.a.createElement(l.a,null))))))}}]),a}(E.a.Component))||n);a.default=x}}]);