import React, { useCallback, useState } from 'react';
import { ImageBackground, ScrollView } from 'react-native';
import { View, Colors, Text } from 'react-native-ui-lib';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
// @ts-ignore
import { RefreshNormalHeader } from 'react-native-smart-refresh';
import { StatusBarView, ViewLoader } from '../../../components';
import { RootState } from '../../../store';
import { imageConfig } from './config';

type IUserInfoScreenProps = ReturnType<typeof mapStateToProps>;

const UserInfoScreen = (props: IUserInfoScreenProps) => {
  const { userInfo } = props;
  const [isRefreshing, setIsRefreshing] = useState(false); // 当前是否下拉刷新中

  const onRefresh = () => {
    setIsRefreshing(true);
  };

  // 每次focus都TODO
  useFocusEffect(
    useCallback(() => {
      console.log(userInfo);
      // fetchMySpace([]);
    }, []),
  );

  return (
    <ViewLoader flex bg-greyF5 loading={false} disableSafeBottom>
      <StatusBarView />
      <View center height={44} bg-primaryColor>
        <Text center white firstTitle>
          我的
        </Text>
      </View>
      <ScrollView
        style={{ position: 'relative', zIndex: 99 }}
        refreshControl={
          <RefreshNormalHeader
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            titleStyle={{ paddingLeft: 10, fontSize: 14 }}
            timeStyle={{ display: 'none', fontSize: 14 }}
            leftContainerStyle={{ marginRight: -40 }}
            activityIndicatorProps={{ color: Colors.primaryColor }}
          />
        }>
        <ImageBackground source={imageConfig.userInfoTabBg} style={{ width: '100%' }}>
          <View height={120}></View>
        </ImageBackground>
      </ScrollView>
    </ViewLoader>
  );
};

const mapStateToProps = ({ login: { userInfo } }: RootState) => ({
  userInfo,
});

export default connect(mapStateToProps)(UserInfoScreen);
