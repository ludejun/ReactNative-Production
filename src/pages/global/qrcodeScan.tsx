import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { Text } from 'react-native-ui-lib';
import { Header, ViewLoader } from '../../components';

// QRCodeScanner的参数请参考 https://github.com/moaazsidat/react-native-qrcode-scanner
export const QrcodeScan = () => {
  const onSuccess = (e) => {
    console.log('qrcodeScan: ', e.data);
  };

  return (
    <ViewLoader>
      <Header headerTitle="扫一扫" />
      <Text f14 style={{ fontSize: 18, padding: 32, color: '#777' }}>
        请将二维码放入框中
      </Text>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker
      />
    </ViewLoader>
  );
};