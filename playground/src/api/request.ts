import axios, { AxiosRequestConfig } from 'axios';
import { Notify } from 'quasar';
import { getApiBaseUrl } from '../utils/runtime-env';

export async function request(cfg: AxiosRequestConfig = {}) {
  try {
    const response = await axios({
      baseURL: getApiBaseUrl(),
      ...cfg,
    });
    return response.data;
  } catch (err: any) {
    Notify.create({ message: err.message, color: 'red' });
    throw err;
  }
}
