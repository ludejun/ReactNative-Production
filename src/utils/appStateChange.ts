import dayjs from 'dayjs';
import { NODE_ENV } from '../../env';
import { getItem, setItem } from './asyncStorage';
import { getUserInfo } from './getStoreInfo';
import { navigate } from './navigation';

/**
 * @description app处于inactive状态一定时间，再活跃时,则强制弹出faceID
 */
export const appActiveCB = () => {
  if (!(getUserInfo() && getUserInfo()?.custNo)) return null;
  const setNewDate = () => setItem('lastActiveTime', dayjs(new Date()).format());
  
  getItem('lastActiveTime').then((date: string) => {
    if (date) {
      const storage = dayjs(date);
      const m5 = dayjs(new Date()).subtract(10, 'm'); // 目前是10分钟，当前时间减去一定时间和缓存中时间进行比较
      if (NODE_ENV === 'dev') {
        console.group();
        console.log('当  前  时   间', dayjs(new Date()).format());
        console.log('5分钟前的   时间', m5.format());
        console.log('上一个缓存的时间', storage.format());
        console.log('缓存时间比M5时间', storage.isAfter(m5));
        console.groupEnd();
      }
      if (!storage.isAfter(m5)) navigate('FaceId', { isGoBack: true }); // 跳转FaceID，验证通过后返回
      setNewDate();
    } else setNewDate();
  });
};
