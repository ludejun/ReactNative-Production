import JPush from 'jpush-react-native';
import Store from '../store';

export function JPushInit() {
  JPush.init({
    appKey: 'a55bdcba87d683c0204ae414',
    titchannelle: 'developer-default',
    production: true,
  });
}

type Extra = {
  [key: string]: string
};

export function JPushRegistry(openUrl: (schema: { router: string; param: any }) => void) {
  JPush.setLoggerEnable(true);

  // 通知回调
  const notificationListener = (result: { notificationEventType: string; extras: Extra }) => {
    console.log(`notificationListener:${JSON.stringify(result)}`);
    if (result.notificationEventType === 'notificationOpened')
      openUrl && openUrl(result.extras as { router: string; param: any });
  };
  JPush.addNotificationListener(notificationListener);

  // // 连接状态
  // const connectListener = result => {
  //   console.log(`connectListener:${JSON.stringify(result)}`)
  // }
  // JPush.addConnectEventListener(connectListener)

  // // 本地通知回调
  // const localNotificationListener = result => {
  //   console.log(`localNotificationListener:${JSON.stringify(result)}`)
  // }
  // JPush.addLocalNotificationListener(localNotificationListener)
  // // 自定义消息回调
  // const customMessageListener = result => {
  //   console.log(`customMessageListener:${JSON.stringify(result)}`)
  // }
  // JPush.addCustomMessagegListener(customMessageListener)
  // // tag alias事件回调
  // const tagAliasListener = result => {
  //   console.log(`tagAliasListener:${JSON.stringify(result)}`)
  // }
  // JPush.addTagAliasListener(tagAliasListener)
  // // 手机号码事件回调
  // const mobileNumberListener = result => {
  //   console.log(`mobileNumberListener:${JSON.stringify(result)}`)
  // }
  // JPush.addMobileNumberListener(mobileNumberListener)
}

export function JPushGetID() {
  return new Promise((rel) => {
    JPush.getRegistrationID((result) => {
      rel(result.registerID);
    });
  });
}

export function registryJPushID() {
  JPushGetID().then((id) => {
    console.log('极光推送RegistrationID：', id);
    Store.dispatch({
      type: 'global/setJPushID',
      payload: id,
    });
  });
}
