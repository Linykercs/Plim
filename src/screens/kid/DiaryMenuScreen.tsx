import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from '../../navigation/types';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore , useTheme} from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';

type Nav = NativeStackNavigationProp<DiaryStackParamList>;

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
  return isToday ? 'Hoje' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

const URINE_COLORS: Record<string, string> = {
  c1: '#F8F4D3', c2: '#FDED9E', c3: '#F9CC4B', c4: '#D69B27', c5: '#A35F12',
};

export default function DiaryMenuScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<Nav>();
  const entries = useAppStore(s => s.entries);

  const todayStr = new Date().toDateString();
  const todayEntries = [...entries]
    .filter(e => new Date(e.createdAt).toDateString() === todayStr)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Diário</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>O que aconteceu hoje?</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Xixi + Cocô cards */}
        <View style={styles.row}>
          {/* Xixi */}
          <View style={styles.cardWrap}>
            <View style={[styles.cardShadow, { backgroundColor: theme.secondary }]} />
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.card, { borderColor: theme.secondary, backgroundColor: theme.surface }]}
              onPress={() => nav.navigate('DiaryMic')}
            >
              <View style={[styles.cardIcon, { backgroundColor: theme.secondary + '33' }]}>
                <PlimIcon name="drop" size={32} color={theme.secondary} />
              </View>
              <Text style={[styles.cardLabel, { color: theme.text }]}>Xixi</Text>
              <Text style={[styles.cardSub, { color: theme.muted }]}>Registrar{'\n'}micção</Text>
              <View style={[styles.addBadge, { backgroundColor: theme.secondary }]}>
                <PlimIcon name="plus" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Cocô */}
          <View style={styles.cardWrap}>
            <View style={[styles.cardShadow, { backgroundColor: '#B57F4F' }]} />
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.card, { borderColor: '#B57F4F', backgroundColor: theme.surface }]}
              onPress={() => nav.navigate('DiaryEvac')}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#B57F4F33' }]}>
                <PlimIcon name="poop" size={32} color="#B57F4F" />
              </View>
              <Text style={[styles.cardLabel, { color: theme.text }]}>Cocô</Text>
              <Text style={[styles.cardSub, { color: theme.muted }]}>Registrar{'\n'}evacuação</Text>
              <View style={[styles.addBadge, { backgroundColor: '#B57F4F' }]}>
                <PlimIcon name="plus" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lembretes */}
        <View style={styles.wideWrap}>
          <View style={[styles.wideShadow, { backgroundColor: theme.accent }]} />
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.wideCard, { borderColor: theme.accent, backgroundColor: theme.surface }]}
            onPress={() => nav.navigate('Alarms')}
          >
            <View style={[styles.wideIconBox, { backgroundColor: theme.accent + '33' }]}>
              <PlimIcon name="bell" size={28} color={theme.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>Lembretes</Text>
              <Text style={[styles.cardSub, { color: theme.muted }]}>Alarmes de xixi e água</Text>
            </View>
            <PlimIcon name="chevron" size={20} color={theme.muted} />
          </TouchableOpacity>
        </View>

        {/* Timeline de hoje */}
        {todayEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Hoje</Text>
            {todayEntries.map((entry, idx) => (
              <View key={entry.id} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    { backgroundColor: entry.type === 'mic' ? theme.secondary : '#B57F4F' },
                  ]} />
                  {idx < todayEntries.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: theme.softBg2 }]} />
                  )}
                </View>
                <View style={[styles.timelineCard, { backgroundColor: theme.surface, ...shadow.card }]}>
                  <View style={styles.timelineCardRow}>
                    <PlimIcon
                      name={entry.type === 'mic' ? 'drop' : 'poop'}
                      size={18}
                      color={entry.type === 'mic' ? theme.secondary : '#B57F4F'}
                    />
                    <Text style={[styles.timelineTime, { color: theme.muted }]}>
                      {formatTime(entry.createdAt)}
                    </Text>
                    {entry.type === 'mic' && (
                      <View style={[styles.colorDot, { backgroundColor: URINE_COLORS[entry.color] ?? '#F8F4D3', borderWidth: 1, borderColor: theme.softBg2 }]} />
                    )}
                    {entry.type === 'evac' && (
                      <Text style={[styles.bristolBadge, { color: '#B57F4F' }]}>T{entry.bristol}</Text>
                    )}
                  </View>
                  {entry.note ? (
                    <Text style={[styles.timelineNote, { color: theme.muted }]} numberOfLines={1}>
                      {entry.note}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {todayEntries.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💧</Text>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              Nenhum registro hoje ainda
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  subtitle: { fontFamily: fontFamily.body, fontSize: fontSize.sm, marginTop: 2 },
  scroll: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },

  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  cardWrap: { flex: 1, minWidth: 0 },
  cardShadow: {
    position: 'absolute', top: 4, left: 0, right: 0, bottom: 0,
    borderRadius: radius.card,
  },
  card: {
    borderRadius: radius.card, borderWidth: 2,
    padding: spacing.md, gap: spacing.xs,
    alignItems: 'flex-start', minHeight: 140,
  },
  cardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { fontFamily: fontFamily.heading, fontSize: fontSize.base, marginTop: spacing.xxs },
  cardSub: { fontFamily: fontFamily.body, fontSize: fontSize.xs, lineHeight: 16 },
  addBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },

  wideWrap: { marginBottom: spacing.md },
  wideShadow: {
    position: 'absolute', top: 4, left: 0, right: 0, bottom: 0,
    borderRadius: radius.card,
  },
  wideCard: {
    borderRadius: radius.card, borderWidth: 2,
    padding: spacing.md, flexDirection: 'row',
    alignItems: 'center', gap: spacing.sm,
  },
  wideIconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

  section: { marginTop: spacing.md },
  sectionTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg, marginBottom: spacing.sm },
  timelineRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
  timelineLeft: { alignItems: 'center', width: 16 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, marginTop: 12 },
  timelineLine: { width: 2, flex: 1, marginTop: 2 },
  timelineCard: { flex: 1, borderRadius: radius.chip, padding: spacing.sm, marginBottom: spacing.xs },
  timelineCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  timelineTime: { fontFamily: fontFamily.body, fontSize: fontSize.xs, flex: 1 },
  colorDot: { width: 14, height: 14, borderRadius: 7 },
  bristolBadge: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs },
  timelineNote: { fontFamily: fontFamily.body, fontSize: fontSize.xs, marginTop: 2 },

  empty: { alignItems: 'center', marginTop: spacing.xxxl, gap: spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontFamily: fontFamily.body, fontSize: fontSize.base, textAlign: 'center' },
});
