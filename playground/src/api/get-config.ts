import { request } from './request';

export function getConfig() {
  return request({ url: '/config' });
}
