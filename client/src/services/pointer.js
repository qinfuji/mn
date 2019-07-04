import request from '../utils/request';

var HOST = 'http://localhost:8086';

export async function fetch(params) {
  return request(`${HOST}/api/pointers/list`, {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`${HOST}/api/pointers/${params.id}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request(`${HOST}/api/pointers/create`, {
    body: params,
    method: 'POST',
  });
}

export async function submit(params) {
  return request(`${HOST}/api/pointers/submit`, {
    body: params,
    method: 'POST',
  });
}

export async function remove(params) {
  return request(`${HOST}/api/pointers/${params.id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`${HOST}/api/pointers/${params.id}`, {
    body: params,
    method: 'PUT',
  });
}