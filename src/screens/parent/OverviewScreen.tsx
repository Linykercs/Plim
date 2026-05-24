import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore , useTheme} from '../../store/useAppStore';
import { AVATAR_COLORS } from '../../theme/palettes';
import PlimMascot from '../../components/mascot/PlimMascot';
import PlimIcon from '../../components/ui/PlimIcon';

const CONDITION_LABELS: Record<string, string> = {
  enuresis: 'Enurese', hyperactive: 'Bexiga hiperativa', constipation: 'Constipação',
  'incont-fec': 'Incontinência fecal', training: 'Treinamento', 'dont-know': 'Em avaliação',
};

function last7Dates() {
  return [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toDateString();
  });
}

export default function OverviewScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const profile = useAppStore(s => s.profile);
  const entries = useAppStore(s => s.entries);
  const stars = useAppStore(s => s.stars);
  const streak = useAppStore(s => s.streak);
  const setMode = useAppStore(s => s.setMode);

  const mascotColor = AVATAR_COLORS[profile?.avatarColor ?? 0];
  const days = last7Dates();

  const { entriesPerDay, weekMic, weekEvac, recent } = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return {
      entriesPerDay: days.map(d =>
        entries.filter(e => new Date(e.createdAt).toDateString() === d).length,
      ),
      weekMic:  entries.filter(e => e.type === 'mic'  && new Date(e.createdAt) >= weekAgo).length,
      weekEvac: entries.filter(e => e.type === 'evac' && new Date(e.createdAt) >= weekAgo).length,
      recent: [...entries]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    };
  }, [entries]);

  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md, backgroundColor: theme.secondary }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Área dos Pais</Text>
            <Text style={styles.headerTitle}>
              {profile ? `${profile.name}, ${profile.age} anos` : 'Perfil da criança'}
            </Text>
          </View>
          <PlimMascot size={56} mood="happy" primary={mascotColor} />
        </View>

        {/* Stat chips */}
        <View style={styles.chipRow}>
          {[
            { icon: 'fire' as const, label: `${streak} dias`, bg: '#fff3' },
            { icon: 'star' as const, label: `${stars} ⭐`, bg: '#fff3' },
            { icon: 'drop' as const, label: `${weekMic} xixi`, bg: '#fff3' },
            { icon: 'poop' as const, label: `${weekEvac} cocô`, bg: '#fff3' },
          ].map((c, i) => (
            <View key={i} style={[styles.chip, { backgroundColor: c.bg }]}>
              <PlimIcon name={c.icon} size={13} color="#fff" />
              <Text style={styles.chipText}>{c.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Conditions */}
        {profile?.conditions && profile.conditions.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.surface, ...shadow.card }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Condições</Text>
            <View style={styles.condRow}>
              {profile.conditions.map(c => (
                <View key={c} style={[styles.condChip, { backgroundColor: theme.secondary + '22' }]}>
                  <Text style={[styles.condText, { color: theme.secondary }]}>{CONDITION_LABELS[c] ?? c}</Text>
                </View>
              ))}
            </View>
            {profile.professional && (
              <View style={styles.proRow}>
                <PlimIcon name="user" size={15} color={theme.muted} />
                <Text style={[styles.proText, { color: theme.muted }]}>{profile.professional.name}</Text>
              </View>
            )}
          </View>
        )}

        {/* 7-day activity */}
        <View style={[styles.card, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Atividade — 7 dias</Text>
          <View style={styles.dotsRow}>
            {entriesPerDay.map((count, i) => {
              const active = count > 0;
              const today = i === 6;
              return (
                <View key={i} style={styles.dayCol}>
                  <View style={[
                    styles.dayDot,
                    { backgroundColor: active ? theme.primary : theme.softBg2, borderWidth: today ? 2 : 0, borderColor: theme.accent },
                  ]}>
                    {count > 0 && <Text style={styles.dotCount}>{count}</Text>}
                  </View>
                  <Text style={[styles.dayLabel, { color: today ? theme.text : theme.muted }]}>
                    {(() => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return dayLabels[d.getDay()]; })()}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent entries */}
        <View style={[styles.card, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Últimos registros</Text>
          {recent.length === 0 ? (
            <Text style={[styles.empty, { color: theme.muted }]}>Nenhum registro ainda</Text>
          ) : (
            recent.map(entry => (
              <View key={entry.id} style={[styles.entryRow, { borderBottomColor: theme.softBg2 }]}>
                <View style={[styles.entryIcon, { backgroundColor: entry.type === 'mic' ? theme.secondary + '22' : '#B57F4F22' }]}>
                  <PlimIcon name={entry.type === 'mic' ? 'drop' : 'poop'} size={16} color={entry.type === 'mic' ? theme.secondary : '#B57F4F'} />
                </View>
                <Text style={[styles.entryTime, { color: theme.muted }]}>
                  {new Date(entry.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  {' '}
                  {new Date(entry.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {entry.type === 'mic' && (
                  <Text style={[styles.entryDetail, { color: theme.muted }]}>{entry.cups} copinho{entry.cups > 1 ? 's' : ''}</Text>
                )}
                {entry.type === 'evac' && (
                  <Text style={[styles.entryDetail, { color: theme.muted }]}>Tipo {entry.bristol}</Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Switch mode */}
        <TouchableOpacity
          style={[styles.switchBtn, { borderColor: theme.softBg2 }]}
          onPress={() => { setMode('kid'); nav.replace('ProfileSelect'); }}
        >
          <PlimIcon name="family" size={18} color={theme.muted} />
          <Text style={[styles.switchText, { color: theme.muted }]}>Trocar para modo criança</Text>
          <PlimIcon name="chevron" size={16} color={theme.muted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  headerSub: { fontFamily: fontFamily.body, fontSize: fontSize.xs, color: '#ffffffBB', marginBottom: 2 },
  headerTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.xl, color: '#fff' },
  chipRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 16 },
  chipText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs, color: '#fff' },

  scroll: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.sm },

  card: { borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  cardTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.base, marginBottom: 4 },

  condRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  condChip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 10 },
  condText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  proText: { fontFamily: fontFamily.body, fontSize: fontSize.xs },

  dotsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: spacing.xs },
  dayDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dotCount: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs, color: '#fff' },
  dayLabel: { fontFamily: fontFamily.body, fontSize: fontSize.xs },

  entryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs, borderBottomWidth: 1 },
  entryIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  entryTime: { fontFamily: fontFamily.body, fontSize: fontSize.xs, flex: 1 },
  entryDetail: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs },
  empty: { fontFamily: fontFamily.body, fontSize: fontSize.sm, textAlign: 'center', paddingVertical: spacing.md },

  switchBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.card, borderWidth: 1.5 },
  switchText: { fontFamily: fontFamily.body, fontSize: fontSize.sm, flex: 1 },
});
