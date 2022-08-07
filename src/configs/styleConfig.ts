import { Colors, Typography } from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';
import { deviceType } from '../utils/safeHeight';

export const fontLineHeight = (fontSize = 12, lineHeight = 1.5) => fontSize * lineHeight;

Colors.loadColors({
  primaryColor: '#CCAC77',
  primaryDisabe: '#E5D5BB',
  subColor: '#E5D5BB',
  hrefColor: '#4A90E2',
  red: '#D0021B',
  errorRed: '#FF5656',
  badgeRed: '#FF5656',
  white: '#ffffff',
  greyF5: '#f5f5f5',
  grayF9: '#f9f9f9',
  greyF9: '#f9f9f9',
  greyF8: '#f8f8f8',
  grey99: '#999999',
  grey66: '#666666',
  grey33: '#333333',
  greyAA: '#AAAAAA',
  greyDD: '#DDDDDD',
  greyEE: '#EEEEEE',
  lightGreyCC: '#ccc',
  opacity5: 'rgba(0,0,0,0.5)',
  opacity7: 'rgba(0,0,0,0.7)',
  opacityB5: 'rgba(255,255,255,0.5)',
});
Typography.loadTypographies({
  h2: {
    fontSize: 18,
    color: '#333',
  },
  h3: {
    fontSize: 18,
    lineHeight: 50,
    color: '#fff',
  },
  // 导航高度
  navTitle: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'PingFangSC-Regular',
  },
  // 一级标题
  firstTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'PingFangSC-Semibold',
  },
  // 二级标题
  secondTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'PingFangSC-Semibold',
  },
  // 三级标题
  thirdTitle: {
    fontSize: 15,
    fontFamily: 'PingFangSC-Regular',
  },
  // 文章标题
  artTitle: {
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
  },
  // 列表行标题
  itemTitle: {
    fontSize: 15,
    fontFamily: 'PingFangSC-Regular',
    fontWeight: '400',
  },
  // 常规体
  pf: { fontFamily: 'PingFang SC' },
  // 常规体(常用于普通文本)
  pfr: { fontFamily: 'PingFangSC-Regular' },
  // 中粗体(常用于标题)
  pfs: { fontFamily: 'PingFangSC-Semibold' },
  // fontSize: title, lineHeight: 默认为title的1.5倍
  f10: { fontSize: 10 },
  f11: { fontSize: 11 },
  f12: { fontSize: 12 },
  f13: { fontSize: 13 },
  f14: { fontSize: 14 },
  f15: { fontSize: 15 },
  f16: { fontSize: 16 },
  f17: { fontSize: 17 },
  f18: { fontSize: 18 },
  f19: { fontSize: 19 },
  f20: { fontSize: 20 },
  f21: { fontSize: 21 },
  f22: { fontSize: 22 },
  f23: { fontSize: 23 },
  f24: { fontSize: 24 },
  f25: { fontSize: 25 },
  f26: { fontSize: 26 },
  f27: { fontSize: 27 },
  f28: { fontSize: 28 },
  f29: { fontSize: 29 },
  f30: { fontSize: 30 },
  f31: { fontSize: 31 },
  f32: { fontSize: 32 },
  f33: { fontSize: 33 },

  l15: { lineHeight: 15 },
  l30: { lineHeight: 30 },

  fw2: { fontWeight: '200' },
  fw3: { fontWeight: '300' },
  fw4: { fontWeight: '400' },
  fw5: { fontWeight: '500' },
  fw6: { fontWeight: '600' },
  fw7: { fontWeight: '700' },
  fw8: { fontWeight: '800' },
  // 文本对齐方式
  textLeft: { textAlign: 'left' },
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  textJustify: { textAlign: 'justify' },
  tavB: { textAlignVertical: 'bottom' },
  tavT: { textAlignVertical: 'top' },
  tavA: { textAlignVertical: 'auto' },
  tavC: { textAlignVertical: 'center' },
});

Animatable.initializeRegistryWithDefinitions({
  entrance: {
    from: { opacity: deviceType ? 0 : 0.8, translateY: 10 },
    to: { opacity: 1, translateY: 0 },
  },
  entranceRight: {
    from: { opacity: 0, translateX: 10 },
    to: { opacity: 1, translateX: 0 },
  },
});
