import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from './types';
import DiaryMenuScreen from '../screens/kid/DiaryMenuScreen';
import DiaryMicScreen from '../screens/kid/DiaryMicScreen';
import DiaryEvacScreen from '../screens/kid/DiaryEvacScreen';

const Stack = createNativeStackNavigator<DiaryStackParamList>();

export default function DiaryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DiaryMenu" component={DiaryMenuScreen} />
      <Stack.Screen name="DiaryMic"  component={DiaryMicScreen} />
      <Stack.Screen name="DiaryEvac" component={DiaryEvacScreen} />
    </Stack.Navigator>
  );
}
