import React, { useState, useMemo } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore, type DiaryEntry , useTheme} from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';

type Filter = 'all' | 'mic' | 'evac';

const URINE_COLORS: Record<string, string> = {
  c1: '#F8F4D3', c2: '#FDED9E', c3: '#F9CC4B', c4: '#D69B27', c5: '#A35F12',
};
const BRISTOL_COLORS: Record<number, string> = {
  1: '#8B6F47', 2: '#7E6A52', 3: '#9E8466', 4: '#B89773', 5: '#C7A584', 6: '#A8804A', 7: '#7E5A28',
};

function groupByDate(entries: DiaryEntry[]) {
  const map = new Map<string, DiaryEntry[]>();
  entries.forEach(e => {
    const key = new Date(e.createdAt).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  });
  return [...map.entries()].map(([title, data]) => ({ title, data }));
}

export default function ParentDiaryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const entries = useAppStore(s => s.entries);
  const [filter, setFilter] = useState<Filter>('all');

  const sections = useMemo(() => {
    const filtered = [...entries]
      .filter(e => filter === 'all' || e.type === filter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return groupByDate(filtered);
  }, [entries, filter]);

  const FILTERS: { key: Filter; label: string; icon: 'drop' | 'poop' | 'diary' }[] = [
    { key: 'all',  label: 'Todos',  icon: 'diary' },
    { key: 'mic',  label: 'Xixi',   icon: 'drop' },
    { key: 'evac', label: 'Cocô',   icon: 'poop' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Histórico</Text>
        <Text style={[styles.sub, { color: theme.muted }]}>{entries.length} registros no total</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const sel = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filterChip, { backgroundColor: sel ? theme.secondary + '22' : theme.softBg, borderColor: sel ? theme.secondary : 'transparent', borderWidth: 2 }]}
            >
              <PlimIcon name={f.icon} size={14} color={sel ? theme.secondary : theme.muted} />
              <Text style={[styles.filterLabel, { color: sel ? theme.secondary : theme.muted }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>Nenhum registro encontrado</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: insets.bottom + 100 }}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { backgroundColor: theme.bg }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
            </View>
          )}
          renderItem={({ item: entry }) => (
            <View style={[styles.entryCard, { backgroundColor: theme.surface, ...shadow.card }]}>
              {/* Left accent bar */}
              <View style={[styles.accentBar, { backgroundColor: entry.type === 'mic' ? theme.secondary : '#B57F4F' }]} />

              <View style={styles.entryContent}>
                <View style={styles.entryTop}>
                  <View style={[styles.iconBox, { backgroundColor: entry.type === 'mic' ? theme.secondary + '22' : '#B57F4F22' }]}>
                    <PlimIcon name={entry.type === 'mic' ? 'drop' : 'poop'} size={18} color={entry.type === 'mic' ? theme.secondary : '#B57F4F'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.entryType, { color: theme.text }]}>
                      {entry.type === 'mic' ? 'Xixi' : 'Cocô'}
                    </Text>
                    <Text style={[styles.entryTime, { color: theme.muted }]}>
                      {new Date(entry.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  {/* Detail chip */}
                  {entry.type === 'mic' && (
                    <View style={styles.detailRow}>
                      <View style={[styles.colorSwatch, { backgroundColor: URINE_COLORS[entry.color] ?? '#F8F4D3', borderWidth: 1, borderColor: '#ccc' }]} />
                      <Text style={[styles.detailText, { color: theme.muted }]}>{entry.cups} copo{entry.cups > 1 ? 's' : ''}</Text>
                    </View>
                  )}
                  {entry.type === 'evac' && (
                    <View style={[styles.bristolChip, { backgroundColor: BRISTOL_COLORS[entry.bristol] + '33' }]}>
                      <Text style={[styles.bristolText, { color: BRISTOL_COLORS[entry.bristol] }]}>Tipo {entry.bristol}</Text>
                    </View>
                  )}
                </View>

                {/* Triggers */}
                {entry.type === 'mic' && entry.triggers.length > 0 && (
                  <View style={styles.triggersRow}>
                    {entry.triggers.map(t => (
                      <View key={t} style={[styles.triggerChip, { backgroundColor: theme.softBg }]}>
                        <Text style={[styles.triggerText, { color: theme.muted }]}>{t}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Note */}
                {entry.note ? (
                  <Text style={[styles.note, { color: theme.muted }]} numberOfLines={2}>{entry.note}</Text>
                ) : null}
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  sub: { fontFamily: fontFamily.body, fontSize: fontSize.xs, marginTop: 2 },
  filterRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill },
  filterLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },
  sectionHeader: { paddingVertical: spacing.sm },
  sectionTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.sm, textTransform: 'capitalize' },
  entryCard: { flexDirection: 'row', borderRadius: radius.card, marginBottom: spacing.sm, overflow: 'hidden' },
  accentBar: { width: 4 },
  entryContent: { flex: 1, padding: spacing.sm, gap: spacing.xs },
  entryTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  entryType: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },
  entryTime: { fontFamily: fontFamily.body, fontSize: fontSize.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  colorSwatch: { width: 16, height: 16, borderRadius: 8 },
  detailText: { fontFamily: fontFamily.body, fontSize: fontSize.xs },
  bristolChip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: 8 },
  bristolText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs },
  triggersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  triggerChip: { paddingHorizontal: spacing.xs, paddingVertical: 2, borderRadius: 6 },
  triggerText: { fontFamily: fontFamily.body, fontSize: 10 },
  note: { fontFamily: fontFamily.body, fontSize: fontSize.xs, fontStyle: 'italic' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyEmoji: { fontSize: 56 },
  emptyText: { fontFamily: fontFamily.body, fontSize: fontSize.base },
});
