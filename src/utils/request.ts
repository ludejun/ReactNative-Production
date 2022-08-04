import { logout } from './asyncStorage';
import configs from '../configs';
import store from '../store';

interface Resp<T> {
  data: T;
  errCode: string;
  errMsg?: string;
}

function parseJSON<T>(response: Response) {
  return response.json() as Promise<Resp<T>>;
}

// 根据后端规范三要素更改此函数代码
function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) return response;

  const error = new Error(response.statusText) as Error & {
    response: Response;
  };
  error.response = response;
  throw error;
}
// 处理业务Code
function checkoutCode<T>(response: Resp<T>) {
  const { errCode, errMsg } = response || {};
  if (String(response.errCode) === configs.successCode.value) {
    return response.data;
  }
  // 其他特殊业务Code处理，如登录态过期、后端报错
  if (String(response.errCode) === '8000') {
    // 特殊Code处理，如无登录态直接跳转Login
    store.dispatch({ type: 'global/showToastGlobal', payload: errMsg });
    setTimeout(() => logout('FaceId', {}, false), 1000);
    // message.error(errMsg).then(() => (window.location.href = window.location.origin + '/login'));
    throw new Error('登录态已经过期');
  } else if (errCode === '9001') {
    store.dispatch({ type: 'global/showToastGlobal', payload: errMsg });
    throw new Error('业务报错');
  }

  return response;
}

function catchError(error: Error) {
  console.log('catchError', error);
  // 统一request请求报错处理，弹toast等
  return Promise.reject(error);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url: string, options: RequestInit) {
  return fetch(url, options).then(checkStatus).then(parseJSON).then(checkoutCode).catch(catchError);
}
