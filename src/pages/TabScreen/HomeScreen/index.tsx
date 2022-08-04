import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ImageBackground, ScrollView, Animated } from 'react-native';
import { View, Colors } from 'react-native-ui-lib';
import { connect } from 'react-redux';
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import JPush from 'jpush-react-native';
// @ts-ignore
import { RefreshNormalHeader } from 'react-native-smart-refresh';
import { ViewLoader, PreLoadWebview, StatusBarView } from '../../../components';
import Store, { DispatchPro, RootState } from '../../../store';
import { getUserInfoAsync, eventBus } from '../../../utils';
import { getItem } from '../../../utils/asyncStorage';
import { StackNavigationProp } from '@react-navigation/stack';
import { DevNavigation } from '../../global';
import { isIOS } from '../../../utils/safeHeight';

type IHome = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const HomeScreen = (props: IHome) => {
  const { replace } = useNavigation<StackNavigationProp<ParamListBase>>();
  const [isRefreshing, setIsRefreshing] = useState(false); // 当前是否下拉刷新中
  const [barStyle, setBarStyle] = useState<'default' | 'light-content' | 'dark-content'>(
    'light-content',
  ); // 状态栏颜色
  const headerAnimate = useRef(new Animated.Value(0)).current; // 状态栏渐入渐出动画
  const { userInfo, fetchHomeLoading, fetchHome, changeFaceId, needFaceId } = props;

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchHome({
      params: {},
      apiName: 'home',
    }).then((data) => {
      console.log(data);
      setIsRefreshing(false);
    });
  };
  const onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const offsetTop = 245; // 滚动多少距离后状态栏开始变化
    const fadeIn = () =>
      Animated.timing(headerAnimate, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    const fadeOut = () =>
      Animated.timing(headerAnimate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    if (e.nativeEvent.contentOffset.y > offsetTop) {
      setBarStyle('dark-content');
      fadeIn();
    } else if (
      e &&
      e.nativeEvent &&
      e.nativeEvent.contentOffset &&
      e.nativeEvent.contentOffset.y <= offsetTop
    ) {
      setBarStyle('light-content');
      fadeOut();
    }
  };

  // 跳转手势
  const isGestures = async (custNo: string | undefined) => {
    const data = await getItem('userGesturePasswordObj');
    if (data && custNo && data[custNo]) replace('GesturesPassword');
    else replace('GesturesPasswordSet');
  };

  useEffect(() => {
    // 是否调用faceId，初始state为true
    if (needFaceId) {
      new Promise((rel) => {
        changeFaceId(false); // 调用faceId之后进入首页一般不再调用faceId
        rel(true);
      }).then(() => {
        if (!(userInfo && userInfo.token)) {
          getUserInfoAsync()
            .then((data) => {
              if (data && data.token) {
                Store.dispatch({
                  type: 'login/loadUserInfoFromStorage',
                  payload: data,
                });
              }
              
              if (isIOS) replace('FaceId');
              else isGestures(data?.custNo || userInfo?.custNo); // 跳转手势
            })
            .catch(() => {});
        }
      });
    } else {
      // 需要校验FaceId/手势时（第一次进首页），加载缓存用户信息，在FaceId/手势后会触发极光推送的回调JPush-Navigate
      // 当不需要校验时，也看看是否有需要跳转的极光推送回调，有就跳转下
      if (eventBus.getAllEvents('JPush-Navigate').length > 0) {
        eventBus.emit('JPush-Navigate'); // 当有Jpush事件没有处理，这里先跳转落地页
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      JPush.setBadge({
        badge: 0,
        appBadge: 0,
      });
      fetchHome({
        params: {},
        apiName: 'home',
      }).then((data) => console.log('Home Data:', data));
    }, []),
  );

  return (
    <ViewLoader flex bg-greyF5 loading={fetchHomeLoading && !isRefreshing} disableSafeBottom>
      <Animated.View
        style={{
          opacity: headerAnimate,
          position: 'absolute',
          zIndex: 100,
          width: '100%',
        }}>
        <StatusBarView backgroundColor={Colors.white} barStyle={barStyle} />
      </Animated.View>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshNormalHeader
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            containerStyle={{ paddingLeft: 10, paddingBottom: 30, alignItems: 'flex-end' }}
            titleStyle={{ fontSize: 14 }}
            timeStyle={{ display: 'none', fontSize: 14 }}
            leftContainerStyle={{ marginBottom: -6, marginRight: -35 }}
            activityIndicatorProps={{ color: Colors.primaryColor }}
          />
        }>
        <View style={{ height: 258 }}>
          <ImageBackground
            source={require('./images/top.jpg')}
            style={{ flex: 1, justifyContent: 'center' }}></ImageBackground>
        </View>
        <DevNavigation />

        <PreLoadWebview url={'https：//tyh.loyalvalleycapital.com/'} />
      </ScrollView>
    </ViewLoader>
  );
};

const mapStateToProps = ({
  home: { homePage, fetchHomeLoading },
  login: { userInfo },
  global: { needFaceId },
}: RootState) => ({
  homePage,
  fetchHomeLoading,
  userInfo,
  needFaceId,
});
const mapDispatchToProps = ({
  home: { fetchHome },
  global: { changeFaceId, showToastGlobal, hideToastGlobal },
}: DispatchPro) => ({
  fetchHome,
  changeFaceId,
  showToastGlobal,
  hideToastGlobal,
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
