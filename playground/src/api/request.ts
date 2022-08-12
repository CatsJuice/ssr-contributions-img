import axios, { AxiosRequestConfig } from 'axios';
import { useQuasar } from 'quasar';

export async function request(cfg: AxiosRequestConfig = {}) {
  try {
    const response = await axios({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      ...cfg,
    });
    return response.data;
  } catch (err: any) {
    useQuasar().notify({ message: err.message, color: 'red' });
  }
}
