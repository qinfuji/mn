import {createHashHistory} from 'history';

//import createHistory from 'history/createHashHistory';

const history = createHashHistory();

// function getQueryString(name) {
//   var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
//   var href = window.location.href;
//   var idx = window.location.href.indexOf('?');
//   if (idx === -1) {
//     return;
//   }

//   var r = href.substring(idx + 1).match(reg);
//   if (r != null) return unescape(r[2]);
//   return null;
// }

// function _getAuthInfo() {
//   return {
//     userAccount: getQueryString('userAccount'),
//     token: getQueryString('token'),
//   };
// }

// push = history.push.bind(history);

// histiry.push = function(path){
//     push()
// }

export default history;
