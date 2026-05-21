import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { GamesStackParamList } from './types';
import GamesHubScreen from '../screens/kid/GamesHubScreen';
import RocketGame    from '../screens/kid/games/RocketGame';
import BalloonGame   from '../screens/kid/games/BalloonGame';
import FrogGame      from '../screens/kid/games/FrogGame';

const Stack = createNativeStackNavigator<GamesStackParamList>();

export default function GamesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="GamesHub"    component={GamesHubScreen} />
      <Stack.Screen name="RocketGame"  component={RocketGame} />
      <Stack.Screen name="BalloonGame" component={BalloonGame} />
      <Stack.Screen name="FrogGame"    component={FrogGame} />
    </Stack.Navigator>
  );
}
