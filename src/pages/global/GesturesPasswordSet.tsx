import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Colors, View, Text } from 'react-native-ui-lib';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// @ts-ignore
import OkGesturePassword from 'react-native-ok-gesture-password';
import { getItem, setItem, eventBus, resetHome, logout } from '../../utils';
import { LineSpace } from '../../components';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { connect } from 'react-redux';
import { RootState } from '../../store';

type IGesture = ReturnType<typeof mapStateToProps>;
type ParamList = {
  GesturesPassword: {
    isGoBack: boolean; // 是否允许返回，一般流程进入设置手势页不允许返回，但是允许跳过；但是从设置页进入，允许返回不允许跳过
    isJump: boolean; // 是否允许跳过此步骤，在初次进首页设置手势时可以跳过，和isGoBack是互斥的，控制不同场景
  };
};
// 该页面有两个路由参数，解释如上
// 设置手势密码需要设置两次，一致才算设置成功，进入首页或者返回之前的页面
const GesturesPasswordSet = (props: IGesture) => {
  const { userInfo } = props;
  const [errMsg, setErrMsg] = useState('');
  const [tipsMsg, setTipsMsg] = useState(''); // 提示信息
  const [sucMsg, setSucMsg] = useState('');
  const [gpasw, setGpasw] = useState(''); // 上次成功设置的手势
  const { params } = useRoute<RouteProp<ParamList, 'GesturesPassword'>>(); // 路由参数
  const { isGoBack = false, isJump = false } = params;

  const { goBack } = useNavigation<StackNavigationProp<ParamListBase>>();
  const onSetGesture = async (password: string) => {
    const custNo = userInfo?.custNo;
    // 储存的手势信息是多用户的object
    let userObj = await getItem('userGesturePasswordObj');
    if (userObj && custNo) userObj[custNo] = password;
    else userObj = custNo && { [custNo]: password };
    setItem('userGesturePasswordObj', userObj);
  };
  const onFinishPassword = (password: React.SetStateAction<string>) => {
    if (password.length >= 6)
      if (gpasw) {
        if (gpasw === password) {
          onSetGesture(password);
          setSucMsg('手势密码设置成功');
          setTipsMsg('');
          setErrMsg('');

          // 当有Jpush事件没有处理，这里先跳转落地页
          if (eventBus.getAllEvents('JPush-Navigate').length > 0) eventBus.emit('JPush-Navigate');
          else
            setTimeout(() => {
              if (isGoBack) goBack();
              else resetHome();
            }, 800);
        } else {
          setErrMsg('两次输入的不一致');
          setTipsMsg('');
          setSucMsg('');
          setGpasw('');
        }
      } else {
        setTipsMsg('再次绘制解锁密码');
        setSucMsg('');
        setErrMsg('');
        setGpasw(password);
      }
    else {
      setErrMsg('密码太短，至少需要6个点');
      setTipsMsg('');
      setSucMsg('');
    }
  };

  const androidGoBack = () => true;
  useEffect(() => {
    if (!isGoBack) BackHandler.addEventListener('hardwareBackPress', androidGoBack);
    return () => {
      if (!isGoBack) BackHandler.removeEventListener('hardwareBackPress', androidGoBack);
    };
  }, []);
  return (
    <View flex bg-white centerV backgroundColor={'#fff'} style={{ backgroundColor: '#fff' }}>
      <View centerH>
        <View>
          <Text navTitle>设置手势密码</Text>
        </View>
        <View height={30} bottom>
          {errMsg ? (
            <Text f12 errorRed>
              {errMsg}
            </Text>
          ) : null}
          {tipsMsg ? (
            <Text f12 grey66>
              {tipsMsg}
            </Text>
          ) : null}
          {sucMsg ? (
            <Text f12 green35>
              {sucMsg}
            </Text>
          ) : null}
        </View>
      </View>
      <OkGesturePassword
        gestureAreaLength={330}
        style={Colors.white}
        pointBackgroundColor={'white'}
        showArrow={false}
        color={Colors.primaryColor}
        activeColor={Colors.primaryColor}
        warningColor={'red'}
        warningDuration={0}
        allowCross={false}
        onFinish={onFinishPassword}
      />
      {!isGoBack && !isJump ? (
        <View centerH>
          <View>
            <LineSpace height={24} />
            <Text artTitle primaryColor onPress={() => logout('Login', { resetName: 'HomeTab' })}>
              其他方式登录
            </Text>
          </View>
        </View>
      ) : null}
      {!isGoBack && isJump ? (
        <View centerH>
          <View>
            <LineSpace height={24} />
            <Text
              artTitle
              primaryColor
              onPress={() => {
                resetHome();
              }}>
              跳过此步骤
            </Text>
          </View>
        </View>
      ) : null}
      {isGoBack ? (
        <View centerH>
          <View>
            <LineSpace height={24} />
            <Text
              artTitle
              primaryColor
              onPress={() => {
                goBack();
              }}>
              暂不设置
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const mapStateToProps = ({ login: { userInfo } }: RootState) => ({
  userInfo,
});
export default connect(mapStateToProps)(GesturesPasswordSet);
