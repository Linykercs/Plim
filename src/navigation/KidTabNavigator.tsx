import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type {
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import HomeScreen    from '../screens/kid/HomeScreen';
import DiaryScreen   from '../screens/kid/DiaryScreen';
import GamesScreen   from '../screens/kid/GamesScreen';
import LearnScreen   from '../screens/kid/LearnScreen';
import StoreScreen   from '../screens/kid/StoreScreen';

import PlimIcon, { type IconName } from '../components/ui/PlimIcon';
import { defaultPalette } from '../theme/palettes';
import { fontFamily } from '../theme/typography';
import type { KidTabParamList } from './types';

const Tab = createBottomTabNavigator<KidTabParamList>();

// ─── Icon map ─────────────────────────────────────────────────
const TAB_ICONS: Record<keyof KidTabParamList, IconName> = {
  Home:   'home',
  Diary:  'diary',
  Games:  'play',
  Learn:  'book',
  Store:  'star',
};

const TAB_LABELS: Record<keyof KidTabParamList, string> = {
  Home:  'Início',
  Diary: 'Diário',
  Games: 'Jogar',
  Learn: 'Aprender',
  Store: 'Loja',
};

// ─── Custom tab bar ───────────────────────────────────────────
function PlimTabBar({ state, descriptors: _, navigation }: BottomTabBarProps) {
  const theme = defaultPalette;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 6 }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const routeName = route.name as keyof KidTabParamList;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: isFocused ? theme.primary : 'transparent' },
                ]}
              >
                <PlimIcon
                  name={TAB_ICONS[routeName]}
                  color={isFocused ? '#fff' : theme.muted}
                  size={20}
                  strokeWidth={2.2}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? theme.text : theme.muted },
                ]}
              >
                {TAB_LABELS[routeName]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Navigator ────────────────────────────────────────────────
export default function KidTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <PlimTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"  component={HomeScreen} />
      <Tab.Screen name="Diary" component={DiaryScreen} />
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bar: {
    marginHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#1F3A4D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
  },
  iconBox: {
    width: 38,
    height: 32,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: fontFamily.body,
    fontSize: 10,
    letterSpacing: -0.2,
  },
});
