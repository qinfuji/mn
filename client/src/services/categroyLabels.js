import request from '../utils/request';

var HOST = 'http://localhost:8086';

export async function fatch(parentId) {
  if (parentId) {
    return request(`${HOST}/api/categroylabels/query?parentId=${parentId}`, {
      method: 'GET',
    });
  } else {
    return request(`${HOST}/api/categroylabels/query`, {
      method: 'GET',
    });
  }
}

export async function create(params) {
  return request(`${HOST}/api/categroylabels/createOrUpdate`, {
    method: 'POST',
    body: params,
  });
}

export async function invalid(params) {
  return request(`${HOST}/api/categroylabels/${params.id}/state`, {
    method: 'PUT',
  });
}

export async function queryRootByLabel(label) {
  return request(`${HOST}/api/categroylabels/queryRootByLabel?rootLabel=${label}`, {
    method: 'GET',
  });
}
