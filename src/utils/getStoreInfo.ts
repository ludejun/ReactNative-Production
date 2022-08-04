import store from '../store';
import { getItem } from './asyncStorage';

// !important -> TODO 需要根据实际业务调整类型
export interface UserInfo {
  custNo: string;
  token: string;
}
export const getUserInfo = (): UserInfo | null => {
  const { userInfo } = store.getState().login;
  if (userInfo && Object.keys(userInfo).length > 0) return userInfo;
  return null;
};

/**
 * @description 获取缓存中的userInfo, promisee异步，优先获取store中数据
 */
export const getUserInfoAsync = (): Promise<UserInfo> => (
  new Promise((rel, rej) => {
    console.log('getUserInfo', getUserInfo());
    if (getUserInfo()) return rel(getUserInfo() || {} as UserInfo);
    getItem('userInfo').then((data: UserInfo) => {
      if (data) rel(data);
      rej('');
    });
  })
);

/**
 * 获取极光推送ID
 * @returns jPushId
 */
export const getJPushId: () => string = () => {
  const { jPushId } = store.getState().global;
  return jPushId || '';
};
