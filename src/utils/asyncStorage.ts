import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as RNConfig from '../../env';
import configs from '../configs';
import store from '../store';
import { resetHome } from './navigation';

export const setItem = (name: string, obj: unknown) =>
  AsyncStorage.setItem(name, JSON.stringify(obj)).then((data) => data);

export const getItem = (name: string) =>
  AsyncStorage.getItem(name).then((data = '') => data && JSON.parse(data));

export const removeItem = (name: string) => AsyncStorage.removeItem(name);
// eslint-disable-next-line no-alert
export const clearStorage = () => {
  AsyncStorage.clear().then(() => {
    if (RNConfig.NODE_ENV === 'dev') Alert.alert('', '成功清除缓存');
  });
};

/**
 * 当退出登录时，有store和缓存数据需要清除，但是像隐私协议、前置页等缓存数据需要先获取，等全清后再写回去
 * @param resetName 登出后reset回到的页面，默认是Tab页，根据业务更改路由名称
 * @param params reset时携带的参数
 * @param needRequest 是否需要调用登出接口，默认需要
 * @returns logout函数
 */
export const logout = (resetName = 'HomeTab', params = {}, needRequest = true) => {
  // 需要保留的缓存
  Promise.all([
    getItem('isPopSecret'), // 隐私协议弹框
    getItem('frontInfo'), // 跑马灯前置页
    getItem('userGesturePasswordObj'), // 手势密码
  ]).then((values) => {
    const [isPopSecret, frontInfo, userGesturePasswordObj] = values;
    // 退出登录要调一下退出登录的接口
    if (needRequest) {
      store.dispatch({
        type: 'login/logout',
        payload: {
          params: {},
          apiName: 'logout',
        },
      });
    }

    // 清空缓存和Store，可依据业务情况而定
    AsyncStorage.clear().then((data) => {
      console.log('AsyncStorage', data);
      store.dispatch({
        type: 'global/changeFaceId',
      });
      store.dispatch({
        type: 'login/loginClear',
      });
      store.dispatch({
        type: 'home/homeClear',
      });

      if (userGesturePasswordObj) setItem('userGesturePasswordObj', userGesturePasswordObj);
      if (isPopSecret) setItem('isPopSecret', isPopSecret);

      if (RNConfig.NODE_ENV === 'dev') Alert.alert('退出登录成功');
      // 防止在重定向后展示前置页，需要等这个promise设置
      if (frontInfo) {
        setItem('frontInfo', frontInfo).then(() => {
          // 为了防止reset到目的页后点左上角无法返回，默认需要采用resetHome方法
          resetHome([{ name: resetName, params }]);
          // resetNavigation(resetName, params);
        });
      }
    });
  });
};

/**
 * 获取uuid的方式
 */
export const generateUuid = () => {
  getItem('maccode').then((maccodeS) => {
    // console.log('maccodeS', maccodeS)
    if (maccodeS) configs.maccode = maccodeS;
    else {
      const maccode = `${String(Date.now())}-${Math.floor(
        1e7 * Math.random(),
      )}-${Math.random().toString(16).replace('.', '')}`;
      setItem('maccode', maccode);
      configs.maccode = maccode;
    }
  });
};
