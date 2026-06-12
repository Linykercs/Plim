import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore, useTheme, countActiveDays } from '../../store/useAppStore';
import { AVATAR_COLORS } from '../../theme/palettes';
import PlimIcon, { type IconName } from '../../components/ui/PlimIcon';
import PlimMascot from '../../components/mascot/PlimMascot';
import { speak } from '../../services/speech';

// Conquistas celebram adesão e coragem (registrar, contar a verdade,
// treinar), nunca o resultado clínico: noite seca não vira medalha.

interface Achievement {
  id: string;
  icon: IconName;
  title: string;
  desc: string;
  unlocked: boolean;
}

export default function AchievementsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const entries = useAppStore(s => s.entries);
  const starsLifetime = useAppStore(s => s.starsLifetime);
  const redemptions = useAppStore(s => s.redemptions);
  const waterHistory = useAppStore(s => s.waterHistory);
  const waterToday = useAppStore(s => s.waterToday);
  const profile = useAppStore(s => s.profile);
  const mascotColor = AVATAR_COLORS[profile?.avatarColor ?? 0];

  const achievements: Achievement[] = useMemo(() => {
    const activeDays = countActiveDays(entries);
    const evacCount = entries.filter(e => e.type === 'evac').length;
    const totalCups = waterHistory.reduce((acc, d) => acc + d.cups, 0) + waterToday;
    return [
      { id: 'first',    icon: 'drop',    title: 'Primeira gota',       desc: 'Fez o primeiro registro',      unlocked: entries.length >= 1 },
      { id: 'honest',   icon: 'sparkle', title: 'Coragem de contar',   desc: 'Registrou um escape',          unlocked: entries.some(e => e.type === 'inc') },
      { id: 'week',     icon: 'sun',     title: 'Semana de aventura',  desc: '7 dias com registros',         unlocked: activeDays >= 7 },
      { id: 'bristol',  icon: 'poop',    title: 'Mestre do cocô',      desc: '5 registros de cocô',          unlocked: evacCount >= 5 },
      { id: 'water',    icon: 'drop',    title: 'Amigo da água',       desc: '20 copos registrados',         unlocked: totalCups >= 20 },
      { id: 'stars50',  icon: 'star',    title: 'Caçador de estrelas', desc: 'Juntou 50 estrelas',           unlocked: starsLifetime >= 50 },
      { id: 'stars200', icon: 'star',    title: 'Chuva de estrelas',   desc: 'Juntou 200 estrelas',          unlocked: starsLifetime >= 200 },
      { id: 'reward',   icon: 'target',  title: 'Primeiro prêmio',     desc: 'Resgatou na lojinha',          unlocked: redemptions.length >= 1 },
      { id: 'lagoon3',  icon: 'frog',    title: 'Lagoa Acordando',     desc: '10 dias de lagoa viva',        unlocked: activeDays >= 10 },
      { id: 'lagoon5',  icon: 'frog',    title: 'Lagoa Encantada',     desc: '50 dias de lagoa viva',        unlocked: activeDays >= 50 },
    ];
  }, [entries, starsLifetime, redemptions, waterHistory, waterToday]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => nav.goBack()} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Conquistas</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Plim comemora */}
        <View style={styles.hero}>
          <PlimMascot
            size={96}
            mood={unlockedCount > 0 ? 'cheer' : 'happy'}
            primary={mascotColor}
            accent={theme.coral}
            dark={theme.text}
          />
          <Text style={[styles.heroCount, { color: theme.text }]}>
            {unlockedCount} de {achievements.length}
          </Text>
          <Text style={[styles.heroSub, { color: theme.muted }]}>
            pedras da lagoa acesas
          </Text>
        </View>

        {/* Grid de medalhas */}
        <View style={styles.grid}>
          {achievements.map(a => (
            <Pressable
              key={a.id}
              onPress={() => speak(a.unlocked ? `${a.title}! ${a.desc}` : `Ainda bloqueada: ${a.desc}`)}
              style={[
                styles.card,
                {
                  backgroundColor: a.unlocked ? theme.surface : theme.softBg2,
                  borderColor: a.unlocked ? theme.accent : 'transparent',
                  ...(a.unlocked ? shadow.card : null),
                },
              ]}
            >
              <View style={[
                styles.medal,
                { backgroundColor: a.unlocked ? theme.accent + '33' : theme.softBg },
              ]}>
                <PlimIcon
                  name={a.icon}
                  size={26}
                  color={a.unlocked ? theme.accentText : theme.muted + '88'}
                  strokeWidth={2.2}
                />
              </View>
              <Text style={[styles.cardTitle, { color: a.unlocked ? theme.text : theme.muted }]}>
                {a.title}
              </Text>
              <Text style={[styles.cardDesc, { color: theme.muted }]}>{a.desc}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.xl },

  scroll: { paddingHorizontal: spacing.md },

  hero: { alignItems: 'center', gap: 2, marginBottom: spacing.md },
  heroCount: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl, marginTop: spacing.xs },
  heroSub: { fontFamily: fontFamily.body, fontSize: fontSize.sm },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: {
    width: '47%', borderRadius: radius.card, borderWidth: 2,
    padding: spacing.md, alignItems: 'center', gap: spacing.xs, flexGrow: 1,
  },
  medal: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm + 1, textAlign: 'center' },
  cardDesc: { fontFamily: fontFamily.body, fontSize: fontSize.xs, textAlign: 'center' },
});
