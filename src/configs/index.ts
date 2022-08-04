import { Platform } from 'react-native';
import { mockWhiteList } from './mockApi';
import { apiServer } from './apiServer';

const configs = {
  version: '1.0.0', // 代码版本，一般会放在api请求中
  accptMd: Platform.OS === 'ios' ? '2' : '3', // 终端类型 1 -> PC ;  2 -> iOS;  3 -> Android ;  4 -> H5;  5 -> 微信小程序
  appName: 'RN-Production', // 用作localstorage的namespace等命名空间
  salt: 'XXX', // API字段加密的salt
  successCode: { key: 'errCode', value: '0000' }, // API请求的业务正常Code
  apiServer, // API请求各环境的Domain配置
  mockWhiteList, // 后端Mock Server的白名单，在白名单中可走Mock服务器，不然还是走DEV服务器
  maccode: '', // 在Root中会生成，使用的utils/asyncStorage的generateUuid异步生成
};

export default configs;
