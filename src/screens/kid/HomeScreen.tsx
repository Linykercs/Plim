import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PlimMascot from '../../components/mascot/PlimMascot';
import PlimIcon, { type IconName } from '../../components/ui/PlimIcon';
import { useAppStore , useTheme} from '../../store/useAppStore';
import { defaultPalette, AVATAR_COLORS } from '../../theme/palettes';
import { fontFamily, fontSize } from '../../theme/typography';
import type { KidTabParamList, RootStackParamList } from '../../navigation/types';

// ─── Types ────────────────────────────────────────────────────
type Nav = BottomTabNavigationProp<KidTabParamList, 'Home'>;

interface Mission {
  id: 'mic' | 'water' | 'game' | 'learn';
  label: string;
  icon: IconName;
  color: string;
  tab: keyof KidTabParamList;
}

interface QuickTile {
  label: string;
  sub: string;
  icon: IconName;
  color: string;
  tab: keyof KidTabParamList;
  screen?: string;
}

// ─── Next alarm helper ────────────────────────────────────────
function useNextAlarm() {
  const alarms = useAppStore((s) => s.alarms);
  return useMemo(() => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const active = alarms
      .filter((a) => a.on)
      .map((a) => {
        const [h, m] = a.time.split(':').map(Number);
        const alarmMin = h * 60 + m;
        const diff = alarmMin >= nowMin ? alarmMin - nowMin : alarmMin + 1440 - nowMin;
        return { ...a, diff, alarmMin };
      })
      .sort((a, b) => a.diff - b.diff);
    return active[0] ?? null;
  }, [alarms]);
}

// ─── Home screen ──────────────────────────────────────────────
export default function HomeScreen({ navigation }: { navigation: Nav }) {
  const theme = useTheme();
  const { profile, stars, streak, missionsDone, savingFor, rewards, setMode, checkAndResetMissions } = useAppStore();
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(useCallback(() => { checkAndResetMissions(); }, []));

  const missions: Mission[] = [
    { id: 'mic',   label: 'Registrar xixi',   icon: 'drop',  color: theme.secondary, tab: 'Diary' },
    { id: 'water', label: 'Beber 2 copos',    icon: 'drop',  color: '#4AB8E0',       tab: 'Diary' },
    { id: 'game',  label: 'Treinar 5 min',    icon: 'play',  color: theme.coral,     tab: 'Games' },
    { id: 'learn', label: 'Aprender postura', icon: 'book',  color: theme.accent,    tab: 'Learn' },
  ];

  const quickTiles: QuickTile[] = [
    { label: 'Xixi',     sub: 'registrar', icon: 'drop',   color: theme.secondary, tab: 'Diary', screen: 'DiaryMic' },
    { label: 'Cocô',     sub: 'registrar', icon: 'poop',   color: '#B57F4F',       tab: 'Diary', screen: 'DiaryEvac' },
    { label: 'Foguete',  sub: 'treinar',   icon: 'rocket', color: theme.coral,     tab: 'Games' },
    { label: 'Aprender', sub: 'postura',   icon: 'book',   color: theme.accent,    tab: 'Learn' },
  ];

  const doneCount = missions.filter((m) => missionsDone[m.id]).length;
  const allDone = doneCount === missions.length;
  const savingReward = savingFor ? rewards.find((r) => r.id === savingFor) : null;
  const nextAlarm = useNextAlarm();
  const avatarColor = profile?.avatarColor !== undefined
    ? AVATAR_COLORS[profile.avatarColor]
    : theme.primary;

  const formatMinutes = useCallback((min: number) =>
    min < 60 ? `${min} min` : `${Math.floor(min / 60)}h${min % 60 > 0 ? ` ${min % 60}min` : ''}`, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Greeting band ── */}
        <LinearGradient
          colors={[theme.primary, theme.primary + 'CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.band}
        >
          {/* switch profile button */}
          <TouchableOpacity
            onPress={() => { setMode('kid'); rootNav.replace('ProfileSelect'); }}
            style={styles.switchBtn}
          >
            <PlimIcon name="family" color="rgba(255,255,255,0.8)" size={16} />
            <Text style={styles.switchBtnTxt}>Trocar perfil</Text>
          </TouchableOpacity>

          <View style={styles.bandRow}>
            {/* left: text + chips */}
            <View style={{ flex: 1 }}>
              <Text style={[styles.greeting, { color: 'rgba(255,255,255,0.88)' }]}>
                oi, {profile?.name ?? 'amigo'}!
              </Text>
              <Text style={[styles.callout, { color: '#fff' }]}>Bora brincar?</Text>

              <View style={styles.chips}>
                <View style={styles.chip}>
                  <PlimIcon name="fire" color="#fff" size={15} />
                  <Text style={styles.chipTxt}>{streak} dias</Text>
                </View>
                <View style={styles.chip}>
                  <PlimIcon name="star" color={theme.accent} size={15} />
                  <Text style={styles.chipTxt}>{stars}</Text>
                </View>
              </View>
            </View>

            {/* right: mascote */}
            <View style={{ marginRight: -8, marginTop: -4 }}>
              <PlimMascot
                size={92}
                mood={allDone ? 'cheer' : 'happy'}
                primary="#FFF7EC"
                accent={theme.coral}
                dark={theme.text}
              />
            </View>
          </View>
        </LinearGradient>

        {/* ── Missions card (overlaps band) ── */}
        <View style={styles.cardOuter}>
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            {/* header */}
            <View style={styles.missionsHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Missões de hoje</Text>
              <Text style={[styles.missionCount, { color: theme.primaryDark }]}>
                {doneCount}/{missions.length}
              </Text>
            </View>

            {/* progress bar */}
            <View style={[styles.progressTrack, { backgroundColor: theme.softBg }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(doneCount / missions.length) * 100}%` as `${number}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>

            {/* mission tiles 2×2 */}
            <View style={styles.missionGrid}>
              {missions.map((m) => {
                const done = missionsDone[m.id];
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => navigation.navigate(m.tab)}
                    style={[
                      styles.missionTile,
                      {
                        backgroundColor: done ? theme.softBg : '#fff',
                        borderColor: done ? theme.primary : theme.softBg,
                      },
                    ]}
                  >
                    <View style={[styles.missionIcon, { backgroundColor: m.color + '30' }]}>
                      <PlimIcon name={m.icon} color={m.color} size={20} strokeWidth={2.4} />
                    </View>
                    <Text style={[styles.missionLabel, { color: theme.text }]}>{m.label}</Text>
                    {done && (
                      <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                        <PlimIcon name="check" color="#fff" size={13} strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Quick tiles ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 4, marginBottom: 12 }]}>
            O que vamos fazer?
          </Text>
          <View style={styles.tileGrid}>
            {quickTiles.map((t) => (
              <QuickTileCard
                key={t.label}
                tile={t}
                onPress={() => {
                  if (t.screen && (t.tab === 'Diary' || t.tab === 'Games')) {
                    navigation.navigate(t.tab, { screen: t.screen } as never);
                  } else {
                    navigation.navigate(t.tab as 'Store' | 'Learn');
                  }
                }}
                theme={theme}
              />
            ))}
          </View>
        </View>

        {/* ── Saving-for widget ── */}
        {savingReward && (
          <View style={styles.section}>
            <Pressable
              onPress={() => navigation.navigate('Store')}
              style={({ pressed }) => [
                styles.savingCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.primary + '30',
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              {/* decorative circle */}
              <View
                style={[
                  styles.savingDeco,
                  { backgroundColor: theme.accent + '18' },
                ]}
              />
              <View style={[styles.savingIcon, { backgroundColor: theme.accent + '28' }]}>
                <Text style={{ fontSize: 28 }}>{savingReward.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.savingEyebrow, { color: theme.primaryDark }]}>
                  JUNTANDO PRA
                </Text>
                <Text style={[styles.savingName, { color: theme.text }]}>{savingReward.name}</Text>
                <View style={styles.savingProgressRow}>
                  <View style={[styles.savingTrack, { backgroundColor: theme.softBg }]}>
                    <View
                      style={[
                        styles.savingFill,
                        {
                          width: `${Math.min(100, (stars / savingReward.cost) * 100)}%` as `${number}%`,
                          backgroundColor: theme.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.savingCost, { color: theme.text }]}>
                    {stars}/{savingReward.cost}⭐
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* ── Next alarm ── */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.alarmCard,
              { backgroundColor: theme.accent + '28', opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={[styles.alarmIcon, { backgroundColor: '#fff' }]}>
              <PlimIcon name="bell" color={theme.coral} size={26} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alarmEyebrow, { color: theme.muted }]}>Próximo lembrete</Text>
              <Text style={[styles.alarmTime, { color: theme.text }]}>
                {nextAlarm
                  ? `Xixi em ${formatMinutes(nextAlarm.diff)} · ${nextAlarm.time}`
                  : 'Nenhum lembrete ativo'}
              </Text>
            </View>
            <PlimIcon name="chevron" color={theme.muted} size={18} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── QuickTile card ───────────────────────────────────────────
function QuickTileCard({
  tile,
  onPress,
  theme,
}: {
  tile: QuickTile;
  onPress: () => void;
  theme: typeof defaultPalette;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickTile,
        {
          backgroundColor: theme.surface,
          opacity: pressed ? 0.88 : 1,
          ...Platform.select({
            ios: {
              shadowColor: '#1F3A4D',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            },
            android: { elevation: pressed ? 1 : 3 },
          }),
        },
      ]}
    >
      {/* decorative circle corner */}
      <View style={[styles.tileCircle, { backgroundColor: tile.color + '22' }]} />

      <View style={[styles.tileIconBox, { backgroundColor: tile.color }]}>
        <PlimIcon name={tile.icon} color="#fff" size={22} strokeWidth={2.4} />
      </View>
      <Text style={[styles.tileTitle, { color: theme.text }]}>{tile.label}</Text>
      <Text style={[styles.tileSub, { color: theme.muted }]}>{tile.sub}</Text>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea:    { flex: 1, backgroundColor: '#FFF7EC' },
  scrollContent: { paddingBottom: 110 },

  // Greeting band
  band: {
    paddingTop: 12,
    paddingBottom: 44,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  switchBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-end', paddingVertical: 4, paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12, marginBottom: 10,
  },
  switchBtnTxt: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.85)' },
  bandRow:  { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  greeting: { fontFamily: fontFamily.body, fontSize: fontSize.md },
  callout:  { fontFamily: fontFamily.headingSemi, fontSize: 26, marginTop: 2 },
  chips:    { flexDirection: 'row', gap: 8, marginTop: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  chipTxt:  { fontFamily: fontFamily.bodyBold, fontSize: fontSize.md, color: '#fff' },

  // Missions card
  cardOuter: { paddingHorizontal: 16, marginTop: -22 },
  card: {
    borderRadius: 26,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#1F3A4D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  missionsHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:    { fontFamily: fontFamily.headingSemi, fontSize: fontSize.lg - 1 },
  missionCount:    { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm + 1 },
  progressTrack:   { height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 14 },
  progressFill:    { height: '100%', borderRadius: 6 },

  missionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  missionTile: {
    width: '47%',
    borderRadius: 18,
    borderWidth: 2,
    padding: 12,
    minHeight: 90,
    justifyContent: 'space-between',
    position: 'relative',
  },
  missionIcon:  { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  missionLabel: { fontFamily: fontFamily.body, fontSize: fontSize.sm + 1, lineHeight: 16 },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sections wrapper
  section: { paddingHorizontal: 16, marginTop: 20 },

  // Quick tiles
  tileGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickTile: {
    width: '47%',
    borderRadius: 22,
    padding: 14,
    minHeight: 100,
    overflow: 'hidden',
    position: 'relative',
  },
  tileCircle: {
    position: 'absolute',
    right: -14,
    bottom: -14,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  tileIconBox:  { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileTitle:    { fontFamily: fontFamily.headingSemi, fontSize: fontSize.lg - 1 },
  tileSub:      { fontFamily: fontFamily.body, fontSize: fontSize.sm },

  // Saving-for card
  savingCard: {
    borderRadius: 22,
    borderWidth: 2,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#1F3A4D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  savingDeco: {
    position: 'absolute',
    right: -16,
    top: -16,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  savingIcon:     { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  savingEyebrow:  { fontFamily: fontFamily.bodyBold, fontSize: 10, letterSpacing: 0.5 },
  savingName:     { fontFamily: fontFamily.headingSemi, fontSize: fontSize.base, lineHeight: 20 },
  savingProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  savingTrack:    { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  savingFill:     { height: '100%', borderRadius: 4 },
  savingCost:     { fontFamily: fontFamily.bodyBold, fontSize: 11 },

  // Alarm card
  alarmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 22,
    padding: 16,
  },
  alarmIcon:     { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  alarmEyebrow:  { fontFamily: fontFamily.bodyBold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4 },
  alarmTime:     { fontFamily: fontFamily.headingSemi, fontSize: fontSize.lg - 1 },
});
