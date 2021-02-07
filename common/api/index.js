import Request from './request'
import { API_BASE_URL } from '../config.js'

const http = new Request();

http.setConfig((config) => {
  config.baseUrl = API_BASE_URL;
  return config
})

http.interceptor.request((config, cancel) => {
  const USER_TOKEN = uni.getStorageSync('USER_TOKEN');
  config.header = {
    ...config.header,
    'user-token': USER_TOKEN
  }
  /*
  if (!token) {
    cancel('token 不存在')
  }
  */
  return config;
})

http.interceptor.response((response) => {
  return response;
})

export {
  http
};
