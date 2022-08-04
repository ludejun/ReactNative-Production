import { Platform, Dimensions, StatusBar } from 'react-native';

export const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

/**
 * @description {deviceType} true ios false android
 */
export const deviceType = Platform.OS === 'ios';
export const isIOS = deviceType;

const noFullScreenIosPhoneDeviceHeight = [667, 736];

export const safeHeight = (() => {
  if (!deviceType) return StatusBar.currentHeight;
  if (noFullScreenIosPhoneDeviceHeight.includes(deviceHeight)) return 20;
  return 44;
})();
