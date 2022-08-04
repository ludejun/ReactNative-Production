import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import { createLogger } from 'redux-logger';
import { apiURL, ajaxPostOptions, ajaxGetOptions, apiConfig } from './configs/api';
import request from './utils/request';
import { wrapperRequest } from './middleware/wrapperRequest';
import { models, RootModel } from './models';

const promiseMiddlewareConfig = {
  fetch: request,
  urlProc: (apiName: string) => apiURL(apiName),
  fetchOptionsProc: (data: any, header = {}, method = 'POST') =>
    method === 'POST' ? ajaxPostOptions(data, header) : ajaxGetOptions(),
  // errorCallback: () => console.log('攻城狮开小差了，请稍后重试～'),
};

const logger = createLogger();

const store = init({
  models,
  redux: { middlewares: [wrapperRequest.bind(null, promiseMiddlewareConfig), logger] },
});

export default store;

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

// type ChangeDispatchType<
//   T extends Record<string | number, Record<string | symbol | number, (...args: never[]) => unknown>>,
// > = {
//   [k in keyof T]: {
//     [ik in keyof T[k]]: <A extends keyof ApiDict | undefined>(
//       payload: A extends keyof ApiDict
//         ? {
//           params: ApiDict[A]['request'];
//           apiName: A;
//         }
//         : Parameters<T[k][ik]>[0]['payload'],
//     ) => A extends keyof ApiDict ? Promise<ApiDict[A]['response']> : ReturnType<T[k][ik]>;
//   };
// };

// 根据中间件改造Dispatch，当有API等异步dispatch，需要使用DispatchPro而不是Dispatch类型
type ChangeDispatchType<T extends Record<string, Record<string, (...args: never[]) => unknown>>> = {
  [k in keyof T]: {
    [ik in keyof T[k]]: <
      A extends
      | {
        params: Record<string, any>;
        apiName?: keyof typeof apiConfig;
        apiUrl?: string;
        apiOptions?: RequestInit;
        method?: 'GET' | 'POST';
      }
      | Parameters<T[k][ik]>[0],
    >(
      payload: A,
    ) => A extends { params: Record<string, any> }
      ? Promise<Parameters<T[k][ik]>[0]['data'] | void> // 这里的Promise的返回值是中间件中成功的return
      : ReturnType<T[k][ik]>;
  };
};

export type DispatchPro = ChangeDispatchType<Dispatch>;