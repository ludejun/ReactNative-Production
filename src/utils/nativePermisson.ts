import { Alert, NativeModules } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import { isIOS } from './safeHeight';
import { linkUrl } from './native';

export const authAlert = () =>
  Alert.alert('温馨提示', '您未开启相机权限设置', [
    {
      text: '去设置',
      onPress: () => {
        isIOS
          ? linkUrl('app-settings:').catch((err) => console.log('打开ios设置失败', err))
          : NativeModules.OpenSettings.openApplicationsSettings((data: unknown) => {
            console.log('call back data', data);
          });
      },
      style: 'cancel',
    },
    {
      text: '关闭',
      onPress: () => {},
      style: 'cancel',
    },
  ]);

export const permissionCamera = () =>
  new Promise((rel, rej) => {
    if (!isIOS)
      request(PERMISSIONS.ANDROID.CAMERA).then(
        (permissionStatus) => {
          console.warn('permissionStatus', permissionStatus);
          switch (permissionStatus) {
            case 'unavailable': // 无设备
            case 'blocked': // 永久禁用
              authAlert();
              rej(false);
              break;
            case 'denied': // 一次禁用
              authAlert();
              rej(false);
              break;
            case 'granted': // 始终允许
            case 'limited': // 本次允许
            default:
              rel(true);
              break;
          }
        },
        () => {},
      );
    else
      request(PERMISSIONS.IOS.CAMERA).then(
        (permissionStatus) => {
          console.warn('permissionStatus', permissionStatus);
          switch (permissionStatus) {
            case 'unavailable': // 无设备
            case 'blocked': // 永久禁用
              authAlert();
              rej(false);
              break;
            case 'denied': // 一次禁用
              authAlert();
              rej(false);
              break;
            case 'granted': // 始终允许
            case 'limited': // 本次允许
            default:
              rel(true);
              break;
          }
        },
        () => {},
      );
  });
