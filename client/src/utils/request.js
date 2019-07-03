import * as fetch from 'isomorphic-fetch';
import Config from '@config';
import {notification} from 'antd';

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function _getAuthInfo() {
  return {
    userAccount: getQueryString('userAccount'),
    token: getQueryString('token'),
  };
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // 系统错误
  const errortext = response.message || codeMessage[response.status] || response.statusText;
  notification.error({
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  //如果是认证授权错误，删除当前的用户存储
  throw error;
};

async function request(url, option) {
  if (!/^https?:\/\//.test(url)) {
    url = Config.HOST + url;
  }
  const options = {
    ...option,
  };

  const defaultOptions = {
    //credentials: 'include',
  };

  const newOptions = {
    ...defaultOptions,
    ...options,
  };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE' ||
    newOptions.method === 'GET'
  ) {
    var authInfo = _getAuthInfo();
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
        token: authInfo.token,
        userAccount: authInfo.userAccount,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
        token: authInfo.token,
        userAccount: authInfo.userAccount,
      };
    }
  }

  try {
    const response = await fetch(url, newOptions);
    await checkStatus(response);
    const json = await response.json();
    if (json.code !== '0') {
      // 处理业务异常
      notification.error({
        description: json.message,
      });
      const error = new Error(json.message);
      error.name = json.code;
      error.response = json;
      throw error;
    }
    return json;
  } catch (e) {
    const status = e.name;
    if (status === 401) {
      // 退出到登录页面
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
    }
  }
}

export default request;
