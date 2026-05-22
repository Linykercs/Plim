import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import OverviewScreen     from '../screens/parent/OverviewScreen';
import ParentDiaryScreen  from '../screens/parent/ParentDiaryScreen';
import ChartScreen        from '../screens/parent/ChartScreen';
import ReportScreen       from '../screens/parent/ReportScreen';
import SettingsScreen     from '../screens/parent/SettingsScreen';

import PlimIcon, { type IconName } from '../components/ui/PlimIcon';
import { fontFamily } from '../theme/typography';
import type { ParentTabParamList } from './types';
import { useTheme } from '../store/useAppStore';

const Tab = createBottomTabNavigator<ParentTabParamList>();

const TAB_ICONS: Record<keyof ParentTabParamList, IconName> = {
  Overview: 'home',
  Diary:    'diary',
  Chart:    'chart',
  Report:   'pdf',
  Settings: 'settings',
};

const TAB_LABELS: Record<keyof ParentTabParamList, string> = {
  Overview: 'Resumo',
  Diary:    'Histórico',
  Chart:    'Gráfico',
  Report:   'Relatório',
  Settings: 'Config',
};

function ParentTabBar({ state, descriptors: _, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 6 }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const routeName = route.name as keyof ParentTabParamList;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
            >
              <View style={[styles.iconBox, { backgroundColor: isFocused ? theme.secondary : 'transparent' }]}>
                <PlimIcon name={TAB_ICONS[routeName]} color={isFocused ? '#fff' : theme.muted} size={19} strokeWidth={2} />
              </View>
              <Text style={[styles.label, { color: isFocused ? theme.text : theme.muted }]}>
                {TAB_LABELS[routeName]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function ParentTabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <ParentTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Diary"    component={ParentDiaryScreen} />
      <Tab.Screen name="Chart"    component={ChartScreen} />
      <Tab.Screen name="Report"   component={ReportScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' },
  bar: {
    marginHorizontal: 12, backgroundColor: '#fff', borderRadius: 28,
    paddingVertical: 10, paddingHorizontal: 6, flexDirection: 'row',
    ...Platform.select({
      ios:     { shadowColor: '#1F3A4D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  tab:     { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 2 },
  iconBox: { width: 36, height: 30, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label:   { fontFamily: fontFamily.body, fontSize: 9, letterSpacing: -0.2 },
});
