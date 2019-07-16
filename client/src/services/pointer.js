import request from '../utils/request';

import config from '@config';

var HOST = config.HOST;

export async function fetch(params) {
  return request(`${HOST}/api/pointerAddresses/list`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchSharePointerAddress(params) {
  return request(`${HOST}/api/sharePointerAddresses/list`, {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`${HOST}/api/pointerAddresses/${params.id}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request(`${HOST}/api/pointerAddresses/createOrUpdate`, {
    body: params,
    method: 'POST',
  });
}

export async function submit(params) {
  return request(`${HOST}/api/pointerAddresses/submit`, {
    body: params,
    method: 'POST',
  });
}

export async function remove(params) {
  return request(`${HOST}/api/pointerAddresses/${params.id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`${HOST}/api/pointerAddresses/${params.id}`, {
    body: params,
    method: 'PUT',
  });
}
