import React, { useEffect, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import { Colors, View, Text } from 'react-native-ui-lib';
import { useNavigation, ParamListBase } from '@react-navigation/native';
// @ts-ignore
import OkGesturePassword from 'react-native-ok-gesture-password';
import { getItem, resetHome, eventBus, logout } from '../../utils';
import { LineSpace } from '../../components';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { connect } from 'react-redux';
import { RootState } from '../../store';

type IGesture = ReturnType<typeof mapStateToProps>;
const GesturesPassword = (props: IGesture) => {
  const { userInfo } = props;
  const [errTimes, setErrTimes] = useState(5); // 最多失败次数，超过需要重新登录
  const { navigate } = useNavigation<StackNavigationProp<ParamListBase>>();
  const resetLogin = () => {
    logout('Login', { resetName: 'HomeTab' }, false);
  };
  const onFinishPassword = async (password: any) => {
    const data = await getItem('userGesturePasswordObj');
    const custNo = userInfo?.custNo;

    if (!data) return noSetGesturePas();
    if (!custNo || (custNo && !data[custNo])) return noSetGesturePas();
    if (custNo && data[custNo] && data[custNo] === password) {
      // !important -> TODO 这里需要加入如更新token等业务需要
      // await fetchNewTokenLogin();

      if (eventBus.getAllEvents('JPush-Navigate').length > 0)
        return eventBus.emit('JPush-Navigate'); // 当有Jpush事件没有处理，这里先跳转落地页
      return resetHome();
    }

    if (errTimes - 1 === 0) {
      setErrTimes(errTimes - 1);
      return Alert.alert('温馨提示', '输入密码错误已达5次，请重新登录', [
        {
          text: '重新登录',
          onPress: resetLogin,
          style: 'cancel',
        },
      ]);
    }
    setErrTimes(errTimes - 1);
  };
  const androidGoBack = () => true;

  const noSetGesturePas = () => {
    Alert.alert('温馨提示', '您暂未设置手势密码，请先设置手势密码？', [
      {
        text: '重新登录',
        onPress: resetLogin,
        style: 'cancel',
      },
      {
        text: '立刻设置',
        onPress: () => {
          navigate('GesturesPasswordSet'); // 跳转设置手势页，路由由业务定义在App中
        },
        style: 'default',
      },
    ]);
  };

  useEffect(() => {
    getItem('userGesturePasswordObj').then((data) => {
      const custNo = userInfo?.custNo;
      if (!data) noSetGesturePas();
      if (!custNo || (custNo && !data[custNo])) noSetGesturePas();
    });
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', androidGoBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', androidGoBack);
    };
  }, []);

  return (
    <View flex bg-white backgroundColor={'#fff'} style={{ backgroundColor: '#fff' }}>
      <View flex centerV>
        <View centerH>
          <View>
            <Text navTitle grey33>
              验证手势密码
            </Text>
          </View>
          <View height={30} bottom>
            {errTimes < 5 ? (
              <Text f12 errorRed>
                密码输入错误，还可以输入{errTimes}次
              </Text>
            ) : null}
          </View>
        </View>
        <OkGesturePassword
          gestureAreaLength={330}
          pointBackgroundColor={'white'}
          showArrow={false}
          color={Colors.primaryColor}
          activeColor={Colors.primaryColor}
          warningColor={'red'}
          warningDuration={0}
          allowCross={false}
          onFinish={onFinishPassword}
        />
        <View centerH>
          <View center>
            <LineSpace height={24} />
            <Text artTitle primaryColor onPress={resetLogin}>
              其他方式登录
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = ({ login: { userInfo } }: RootState) => ({
  userInfo,
});
export default connect(mapStateToProps)(GesturesPassword);
