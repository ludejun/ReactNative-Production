import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export const PreLoadWebview = (props: { url: string }) => (
  <View
    style={{
      height: 1,
      width: 1,
      display: 'none',
    }}>
    <WebView url={props.url} />
  </View>
);
