import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from '../../navigation/types';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore , useTheme} from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';
import ClockFace from '../../components/diary/ClockFace';
import CupGlyph from '../../components/diary/CupGlyph';

type Nav = NativeStackNavigationProp<DiaryStackParamList, 'DiaryMic'>;

const URINE_COLORS = [
  { key: 'c1', hex: '#F8F4D3', label: 'Clara' },
  { key: 'c2', hex: '#FDED9E', label: 'Normal' },
  { key: 'c3', hex: '#F9CC4B', label: 'Amarela' },
  { key: 'c4', hex: '#D69B27', label: 'Escura' },
  { key: 'c5', hex: '#A35F12', label: 'Marrom' },
];

const TRIGGERS = [
  { key: 'tv',  emoji: '📺', label: 'TV' },
  { key: 'br',  emoji: '🤸', label: 'Brincando' },
  { key: 'es',  emoji: '🎒', label: 'Escola' },
  { key: 'do',  emoji: '😴', label: 'Dormindo' },
  { key: 'co',  emoji: '🍽',  label: 'Comendo' },
  { key: 'me',  emoji: '🤷', label: 'Não sei' },
];

function nowHM() {
  const d = new Date();
  return { h: d.getHours(), m: d.getMinutes() };
}

export default function DiaryMicScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<Nav>();
  const addEntry = useAppStore(s => s.addEntry);
  const addStars = useAppStore(s => s.addStars);
  const completeMission = useAppStore(s => s.completeMission);
  const missionsDone = useAppStore(s => s.missionsDone);

  const [phase, setPhase] = useState<'form' | 'reward'>('form');
  const [time, setTime] = useState(nowHM());
  const [cups, setCups] = useState(1);
  const [urineColor, setUrineColor] = useState('c2');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [note, setNote] = useState('');

  function toggleTrigger(k: string) {
    setTriggers(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  }

  function adjustTime(field: 'h' | 'm', delta: number) {
    setTime(prev => {
      if (field === 'h') return { ...prev, h: (prev.h + delta + 24) % 24 };
      return { ...prev, m: (prev.m + delta + 60) % 60 };
    });
  }

  function handleSave() {
    addEntry({
      id: Date.now().toString(),
      type: 'mic',
      createdAt: (() => {
        const d = new Date();
        d.setHours(time.h, time.m, 0, 0);
        return d.toISOString();
      })(),
      cups,
      color: urineColor,
      triggers,
      note,
    });
    if (!missionsDone.mic) {
      addStars(3);
      completeMission('mic');
    }
    setPhase('reward');
  }

  if (phase === 'reward') {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
        <View style={styles.rewardCenter}>
          <Text style={styles.rewardEmoji}>💧</Text>
          <Text style={[styles.rewardTitle, { color: theme.text }]}>Ótimo registro!</Text>
          <Text style={[styles.rewardSub, { color: theme.muted }]}>Você ganhou 3 estrelas!</Text>
          <View style={[styles.starsBadge, { backgroundColor: theme.accent + '33' }]}>
            <PlimIcon name="star" size={22} color={theme.accent} />
            <Text style={[styles.starsText, { color: theme.accent }]}>+3 ⭐</Text>
          </View>
          <View style={styles.rewardBtnWrap}>
            <View style={[styles.btnShadow, { backgroundColor: theme.primaryDark }]} />
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                { backgroundColor: theme.primary, borderBottomWidth: pressed ? 2 : 4, borderColor: theme.primaryDark, transform: [{ translateY: pressed ? 2 : 0 }] },
              ]}
              onPress={() => nav.goBack()}
            >
              <Text style={styles.btnLabel}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Registro de Xixi</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Clock */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            <PlimIcon name="clock" size={16} color={theme.secondary} /> Que horas foi?
          </Text>
          <View style={styles.clockRow}>
            <View style={styles.clockControls}>
              <TouchableOpacity onPress={() => adjustTime('h', 1)} style={styles.arrowBtn}>
                <PlimIcon name="chevron" size={20} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.clockNum, { color: theme.text }]}>
                {String(time.h).padStart(2, '0')}
              </Text>
              <TouchableOpacity onPress={() => adjustTime('h', -1)} style={[styles.arrowBtn, styles.arrowDown]}>
                <PlimIcon name="chevron" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
            <ClockFace hour={time.h} minute={time.m} size={88} color={theme.secondary} />
            <View style={styles.clockControls}>
              <TouchableOpacity onPress={() => adjustTime('m', 5)} style={styles.arrowBtn}>
                <PlimIcon name="chevron" size={20} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.clockNum, { color: theme.text }]}>
                {String(time.m).padStart(2, '0')}
              </Text>
              <TouchableOpacity onPress={() => adjustTime('m', -5)} style={[styles.arrowBtn, styles.arrowDown]}>
                <PlimIcon name="chevron" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Volume */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>Quanto fez?</Text>
          <View style={styles.cupsRow}>
            {[1, 2, 3, 4, 5].map(n => (
              <TouchableOpacity key={n} onPress={() => setCups(n)} style={styles.cupBtn}>
                <CupGlyph fill={n <= cups ? 1 : 0.08} color={theme.secondary} size={44} />
                {n === cups && (
                  <View style={[styles.cupBadge, { backgroundColor: theme.secondary }]}>
                    <PlimIcon name="check" size={10} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.cupsLabel, { color: theme.muted }]}>
            {cups === 1 ? 'Pouco (1 copinho)' : cups <= 3 ? `Médio (${cups} copinhos)` : `Muito (${cups} copinhos)`}
          </Text>
        </View>

        {/* Urine color */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>Cor do xixi</Text>
          <View style={styles.colorRow}>
            {URINE_COLORS.map(c => (
              <TouchableOpacity
                key={c.key}
                onPress={() => setUrineColor(c.key)}
                style={[
                  styles.colorChip,
                  { backgroundColor: c.hex, borderColor: urineColor === c.key ? theme.secondary : '#ccc', borderWidth: urineColor === c.key ? 3 : 1 },
                ]}
              >
                {urineColor === c.key && <PlimIcon name="check" size={14} color={theme.secondary} />}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.colorLabel, { color: theme.muted }]}>
            {URINE_COLORS.find(c => c.key === urineColor)?.label}
          </Text>
        </View>

        {/* Triggers */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>O que estava fazendo?</Text>
          <View style={styles.triggerGrid}>
            {TRIGGERS.map(t => {
              const sel = triggers.includes(t.key);
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => toggleTrigger(t.key)}
                  style={[
                    styles.triggerChip,
                    { backgroundColor: sel ? theme.secondary + '22' : theme.softBg, borderColor: sel ? theme.secondary : 'transparent', borderWidth: 2 },
                  ]}
                >
                  <Text style={styles.triggerEmoji}>{t.emoji}</Text>
                  <Text style={[styles.triggerLabel, { color: sel ? theme.secondary : theme.muted }]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Note */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>Observação (opcional)</Text>
          <TextInput
            style={[styles.noteInput, { color: theme.text, borderColor: theme.softBg2 }]}
            placeholder="Ex: sentiu urgência, dor..."
            placeholderTextColor={theme.muted}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={200}
          />
        </View>
      </ScrollView>

      {/* Save button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={[styles.btnShadow, { backgroundColor: theme.primaryDark }]} />
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: theme.primary, borderBottomWidth: pressed ? 2 : 4, borderColor: theme.primaryDark, transform: [{ translateY: pressed ? 2 : 0 }] },
          ]}
          onPress={handleSave}
        >
          <PlimIcon name="check" size={20} color="#fff" />
          <Text style={styles.btnLabel}>Salvar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  scroll: { paddingHorizontal: spacing.md, gap: spacing.sm },

  section: {
    borderRadius: radius.card, padding: spacing.md, gap: spacing.sm,
  },
  sectionLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },

  clockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  clockControls: { alignItems: 'center', gap: spacing.xs },
  arrowBtn: { padding: spacing.xs },
  arrowDown: { transform: [{ rotate: '180deg' }] },
  clockNum: { fontFamily: fontFamily.heading, fontSize: fontSize.xl },

  cupsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cupBtn: { alignItems: 'center', position: 'relative' },
  cupBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  cupsLabel: { fontFamily: fontFamily.body, fontSize: fontSize.sm, textAlign: 'center' },

  colorRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  colorChip: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  colorLabel: { fontFamily: fontFamily.body, fontSize: fontSize.sm, textAlign: 'center' },

  triggerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  triggerChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.chip,
  },
  triggerEmoji: { fontSize: 18 },
  triggerLabel: { fontFamily: fontFamily.body, fontSize: fontSize.xs },

  noteInput: {
    fontFamily: fontFamily.body, fontSize: fontSize.sm,
    borderWidth: 1, borderRadius: radius.chip,
    padding: spacing.sm, minHeight: 64,
    textAlignVertical: 'top',
  },

  footer: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  btnShadow: { position: 'absolute', top: spacing.sm + 4, left: spacing.md, right: spacing.md, bottom: 0, borderRadius: 16 },
  btn: {
    borderRadius: 16, paddingVertical: spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    borderWidth: 0,
  },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.lg, color: '#fff' },

  rewardCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  rewardEmoji: { fontSize: 72 },
  rewardTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl, textAlign: 'center' },
  rewardSub: { fontFamily: fontFamily.body, fontSize: fontSize.base, textAlign: 'center' },
  starsBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 24 },
  starsText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl },
  rewardBtnWrap: { width: '100%', marginTop: spacing.md },
});
