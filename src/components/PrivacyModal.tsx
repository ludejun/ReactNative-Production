import React, { useState } from 'react';
import { ScrollView, TouchableWithoutFeedback } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import RNExitApp from 'react-native-exit-app';
import { ConfirmModal, LineSpace } from '.';
import { setItem, deviceWidth, linkUrl } from '../utils';

interface PrivacyModalProps {
  onAgree: () => void;
  hrefConfig?: Record<string, string>;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onAgree, hrefConfig = {} }: PrivacyModalProps) => {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(true); // 展示隐

  /* 同意隐私协议 */
  const agreePrivacy = () => {
    setItem('isPopSecret', 2);
    setPrivacyModalVisible(false);
    onAgree();
  };

  /* 不同意隐私协议  退出登录 页面缓存记录 不再弹出该modal 除非登录失效或杀进程 */
  const cancelPrivacy = () => {
    RNExitApp.exitApp();
  };

  const linkToService = (type: string) => {
    linkUrl(hrefConfig[type]);
  };

  return (
    <ConfirmModal
      visible={privacyModalVisible}
      headerTitle={'温馨提示'}
      okText={'同意'}
      onOk={agreePrivacy}
      cancelText={'拒绝'}
      onCancel={cancelPrivacy}
      showCloseBtn={false}
      width={deviceWidth - 90}
      containerRender={() => (
        <ScrollView style={{ height: 418 }} showsVerticalScrollIndicator={false}>
          <View>
            <View>
              <Text f14 l21 grey66 style={{ textAlign: 'justify' }}>
                <Text style={{ textAlign: 'justify' }} textJustify>
                  欢迎使用XXX
                  App！为给您提供优质的服务、控制业务风险、保障信息和资金安全，本应用使用过程中，需要联网，需要在必要范围内收集、使用或共享您的个人信息。请您在使用前务必仔细阅读
                </Text>
                <TouchableWithoutFeedback
                  style={{ height: 16 }}
                  onPress={() => linkToService('register')}>
                  <Text blueE2 f14>
                    《用户服务协议》
                  </Text>
                </TouchableWithoutFeedback>
                <Text f14 l21 grey66>
                  和
                </Text>
                <TouchableWithoutFeedback
                  style={{ height: 16 }}
                  onPress={() => linkToService('privacyService')}>
                  <Text blueE2 f14>
                    《用户隐私政策》
                  </Text>
                </TouchableWithoutFeedback>
                <Text>，并确保您已全部了解关于您个人信息的收集使用规则。</Text>
              </Text>
            </View>
            <LineSpace />
            <View>
              <Text f14 l21 grey66>
                本应用使用期间，我们需要申请获取您的系统权限，您可以在我们询问时开启相关权限，也可以在设备系统“设置”里管理相关权限：
              </Text>
            </View>
            <LineSpace />
            <View>
              <Text f14 l21 grey66>
                1.
                读取手机/电话权限：正常识别您的设备信息、手机号、通讯录，以便完成安全风控、进行统计和服务推送。
              </Text>
            </View>
            <View>
              <Text f14 l21 grey66>
                2. 读写外部存储权限：当您通过App进行分享时，您可以开启存储权限。
              </Text>
            </View>
            <View>
              <Text f14 l21 grey66>
                3.
                相机权限：向您提供扫一扫、身份证上传、资产证明上传服务时，您可以通过开通相机权限以便进行实时拍摄和图片处理。
              </Text>
            </View>
            <View>
              <Text f14 l21 grey66>
                4. 读取软件列表：仅用于微信分享时判断是否安装微信使用，提高未安装用户分享体验。
              </Text>
            </View>
            <LineSpace />
            <View>
              <Text f14 l21 grey66>
                为方便您的查阅，您可以在新用户注册界面、登录App后“我的-设置-关于我们-XXX用户隐私政策”中查看完整的隐私政策。
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    />
  );
};

export default PrivacyModal;
