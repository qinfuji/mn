import request from '../utils/request';
import config from '@config';

var HOST = config.HOST;

export async function getEsmtimateByPointerAddressId(params) {
  return request(`${HOST}/api/estimateTask/querybyPointerAddressId?paId=${params.pointerAddressId}`, {
    method: 'GET',
  });
}

export async function createEsmtimate(params, type) {
  if (type === 'save') {
    return request(`${HOST}/api/estimateTask/create`, {
      method: 'POST',
      body: params,
    });
  } else {
    return request(`${HOST}/api/estimateTask/submit`, {
      method: 'POST',
      body: params,
    });
  }
}

export async function getEsmtimateDataResult(params) {
  return request(`${HOST}/api/estimateTask/getDataResult?emtimateId=${params.id}`, {
    method: 'GET',
  });
}

export async function saveConclusion(id, params) {
  return request(`${HOST}/api/estimateTask/saveConclusion?emtimateId=${id}`, {
    method: 'PUT',
    body: params,
  });
}

//获取测控点列表
export async function getObserveList() {
  return request(`${HOST}/api/estimateTask/getObserveList`, {
    method: 'GET',
  });
}
