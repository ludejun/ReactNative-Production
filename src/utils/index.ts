import { formatDate, formatProductDate, formatTime, inSevenDays } from './moment';

import { deviceWidth, deviceHeight, safeHeight, isIOS } from './safeHeight';
import {
  checkPasswordNotAbc,
  checkPasswordNotSimpleNumber,
  checkPassswordStand,
  checkPasswordValue,
  checkPhone,
  checkIdCard,
  checkBankCard,
  checkPasswordStrength,
  checkUrl,
} from './validate';
import { callPhone, linkMail, linkSms, linkUrl } from './native';
import { setItem, getItem, clearStorage, removeItem, logout } from './asyncStorage';
import {
  resetHome,
  resetLoginHome,
  resetUserInfo,
  resetNavigation,
  resetUserInfoTab,
  navigate,
  navigationRef,
  reset,
} from './navigation';
import { UserInfo, getUserInfo, getUserInfoAsync, getJPushId } from './getStoreInfo';
import { appActiveCB } from './appStateChange';
import { permissionCamera } from './nativePermisson';
import eventBus from './eventBus';
import monitor from './monitor';
import request from './request';

export {
  formatDate,
  formatProductDate,
  deviceWidth,
  deviceHeight,
  safeHeight,
  checkPasswordNotAbc,
  checkPasswordNotSimpleNumber,
  checkPassswordStand,
  checkPasswordValue,
  checkPhone,
  checkIdCard,
  checkBankCard,
  checkUrl,
  callPhone,
  linkMail,
  linkSms,
  linkUrl,
  setItem,
  getItem,
  resetHome,
  clearStorage,
  getUserInfo,
  getUserInfoAsync,
  checkPasswordStrength,
  resetLoginHome,
  formatTime,
  inSevenDays,
  resetUserInfo,
  removeItem,
  resetNavigation,
  logout,
  resetUserInfoTab,
  getJPushId,
  navigate,
  navigationRef,
  appActiveCB,
  reset,
  permissionCamera,
  isIOS,
  eventBus,
  monitor,
  request,
};
export type { UserInfo };
