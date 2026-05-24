import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { GamesStackParamList } from '../../navigation/types';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import PlimIcon from '../../components/ui/PlimIcon';
import { useTheme } from '../../store/useAppStore';

type Nav = NativeStackNavigationProp<GamesStackParamList>;

const GAMES = [
  {
    route: 'RocketGame' as const,
    emoji: '🚀',
    name: 'Foguete',
    description: 'Segure o botão para fazer o foguete subir. Treina contrações longas do xixi!',
    color: '#FF8A7A',
    difficulty: 2,
    reward: '8 ⭐',
    tag: 'Contração longa',
  },
  {
    route: 'BalloonGame' as const,
    emoji: '🎈',
    name: 'Balão',
    description: 'Segure para encher o balão no tempo certo. Treina respiração e controle!',
    color: '#7DC9E8',
    difficulty: 1,
    reward: '5 ⭐',
    tag: 'Respiração',
  },
  {
    route: 'FrogGame' as const,
    emoji: '🐸',
    name: 'Sapo Pulo',
    description: 'Toque rápido para o sapo pular! Treina contrações rápidas do xixi.',
    color: '#5FCB8E',
    difficulty: 3,
    reward: '10 ⭐',
    tag: 'Contração rápida',
  },
];

export default function GamesHubScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<Nav>();

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Jogos</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Exercícios divertidos para o xixi</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {GAMES.map(game => (
          <View key={game.route} style={styles.cardWrap}>
            <View style={[styles.cardShadow, { backgroundColor: game.color }]} />
            <View
              style={[styles.card, { backgroundColor: theme.surface, borderColor: game.color, borderWidth: 2 }]}
            >
              {/* Top row */}
              <View style={styles.cardTop}>
                <View style={[styles.emojiBox, { backgroundColor: game.color + '22' }]}>
                  <Text style={styles.emoji}>{game.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.gameName, { color: theme.text }]}>{game.name}</Text>
                  <View style={[styles.tagChip, { backgroundColor: game.color + '22' }]}>
                    <Text style={[styles.tagText, { color: game.color }]}>{game.tag}</Text>
                  </View>
                </View>
                <View style={[styles.rewardBadge, { backgroundColor: theme.accent + '22' }]}>
                  <PlimIcon name="star" size={13} color={theme.accent} />
                  <Text style={[styles.rewardText, { color: theme.accent }]}>{game.reward}</Text>
                </View>
              </View>

              <Text style={[styles.desc, { color: theme.muted }]}>{game.description}</Text>

              {/* Difficulty */}
              <View style={styles.diffRow}>
                <Text style={[styles.diffLabel, { color: theme.muted }]}>Dificuldade:</Text>
                {[1, 2, 3].map(d => (
                  <View key={d} style={[styles.diffDot, { backgroundColor: d <= game.difficulty ? game.color : theme.softBg2 }]} />
                ))}
              </View>

              {/* Play button */}
              <View style={styles.btnWrap}>
                <View style={[styles.btnShadow, { backgroundColor: game.color + 'BB' }]} />
                <Pressable
                  style={({ pressed }) => [
                    styles.btn,
                    { backgroundColor: game.color, borderColor: game.color + 'BB', borderBottomWidth: pressed ? 2 : 4, transform: [{ translateY: pressed ? 2 : 0 }] },
                  ]}
                  onPress={() => nav.navigate(game.route)}
                >
                  <PlimIcon name="play" size={18} color="#fff" />
                  <Text style={styles.btnLabel}>Jogar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  subtitle: { fontFamily: fontFamily.body, fontSize: fontSize.sm, marginTop: 2 },
  scroll: { paddingHorizontal: spacing.md, gap: spacing.md },

  cardWrap: { position: 'relative' },
  cardShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: radius.card },
  card: { borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },

  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emojiBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 30 },
  gameName: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  tagChip: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  tagText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs },
  rewardBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 16 },
  rewardText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  desc: { fontFamily: fontFamily.body, fontSize: fontSize.sm, lineHeight: 20 },

  diffRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  diffLabel: { fontFamily: fontFamily.body, fontSize: fontSize.xs },
  diffDot: { width: 10, height: 10, borderRadius: 5 },

  btnWrap: { position: 'relative', marginTop: spacing.xs },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 14 },
  btn: {
    borderRadius: 14, paddingVertical: spacing.sm,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    borderWidth: 0,
  },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base, color: '#fff' },
});
