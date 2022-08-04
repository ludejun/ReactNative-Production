import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import store from './store';
import App from './App';
import './configs/styleConfig';
import { getItem } from './utils';
import { PrivacyModal } from './components';

// 全局关闭字体放大缩小功能
//Text.defaultProps = Text.defaultProps || {}
//Text.defaultProps.allowFontScaling = false

const Root: React.FC = () => {
  const [privacyStatus, setPrivacyStatus] = useState(0); // 隐私协议弹框
  const onArgee = () => setPrivacyStatus(2);
  useEffect(() => {
    SplashScreen.hide(); // 启动屏关闭

    // 缓存中是否有弹过隐私协议
    try {
      getItem('isPopSecret').then((haveAgree) => {
        console.log('haveAgree', haveAgree);
        // 用户已经同意过
        if (haveAgree) setPrivacyStatus(2);
        // 用户未同意过
        else setPrivacyStatus(1);
      });
    } catch (e) {
      console.log('Root error', e);
    }
  }, []);

  return (
    <Provider store={store}>
      {privacyStatus === 1 ? <PrivacyModal onAgree={onArgee} /> : null}
      {privacyStatus === 2 ? <App /> : null}
    </Provider>
  );
};

export default Root;
