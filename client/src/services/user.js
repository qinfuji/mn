import request from '../utils/request';
import config from '@config';

var HOST = config.HOST;

export async function fetchUserPermissions() {
  return request(`${HOST}/api/auth/userPermissions`, {
    method: 'GET',
  });
}
