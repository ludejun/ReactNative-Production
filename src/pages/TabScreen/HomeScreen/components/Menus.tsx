import React from 'react';
import { View, Text, Image } from 'react-native-ui-lib';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { AnimatableView, LineSpace, Touchable } from '../../../../components';
import { menuImage } from '../config';
import monitor from '../../../../utils/monitor';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { checkUrl } from '../../../../utils';

interface MenusProps {
  menuList: {
    name: string
    url: string
    functionNo: string
  }[]
}

const Menus: React.FC<MenusProps> = ({ menuList = [] }: MenusProps) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  // const imageLinkUrl =
  let menuArray: { name: string; url: string; functionNo: string }[] = [];
  if (menuList && menuList.length) menuArray = menuList;

  const linkTo = (url: string, functionNo: string) => {
    monitor.trackEv('MC', functionNo);
    if (url && checkUrl(url))
      navigation.navigate('Webview', { url });
    else navigation.navigate(url, {});
  };

  return (
    <View flex row paddingT-16 paddingH-12 style={{ flexWrap: 'wrap' }}>
      {menuArray &&
        menuArray.map(({ name, url, functionNo }, index) => (
          <View
            marginB-18
            centerH
            key={functionNo}
            style={{
              width:
                menuArray && (menuArray.length === 8 || menuArray.length === 4) ? '25%' : '20%',
            }}>
            <AnimatableView
              animataIndex={index}
              key={functionNo}
              style={{
                flex: 1,
              }}>
              <Touchable
                onPress={() => linkTo(url, functionNo)}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={menuImage[name]} style={{ width: 27, height: 27 }} />
                <LineSpace height={9} />
                <Text center grey33 f12>
                  {name}
                </Text>
              </Touchable>
            </AnimatableView>
          </View>
        ))}
    </View>
  );
};

export default Menus;
