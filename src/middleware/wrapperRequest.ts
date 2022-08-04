import { request } from '../utils';
import { Action } from '@rematch/core';

interface WrapperOptions {
  fetch: typeof request;
  fetchOptionsProc: (data: any, headers?: HeadersInit_, method?: string) => RequestInit;
  urlProc: (url: string) => string;
  errorCallback?: () => void;
}
export type Status = 'start' | 'success' | 'failure';
export type Payload<T> = {
  loading: boolean;
  status: Status;
  data: T;
};

export const wrapperRequest = ({
  fetch,
  fetchOptionsProc,
  urlProc,
  errorCallback,
}: WrapperOptions) => (next: (action: Action) => unknown) => (action: {
  type: string;
  payload: {
    apiUrl?: string; // API请求的真实URL，当有此项忽略apiName，默认没有
    params?: unknown; // 一般是Post请求的body
    apiName?: string; // urlProc函数的参数，一般通过此key在mapping表中找真实的URL
    apiOptions?: RequestInit; // 其余的options添加项
    method?: 'POST' | 'GET';
  };
}) => {
  if (!fetch) {
    return next(action);
  }

  const { type, payload } = action;
  const { params, apiName, apiOptions, apiUrl = '' } = payload || {};
  let url: string = apiUrl;
  if (!apiUrl) {
    if (urlProc && apiName) {
      url = urlProc(apiName);
    }
  }

  let options = (apiOptions || {});
  if (fetchOptionsProc && payload) {
    options = {
      ...fetchOptionsProc(params, options.headers, payload.method),
      ...options,
    };
  } else {
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '',
      ...options,
    };
  }

  if (url && options) {
    next({
      type,
      payload: {
        loading: true,
        status: 'start',
        params,
      },
    });

    return fetch(url, options)
      .then((data) => {
        next({
          type,
          payload: {
            data,
            loading: false,
            status: 'success',
            params,
          },
        });
        return data;
      })
      .catch((error: Error) => {
        next({
          type,
          payload: {
            error,
            loading: false,
            status: 'failure',
            params,
          },
        });
        if (errorCallback) errorCallback();
        // throw error;
      });
  }
  return next(action);
};
