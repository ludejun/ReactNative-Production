import React from 'react';
import { View } from 'react-native-ui-lib';
import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Touchable, WechatShareTab } from '../../components';

type ParamList = {
  WechatShare: {
    shareImg?: string; // 分享图片的URL
    shareObj: {
      title: string;
      thumbImageUrl?: string; // 缩略图URL
      webpageUrl: string; // 分享文章的URL
      scene: number; // 分享的场景 @Number 分享到, 0:会话 1:朋友圈 2:收藏
    }; // 微信分享的固定格式object
  };
};

const WechatShare: React.FC = () => {
  const { goBack } = useNavigation<StackNavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<ParamList, 'WechatShare'>>();
  const { shareObj, shareImg } = params; // shareImg默认为null，不显示分享长图
  const shareGoBack = () => {
    goBack();
  };
  return (
    <View flex>
      {/* 加蒙层<View flex bg-opacity5> */}
      <View flex>
        <Touchable style={{ flex: 1 }} onPress={shareGoBack}>
          <View></View>
        </Touchable>
      </View>
      <View bg-white>
        <WechatShareTab shareObj={shareObj} shareImg={shareImg} />
      </View>
    </View>
  );
};

export default WechatShare;
