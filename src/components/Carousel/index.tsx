import React, { ReactNode } from 'react';
import { ImageBackground, ImageRequireSource } from 'react-native';
import { View, Carousel, Colors, Image } from 'react-native-ui-lib';
import { AnimatableView, Touchable } from '../../components';

export const ViewBG = ({
  source,
  children,
}: {
  source?: ImageRequireSource;
  children?: ReactNode;
}) => (
  <View flex bg-grey50>
    <ImageBackground
      source={source || require('./image/carouselBG.png')}
      resizeMode={'cover'}
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      {children}
    </ImageBackground>
  </View>
);

interface CarouselProps {
  data: {
    key?: string;
    imageUrl: string;
    onPress?: (index: number) => void;
    mcid?: string;
  }[];
}

export const CarouselBanner: React.FC<CarouselProps> = ({
  data = [],
}: CarouselProps) => {
  return (
    <View br10 style={{ overflow: 'hidden' }}>
      <Carousel
        containerStyle={{ height: 170 }}
        // loop
        pageControlProps={{ size: 5, color: Colors.primaryColor }}
        pageControlPosition={
          data.length > 1 ? Carousel.pageControlPositions.OVER : undefined
        }>
        {data.map(({ imageUrl, onPress, mcid, key }, index) => (
          <AnimatableView animataIndex={index} key={key || imageUrl} style={{ flex: 1 }}>
            <View flex>
              <Touchable
                mcid={mcid || ''}
                style={{ flex: 1 }}
                onPress={onPress ? () => onPress(index) : undefined}>
                <Image style={{ flex: 1 }} source={{ uri: imageUrl }} resizeMode={'cover'} />
              </Touchable>
            </View>
          </AnimatableView>
        ))}
      </Carousel>
    </View>
  );
};
