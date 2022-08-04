import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { Button, StatusBarView, ViewLoader } from '../../components';

// 需要注意下面几点：
// 1. 在登录成功时，在eventBus中有登录完成后需要执行的回调：if (eventBus.getAllEvents('LoginCallback').length > 0) eventBus.emit('LoginCallback')
//    一般是webview在调用login之后需要执行回到webview的回调
// 2. 路由参数中的resetName，指的是登录完需要reset的页面，在utils中的reset函数中，默认resetName === 'HomeTab'，这个与第一个功能有重合，第一个优先级高一点，适合执行更复杂的回调函数，resetName只是一个路由字符串
// 3. 登录成功要将store中的needFaceId重置，changeFaceId()
// 4. 登录成功引导设置FaceId或者手势，直接跳转FaceId就行，并且可以跳过此步 navigate('FaceId', { isJump: true })
// 5. 极光推送的回调需要在登录成功后执行：eventBus.emit('JPush-Navigate')，可以参考FaceId验证成功的处理；防止在登录过程中点击了极光推送
const Login = () => {
  return (
    <ViewLoader loading={false} flex>
      <StatusBarView />
      <View>
        <Text>登录页</Text>
        <Button title="登录" />
      </View>
    </ViewLoader>
  );
};

export default Login;