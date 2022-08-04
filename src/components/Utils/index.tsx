import React from 'react';
import { View as RnView, StatusBar, TextStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, View, Text } from 'react-native-ui-lib';
import { safeHeight } from '../../utils';

interface LineSpaceProps {
  height?: number;
  bgColor?: string;
  marginH?: number; // 水平方向的margin
}

export const LineSpace: React.FC<LineSpaceProps> = ({
  height = 12,
  bgColor = 'rgba(0,0,0,0)',
  marginH = 0,
}: LineSpaceProps) => (
  <View
    height={height}
    backgroundColor={bgColor}
    style={{ marginLeft: marginH, marginRight: marginH }}
  />
);

export const SplitLine: React.FC = () => <LineSpace height={1} bgColor={'#eee'} />;

interface WidthSpaceProps {
  width?: number;
  bgColor?: string;
  marginV?: number;
  height?: number;
}

export const WidthSpace: React.FC<WidthSpaceProps> = ({
  width = 12,
  bgColor = 'rgba(0,0,0,0)',
  marginV = 0,
  height = 0,
}: WidthSpaceProps) => (
  <View
    backgroundColor={bgColor}
    style={{
      width,
      height,
      marginTop: marginV,
      marginBottom: marginV,
    }}
  />
);

interface StatusBarHeightProps {
  backgroundColor?: string
  height?: number
  style?: any
  type?: 'light' | 'dark' | 'default'
  barStyle?: 'default' | 'light-content' | 'dark-content'
}

export const StatusBarView: React.FC<StatusBarHeightProps> = ({
  backgroundColor = Colors.primaryColor,
  style = {},
  height = safeHeight,
  type = 'default',
  barStyle = 'light-content', // 状态栏的barStyle，状态栏上系统文字的颜色
}: StatusBarHeightProps) => {
  let bg = backgroundColor;
  if (type === 'default') bg = backgroundColor;
  if (type === 'light') bg = 'rgba(0,0,0,0)';
  if (type === 'dark') bg = Colors.primaryColor;

  useFocusEffect(() => {
    //console.log(2222, barStyle, navigationRef.current.getCurrentRoute().name, bg)
    StatusBar.setBarStyle(barStyle);
  });

  return (
    <RnView
      style={{
        backgroundColor: bg,
        height,
        ...style,
      }}
    />
  );
};

export const CircularIcon = () => <View width={6} height={6} bg-greyDD br20 />;

interface DesTextProps {
  title?: string | React.ReactNode;
  style?: TextStyle;
}

export const DesciptionText: React.FC<DesTextProps> = (props: DesTextProps) => {
  const { title = '' } = props;
  return (
    <Text f12 grey99 {...props}>
      {title}
    </Text>
  );
};

export const ErrorText: React.FC<DesTextProps> = (props: DesTextProps) => {
  const { title = '' } = props;
  return (
    <Text f12 errorRed {...props}>
      {title}
    </Text>
  );
};

