import configs from './index';
import { getUserInfo } from '../utils';
import {
  homeApi,
  loginApi,
} from './apiUrl';
import * as RNConfig from '../../env';

// API对应url配置
export const apiConfig: { [key: string]: string } = {
  ...homeApi, // 首页api
  ...loginApi, // 登录api
}; // 登录接口

// 真实环境请求的url
export function apiURL(type: string) {
  if (apiConfig[type] && apiConfig[type].length > 0) {
    if (RNConfig.MOCK && configs.mockWhiteList.indexOf(apiConfig[type]) >= 0) {
      console.log(`${configs.apiServer.mock}${apiConfig[type]}`);
      return `${configs.apiServer.mock}${apiConfig[type]}`; // Mock服务器代理
    }

    return `${configs.apiServer[RNConfig.NODE_ENV]}${apiConfig[type]}`;
  }

  throw new Error('该api匹配不到url，请检查api名称或apiConfig配置');
}

// 基本的Get请求options封装
export function ajaxGetOptions(): RequestInit {
  return {
    method: 'GET',
  };
}

// 基本的Post请求options封装
export function ajaxPostOptions(data: any, headers: HeadersInit_ ): RequestInit {
  const { accptMd } = configs;
  const { custNo = '', token = '' } = getUserInfo() || {};
  const uuid = configs.maccode;

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accptMd,
      lvcToken: token,
      appName: configs.appName,
      custNo,
      uuid,
      env: RNConfig.NODE_ENV,
      ...headers,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  };
}

// form表单请求Post的options封装
export function ajaxFormPostOptions(data: { [key: string]: any }, headers: HeadersInit_): RequestInit {
  const formData = new FormData();
  Object.keys(data).forEach((key: string) => formData.append(key, JSON.stringify(data[key])));
  return {
    method: 'POST',
    headers: {
      env: RNConfig.NODE_ENV,
      ...headers,
    },
    credentials: 'include',
    body: formData,
  };
}
