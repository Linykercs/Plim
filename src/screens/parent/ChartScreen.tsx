import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore , useTheme} from '../../store/useAppStore';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = SCREEN_W - spacing.md * 2 - spacing.md * 2; // card padding
const CHART_H = 160;
const BAR_GAP = 6;

type Range = '7d' | '14d' | '30d';
const RANGES: { key: Range; label: string; days: number }[] = [
  { key: '7d',  label: '7 dias',  days: 7  },
  { key: '14d', label: '14 dias', days: 14 },
  { key: '30d', label: '30 dias', days: 30 },
];

function buildDays(days: number) {
  return [...Array(days)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d;
  });
}

function shortLabel(d: Date, days: number) {
  if (days <= 7) return ['D','S','T','Q','Q','S','S'][d.getDay()];
  if (days <= 14) return d.getDate().toString();
  return d.getDate() % 5 === 0 ? d.getDate().toString() : '';
}

export default function ChartScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const entries = useAppStore(s => s.entries);
  const [range, setRange] = useState<Range>('7d');

  const { days } = RANGES.find(r => r.key === range)!;
  const dayList = buildDays(days);

  const micCounts  = dayList.map(d => entries.filter(e => e.type === 'mic'  && new Date(e.createdAt).toDateString() === d.toDateString()).length);
  const evacCounts = dayList.map(d => entries.filter(e => e.type === 'evac' && new Date(e.createdAt).toDateString() === d.toDateString()).length);
  const totalCounts = micCounts.map((m, i) => m + evacCounts[i]);

  const maxVal = Math.max(...totalCounts, 1);
  const barW = (CHART_W - (days + 1) * BAR_GAP) / days;
  const xScale = (i: number) => BAR_GAP + i * (barW + BAR_GAP);
  const yScale = (v: number) => CHART_H - (v / maxVal) * (CHART_H - 20);

  // Stats
  const totalMic  = micCounts.reduce((a, b) => a + b, 0);
  const totalEvac = evacCounts.reduce((a, b) => a + b, 0);
  const avgMic    = (totalMic  / days).toFixed(1);
  const avgEvac   = (totalEvac / days).toFixed(1);
  const activeDays = dayList.filter((_, i) => totalCounts[i] > 0).length;

  const today = new Date().toDateString();

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Gráfico</Text>
        <Text style={[styles.sub, { color: theme.muted }]}>Frequência miccional e evacuatória</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Range selector */}
        <View style={styles.rangeRow}>
          {RANGES.map(r => {
            const sel = range === r.key;
            return (
              <TouchableOpacity
                key={r.key}
                onPress={() => setRange(r.key)}
                style={[styles.rangeChip, { backgroundColor: sel ? theme.secondary : theme.softBg, borderColor: sel ? theme.secondary : 'transparent', borderWidth: 2 }]}
              >
                <Text style={[styles.rangeLabel, { color: sel ? '#fff' : theme.muted }]}>{r.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Chart */}
        <View style={[styles.chartCard, { backgroundColor: theme.surface, ...shadow.card }]}>
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.secondary }]} />
              <Text style={[styles.legendText, { color: theme.muted }]}>Xixi</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#B57F4F' }]} />
              <Text style={[styles.legendText, { color: theme.muted }]}>Cocô</Text>
            </View>
          </View>

          <Svg width={CHART_W} height={CHART_H + 24}>
            {/* Y-axis grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(pct => {
              const y = CHART_H - pct * (CHART_H - 20);
              const val = Math.round(pct * maxVal);
              return (
                <G key={pct}>
                  <Line x1={0} y1={y} x2={CHART_W} y2={y} stroke={theme.softBg2} strokeWidth={1} strokeDasharray="4 4" />
                  <SvgText x={0} y={y - 3} fill={theme.muted} fontSize={8} fontFamily={fontFamily.body}>{val}</SvgText>
                </G>
              );
            })}

            {/* Bars */}
            {dayList.map((d, i) => {
              const x     = xScale(i);
              const isToday = d.toDateString() === today;
              const mic   = micCounts[i];
              const evac  = evacCounts[i];
              const total = mic + evac;
              const barH  = total > 0 ? ((total / maxVal) * (CHART_H - 20)) : 2;
              const micH  = total > 0 ? (mic / total) * barH : 0;
              const evacH = barH - micH;
              const barTop = CHART_H - barH;

              return (
                <G key={i}>
                  {/* Evac (bottom) */}
                  {evacH > 0 && <Rect x={x} y={barTop + micH} width={barW} height={evacH} fill="#B57F4F" rx={2} />}
                  {/* Mic (top) */}
                  {micH > 0 && <Rect x={x} y={barTop} width={barW} height={micH} fill={theme.secondary} rx={2} />}
                  {/* Today highlight */}
                  {isToday && <Rect x={x} y={CHART_H + 4} width={barW} height={4} fill={theme.accent} rx={2} />}
                  {/* Day label */}
                  <SvgText
                    x={x + barW / 2}
                    y={CHART_H + 18}
                    fill={isToday ? theme.text : theme.muted}
                    fontSize={9}
                    textAnchor="middle"
                    fontFamily={fontFamily.body}
                  >
                    {shortLabel(d, days)}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Total xixi', value: totalMic.toString(),    color: theme.secondary },
            { label: 'Total cocô', value: totalEvac.toString(),   color: '#B57F4F' },
            { label: 'Média xixi/dia', value: avgMic,             color: theme.secondary },
            { label: 'Média cocô/dia', value: avgEvac,            color: '#B57F4F' },
            { label: 'Dias com registro', value: `${activeDays}/${days}`, color: theme.primary },
            { label: 'Total registros', value: (totalMic + totalEvac).toString(), color: theme.primary },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: theme.surface, ...shadow.card }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.muted }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Guidance */}
        <View style={[styles.guideCard, { backgroundColor: theme.secondary + '11', borderColor: theme.secondary + '44', borderWidth: 1.5 }]}>
          <Text style={[styles.guideTitle, { color: theme.secondary }]}>Referência normal</Text>
          <Text style={[styles.guideText, { color: theme.muted }]}>
            Crianças de 4–10 anos urinam em média <Text style={{ color: theme.text, fontFamily: fontFamily.bodyBold }}>5–7 vezes por dia</Text>.
            Evacuações saudáveis ocorrem <Text style={{ color: theme.text, fontFamily: fontFamily.bodyBold }}>1 vez ao dia ou a cada 2 dias</Text>.
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

  rangeRow: { flexDirection: 'row', gap: spacing.sm },
  rangeChip: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.pill },
  rangeLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  chartCard: { borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  legend: { flexDirection: 'row', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontFamily: fontFamily.body, fontSize: fontSize.xs },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: { width: '47%', flex: 1, borderRadius: radius.card, padding: spacing.md, alignItems: 'center', gap: spacing.xxs },
  statValue: { fontFamily: fontFamily.heading, fontSize: fontSize.xl },
  statLabel: { fontFamily: fontFamily.body, fontSize: fontSize.xs, textAlign: 'center' },

  guideCard: { borderRadius: radius.card, padding: spacing.md, gap: spacing.xs },
  guideTitle: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },
  guideText: { fontFamily: fontFamily.body, fontSize: fontSize.sm, lineHeight: 20 },
});
