import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Colors, View } from 'react-native-ui-lib';
import HomeScreen from './HomeScreen';
import InvestmentScreen from './InvestmentScreen';
import InformationScreen from './InformationScreen';
import UserInfoScreen from './UserInfoScreen';
import { MyBadge } from '../../components';
import { isIOS } from '../../utils/safeHeight';

const BottomTab = createBottomTabNavigator();
const iconsMapping = {
  home: {
    active: require('./images/tabs/home-activity.png'),
    inactive: require('./images/tabs/home.png'),
  },
  invest: {
    active: require('./images/tabs/invest-activity.png'),
    inactive: require('./images/tabs/invest.png'),
  },
  find: {
    active: require('./images/tabs/find-activity.png'),
    inactive: require('./images/tabs/find.png'),
  },
  mine: {
    active: require('./images/tabs/mine-activity.png'),
    inactive: require('./images/tabs/mine.png'),
  },
};

const TabScreen = ({ homeTodoCount }: { homeTodoCount: number }) => (
  <BottomTab.Navigator
    initialRouteName={'HomeScreen'}
    screenOptions={{
      tabBarActiveTintColor: Colors.primaryColor,
      tabBarInactiveTintColor: Colors.lightGreyCC,
      tabBarStyle: isIOS ? undefined : { height: 64, paddingBottom: 15 },
      tabBarLabelStyle: { fontSize: 12 },
      headerShown: false,
    }}>
    <BottomTab.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        tabBarLabel: '首页',
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Image
            source={focused ? iconsMapping.home.active : iconsMapping.home.inactive}
            style={{ width: 20, height: 20 }}
          />
        ),
      }}
    />
    <BottomTab.Screen
      name="InvestmentScreen"
      component={InvestmentScreen}
      options={{
        tabBarLabel: '消息',
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Image
            source={focused ? iconsMapping.invest.active : iconsMapping.invest.inactive}
            style={{ width: 20, height: 20 }}
          />
        ),
      }}
    />
    <BottomTab.Screen
      name="InformationScreen"
      component={InformationScreen}
      options={{
        tabBarLabel: '团队',
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Image
            source={focused ? iconsMapping.find.active : iconsMapping.find.inactive}
            style={{ width: 20, height: 20 }}
          />
        ),
      }}
    />
    <BottomTab.Screen
      name="UserInfoScreen"
      component={UserInfoScreen}
      options={{
        tabBarLabel: '我的',
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <View>
            <MyBadge badgeCount={homeTodoCount || 0} />
            <Image
              source={focused ? iconsMapping.mine.active : iconsMapping.mine.inactive}
              style={{ width: 20, height: 20 }}
            />
          </View>
        ),
      }}
    />
  </BottomTab.Navigator>
);

// const mapStateToProps = ({
//   home: { homeTodoCount },
// }: RootState) => ({
//   homeTodoCount,
// });

// export default connect(mapStateToProps)(frontInfoHoc(TabScreen));
export default TabScreen;
