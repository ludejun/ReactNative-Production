import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';
// @ts-ignore
import { RefreshNormalHeader } from 'react-native-smart-refresh';
import { StatusBarView, ViewLoader } from '../../../components';

const InvestmentScreen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false); // 当前是否下拉刷新中

  const onRefresh = () => {
    setIsRefreshing(true);
  };
  useFocusEffect(
    useCallback(() => {

    }, []),
  );

  return (
    <ViewLoader flex bg-greyF5 loading={false} disableSafeBottom>
      <StatusBarView />
      <View center height={44} bg-primaryColor>
        <Text center white firstTitle>
          消息
        </Text>
      </View>
      <ScrollView
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
        <View height={115}>
          <View height={76} row paddingT-14></View>
        </View>
      </ScrollView>
    </ViewLoader>
  );
};
export default InvestmentScreen;
