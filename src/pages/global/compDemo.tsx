import React, { ReactNode, useState } from 'react';
import { ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import { RefreshNormalHeader } from 'react-native-smart-refresh';
import { Colors, Text, View } from 'react-native-ui-lib';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AnimatableView, BottomButton, Button, ButtonColumnTwo, CarouselBanner, CircularIcon, ConfirmModal, DesciptionText, ErrorText, Header, LineSpace, Modal, MyBadge, PreLoadWebview, ScrollInputView, SMSGETVerificationCode, SplitLine, TabBar, TabWarp, TextField, Touchable, ViewBG, ViewLoader, WechatDialog, WidthSpace } from '../../components';
import { isIOS } from '../../utils/safeHeight';

export const CompDemo = () =>{
  const [isRefreshing, setRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState('tab0');
  const [modalShow, setModalShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [wechatShareShow, setWechatShow] = useState(false);

  const onRefresh = () => {
    setRefresh(true);
    // 下面一般为页面请求
    setTimeout(() => setRefresh(false), 1000);
  };
  const onLaunchCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      console.log(response);
    });
  };
  const onLaunchImageLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1000,
        quality: isIOS ? 0.5 : 0.3,
        includeBase64: true,
      },
      (image) => {console.log(image);},
    );
  };

  return (
    <ViewLoader flex loading={isRefreshing}>
      <Header headerTitle={'组件示例'} />
      <ScrollView
        // onScroll={onScroll}
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
        <DemoItem description="LineSpace 纯色LineSpace，默认List各Item空白分割">
          <LineSpace bgColor="white" />
        </DemoItem>
        <DemoItem description="SplitLine 分割线">
          <SplitLine />
        </DemoItem>
        <DemoItem description="WidthSpace 水平空白块，默认无高度">
          <WidthSpace bgColor="red" width={120} height={2} />
        </DemoItem>
        <DemoItem description="Touchable 带点击埋点可交互按钮">
          <Touchable>
            <Text>默认节流点击交互</Text>
          </Touchable>
        </DemoItem>
        <DemoItem description="Button 默认色">
          <Button title="默认按钮" />
        </DemoItem>
        <DemoItem description="Button 白底常规按钮">
          <Button title="白底常规按钮" type="default" width={200} />
        </DemoItem>
        <DemoItem description="ButtonColumnTwo 两列按钮">
          <ButtonColumnTwo leftTitle="左边" rightTitle="右边重点" />
        </DemoItem>
        <DemoItem description="BottomButton 底部按钮，无radius，默认不可点击">
          <BottomButton />
        </DemoItem>
        <DemoItem description="LinearGradient 颜色渐变">
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={{ height: 30, borderRadius: 5, flex: 1 }}>
            <Text f18 white center margin-5>
              颜色渐变
            </Text>
          </LinearGradient>
        </DemoItem>
        <DemoItem description="ViewLoader 页面整体包装，区分是否底部安全区，包含一个Loading组件">
          <ViewLoader loading height={200} bg-grayF9 />
        </DemoItem>
        <DemoItem description="AnimatableView 基础进入动画，列表中逐个添加延迟，添加animataIndex">
          <AnimatableView>
            <Button title="默认按钮" />
          </AnimatableView>
        </DemoItem>
        <DemoItem description="ScrollInputView 包含Input的基本ScrollView">
          <View height={100}>
            <ScrollInputView>
              <View height={200} center bg-grayF9>
                <TextField
                  type={'default'}
                  placeholder="请输入短信验证码"
                  onChangeText={() => {}}
                  clearButtonMode={'never'}
                  keyboardType={'numeric'}
                />
              </View>
            </ScrollInputView>
          </View>
        </DemoItem>
        <DemoItem description="TabBar 滚动Tab导航">
          <TabBar
            data={new Array(10)
              .fill(1)
              .map((item, index) => ({ label: `Tab ${index}`, key: `tab${index}` }))}
            onTabSelected={(item) => setSelectedTab(item.key)}
          />
          <TabWarp>
            <TabWarp.Item>
              <View height={100} bg-greyF9 center>
                <Text>{selectedTab}</Text>
              </View>
            </TabWarp.Item>
          </TabWarp>
        </DemoItem>
        <DemoItem description="TabWarp 滚动Tab下面的容器">
          <Text>demo见上，TabWarp.Item应有N个，通过选中的TabKey控制显示哪个Item</Text>
        </DemoItem>
        <DemoItem description="MyBadge 徽标">
          <View height={10} width={100}>
            <MyBadge badgeCount={10} />
          </View>
        </DemoItem>
        <DemoItem description="SMSGETVerificationCode 获取短信验证码， onPress发API，return true">
          <View>
            <TextField
              type={'default'}
              placeholder="请输入短信验证码"
              onChangeText={() => {}}
              clearButtonMode={'never'}
              keyboardType={'numeric'}
            />
            <View absT absR height={21} centerV>
              <SMSGETVerificationCode onPress={() => true} />
            </View>
          </View>
        </DemoItem>
        <DemoItem description="Header 页面头部，默认带状态栏">
          <Header headerTitle={'组件示例'} />
        </DemoItem>
        <DemoItem description="Header 页面头部，light状态，跟随页面背景色">
          <Header headerTitle={'无状态栏无背景light头部'} hasStatus={false} type="light" />
        </DemoItem>
        <DemoItem description="Loading 加载中组件，Demo见ViewLoader组件">
          <></>
        </DemoItem>
        <DemoItem description="Modal 基本Modal">
          <Button title="点击显示基本Modal" onPress={() => setModalShow(true)} />
          <Modal
            visible={modalShow}
            onBtnPress={() => setModalShow(false)}
            onCancel={() => setModalShow(false)}
            overlayBackgroundColor // 默认没有浮层，这里只是demo
          />
        </DemoItem>
        <DemoItem description="ConfirmModal 双Button确认弹框">
          <Button title="点击显示ConfirmModal" onPress={() => setConfirmShow(true)} />
          <ConfirmModal
            visible={confirmShow}
            onOk={() => setConfirmShow(false)}
            onCancel={() => setConfirmShow(false)}
          />
        </DemoItem>
        <DemoItem description="WechatDialog 微信分享底部弹框">
          <Button title="点击显示WechatDialog" onPress={() => setWechatShow(true)} />
          <WechatDialog visible={wechatShareShow} onCancel={() => setWechatShow(false)} />
        </DemoItem>
        <DemoItem description="WechatShareTab 微信分享+长图底部弹框">
          <Text>作为页面使用，Demo查看pages/global中页面，也可放在Dialog中</Text>
        </DemoItem>
        <DemoItem description="Toast 提示框，已作为顶级组件集成在App中，通过store中的global控制是否展示组件，Demo查看页面中">
          <></>
        </DemoItem>
        <DemoItem description="StatusBarView 状态栏，已集成到Header中，一般不会单独用到">
          <></>
        </DemoItem>
        <DemoItem description="CircularIcon 灰色圆点，用于无序列表左边的圆icon">
          <CircularIcon />
        </DemoItem>
        <DemoItem description="DesciptionText 描述信息">
          <DesciptionText title="备注等描述性Text" />
        </DemoItem>
        <DemoItem description="ErrorText 错误信息">
          <ErrorText title="用户名密码错误等Text" />
        </DemoItem>
        <DemoItem description="TextField 文本框，所有需要校验的输入框">
          <TextField type="phone" />
          <TextField type="password" />
          <TextField type="idCard" />
        </DemoItem>
        <DemoItem description="ViewBG 含有背景图片的View">
          <ViewBG>
            <View height={160} center>
              <Text>前置DOM</Text>
            </View>
          </ViewBG>
        </DemoItem>
        <DemoItem description="CarouselBanner Banner图片走马灯">
          <CarouselBanner
            data={[
              {
                imageUrl:
                  'https://static.loyalvalleycapital.com/web/images/new_version/company/01.jpg',
              },
              {
                imageUrl:
                  'https://static.loyalvalleycapital.com/web/images/new_version/company/02.jpg',
              },
            ]}
          />
        </DemoItem>
        <DemoItem description="react-native-image-picker 打开相机/相册">
          <Button title="打开相机" onPress={() => onLaunchCamera()} />
          <Button title="打开相册" onPress={() => onLaunchImageLibrary()} />
        </DemoItem>
        <DemoItem description="PreLoadWebview H5预加载:(看不见，可以有多个)">
          <PreLoadWebview url={'https：//tyh.loyalvalleycapital.com/'} />
        </DemoItem>
        <DemoItem description="RNConsole 类似Console的监控SDK，已发布npm">
          <></>
        </DemoItem>
      </ScrollView>
    </ViewLoader>
  );
};

const DemoItem = (props: { description: string; children: ReactNode; }) => {
  const { description, children } = props;
  return (
    <>
      <Text color={Colors.blue40} f16>
        👉 {description}
      </Text>
      {children}
      <LineSpace />
    </>
  );
};
