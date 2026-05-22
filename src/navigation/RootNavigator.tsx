import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileSelectScreen from '../screens/ProfileSelectScreen';
import KidTabNavigator from './KidTabNavigator';
import ParentTabNavigator from './ParentTabNavigator';
import type { RootStackParamList } from './types';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Splash"        component={SplashScreen} />
        <Stack.Screen name="Onboarding"    component={OnboardingScreen} />
        <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} />
        <Stack.Screen name="KidTabs"       component={KidTabNavigator} />
        <Stack.Screen name="ParentTabs"    component={ParentTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
