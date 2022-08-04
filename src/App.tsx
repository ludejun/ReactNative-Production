import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native-ui-lib';
import dayjs from 'dayjs';
import JPush from 'jpush-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNConsole, { handleRNNavigationStateChange, RNStackRef } from 'rn-vconsole-panel';
import { AppState, AppStateStatus } from 'react-native';
import { connect } from 'react-redux';
import { generateUuid } from './utils/asyncStorage';
import TabScreen from './pages/TabScreen';
import {
  GesturesPassword,
  GesturesPasswordSet,
  WechatShare,
  RWebview,
  FaceId,
  CompDemo,
  FrontInfoCarousel,
  QrcodeScan,
} from './pages/global';
import * as RNConfig from '../env';
import { ToastGlobal } from './components';
import { RootState } from './store';
import {
  appActiveCB,
  navigationRef,
  removeItem,
  setItem,
  eventBus,
  monitor,
  navigate,
  checkUrl,
} from './utils';
import configs from './configs';
import Login from './pages/Login';
import { JPushInit, JPushRegistry, registryJPushID } from './configs/jpush';

const Stack = createStackNavigator();

type IApp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const App = (props: IApp) => {
  const appState = useRef(AppState.currentState);

  // 当从后台等重新活跃App时，执行Active回调
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      appActiveCB();
    }  else {
      setItem('lastActiveTime', dayjs(new Date()).format());
    }
    appState.current = nextAppState;
    console.log('AppState', appState.current);
  };

  useEffect(() => {
    try {
      // 埋点
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      monitor.init({
        appName: configs.appName,
        headerName: 'loyalvalleylog',
        apiUrl: `${configs.apiServer[RNConfig.NODE_ENV]}/log/tranCore/point`,
        appVersion: configs.version,
      } as any);
      // 生成用户id，存缓存
      generateUuid();

      let jpushTimer: ReturnType<typeof setTimeout>;
      removeItem('appDate5m');
      JPushInit(); // 极光推送初始化
      registryJPushID(); // 极光Id保存全局store

      // 发布事件：极光监听回调，在FaceId/手势成功/首页/登录成功再消费
      // 路由跳转：比如通过极光推送打开页面
      JPushRegistry((schema) => {
        console.log('极光推送schema：', schema);
        // monitor.trackEv('MC', 'FPMP1030001', schema);
        JPush.setBadge({
          // 去除app小红点
          badge: 0,
          appBadge: 0,
        });

        eventBus.once('JPush-Navigate', () => {
          if (schema.router && checkUrl(schema.router)) {
            navigate(schema.router, { ...schema });
          } else {
            console.log('schema.param', schema.param, { ...JSON.parse(schema.param) });
            navigate(schema.router, { ...JSON.parse(schema.param) });
          }
        });
        // 标记是否极光推送点击，主要是给当active App收到极光推送并点击，任意页面能通过state变化监听到点击了推送
        // 点击的callback中并没有直接做跳转，只是注册了一个事件，标明在未来的某一个尽早的状态跳转落地页
        // 等待app从非active状态点击极光推送先给时间走完校验跳转逻辑，再来判断是否需要跳极光推送页
        jpushTimer = setTimeout(() => {
          const currentRoute = RNStackRef?.current?.slice(-1)[0];
          if (
            RNStackRef &&
            RNStackRef.current &&
            currentRoute &&
            [
              'FaceId',
              'GesturesPassword',
              'GesturesPasswordSet',
              'Login',
              'LoginVerifyCode',
            ].indexOf(currentRoute.name) < 0
          ) {
            if (schema.router && checkUrl(schema.router)) {
              navigate(schema.router, { ...schema });
            } else {
              console.log('schema.param==', schema.param, { ...JSON.parse(schema.param) });
              if (schema && schema.param) {
                navigate(schema.router, { ...JSON.parse(schema.param) });
              } else {
                navigate(schema.router, { ...schema });
              }
            }
          }
        }, 200);
      });

      return () => {
        removeItem('lastActiveTime');
        clearTimeout(jpushTimer);
      };
    } catch (e) {
      console.log('APP error', e);
    }
  }, []);

  // app的状态监听，主要是给当变为活跃状态时做安全校验用
  useEffect(() => {
    try {
      AppState.addEventListener('change', handleAppStateChange);
      return () => {
        AppState.removeEventListener('change', handleAppStateChange);
      };
    } catch (e) {
      console.log('app状态判断', e);
    }
  }, []);

  return (
    <View flex>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={(state) => {
          try {
            handleRNNavigationStateChange(state);
            // 将App访问每个页面都存入stackNavigationRef栈中
            // stateChange和页面的DisMount的关系是：页面先DidMount才会触发NavigationContainer的stateChange
            // 跳首页的时候会先经过HomeTab，在进入HomeScreen
            // 页面回退也会有stateChange，理论上任何focus页面都会有stateChange，但是回退不会触发页面埋点，可能会触发PE
          } catch (e) {
            console.log('APP onStateChange error', e);
          }
        }}>
        <Stack.Navigator
          initialRouteName="HomeTab"
          screenOptions={{
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#CCAC77',
            },
            headerTitleStyle: {
              color: 'white',
              alignSelf: 'center',
              fontSize: 18,
            },
            headerTintColor: 'white',
            // headerBackImage: ({}) => <NavigationGoBackImage />,
            // headerRight: ({}) => <View style={{ width: 50 }} />,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}>
          <Stack.Screen name="HomeTab" options={{ header: () => null }} component={TabScreen} />

          <Stack.Screen name="Login" options={{ header: () => null }} component={Login} />

          <Stack.Screen name="Webview" options={{ header: () => null }} component={RWebview} />

          <Stack.Screen name="CompDemo" options={{ header: () => null }} component={CompDemo} />

          <Stack.Screen name="FaceId" options={{ header: () => null }} component={FaceId} />

          <Stack.Screen
            name="GesturesPassword"
            options={{
              header: () => null,
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              gestureEnabled: false,
            }}
            component={GesturesPassword}
          />
          <Stack.Screen
            name="GesturesPasswordSet"
            component={GesturesPasswordSet}
            options={{ header: () => null }}
          />
          <Stack.Screen
            name="FrontInfoCarousel"
            component={FrontInfoCarousel}
            options={{ header: () => null }}
          />

          <Stack.Screen
            name="WechatShare"
            options={{
              header: () => null,
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              gestureEnabled: false,
              cardStyle: { backgroundColor: 'rgba(0,0,0,0)' },
            }}
            component={WechatShare}
          />

          <Stack.Screen name="QrcodeScan" options={{ header: () => null }} component={QrcodeScan} />
        </Stack.Navigator>
      </NavigationContainer>
      <ToastGlobal hideToastGlobal={() => null} />
      {RNConfig.NODE_ENV === 'dev' || RNConfig.NODE_ENV === 'sit' ? (
        <RNConsole
          definedData={{
            // userInfo: props.userInfo,
            'uuid/maccode': configs.maccode,
            version: configs.version,
            accptMd: configs.accptMd,
            env: RNConfig.NODE_ENV,
            mockWhiteList: configs.mockWhiteList,
          }}
          storage={{
            getAllKeys: AsyncStorage.getAllKeys,
            // @ts-ignore
            getItem: AsyncStorage.getItem,
            setItem: AsyncStorage.setItem,
            removeItem: AsyncStorage.removeItem,
            clear: AsyncStorage.clear,
          }}
        />
      ) : null}
    </View>
  );
};

const mapStateToProps = ({ login: { userInfo } }: RootState) => ({
  userInfo,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
