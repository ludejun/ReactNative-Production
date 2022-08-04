import React from 'react';
import { View, Image, Text } from 'react-native-ui-lib';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Touchable } from '../Button';
import { imageConfig } from './config';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { StatusBarView } from '../Utils';

export const headerImageConfig = {
  goBack: imageConfig.goBack,
  goBackWhite: imageConfig.goBackWhite,
};

export interface HeaderProps {
  leftRender?: Function
  leftOnPress?: Function
  rightRender?: Function
  headerTitle?: string | null
  type?: 'default' | 'light' | 'dark'
  hasStatus?: boolean
  goBackMcid?: string
  statusStyle?: {}
  barStyle?: 'default' | 'light-content' | 'dark-content'
}

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const {
    leftRender = () => false, // 返回true可以没有返回按钮
    leftOnPress = () => false,
    rightRender = null,
    headerTitle = 'header title',
    type = 'default', // Header的类型，主要用来控制返回按钮的颜色、状态栏默认颜色
    hasStatus = true, // 是否有状态栏，默认有
    statusStyle = {}, // 状态栏其他样式
    goBackMcid,
    barStyle = 'light-content', // 状态栏的barStyle，状态栏上系统文字的颜色
  } = props;

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  let imageSource = headerImageConfig.goBack;
  if (type === 'default') imageSource = headerImageConfig.goBackWhite;
  if (type === 'dark') imageSource = headerImageConfig.goBackWhite;
  if (type === 'light') imageSource = headerImageConfig.goBack;

  const leftPressHandler = () => {
    if (leftOnPress()) leftOnPress();
    else navigation.goBack();
  };
  return (
    <View>
      {hasStatus ? <StatusBarView barStyle={barStyle} type={type} style={statusStyle} /> : null}
      <View
        height={44}
        bg-primaryColor={type === 'default'}
        center
        centerV
        style={{ position: 'relative' }}>
        {leftRender() || (
          <View absL height={44} width={44} center>
            {/*leftOnPress() || navigation.goBack() */}
            <Touchable onPress={() => leftPressHandler()} mcid={goBackMcid}>
              <View flex row center centerV>
                <Image source={imageSource} />
              </View>
            </Touchable>
          </View>
        )}
        <Text f16 white={type !== 'light'} pfs>
          {headerTitle}
        </Text>
        {rightRender && (
          <View absR height={44} width={44}>
            {rightRender()}
          </View>
        )}
      </View>
    </View>
  );
};

// interface NavigationGoBackImageProps {
//   goBackImage?: 'white' | 'black'
// }

// export const NavigationGoBackImage: React.FC<NavigationGoBackImageProps> = ({
//   goBackImage = 'white',
// }: NavigationGoBackImageProps) => {
//   if (goBackImage === 'white')
//     return (
//       <View paddingL-10 width={50} style={{ width: 50 }}>
//         <Image source={imageConfig.goBackWhite} />
//       </View>
//     );
//   if (goBackImage === 'black')
//     return (
//       <View paddingL-10 width={50} style={{ width: 50 }}>
//         <Image source={imageConfig.goBack} />
//       </View>
//     );
//   return null;
// };

// interface HeaderBackButtonProps extends NavigationGoBackImageProps {
//   navigateType?:
//     | 'goBack'
//     | 'resetHome'
//     | 'resetLogin'
//     | 'resetUserInfo'
//     | 'resetRegistered'
//     | 'resetNavigation'
//   resetName?: string
// }

// export const HeaderBackButton: React.FC<HeaderBackButtonProps> = ({
//   goBackImage = 'white',
//   navigateType = 'goBack',
//   resetName = 'HomeTab',
// }: HeaderBackButtonProps) => {
//   const { goBack } = useNavigation<StackNavigationProp<ParamListBase>>();
//   const {
//     resetHome,
//     resetLogin,
//     resetUserInfo,
//     resetRegistered,
//     resetNavigation,
//   } = useNavigationReset();
//   const onNavigate = () => {
//     if (navigateType === 'goBack') goBack();
//     if (navigateType === 'resetHome') resetHome();
//     if (navigateType === 'resetLogin') resetLogin();
//     if (navigateType === 'resetUserInfo') resetUserInfo();
//     if (navigateType === 'resetRegistered') resetRegistered();
//     if (navigateType === 'resetNavigation') resetNavigation(resetName);
//   };
//   return (
//     <Touchable onPress={onNavigate}>
//       <NavigationGoBackImage goBackImage={goBackImage} />
//     </Touchable>
//   );
// };
