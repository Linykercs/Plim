import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { defaultPalette } from '../../theme/palettes';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore, type Reward } from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';

export default function StoreScreen() {
  const theme = defaultPalette;
  const insets = useSafeAreaInsets();
  const stars = useAppStore(s => s.stars);
  const rewards = useAppStore(s => s.rewards);
  const savingFor = useAppStore(s => s.savingFor);
  const setSavingFor = useAppStore(s => s.setSavingFor);
  const redeemReward = useAppStore(s => s.redeemReward);
  const redemptions = useAppStore(s => s.redemptions);

  const savingReward = rewards.find(r => r.id === savingFor);
  const progress = savingReward ? Math.min(stars / savingReward.cost, 1) : 0;

  function pendingCount(rewardId: string) {
    return redemptions.filter(r => r.rewardId === rewardId && r.status === 'pending').length;
  }

  function handleCard(reward: Reward) {
    if (stars >= reward.cost) {
      redeemReward(reward.id);
    } else {
      setSavingFor(savingFor === reward.id ? null : reward.id);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Lojinha</Text>
        {/* Stars balance */}
        <View style={[styles.starsBadge, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '55', borderWidth: 1.5 }]}>
          <PlimIcon name="star" size={18} color={theme.accent} />
          <Text style={[styles.starsCount, { color: theme.accent }]}>{stars}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Saving-for bar */}
        {savingReward && (
          <View style={[styles.savingCard, { backgroundColor: theme.surface, ...shadow.card }]}>
            <View style={styles.savingRow}>
              <Text style={styles.savingEmoji}>{savingReward.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.savingLabel, { color: theme.text }]}>
                  Economizando para {savingReward.name}
                </Text>
                <Text style={[styles.savingProgress, { color: theme.muted }]}>
                  {stars} / {savingReward.cost} ⭐
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSavingFor(null)}>
                <PlimIcon name="close" size={18} color={theme.muted} />
              </TouchableOpacity>
            </View>
            <View style={[styles.progressBg, { backgroundColor: theme.softBg2 }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.primary, width: `${Math.round(progress * 100)}%` as `${number}%` },
                ]}
              />
            </View>
          </View>
        )}

        {/* Rewards grid */}
        <View style={styles.grid}>
          {rewards.map(reward => {
            const canRedeem = stars >= reward.cost;
            const isSaving = savingFor === reward.id;
            const pending = pendingCount(reward.id);
            const pct = Math.min(stars / reward.cost, 1);

            return (
              <View key={reward.id} style={styles.cardWrap}>
                <View style={[
                  styles.cardShadow,
                  { backgroundColor: canRedeem ? theme.primary : isSaving ? theme.accent : theme.softBg2 },
                ]} />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleCard(reward)}
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.surface,
                      borderColor: canRedeem ? theme.primary : isSaving ? theme.accent : theme.softBg2,
                      borderWidth: 2,
                    },
                  ]}
                >
                  {/* Pending badge */}
                  {pending > 0 && (
                    <View style={[styles.pendingBadge, { backgroundColor: theme.coral }]}>
                      <Text style={styles.pendingText}>{pending}</Text>
                    </View>
                  )}

                  <Text style={styles.rewardEmoji}>{reward.icon}</Text>
                  <Text style={[styles.rewardName, { color: theme.text }]}>{reward.name}</Text>

                  {/* Mini progress bar */}
                  {!canRedeem && (
                    <View style={[styles.miniProgressBg, { backgroundColor: theme.softBg2 }]}>
                      <View style={[styles.miniProgressFill, {
                        backgroundColor: isSaving ? theme.accent : theme.primary + '88',
                        width: `${Math.round(pct * 100)}%` as `${number}%`,
                      }]} />
                    </View>
                  )}

                  <View style={[
                    styles.costChip,
                    { backgroundColor: canRedeem ? theme.primary : isSaving ? theme.accent + '22' : theme.softBg },
                  ]}>
                    {canRedeem ? (
                      <>
                        <PlimIcon name="star" size={13} color="#fff" />
                        <Text style={[styles.costText, { color: '#fff' }]}>Resgatar!</Text>
                      </>
                    ) : (
                      <>
                        <PlimIcon name="star" size={13} color={isSaving ? theme.accent : theme.muted} />
                        <Text style={[styles.costText, { color: isSaving ? theme.accent : theme.muted }]}>
                          {reward.cost}
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Empty stars hint */}
        {stars === 0 && (
          <View style={styles.hint}>
            <Text style={[styles.hintText, { color: theme.muted }]}>
              Complete tarefas na aba Início para ganhar ⭐
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  starsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 24,
  },
  starsCount: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.lg },

  scroll: { paddingHorizontal: spacing.md, gap: spacing.md },

  savingCard: { borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  savingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  savingEmoji: { fontSize: 36 },
  savingLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },
  savingProgress: { fontFamily: fontFamily.body, fontSize: fontSize.sm },
  progressBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cardWrap: { width: '47%' },
  cardShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: radius.card },
  card: {
    borderRadius: radius.card, padding: spacing.md,
    alignItems: 'center', gap: spacing.xs,
  },
  pendingBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  pendingText: { fontFamily: fontFamily.bodyBold, fontSize: 11, color: '#fff' },

  rewardEmoji: { fontSize: 40, marginTop: spacing.xs },
  rewardName: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm, textAlign: 'center' },
  miniProgressBg: { width: '100%', height: 5, borderRadius: 3, overflow: 'hidden' },
  miniProgressFill: { height: 5, borderRadius: 3 },
  costChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 20,
  },
  costText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  hint: { alignItems: 'center', paddingVertical: spacing.md },
  hintText: { fontFamily: fontFamily.body, fontSize: fontSize.sm, textAlign: 'center', paddingHorizontal: spacing.xl },
});
