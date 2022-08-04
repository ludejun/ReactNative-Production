import React from 'react';
import { View, Colors, Text } from 'react-native-ui-lib';
import * as Animatable from 'react-native-animatable';

const Loading = ({ message = '加载中...' }: { message: string }) => {
  const minHeight = 3;
  const maxHeight = 18;
  const defaultWidth = 3;
  const boxSize = 90;
  return (
    <View flex center>
      <View bottom height={boxSize} center width={boxSize} bg-opacity7 br30 paddingH-6>
        <View row center style={{ justifyContent: 'space-around' }} width={30} height={30}>
          <Animatable.View
            iterationCount={'infinite'}
            easing={'linear'}
            animation={{
              0: { height: maxHeight },
              0.5: { height: minHeight },
              1: { height: maxHeight },
            }}
            duration={2000}
            style={{
              height: maxHeight,
              width: defaultWidth,
              backgroundColor: Colors.primaryColor,
              borderRadius: defaultWidth,
            }}
          />
          <Animatable.View
            iterationCount={'infinite'}
            easing={'linear'}
            animation={{
              0: { height: minHeight },
              0.5: { height: maxHeight },
              1: { height: minHeight },
            }}
            duration={2000}
            style={{
              height: minHeight,
              width: defaultWidth,
              backgroundColor: Colors.primaryColor,
              borderRadius: defaultWidth,
            }}
          />
          <Animatable.View
            iterationCount={'infinite'}
            easing={'linear'}
            animation={{
              0: { height: maxHeight },
              0.5: { height: minHeight },
              1: { height: maxHeight },
            }}
            duration={2000}
            style={{
              height: maxHeight,
              width: defaultWidth,
              backgroundColor: Colors.primaryColor,
              borderRadius: defaultWidth,
            }}
          />
        </View>
        <View>
          <Text f12 pfr white>
            {message}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Loading;
