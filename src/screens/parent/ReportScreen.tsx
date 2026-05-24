import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore, useTheme } from '../../store/useAppStore';
import type { DiaryEntry, KidProfile } from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';

type Period = 7 | 14 | 30;

const BRISTOL_LABELS: Record<number, string> = {
  1: 'Bolinhas duras', 2: 'Formato duro', 3: 'Com rachaduras',
  4: 'Suave (ideal)', 5: 'Pedacos macios', 6: 'Pastosa', 7: 'Liquida',
};
const CONDITION_LABELS: Record<string, string> = {
  enuresis: 'Enurese', hyperactive: 'Bexiga hiperativa', constipation: 'Constipacao',
  'incont-fec': 'Incont. fecal', training: 'Treinamento', 'dont-know': 'Em avaliacao',
};

function buildHtml(days: Period, entries: DiaryEntry[], profile: KidProfile | null, waterHistory: { date: string; cups: number }[]): string {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const period = entries.filter(e => new Date(e.createdAt) >= cutoff);
  const mics  = period.filter(e => e.type === 'mic');
  const evacs = period.filter(e => e.type === 'evac');
  const incs  = period.filter(e => e.type === 'inc');
  const waterGoalDays = waterHistory.filter(h => new Date(h.date) >= cutoff && h.cups >= 2).length;

  const avgMic  = (mics.length  / days).toFixed(1);
  const avgEvac = (evacs.length / days).toFixed(1);

  const bristolCounts = evacs.reduce<Record<number, number>>((acc, e) => {
    if (e.type === 'evac') acc[e.bristol] = (acc[e.bristol] ?? 0) + 1;
    return acc;
  }, {});
  const bristolOk = evacs.filter(e => e.type === 'evac' && [3, 4, 5].includes(e.bristol)).length;
  const bristolPct = evacs.length > 0 ? Math.round((bristolOk / evacs.length) * 100) : 0;

  const colorCounts = mics.reduce<Record<string, number>>((acc, e) => {
    if (e.type === 'mic') acc[e.color] = (acc[e.color] ?? 0) + 1;
    return acc;
  }, {});

  const conditions = profile?.conditions.map(c => CONDITION_LABELS[c] ?? c).join(', ') ?? '-';
  const professional = profile?.professional?.name ?? '-';
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const bristolRows = Object.entries(bristolCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([t, n]) => `<tr><td>Tipo ${t}</td><td>${BRISTOL_LABELS[Number(t)] ?? ''}</td><td style="text-align:center"><strong>${n}x</strong></td></tr>`)
    .join('');

  const colorRows = Object.entries(colorCounts)
    .map(([c, n]) => `<tr><td>${c}</td><td style="text-align:center"><strong>${n}x</strong></td></tr>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; font-size:13px; color:#1F3A4D; padding:32px; }
  h1 { font-size:22px; color:#3DA070; margin-bottom:4px; }
  h2 { font-size:14px; color:#3DA070; margin:20px 0 8px; border-bottom:2px solid #EAF7EF; padding-bottom:4px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
  .subtitle { color:#6B8499; font-size:11px; margin-top:2px; }
  .meta { background:#F5FDF8; border:1px solid #D4EFE2; border-radius:10px; padding:14px 18px; margin-bottom:8px; }
  .meta-row { display:flex; gap:32px; flex-wrap:wrap; }
  .meta-item { flex:1; min-width:140px; }
  .meta-label { font-size:10px; color:#6B8499; text-transform:uppercase; letter-spacing:.5px; margin-bottom:2px; }
  .meta-value { font-size:13px; font-weight:600; color:#1F3A4D; }
  .stats { display:flex; gap:12px; margin-bottom:8px; }
  .stat-card { flex:1; background:#F5FDF8; border:1px solid #D4EFE2; border-radius:10px; padding:12px 14px; text-align:center; }
  .stat-num { font-size:28px; font-weight:700; color:#3DA070; }
  .stat-num.brown { color:#B57F4F; }
  .stat-sub { font-size:10px; color:#6B8499; margin-top:2px; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  th { background:#EAF7EF; color:#3DA070; padding:7px 10px; text-align:left; font-size:11px; }
  td { padding:6px 10px; border-bottom:1px solid #F0F4F7; }
  tr:last-child td { border-bottom:none; }
  .footer { margin-top:32px; text-align:center; color:#6B8499; font-size:10px; border-top:1px solid #EEE; padding-top:12px; }
  .badge { display:inline-block; background:#EAF7EF; color:#3DA070; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:600; }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>Relatorio Plim</h1>
    <div class="subtitle">Reabilitacao Pelvica Pediatrica - Ultimos ${days} dias</div>
  </div>
  <div style="text-align:right">
    <div class="badge">${days} dias</div>
    <div class="subtitle" style="margin-top:6px">${today}</div>
  </div>
</div>
<div class="meta">
  <div class="meta-row">
    <div class="meta-item">
      <div class="meta-label">Paciente</div>
      <div class="meta-value">${profile?.name ?? '-'}, ${profile?.age ?? '-'} anos</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Condicoes</div>
      <div class="meta-value">${conditions}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Profissional</div>
      <div class="meta-value">${professional}</div>
    </div>
  </div>
</div>
<h2>Miccao</h2>
<div class="stats">
  <div class="stat-card"><div class="stat-num">${mics.length}</div><div class="stat-sub">registros</div></div>
  <div class="stat-card"><div class="stat-num">${avgMic}</div><div class="stat-sub">por dia</div></div>
  <div class="stat-card"><div class="stat-num">${waterGoalDays}</div><div class="stat-sub">dias c/ meta de agua (≥2 copos)</div></div>
</div>
${colorRows ? `<table><tr><th>Cor da urina</th><th style="text-align:center">Ocorrencias</th></tr>${colorRows}</table>` : '<p style="color:#6B8499;font-size:12px">Nenhum registro de miccao no periodo.</p>'}
<h2>Evacuacao</h2>
<div class="stats">
  <div class="stat-card"><div class="stat-num brown">${evacs.length}</div><div class="stat-sub">registros</div></div>
  <div class="stat-card"><div class="stat-num brown">${avgEvac}</div><div class="stat-sub">por dia</div></div>
  <div class="stat-card"><div class="stat-num brown">${bristolPct}%</div><div class="stat-sub">consistencia normal (3-5)</div></div>
</div>
${bristolRows ? `<table><tr><th>Bristol</th><th>Descricao</th><th style="text-align:center">Qtd</th></tr>${bristolRows}</table>` : '<p style="color:#6B8499;font-size:12px">Nenhum registro de evacuacao no periodo.</p>'}
<h2>Escapes (Incontinencia)</h2>
<div class="stats">
  <div class="stat-card"><div class="stat-num" style="color:#C4364A">${incs.length}</div><div class="stat-sub">total de escapes</div></div>
  <div class="stat-card"><div class="stat-num" style="color:#C4364A">${(incs.length / days).toFixed(1)}</div><div class="stat-sub">por dia</div></div>
</div>
${incs.length === 0 ? '<p style="color:#6B8499;font-size:12px">Nenhum escape no periodo.</p>' : ''}
<div class="footer">
  Relatorio gerado pelo app Plim<br/>
  Este documento e informativo. Interprete os dados junto ao seu profissional de saude.
</div>
</body>
</html>`;
}

export default function ReportScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const entries = useAppStore(s => s.entries);
  const profile = useAppStore(s => s.profile);
  const waterHistory = useAppStore(s => s.waterHistory);

  const [period, setPeriod] = useState<Period>(7);
  const [loading, setLoading] = useState(false);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - period);
  const periodEntries = entries.filter(e => new Date(e.createdAt) >= cutoff);
  const mics  = periodEntries.filter(e => e.type === 'mic');
  const evacs = periodEntries.filter(e => e.type === 'evac');
  const incs  = periodEntries.filter(e => e.type === 'inc');
  const bristolOk = evacs.filter(e => e.type === 'evac' && [3, 4, 5].includes(e.bristol)).length;
  const bristolPct = evacs.length > 0 ? Math.round((bristolOk / evacs.length) * 100) : 0;
  const waterGoalDays = waterHistory.filter(h => new Date(h.date) >= cutoff && h.cups >= 2).length;

  async function handleExportPdf() {
    setLoading(true);
    try {
      const html = buildHtml(period, entries, profile, waterHistory);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Relatorio Plim - ${period} dias`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        await Print.printAsync({ uri });
      }
    } catch {
      Alert.alert('Erro', 'Nao foi possivel gerar o PDF. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const PERIODS: Period[] = [7, 14, 30];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Relatorio</Text>
        <Text style={[styles.sub, { color: theme.muted }]}>PDF para o profissional</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.periodRow}>
          {PERIODS.map(p => {
            const sel = period === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodChip, {
                  backgroundColor: sel ? theme.primary : theme.softBg,
                  borderColor: sel ? theme.primaryDark : 'transparent',
                  borderWidth: 2,
                }]}
              >
                <Text style={[styles.periodLabel, { color: sel ? '#fff' : theme.muted }]}>{p} dias</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.previewCard, { backgroundColor: theme.surface, ...shadow.card }]}>
          <View style={styles.previewHeader}>
            <PlimIcon name="pdf" size={20} color={theme.coral} />
            <Text style={[styles.previewTitle, { color: theme.text }]}>Resumo — {period} dias</Text>
          </View>

          <View style={[styles.previewSection, { borderColor: theme.softBg2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Paciente</Text>
            <Text style={[styles.previewLine, { color: theme.text }]}>
              {profile?.name ?? '—'}, {profile?.age ?? '—'} anos
            </Text>
            <Text style={[styles.previewLine, { color: theme.muted }]}>
              {profile?.conditions.map(c => CONDITION_LABELS[c]).join(' · ') || '—'}
            </Text>
          </View>

          <View style={[styles.previewSection, { borderColor: theme.softBg2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Miccao</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: theme.secondary }]}>{mics.length}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>registros</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: theme.secondary }]}>{(mics.length / period).toFixed(1)}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>por dia</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: '#4AB8E0' }]}>{waterGoalDays}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>dias c/ água</Text>
              </View>
            </View>
          </View>

          <View style={[styles.previewSection, { borderColor: theme.softBg2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Evacuacao</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: '#B57F4F' }]}>{evacs.length}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>registros</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: '#B57F4F' }]}>{bristolPct}%</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>consistencia ok</Text>
              </View>
            </View>
          </View>

          <View style={[styles.previewSection, { borderColor: theme.softBg2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>Escapes</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: '#C4364A' }]}>{incs.length}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>no periodo</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statBig, { color: '#C4364A' }]}>{(incs.length / period).toFixed(1)}</Text>
                <Text style={[styles.statSm, { color: theme.muted }]}>por dia</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.btnWrap}>
          <View style={[styles.btnShadow, { backgroundColor: theme.coral + 'BB' }]} />
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              {
                backgroundColor: theme.coral,
                borderColor: theme.coral + 'BB',
                borderBottomWidth: pressed ? 2 : 4,
                transform: [{ translateY: pressed ? 2 : 0 }],
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleExportPdf}
            disabled={loading}
          >
            <PlimIcon name="pdf" size={20} color="#fff" />
            <Text style={styles.btnLabel}>{loading ? 'Gerando PDF...' : 'Exportar PDF'}</Text>
          </Pressable>
        </View>

        <View style={[styles.tip, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '55', borderWidth: 1.5 }]}>
          <Text style={[styles.tipText, { color: theme.muted }]}>
            O PDF sera gerado no celular e voce pode compartilhar por WhatsApp, e-mail ou salvar nos arquivos.
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

  previewCard: { borderRadius: radius.card, padding: spacing.md },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  previewTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  previewSection: { borderTopWidth: 1, paddingVertical: spacing.sm, gap: spacing.xs },
  sectionTitle: { fontFamily: fontFamily.body, fontSize: fontSize.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  previewLine: { fontFamily: fontFamily.body, fontSize: fontSize.sm },
  statRow: { flexDirection: 'row', gap: spacing.xl },
  statItem: { alignItems: 'center' },
  statBig: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  statSm: { fontFamily: fontFamily.body, fontSize: fontSize.xs },

  btnWrap: { position: 'relative' },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  btn: { borderRadius: 16, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 0 },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.lg, color: '#fff' },

  tip: { borderRadius: radius.card, padding: spacing.md },
  tipText: { fontFamily: fontFamily.body, fontSize: fontSize.sm, lineHeight: 20 },
});
