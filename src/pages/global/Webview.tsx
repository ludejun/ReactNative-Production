import React, { useState, useRef } from 'react';
import { Colors, View } from 'react-native-ui-lib';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { WeChat } from '../../configs/wechat';
import { RootState, Dispatch } from '../../store';
import {
  callPhone,
  eventBus,
  getUserInfo,
  getUserInfoAsync,
  resetNavigation,
  resetHome,
  logout,
  checkUrl,
} from '../../utils';
import { Header } from '../../components/Header';
import { ConfirmModal } from '../../components/Modal';
import Configs from '../../configs';
import { StatusBarView, ViewLoader } from '../../components';
import { deviceType, isIOS } from '../../utils/safeHeight';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';

type IWebviewProps = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
  route: {
    params: IWebviewRoute
    goBackPage: false | string | undefined
    isReload: boolean
  } // 页面路由参数
};

interface IWebviewRoute {
  isReload: boolean
  url: string // h5 url
  header?: {} // 给H5请求添加自定义headers
  disableBottom?: boolean // 是否不设置底部安全距离的padding，在Tab页、产品概览页不设置底部安全距离，一般设置的页面需要页面背景是白色
  title: string; // 导航栏展示文案，如没有没有导航栏
  route: {
    params: { url: string; isReload: boolean }
  }
  showToastGlobal: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const RWebview: React.FC<IWebviewProps> = (props: IWebviewProps) => {
  const { route, showToastGlobal, ...restProps } = props;
  const [webViewLoading, setWebViewLoading] = useState(true);
  const { url, header = {}, disableBottom = false } = (route && route.params) || restProps || {};
  const webview = useRef<WebView>(null);

  const [isModalShow, setModalShow] = useState(false);
  const currentURI = url;
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets(); // 精细控制safearea：https://reactnavigation.org/docs/handling-safe-area/

  // 用户信息
  let userInfoCookie = '';
  let userInfo = getUserInfo();
  const { token, custNo } = userInfo || {};
  if (userInfo && Object.keys(userInfo).length > 0) {
    Object.entries(userInfo).forEach(
      ([key, value]) => (userInfoCookie += `${key}:${value};`),
    );
  }

  const newSource = {
    uri: currentURI,
    headers: { ...header },
  };

  const JSBridge = `
    window.__JSBridge__ = {
      postMsg: function(eventName, postData) {
        window.ReactNativeWebView.postMessage(JSON.stringify({[eventName]: postData || ''}));
      },
      shareImage: function(url, scene) {
        this.postMsg('wxShareImage', {imageUrl: url, scene: scene || 0});
      },
      shareFile: function(url, title) {
        this.postMsg('wxShareFile', {url: url, title: title || ''});
      },
      shareWebpage: function(shareObj, scene) {
        this.postMsg('wxShareWebpage', {data: shareObj, scene: scene || 0});
      },
      wxShareWebpageModal: function(shareObj, scene) {
        this.postMsg('wxShareWebpageModal', {data: shareObj, scene: scene || 0});
      },
      callPhone: function(phone) {
        this.postMsg('callPhone', phone);
      },
      logOut: function() {
        this.postMsg('logOut');
      },
      logIn: function(goBack) {
        this.postMsg('logIn', {goBack: goBack || true});
      },
      goBack: function() {
        this.postMsg('goBack');
      },
      goForward: function(url, title, params) {
        this.postMsg('goForward', {url: url, title: title, params: params});
      },
      goForwardReplace: function(url, title, params) {
        this.postMsg('goForwardReplace', {url: url, title: title, params: params});
      },
      goForwardTakeFn: function(url, params) {
        this.postMsg('goForwardTakeFn', {url: url, params: params});
      },
      showWebViewLoading: function() {
        this.postMsg('showLoading');
      },
      closeWebViewLoading: function() {
        this.postMsg('closeLoading');
      },
      copyToClipboard: function(info) {
        this.postMsg('copyToClipboard', info);
      },
      getShareImg: function(img) {
        this.postMsg('getShareImg', img);
      }
    };
  `;
  const initInjectJS = `
    window.__webview_env__ = 'RN';
    window.__custNo__ = '${custNo}';
    window.__accptMd__ = '${Configs.accptMd}';
    window.__loading__ = true;
    window.__userInfo__ = '${userInfoCookie}';
    window.__token__ = '${token}';
    window.__maccode__= '${Configs.maccode}';
    window.__version__ = '${Configs.version}';
    ${JSBridge}

    true; // note: this is required, or you'll sometimes get silent failures
  `;
  const [runFirst, setJS] = useState(initInjectJS);

  if (!userInfo)
    getUserInfoAsync().then(
      (value) => {
        userInfo = value;
        if (userInfo && userInfo.token) Object.entries(userInfo).forEach(([key, value]) => (userInfoCookie += `${key}:${value};`));
        setJS(
          initInjectJS.replace(
            /window\.__userInfo__ = '\w*';/,
            `window.__userInfo__ = '${userInfoCookie}'`,
          ),
        );
      },
      () => {
        // error
      },
    );

  const initJSBridge = `
    if (!window.__JSBridge__) {
      window.__webview_env__ = 'RN';
      window.__custNo__ = '${custNo}';
      window.__accptMd__ = '${Configs.accptMd}';
      window.__userInfo__ = '${userInfoCookie}';
      window.__token__ = '${token}';
      window.__maccode__= '${Configs.maccode}';
      ${JSBridge}
    }
    window.__loading__ = false;
    window.__JSBridge__.showStatusBar();
    window.__JSBridge__.closeWebViewLoading();

    true; // note: this is required, or you'll sometimes get silent failures
  `;

  // JSBridge的处理函数，当onMessage收到JSBridge传来的信息则执行对应函数
  const onJSBridgeHandler = (event: { nativeEvent: { data: string } }) => {
    const postData = JSON.parse(event.nativeEvent.data);
    console.log('postData', postData);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.keys(postData).forEach((event) => eventProc(event));

    // scene @Number 分享到, 0:会话 1:朋友圈 2:收藏
    function eventProc(eventName: string | string[]) {
      // if (!WeChat) return
      if (eventName.indexOf('wxShare') >= 0) {
        let isWXAppInstalled = false;
        WeChat.isWXAppInstalled().then((isInstalled: boolean) => {
          isWXAppInstalled = isInstalled;
          if (!isWXAppInstalled) setModalShow(true);
          // Alert('没有安装微信软件，请您安装微信之后再试')
        });
      }

      switch (eventName) {
        case 'wxShareImage':
          WeChat.shareImage({ scene: 0, ...postData[eventName] });
          break;
        case 'wxShareFile':
          WeChat.shareFile({ ...postData[eventName], scene: 0 });
          break;
        case 'wxShareWebpage':
          WeChat.shareWebpage({
            title: '',
            description: '',
            thumbImageUrl: '',
            webpageUrl: 'http://10.66.16.98:8100/#//user/index',
            scene: 0,
            ...postData[eventName].data,
          });
          break;
        case 'wxShareWebpageModal':
          navigation.navigate('WechatShare', {
            shareObj: {
              title: '',
              description: '',
              thumbImageUrl: '',
              webpageUrl: 'http://10.66.16.98:8100/#//user/index',
              scene: 0,
              ...postData[eventName].data,
            },
          });
          break;
        case 'callPhone':
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          callPhone(postData[eventName]);
          break;
        case 'goBack':
          navigation.goBack();
          break;
        case 'logIn':
          // 跳转login页，并默认登录成功后跳回来
          if (postData[eventName]?.goBack) {
            eventBus.once('LoginCallback', () =>
              resetHome([
                {
                  name: 'Webview',
                  params: {
                    url,
                  },
                },
              ]),
            );
          }

          resetNavigation('Login');
          break;
        case 'logOut':
          logout();
          break;
        case 'goForward':
          // 一般是跳转webview或者别的native页面
          if (
            checkUrl(postData[eventName].url as string) ||
            postData[eventName].url.indexOf('localhost') > 0
          )
            navigation.push('Webview', {
              url: postData[eventName].url,
              title: postData[eventName].title,
            });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          else navigation.navigate(postData[eventName].url, postData[eventName].params);
          break;
        case 'goForwardTakeFn':
          // 跳转页面后执行回调函数，目前用于充值取现功能
          postData[eventName].params.func = (validate: boolean) => {
            if (validate) webview && webview.current && webview.current.postMessage('true');
            else webview && webview.current && webview.current.postMessage('false');
          };
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          navigation.navigate(postData[eventName].url, postData[eventName].params);
          break;
        case 'showLoading':
          setWebViewLoading(true);
          break;
        case 'closeLoading':
          setWebViewLoading(false);
          break;
        case 'copyToClipboard':
          Clipboard.setString(postData[eventName] as string);
          showToastGlobal(['复制成功']);
          break;
        case 'getShareImg':
          // getShareImgHandler && getShareImgHandler(postData[eventName])
          console.log(postData[eventName]);
          // try {
          //   WeChat.shareLocalImage({
          //     imageUrl: postData[eventName],
          //     scene: 0,
          //   })
          // } catch (e) {
          console.log('[长图分享失败]');
          // 将base64写文件然后微信分享失败，换个思路：图片上传到后端
          // const path = `${RNFS.DocumentDirectoryPath}/shareImg.png`
          // RNFS.writeFile(path, postData[eventName], 'base64').then(() => {
          //   console.log(path)
          //   WeChat.shareLocalImage({
          //     imageUrl: path,
          //     scene: 0,
          //   })
          // }).catch(err => console.log('[长图分享保存图片分享失败]', err.message))
          // }

          break;
        default:
          console.log(eventName);
      }
    }
  };

  // 添加isReload参数判断当前webview是否需要重载
  useFocusEffect(() => {
    if (route?.params?.isReload) webview?.current?.reload();
  });

  return (
    <ViewLoader flex loading={webViewLoading} disableSafeBottom style={{ backgroundColor: '#fff' }}>
      <View
        flex
        style={{
          marginBottom: !disableBottom ? insets.bottom : 0,
          backgroundColor: isIOS ? '#fff' : Colors.primaryColor, // 安卓机将背景设为黄色，解决状态栏黄色部分机型不生效问题
        }}>
        <StatusBarView />

        {props.route && props.route.params && props.route.params.title ? (
          <Header headerTitle={props.route.params.title} hasStatus={false} />
        ) : null}
        <WebView
          {...restProps}
          ref={webview}
          source={newSource}
          sharedCookiesEnabled
          injectedJavaScript={initJSBridge} // 页面加载后立即运行的JS，只运行一次
          injectedJavaScriptBeforeContentLoaded={runFirst} // 页面加载前运行的JS
          onMessage={onJSBridgeHandler}
          onLoad={() => {
            setWebViewLoading(false);
            if (!deviceType)
              setTimeout(() => {
                webview.current && webview.current.requestFocus();
              }, 100);
          }}
          // onShouldStartLoadWithRequest={request => {
          //   // IOS请求自定义处理，返回true或false表示是否要继续执行响应的请求
          //   // If we're loading the current URI, allow it to loads
          //   console.log('webview request', request)
          //   if (request.url === currentURI) {
          //     console.log('**********')
          //     return true
          //   }
          //   // We're loading a new URL -- change state first
          //   request.url !== 'about:blank' && setURI(request.url)
          //   console.log('$$$$$$$$$$$$$$')
          //   return false
          // }}
        />
        {isModalShow && <ConfirmModal containerTitle={'没有安装微信软件，请您安装微信之后再试'} />}
        {/* {RNConfig.NODE_ENV === 'dev' && <Button onPress={onClearCache} title="清空缓存(android only)" />} */}
      </View>
    </ViewLoader>
  );
};

const mapStateToProps = ({ login: { userInfo } }: RootState) => ({ userInfo });
const mapDispatchToProps = ({ global: { showToastGlobal } }: Dispatch) => ({
  showToastGlobal,
});

export default connect(mapStateToProps, mapDispatchToProps)(RWebview);
