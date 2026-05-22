import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { defaultPalette } from '../../theme/palettes';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore , useTheme} from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';

type Period = 7 | 14 | 30;

const BRISTOL_LABELS: Record<number, string> = {
  1: 'Bolinhas', 2: 'Dura', 3: 'Rachaduras', 4: 'Suave', 5: 'Pedaços', 6: 'Pastosa', 7: 'Líquida',
};
const CONDITION_LABELS: Record<string, string> = {
  enuresis: 'Enurese', hyperactive: 'Bexiga hiperativa', constipation: 'Constipação',
  'incont-fec': 'Incont. fecal', training: 'Treinamento', 'dont-know': 'Em avaliação',
};

function buildReport(days: Period, entries: ReturnType<typeof useAppStore.getState>['entries'], profile: ReturnType<typeof useAppStore.getState>['profile']): string {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const period = entries.filter(e => new Date(e.createdAt) >= cutoff);
  const mics   = period.filter(e => e.type === 'mic');
  const evacs  = period.filter(e => e.type === 'evac');

  const avgMic  = (mics.length  / days).toFixed(1);
  const avgEvac = (evacs.length / days).toFixed(1);

  const bristolCounts = evacs.reduce<Record<number, number>>((acc, e) => {
    if (e.type === 'evac') { acc[e.bristol] = (acc[e.bristol] ?? 0) + 1; }
    return acc;
  }, {});
  const bristolSummary = Object.entries(bristolCounts)
    .map(([t, n]) => `Tipo ${t} (${BRISTOL_LABELS[Number(t)]}): ${n}x`)
    .join('\n  ');

  const colorCounts = mics.reduce<Record<string, number>>((acc, e) => {
    if (e.type === 'mic') { acc[e.color] = (acc[e.color] ?? 0) + 1; }
    return acc;
  }, {});
  const colorSummary = Object.entries(colorCounts)
    .map(([c, n]) => `${c}: ${n}x`)
    .join('  ');

  const conditions = profile?.conditions.map(c => CONDITION_LABELS[c] ?? c).join(', ') ?? '—';
  const professional = profile?.professional?.name ?? '—';

  return `
╔══════════════════════════════════╗
   RELATÓRIO PLIM — ${days} DIAS
╚══════════════════════════════════╝

Paciente: ${profile?.name ?? '—'}, ${profile?.age ?? '—'} anos
Condições: ${conditions}
Profissional: ${professional}
Período: últimos ${days} dias
Gerado em: ${new Date().toLocaleDateString('pt-BR')}

──────────────────────────────────
MICÇÃO
──────────────────────────────────
Total de registros: ${mics.length}
Média por dia: ${avgMic}
Cores registradas: ${colorSummary || '—'}

──────────────────────────────────
EVACUAÇÃO
──────────────────────────────────
Total de registros: ${evacs.length}
Média por dia: ${avgEvac}
Distribuição Bristol:
  ${bristolSummary || '—'}

──────────────────────────────────
Gerado pelo app Plim 🐸
`.trim();
}

export default function ReportScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const entries = useAppStore(s => s.entries);
  const profile = useAppStore(s => s.profile);

  const [period, setPeriod] = useState<Period>(7);
  const [sharing, setSharing] = useState(false);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - period);
  const periodEntries = entries.filter(e => new Date(e.createdAt) >= cutoff);
  const mics  = periodEntries.filter(e => e.type === 'mic');
  const evacs = periodEntries.filter(e => e.type === 'evac');

  const bristolOk = evacs.filter(e => e.type === 'evac' && [3, 4, 5].includes(e.bristol)).length;
  const bristolPct = evacs.length > 0 ? Math.round((bristolOk / evacs.length) * 100) : 0;

  async function handleShare() {
    setSharing(true);
    try {
      const text = buildReport(period, entries, profile);
      await Share.share({ message: text, title: `Relatório Plim — ${period} dias` });
    } finally {
      setSharing(false);
    }
  }

  const PERIODS: Period[] = [7, 14, 30];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Relatório</Text>
        <Text style={[styles.sub, { color: theme.muted }]}>Para enviar ao profissional</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Period selector */}
        <View style={styles.periodRow}>
          {PERIODS.map(p => {
            const sel = period === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodChip, { backgroundColor: sel ? theme.primary : theme.softBg, borderColor: sel ? theme.primaryDark : 'transparent', borderWidth: 2 }]}
              >
                <Text style={[styles.periodLabel, { color: sel ? '#fff' : theme.muted }]}>{p} dias</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary preview */}
        <View style={[styles.previewCard, { backgroundColor: theme.surface, ...shadow.card }]}>
          <View style={styles.previewHeader}>
            <PlimIcon name="pdf" size={20} color={theme.coral} />
            <Text style={[styles.previewTitle, { color: theme.text }]}>Resumo — {period} dias</Text>
          </View>

          {/* Patient */}
          <View style={[styles.previewSection, { borderColor: theme.softBg2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Paciente</Text>
            <Text style={[styles.previewLine, { color: theme.text }]}>
              {profile?.name ?? '—'}, {profile?.age ?? '—'} anos
            </Text>
            <Text style={[styles.previewLine, { color: theme.muted }]}>
              {profile?.conditions.map(c => CONDITION_LABELS[c]).join(' · ') || '—'}
            </Text>
          </View>

          {/* Micção */}
          <View style={[styles.previewSection, { borderColor: theme.softBg2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Micção</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: theme.secondary }]}>{mics.length}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>registros</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: theme.secondary }]}>{(mics.length / period).toFixed(1)}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>por dia</Text>
              </View>
            </View>
          </View>

          {/* Evacuação */}
          <View style={[styles.previewSection, { borderColor: theme.softBg2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Evacuação</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: '#B57F4F' }]}>{evacs.length}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>registros</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: '#B57F4F' }]}>{bristolPct}%</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>consistência ok</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Share button */}
        <View style={styles.shareBtnWrap}>
          <View style={[styles.btnShadow, { backgroundColor: theme.coral + 'BB' }]} />
          <Pressable
            style={({ pressed }) => [
              styles.shareBtn,
              { backgroundColor: theme.coral, borderColor: theme.coral + 'BB', borderBottomWidth: pressed ? 2 : 4, transform: [{ translateY: pressed ? 2 : 0 }], opacity: sharing ? 0.7 : 1 },
            ]}
            onPress={handleShare}
            disabled={sharing}
          >
            <PlimIcon name="share" size={20} color="#fff" />
            <Text style={styles.shareBtnLabel}>{sharing ? 'Preparando...' : 'Compartilhar relatório'}</Text>
          </Pressable>
        </View>

        {/* Tip */}
        <View style={[styles.tip, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '55', borderWidth: 1.5 }]}>
          <Text style={[styles.tipText, { color: theme.muted }]}>
            O relatório será compartilhado como texto. Você pode enviar por WhatsApp, e-mail ou outro app direto para o profissional.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  sub: { fontFamily: fontFamily.body, fontSize: fontSize.xs, marginTop: 2 },
  scroll: { paddingHorizontal: spacing.md, gap: spacing.sm },

  periodRow: { flexDirection: 'row', gap: spacing.sm },
  periodChip: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.pill },
  periodLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  previewCard: { borderRadius: radius.card, padding: spacing.md, gap: 0 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  previewTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },

  previewSection: { borderTopWidth: 1, paddingVertical: spacing.sm, gap: spacing.xs },
  sectionTitle: { fontFamily: fontFamily.body, fontSize: fontSize.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  previewLine: { fontFamily: fontFamily.body, fontSize: fontSize.sm },
  statRow: { flexDirection: 'row', gap: spacing.xl },
  statItem: { alignItems: 'center' },
  statBig: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  statSm: { fontFamily: fontFamily.body, fontSize: fontSize.xs },

  shareBtnWrap: { position: 'relative' },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  shareBtn: { borderRadius: 16, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 0 },
  shareBtnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.lg, color: '#fff' },

  tip: { borderRadius: radius.card, padding: spacing.md },
  tipText: { fontFamily: fontFamily.body, fontSize: fontSize.sm, lineHeight: 20 },
});
