// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('mn-permissions') : str;
  if (!authorityString) {
    return [];
  }
  return JSON.parse(authorityString);
}

export function setAuthority(permissions) {
  // 清空
  if (!permissions) {
    localStorage.removeItem('mn-permissions');
    return;
  }
  localStorage.setItem('mn-permissions', JSON.stringify(permissions));
}
