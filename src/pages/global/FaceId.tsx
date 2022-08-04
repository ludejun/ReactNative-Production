import React, { useEffect, useState } from 'react';
// @ts-ignore
import RNBiometrics from 'react-native-simple-biometrics';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { View, Image, Text } from 'react-native-ui-lib';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { Touchable, LineSpace } from '../../components';
import { globalImages } from './configs';
import { getItem, resetHome, setItem, eventBus, logout, getUserInfoAsync } from '../../utils';
import { DispatchPro } from '../../store';
import { isIOS } from '../../utils/safeHeight';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';

type ParamList = {
  FaceId: {
    isJump: boolean; // 是否允许跳过此步骤，在初次进首页设置手势时可以跳过，和isGoBack是互斥的，控制不同场景
    isGoBack: boolean; // 是否允许返回，一般流程进入设置手势页不允许返回，但是允许跳过；但是从设置页进入，允许返回不允许跳过
  };
};
type IFaceId = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const FaceId = (props: IFaceId) => {
  console.log(props);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const { goBack, replace } = navigation;
  const { params } = useRoute<RouteProp<ParamList, 'FaceId'>>();
  const { isJump = false, isGoBack = false } = params;
  const [noFaceId, setNoFaceId] = useState(true); // 是否禁用FaceId

  const isGestures = async () => {
    const { custNo = '' } = await getUserInfoAsync();
    const data = await getItem('userGesturePasswordObj');
    if (data && custNo && data[custNo])
      if (isJump) resetHome();
      else replace('GesturesPassword');
    else replace('GesturesPasswordSet', { isJump }); // 没有手势密码就跳到设置手势密码页，isJump参数透传
  };

  const alertOnPress = (isFaceId: string | undefined) => {
    // 如果没有权限调FaceId，设置isFaceId缓存为noFaceId
    if (isFaceId === 'noFaceId')
      setItem('isFaceId', 'noFaceId').then((data) => {
        console.log(data);
      });

    if (isGoBack === true) return goBack();
    isGestures(); // 如不是直接返回，当没有权限时都跳到手势页
  };
  const onFaceId = async () => {
    const can = await RNBiometrics.canAuthenticate();
    if (can)
      try {
        await RNBiometrics.requestBioAuth('验证登录密码', '将手机正对面部验证已有面容ID');

        // !important -> TODO 这里可以根据业务去更新token之类的
        // await fetchNewTokenLogin(); // faceId或者手势更新token

        // 最高优先级是当点击极光推送进来，先做完FaceId验证后直接跳转落地页
        if (eventBus.getAllEvents('JPush-Navigate').length > 0) {
          return eventBus.emit('JPush-Navigate'); // 当有Jpush事件没有处理，这里先跳转落地页
        }

        // 第二优先级是跳回进FaceId的页面，比如从设置页进来
        if (params?.isGoBack === true) {
          return goBack();
        }
        // 默认跳首页
        resetHome();
      } catch (error) {
        Alert.alert('温馨提示', '面容ID调用失败', [
          {
            text: isGoBack === true ? '知道了' : '使用手势密码',
            onPress: alertOnPress,
            style: 'cancel',
          },
        ]);
      }
    else
      Alert.alert('温馨提示', '请在设置中允许使用FaceID', [
        {
          text: '知道了',
          onPress: alertOnPress.bind(null, 'noFaceId'),
          style: 'cancel',
        },
      ]);
  };
  useEffect(() => {
    // 只有iOS，只是调用getItem('isFaceId')，没有返回null；当之前没有有禁用权限调用FaceId
    if (isIOS)
      getItem('isFaceId').then((data) => {
        if (isGoBack) {
          setNoFaceId(false);
          onFaceId();
          return false;
        }
        if (data === 'noFaceId') {
          isGestures();
        } else {
          setNoFaceId(false);
          onFaceId();
        }
      });
    else isGestures();
  }, []);

  if (!isIOS) return null;
  if (noFaceId) return null;
  return (
    <View flex style={{ justifyContent: 'space-around' }}>
      <View>
        <View center>
          <Image source={globalImages.logo} />
          <LineSpace />
          <Image source={globalImages.logoText} />
        </View>
        <LineSpace height={90} />
        <View center>
          <Touchable onPress={onFaceId}>
            <View center>
              <Image source={globalImages.faceId} />
              <LineSpace />
              <Text f12 primaryColor>
                点击进行面容 ID 解锁
              </Text>
            </View>
          </Touchable>
        </View>
      </View>
      <View center>
        {!params?.isGoBack ? (
          <Touchable
            onPress={() => {
              logout('Login', {}, false); // 根据业务更改路由名，退出登录并回到Login页
            }}>
            <Text f12 primaryColor>
              其他登录方式
            </Text>
          </Touchable>
        ) : null}
      </View>
    </View>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = ({
  login: { fetchGestureLogin, fetchNewTokenLogin },
}: DispatchPro) => ({
  fetchGestureLogin,
  fetchNewTokenLogin,
});

export default connect(mapStateToProps, mapDispatchToProps)(FaceId);
