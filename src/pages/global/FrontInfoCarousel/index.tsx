import React from 'react';
import { Alert, ImageBackground } from 'react-native';
import { View, Carousel, Colors, Text } from 'react-native-ui-lib';
import { Button, LineSpace, Touchable } from '../../../components';
import { frontInfoImageConfig } from './config';
import { reset, resetHome, setItem } from '../../../utils';

const FrontInfoCarousel = () => {
  const onSetFrontInfoStroage = (cb: () => void) => {
    try {
      setItem('frontInfo', 'close')
        .then((data) => {
          console.log('frontInfo', data);
        })
        .finally(() => {
          cb();
        });
    } catch (e) {
      console.log('frontInfo-catch', e);
    }
  };

  return (
    <View flex bg-black>
      <Carousel
        containerStyle={{ flex: 1 }}
        // loop
        pageControlProps={{ size: 5, color: Colors.primaryColor }}
        pageControlPosition={Carousel.pageControlPositions.OVER}>
        {frontInfoImageConfig.map((item, index, arr) => (
          <View flex key={index} center>
            <ImageBackground style={{ flex: 1, width: '100%' }} source={item}>
              {index !== arr.length - 1 && (
                <View flex bottom centerH paddingB-102>
                  <Button
                    type={'basic'}
                    title={'立 即 体 验'}
                    width={150}
                    onPress={onSetFrontInfoStroage.bind(null, resetHome)}
                  />
                </View>
              )}
              {index === arr.length - 1 && (
                <View flex bottom padding-23 paddingB-102>
                  <Button title={'登  录'} onPress={onSetFrontInfoStroage.bind(null, reset)} />
                  <LineSpace height={15} />
                  <Button
                    title={'注  册'}
                    type={'default'}
                    backgroundColor={Colors.opacity5}
                    onPress={onSetFrontInfoStroage.bind(null, reset)}
                  />
                  <LineSpace height={15} />
                  <View row left>
                    <Touchable onPress={onSetFrontInfoStroage.bind(null, () => Alert.alert('请输入忘记密码回调'))}>
                      <Text white f12>
                        忘记密码
                      </Text>
                    </Touchable>
                    <View flex right>
                      <Touchable onPress={onSetFrontInfoStroage.bind(null, resetHome)}>
                        <Text white f12>
                          随便逛逛
                        </Text>
                      </Touchable>
                    </View>
                  </View>
                </View>
              )}
            </ImageBackground>
          </View>
        ))}
      </Carousel>
    </View>
  );
};

export default FrontInfoCarousel;
