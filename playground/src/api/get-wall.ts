import { request } from './request';

export function getWall(username: string, options: Record<string, string>) {
  return request({
    url: `/_/${username}`,
    params: options,
  });
}
