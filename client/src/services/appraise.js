import request from '../utils/request';

var HOST = 'http://localhost:8086';

export async function getEsmtimateByPointerAddressId(params) {
  return request(`${HOST}/api/estimateTask/querybyPointerAddressId?paId=${params.pointerAddressId}`, {
    method: 'GET',
  });
}
