import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PlimMascot from '../components/mascot/PlimMascot';
import PlimIcon from '../components/ui/PlimIcon';
import { useAppStore , useTheme} from '../store/useAppStore';
import { defaultPalette } from '../theme/palettes';
import { fontFamily, fontSize } from '../theme/typography';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProfileSelect'>;

export default function ProfileSelectScreen({ navigation }: { navigation: Nav }) {
  const theme = useTheme();
  const { setMode, profile } = useAppStore();

  const pickKid = () => {
    setMode('kid');
    navigation.replace('KidTabs');
  };

  const pickParent = () => {
    setMode('parent');
    navigation.replace('ParentTabs');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Text style={[styles.title, { color: theme.text }]}>
          Quem vai brincar agora?
        </Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Toque no seu rostinho 👇
        </Text>

        {/* ── Kid card (large, primary border + duolingo shadow) ── */}
        <View style={styles.kidShadowWrapper}>
          {/* Primary-coloured "floor" creates the duolingo bottom-shadow effect */}
          <View
            style={[
              styles.kidShadow,
              { backgroundColor: theme.primary, borderRadius: 32 },
            ]}
          />
          <Pressable
            onPress={pickKid}
            style={({ pressed }) => [
              styles.kidCard,
              {
                borderColor: theme.primary,
                transform: [{ translateY: pressed ? 4 : 0 }],
                // soft primary glow on iOS
                ...Platform.select({
                  ios: {
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.22,
                    shadowRadius: 14,
                  },
                  android: { elevation: pressed ? 2 : 6 },
                }),
              },
            ]}
          >
            <View style={styles.kidMascotWrap}>
              <PlimMascot
                size={110}
                mood="cheer"
                primary={
                  profile?.avatarColor !== undefined
                    ? AVATAR_COLORS[profile.avatarColor]
                    : theme.primary
                }
                accent={theme.coral}
                dark={theme.text}
              />
            </View>
            <Text style={[styles.kidLabel, { color: theme.text }]}>
              {profile?.name ? `${profile.name}!` : 'Eu, criança!'}
            </Text>
            <Text style={[styles.kidSub, { color: theme.muted }]}>
              jogar, registrar e ganhar prêmios
            </Text>
          </Pressable>
        </View>

        {/* ── Parent card (smaller, row layout) ── */}
        <Pressable
          onPress={pickParent}
          style={({ pressed }) => [
            styles.parentCard,
            {
              backgroundColor: theme.surface,
              opacity: pressed ? 0.85 : 1,
              ...Platform.select({
                ios: {
                  shadowColor: '#1F3A4D',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                },
                android: { elevation: pressed ? 1 : 3 },
              }),
            },
          ]}
        >
          <View style={[styles.parentIconBox, { backgroundColor: theme.softBg }]}>
            <PlimIcon name="family" color={theme.text} size={36} strokeWidth={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.parentLabel, { color: theme.text }]}>
              Pais ou Profissional
            </Text>
            <Text style={[styles.parentSub, { color: theme.muted }]}>
              relatórios, gráficos, alarmes
            </Text>
          </View>
          <PlimIcon name="chevron" color={theme.muted} size={20} />
        </Pressable>

        {/* ── Disclaimer ── */}
        <View style={[styles.disclaimer, { backgroundColor: theme.accent + '28' }]}>
          <PlimIcon name="sparkle" color={theme.primaryDark} size={18} />
          <Text style={[styles.disclaimerTxt, { color: theme.text }]}>
            <Text style={{ fontFamily: fontFamily.bodyBold }}>
              Para crianças de 4 a 10 anos.
            </Text>
            {' '}Plim é complementar — use sempre junto com seu fisioterapeuta ou pediatra.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Avatar colours matching the Onboarding picker
const AVATAR_COLORS = [
  '#5FCB8E', '#7DC9E8', '#FF8A7A', '#C497F0', '#FFCE5C', '#FF8E72',
];

const styles = StyleSheet.create({
  root: { flex: 1 },

  scroll: {
    paddingHorizontal: 22,
    paddingTop: 56,
    paddingBottom: 32,
    alignItems: 'stretch',
  },

  title: {
    fontFamily: fontFamily.headingSemi,
    fontSize: fontSize.xxl + 2,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base + 1,
    textAlign: 'center',
    marginBottom: 32,
  },

  // Kid card
  kidShadowWrapper: {
    marginBottom: 16,
    // extra bottom space so the shadow View can peek out
    paddingBottom: 4,
  },
  kidShadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    // sits 4px below the card top, extends 4px below card bottom
    top: 4,
    bottom: 0,
  },
  kidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 3,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  kidMascotWrap: { marginBottom: 8 },
  kidLabel: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xxl,
    marginBottom: 2,
  },
  kidSub: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
  },

  // Parent card
  parentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    borderRadius: 32,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  parentIconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentLabel: {
    fontFamily: fontFamily.headingSemi,
    fontSize: fontSize.lg,
    marginBottom: 2,
  },
  parentSub: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm + 1,
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 18,
    padding: 14,
  },
  disclaimerTxt: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm + 1,
    lineHeight: 19,
    flex: 1,
  },
});
