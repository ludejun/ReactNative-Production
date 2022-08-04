/* eslint-disable @typescript-eslint/no-var-requires */
import React, { ReactNode } from 'react';
import { View, Text, Modal as RNModal, Image, Colors, Dialog } from 'react-native-ui-lib';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Button, Touchable } from '../Button';
import { LineSpace, WidthSpace } from '../Utils';
import { WeChat } from '../../configs/wechat';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';

export const modalImageConfig = { closeModal: require('./image/closeModal.png') };

interface ModalProps {
  visible?: boolean;
  headerTitle?: string;
  containerTitle?: string | React.ReactNode;
  btnTitle?: string;
  headerReander?: Function;
  containerRender?: Function;
  onBtnPress?: () => void;
  btnType?: 'primary' | 'default';
  bottomRender?: Function;
  onCancel?: () => void;
  onCancelRender?: Function;
  showCloseBtn?: boolean;
  width?: number;
  overlayBackgroundColor?: boolean | string; // 浮层是否有，默认没有，默认色为rgba(0,0,0,0.7)
}

export const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    visible = false,
    headerTitle = '温馨提示',
    containerTitle = '',
    btnTitle = '确认',
    headerReander = () => false,
    containerRender = () => false,
    onBtnPress = () => null,
    btnType = 'primary', // primary && default
    bottomRender = () => false,
    onCancel = () => null,
    onCancelRender = () => false,
    showCloseBtn = true,
    width = 290,
    overlayBackgroundColor = false,
  } = props;

  // const overlayColor = 
  return (
    <RNModal
      visible={visible}
      animationType={'fade'}
      transparent
      overlayBackgroundColor={overlayBackgroundColor === true ? 'rgba(0,0,0,0.7)' : overlayBackgroundColor === false ? undefined : overlayBackgroundColor }
    >
      <View flex bg-opacity8 center>
        <View padding-30 bg-white br20 width={width}>
          {headerReander() || (
            <>
              <Text firstTitle grey33 textCenter>
                {headerTitle}
              </Text>
              <LineSpace height={12} />
            </>
          )}
          {containerRender() || (
            <Text grey66 artTitle textJustify>
              {containerTitle}
            </Text>
          )}
          <LineSpace height={12} />
          {bottomRender() || <Button type={btnType} title={btnTitle} onPress={onBtnPress} />}
        </View>
        {showCloseBtn
          ? onCancelRender() || (
              <View centerH>
                <LineSpace height={20} />
                <Touchable onPress={onCancel}>
                  <Image source={modalImageConfig.closeModal} />
                </Touchable>
              </View>
          )
          : null}
      </View>
    </RNModal>
  );
};

export const ConfirmModalButton = ({
  okText = '确认',
  cancelText = '取消',
  onCancel = () => null,
  onOk = () => null,
}: //...restProps
{
  okText?: string;
  cancelText?: string;
  onCancel?: () => void;
  onOk?: () => void;
}) => (
  <View row center>
    <Touchable onPress={onCancel}>
      <View
        center
        width={100}
        height={36}
        br10
        bg-white
        style={{
          borderColor: Colors.primaryColor,
          borderWidth: 1,
        }}>
        <Text f15 pfr primaryColor>
          {cancelText}
        </Text>
      </View>
    </Touchable>
    <WidthSpace width={35} />
    <Touchable onPress={onOk}>
      <View
        center
        width={100}
        height={36}
        br10
        bg-primaryColor
        style={{
          borderColor: Colors.primaryColor,
          borderWidth: 1,
        }}>
        <Text f15 pfr white>
          {okText}
        </Text>
      </View>
    </Touchable>
  </View>
);

interface ConfirmModalProps extends ModalProps {
  containerTitle?: string | ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  onShareFriend?: () => void;
  onShareCircle?: () => void;
  onShareCollect?: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = (props: ConfirmModalProps) => (
  <Modal
    {...props}
    bottomRender={() => (
      <ConfirmModalButton
        okText={props.okText}
        cancelText={props.cancelText}
        onOk={props.onOk}
        onCancel={props.onCancel}
      />
    )}
  />
);

export const iconShareImg = require('./image/icon_shareImg.png');
export const iconPeople = require('./image/icon_friend.png');
export const iconCollect = require('./image/icon_collect.png');
export const iconWechat = require('./image/icon_wechat.png');

export const WechatDialog: React.FC<ConfirmModalProps> = (props: ConfirmModalProps) => {
  const {
    visible = false,
    onCancel = () => null,
    onShareFriend = () => null,
    onShareCircle = () => null,
    onShareCollect = () => null,
  } = props;

  return (
    <Dialog
      visible={visible}
      containerStyle={{ backgroundColor: '#fff' }}
      bottom
      width={'100%'}
      height={150}>
      <View>
        <Touchable onPress={onCancel}>
          <View paddingT-12 paddingL-15>
            <Text grey99 f14>
              取消
            </Text>
          </View>
        </Touchable>
        <View row paddingT-12 paddingB-30>
          <Touchable style={{ flex: 1 }} onPress={onShareFriend}>
            <View centerH>
              <Image
                source={iconWechat}
                style={{
                  width: 45,
                  height: 45,
                  marginBottom: 10,
                }}
              />
              <Text center f14>
                微信
              </Text>
            </View>
          </Touchable>
          <Touchable style={{ flex: 1 }} onPress={onShareCircle}>
            <View centerH>
              <Image
                source={iconPeople}
                style={{
                  width: 45,
                  height: 45,
                  marginBottom: 10,
                }}
              />
              <Text center f14>
                朋友圈
              </Text>
            </View>
          </Touchable>
          <Touchable style={{ flex: 1 }} onPress={onShareCollect}>
            <View centerH>
              <Image
                source={iconCollect}
                style={{
                  width: 45,
                  height: 45,
                  marginBottom: 10,
                }}
              />
              <Text center f14>
                微信收藏
              </Text>
            </View>
          </Touchable>
        </View>
      </View>
    </Dialog>
  );
};

interface WechatShareTabProps {
  shareObj: {
    title: string;
    thumbImageUrl?: string; // 缩略图URL
    webpageUrl: string; // 分享文章的URL
    scene: number; // 分享的场景 @Number 分享到, 0:会话 1:朋友圈 2:收藏
  }; // 微信分享的固定格式object; // 分享object，查看demo
  shareImg?: { startCreateImg?: () => string } | string; // 开始生成分享图或者URL
}

export const WechatShareTab: React.FC<WechatShareTabProps> = ({
  shareObj,
  shareImg,
}: WechatShareTabProps) => {
  const { goBack } = useNavigation<StackNavigationProp<ParamListBase>>();
  const onShare = (type: string) => {
    if (type === 'share') WeChat.shareWebpage(shareObj);
    if (type === 'shareFriends')
      WeChat.shareWebpage({
        ...shareObj,
        scene: 1,
      });
    if (type === 'collection')
      WeChat.shareWebpage({
        ...shareObj,
        scene: 2,
      });
    if (type === 'shareImg' && shareImg) {
      let imageUrl;
      if (typeof shareImg === 'string') {
        imageUrl = shareImg;
      } else {
        const { startCreateImg } = shareImg;
        if (startCreateImg) imageUrl = startCreateImg();
      }
      WeChat.shareImage({
        imageUrl,
        scene: 0,
      });
    }
    goBack();
  };
  return (
    <View bg-white>
      <View row paddingV-30 paddingB-30>
        {shareImg ? (
          <Touchable style={{ flex: 1 }} onPress={onShare.bind(null, 'shareImg')}>
            <View center>
              <Image
                source={iconShareImg}
                style={{
                  width: 45,
                  height: 45,
                  marginBottom: 10,
                }}
              />
              <Text center f14>
                长图分享
              </Text>
            </View>
          </Touchable>
        ) : null}
        <Touchable style={{ flex: 1 }} onPress={onShare.bind(null, 'share')}>
          <View center>
            <Image
              source={iconWechat}
              style={{
                width: 45,
                height: 45,
                marginBottom: 10,
              }}
            />
            <Text center f14>
              微信
            </Text>
          </View>
        </Touchable>
        <Touchable style={{ flex: 1 }} onPress={onShare.bind(null, 'shareFriends')}>
          <View center>
            <Image
              source={iconPeople}
              style={{
                width: 45,
                height: 45,
                marginBottom: 10,
              }}
            />
            <Text center f14>
              朋友圈
            </Text>
          </View>
        </Touchable>
        <Touchable style={{ flex: 1 }} onPress={onShare.bind(null, 'collection')}>
          <View center>
            <Image
              source={iconCollect}
              style={{
                width: 45,
                height: 45,
                marginBottom: 10,
              }}
            />
            <Text center f14>
              微信收藏
            </Text>
          </View>
        </Touchable>
      </View>
    </View>
  );
};
