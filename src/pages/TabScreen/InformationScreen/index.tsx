import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import {
  ViewLoader,
  StatusBarView,
} from '../../../components';


const InformationScreen: React.FC = () => {
  return (
    <ViewLoader
      flex
      loading={false}
      disableSafeBottom>
      <StatusBarView />
      <View center height={44} bg-primaryColor>
        <Text center white firstTitle>
          团队
        </Text>
      </View>
    </ViewLoader>
  );
};

export default InformationScreen;
