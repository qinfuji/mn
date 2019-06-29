// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('saiwill-role') : str;
  let authority = ['home'];
  if (!authorityString) {
    return null;
  }
  try {
    const permissions = JSON.parse(authorityString).permissions;
    if (permissions && permissions.length > 0) {
      authority = permissions.reduce((result, permission) => {
        result.push(permission.name);
        return result;
      }, []);
    }
  } catch (e) {
    authority = 'guest';
  }

  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || [];
}

export function getCurrentUser() {
  const userString = localStorage.getItem('saiwill-user');
  if (!userString) {
    return null;
  }
  return JSON.parse(userString);
}

export function getToken() {
  const tokenString = localStorage.getItem('saiwill-token');
  return tokenString;
}

export function setAuthority(loginInfo) {
  // 清空
  if (!loginInfo) {
    localStorage.removeItem('saiwill-user');
    localStorage.removeItem('saiwill-role');
    localStorage.removeItem('saiwill-token');
    return;
  }
  const { userInfo, role, __token } = loginInfo;

  localStorage.setItem('saiwill-user', JSON.stringify(userInfo));
  localStorage.setItem('saiwill-role', JSON.stringify(role));
  localStorage.setItem('saiwill-token', __token);
}
