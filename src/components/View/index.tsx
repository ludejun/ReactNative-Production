import React, { useEffect, useState, ReactNode, ReactElement } from 'react';
import { ScrollView, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ViewProps,
  TabBar as RnTabBar,
  Colors,
  Badge,
} from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';
import { useInterval } from '../../hooks';
import { Touchable } from '../Button';
import Loading from '../Loading';

interface ViewLoaderProps extends ViewProps {
  loading?: boolean;
  children?: ReactNode;
  message?: string;
  disableSafeBottom?: boolean;
  disableGoBack?: boolean;
  //style?: CSSProperties
}

export const ViewLoader: React.FC<ViewLoaderProps> = (props: ViewLoaderProps) => {
  const {
    loading = false,
    children,
    disableSafeBottom = false,
    message = '加载中...',
    disableGoBack = false,
    style = {},
    ...restProps
  } = props;
  const { bottom } = useSafeAreaInsets();
  const backgroundColor: any = {
    default: '#fff',
    opacity: 'rgba(255,255,255,0)',
    opacity1: 'rgba(255,255,255,0.1)',
    opacity2: 'rgba(255,255,255,0.2)',
    opacity3: 'rgba(255,255,255,0.3)',
    opacity4: 'rgba(255,255,255,0.4)',
    opacity5: 'rgba(255,255,255,0.5)',
    opacity6: 'rgba(255,255,255,0.6)',
    opacity7: 'rgba(255,255,255,0.7)',
    opacity8: 'rgba(255,255,255,0.8)',
    opacity9: 'rgba(255,255,255,0.9)',
    opacityDark: 'rgba(0,0,0,0)',
    opacityDark1: 'rgba(0,0,0,0.1)',
    opacityDark2: 'rgba(0,0,0,0.2)',
    opacityDark3: 'rgba(0,0,0,0.3)',
    opacityDark4: 'rgba(0,0,0,0.4)',
    opacityDark5: 'rgba(0,0,0,0.5)',
    opacityDark6: 'rgba(0,0,0,0.6)',
    opacityDark7: 'rgba(0,0,0,0.7)',
    opacityDark8: 'rgba(0,0,0,0.8)',
    opacityDark9: 'rgba(0,0,0,0.9)',
  };
  const androidGoBack = () => true;
  useEffect(() => {
    if (disableGoBack) BackHandler.addEventListener('hardwareBackPress', androidGoBack);
    return () => {
      if (disableGoBack) BackHandler.removeEventListener('hardwareBackPress', androidGoBack);
    };
  }, []);
  return (
    <View style={[{ paddingBottom: !disableSafeBottom ? bottom : 0 }, style]} {...restProps}>
      {loading ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            zIndex: 999,
            backgroundColor: backgroundColor.opacity,
          }}>
          <Loading message={message} />
        </View>
      ) : null}
      {children}
    </View>
  );
};

// extends Animatable.AnimatableProperties
interface AnimatableViewProps extends ViewProps {
  animataIndex?: number;
  animationName?: 'entrance' | 'entranceRight' | Animatable.Animation;
}

export const AnimatableView = (props: AnimatableViewProps & { children: ReactNode }) => {
  const { children = null, animataIndex = 0, animationName = 'entrance', ...restProps } = props;
  return (
    // @ts-ignore
    <Animatable.View
      delay={10 + (Number(animataIndex) % 12) * 100}
      animation={animationName}
      easing={'ease-in-out'}
      duration={600}
      {...restProps}>
      {children}
    </Animatable.View>
  );
};

export const ScrollInputView = (props: { children: ReactElement }) => {
  const { children, ...restProps } = props;
  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} {...restProps}>
      {children}
    </ScrollView>
  );
};

interface TabWarpFC {
  children: ReactNode
}

export const TabWarp = ({ children }: TabWarpFC) => <View flex>{children}</View>;
TabWarp.Item = ({ children }: { children: ReactNode }) => <ScrollView>{children}</ScrollView>;

interface TabBarProps {
  data: Array<{ label: string; key: string }>;
  height?: number;
  onTabSelected: (item: { label: string; key: string }) => void;
  selectedIndex?: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  data = [],
  height = 44,
  onTabSelected = () => {},
  selectedIndex = 0,
}: TabBarProps) => (
  <RnTabBar
    height={height}
    style={{ display: 'flex' }}
    // @ts-ignore
    indicatorStyle={{
      backgroundColor: Colors.primaryColor,
      height: 2,
      width: 12,
      marginHorizontal: 0,
      alignSelf: 'center',
      borderRadius: 3,
      position: 'absolute',
      bottom: 5,
    }}
    onTabSelected={(e: number) => onTabSelected(data[e])}
    selectedIndex={selectedIndex}>
    {data.map(({ label, key }) => (
      <RnTabBar.Item
        key={key}
        label={label}
        labelStyle={{
          marginLeft: -20,
          marginRight: -20,
          color: Colors.greyAA,
          fontSize: 15,
          fontFamily: Colors.pfr,
        }}
        selectedLabelStyle={{
          color: Colors.primaryColor,
          fontSize: 15,
          fontFamily: Colors.pfr,
          fontWeight: '600',
        }}
        style={{ height: 44, position: 'relative' }}
      />
    ))}
  </RnTabBar>
);

export const MyBadge = ({
  badgeCount = 0,
  style,
  ...restProps
}: { badgeCount: number } & ViewProps) =>
  badgeCount ? (
    <View absT absR style={[{ zIndex: 1 }, style]} {...restProps}>
      <Badge size={5} backgroundColor={Colors.badgeRed} />
    </View>
  ) : null;


// Get the verification code
export const SMSGETVerificationCode = (props: {
  onPress: () => boolean | void | Promise<boolean>
  mcid?: string
  title?: string
  hasSend?: boolean
}) => {
  const baseTime = 61;
  const [vCodeTime, setVCodeTime] = useState(baseTime);
  // mcid = 'FPMC60200001'
  const { onPress = () => {}, mcid = '', title = '获取验证码', hasSend, ...restProps } = props;
  const onGetVCode = async () => {
    const isSetTime = await onPress();
    if (isSetTime) setVCodeTime(vCodeTime - 1);
  };

  useEffect(() => {
    if (hasSend) {
      onGetVCode();
    }
  }, []);
  useInterval(() => {
    if (vCodeTime !== baseTime) setVCodeTime(vCodeTime - 1);
    if (vCodeTime === 0) setVCodeTime(baseTime);
  }, 1000);
  return (
    <View {...restProps}>
      {vCodeTime === baseTime ? (
        <Touchable mcid={mcid} onPress={onGetVCode}>
          <Text primaryColor f14>
            {title}
          </Text>
        </Touchable>
      ) : (
        <Text grey99 f12>
          {vCodeTime}秒
        </Text>
      )}
    </View>
  );
};
