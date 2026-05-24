import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Fredoka_400Regular, Fredoka_500Medium, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

import RootNavigator from './src/navigation/RootNavigator';
import { useAppStore } from './src/store/useAppStore';
import { requestNotificationPermission, syncAllAlarms } from './src/services/notifications';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const alarms = useAppStore(s => s.alarms);
  const checkAndResetMissions = useAppStore(s => s.checkAndResetMissions);
  const hasHydrated = useAppStore(s => s._hasHydrated);

  useEffect(() => {
    // Request notification permission and sync alarms on first launch
    requestNotificationPermission().then(granted => {
      if (granted) syncAllAlarms(alarms);
    });
    // Reset daily missions if day changed
    checkAndResetMissions();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;
  if (!hasHydrated) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <RootNavigator />
    </View>
  );
}
