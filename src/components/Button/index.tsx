import React, { ReactNode, useState } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { TouchableOpacity, View, Text, Colors } from 'react-native-ui-lib';
import monitor from '../../utils/monitor';
import { buttonBG, buttonBR } from './config';
import { LineSpace } from '../../components';

interface TouchableProps {
  onPress?: (e?: any) => void;
  style?: StyleProp<ViewStyle>;
  mcid?: string; // 埋点-点击事件ID
  mcCustom?: {}; // 埋点-点击事件的自定义字段
  disabled?: boolean;
  throttleTime?: number; // 节流
  activeOpacity?: number; // 点击时添加的透明度
  children?: ReactNode;
}

export const Touchable: React.FC<TouchableProps> = (props: TouchableProps) => {
  const {
    children,
    onPress = () => {},
    mcid,
    mcCustom,
    disabled = false,
    throttleTime = 300,
    activeOpacity = 0.8,
  } = props;

  const onPressTouchable = () => {
    // 自动添加埋点
    if (mcid) monitor.trackEv('MC', mcid, mcCustom);
    onPress();
  };
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : activeOpacity}
      throttleTime={throttleTime}
      {...props}
      onPress={!disabled ? onPressTouchable : () => {}}>
      {children}
    </TouchableOpacity>
  );
};

interface ButtonProps {
  disable?: boolean;
  title?: string;
  onPress?: () => void;
  type?: 'primary' | 'default' | 'basic'; // 主色背景、白色背景、无背景
  width?: number;
  height?: number;
  fontSize?: TextStyle['fontSize'];
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  mcid?: string;
  mcCustom?: Object;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const [iLoading, setLoading] = useState(false);
  const {
    disable = false,
    title = 'set btn title',
    onPress = () => {},
    type = 'primary', // primary && default
    width,
    height = 42,
    fontSize = 18,
    backgroundColor = false,
    borderColor,
    mcid = '',
    mcCustom = {},
    fullWidth = false,
    loading = false,
  } = props;
  const onPressBtn = () => {
    setLoading(true);
    onPress();
  }
  if (disable)
    return (
      <View
        center
        width={width}
        height={height}
        br10={!fullWidth}
        bg-primaryColor={type === 'primary'}
        bg-white={type === 'default'}
        style={{
          borderColor: Colors.primaryColor,
          borderWidth: 1,
        }}>
        <Text
          firstTitle={fontSize === 18}
          f16
          pfr
          white={type === 'primary' || type === 'basic'}
          primaryColor={type === 'default'}
          style={{ fontSize }}>
          {title}
        </Text>
      </View>
    );
  return (
    <Touchable mcid={mcid} mcCustom={mcCustom} onPress={onPressBtn}>
      <View
        center
        width={width}
        height={height}
        br10={!fullWidth}
        bg-primaryColor={type === 'primary'}
        bg-white={type === 'default'}
        bg-opacityB1={type === 'basic'}
        style={{
          backgroundColor: backgroundColor || Colors[buttonBG[type]],
          borderColor: borderColor || Colors[buttonBR[type]],
          borderWidth: 1,
        }}>
        <Text
          firstTitle={fontSize === 18}
          pfr
          white={type === 'primary' || type === 'basic'}
          primaryColor={type === 'default'}
          f16={fontSize === 16}
          style={{ fontSize }}>
          {title}
        </Text>
      </View>
    </Touchable>
  );
};

interface ButtonColumnTwoProps {
  disable?: boolean;
  type?: 'primary' | 'default' | 'basic';
  title?: string;
  leftTitle?: string;
  rightTitle?: string;
  onPressLeftButton?: () => void;
  onPressRightButton?: () => void;
  width?: number;
  height?: number;
  fontSize?: TextStyle['fontSize'];
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  mcid?: string;
  mcid1?: string;
  mcid2?: string;
  mcCustom?: {};
}

export const ButtonColumnTwo: React.FC<ButtonColumnTwoProps> = (props: ButtonColumnTwoProps) => {
  const {
    leftTitle = 'set btn title',
    rightTitle = 'set btn title',
    onPressLeftButton = () => {},
    onPressRightButton = () => {},
    height = 42,
    fontSize = 18,
    mcid1 = '',
    mcid2 = '',
    mcCustom = {},
  } = props;

  return (
    <View>
      <LineSpace height={1} bgColor={Colors.primaryColor} />
      <View row>
        <Touchable
          mcid={mcid1}
          mcCustom={mcCustom}
          onPress={onPressLeftButton}
          style={{ width: '50%' }}>
          <View center width={'100%'} height={height} style={{ backgroundColor: '#ffffff' }}>
            <Text firstTitle={fontSize === 18} pfr primaryColor style={{ fontSize }}>
              {leftTitle}
            </Text>
          </View>
        </Touchable>
        <Touchable
          mcid={mcid2}
          mcCustom={mcCustom}
          onPress={onPressRightButton}
          style={{ width: '50%' }}>
          <View center width={'100%'} height={height} style={{ backgroundColor: '#CCAC77' }}>
            <Text firstTitle={fontSize === 18} pfr white style={{ fontSize }}>
              {rightTitle}
            </Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
};

export const BottomButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    disable = true,
    title = '确认',
    onPress = () => {},
    height = 42,
    fontSize = 18,
    mcid = '',
    mcCustom = {},
    // type = 'primary',
  } = props;

  return (
    <Touchable mcid={mcid} mcCustom={mcCustom} onPress={onPress}>
      <View
        center
        width={'100%'}
        height={height}
        bg-primaryColor={!disable}
        bg-SunDisColor={disable}>
        <Text firstTitle={fontSize === 18} pfr white style={{ fontSize }}>
          {title}
        </Text>
      </View>
    </Touchable>
  );
};
