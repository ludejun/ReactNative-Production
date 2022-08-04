import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { NativeModules } from 'react-native';
import { View } from 'react-native-ui-lib';
import { Button, LineSpace } from '../../components';
import { navigate } from '../../utils';
import FrontInfoCarousel from './FrontInfoCarousel';
import GesturesPassword from './GesturesPassword';
import GesturesPasswordSet from './GesturesPasswordSet';
import WechatShare from './WechatShare';
import RWebview from './Webview';
import FaceId from './FaceId';
import { globalImages } from './configs';
import { CompDemo } from './compDemo';
import { QrcodeScan } from './qrcodeScan';

// 全局页面
export {
  FrontInfoCarousel, // 前置页跑马灯
  GesturesPassword, // 手势登录页
  GesturesPasswordSet, // 设置手势页
  WechatShare, // 微信分享页面
  RWebview, // webview页面，承载H5及JSBridge
  FaceId, // FaceId验证页面
  globalImages, // 全局共用图片
  CompDemo, // 基础组件示例页面
  QrcodeScan, // 扫一扫页面
};

export const DevNavigation = () => {
  const navigationBtnConfig = [
    {
      label: '跳转组件示例',
      navigateName: 'CompDemo',
    },
    {
      label: '打开扫一扫',
      navigateName: 'QrcodeScan',
    },
    {
      label: '打开设置',
      onPress: () => {
        NativeModules.OpenSettings.openApplicationsSettings((data: any) => {
          console.log('call back data', data);
        });
      },
    },
    {
      label: '前置页',
      navigateName: 'FrontInfoCarousel',
    },
    {
      label: '验证手势密码',
      navigateName: 'GesturesPassword',
    },
    {
      label: '手势密码设置',
      navigateName: 'GesturesPasswordSet',
    },
    {
      label: '手势密码设置GoBack',
      navigateName: 'GesturesPasswordSet',
      params: { isGoBack: true },
    },
    {
      label: '微信分享页面',
      navigateName: 'WechatShare',
    },
    {
      label: '打开FaceId验证',
      navigateName: 'FaceId',
    },
    {
      label: '清除缓存',
      onPress: () => AsyncStorage.clear(),
    },
  ];

  return (
    <View>
      {navigationBtnConfig.map(({ label, navigateName, onPress, params = {} }) => (
        <View key={label}>
          <Button
            title={label}
            onPress={() => {
              if (onPress) {
                onPress();
              } else {
                if (navigateName) navigate(navigateName, params);
              }
            }}
          />
          <LineSpace />
        </View>
      ))}
    </View>
  );
};
