import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DiaryStackParamList } from '../../navigation/types';
import { defaultPalette } from '../../theme/palettes';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore , useTheme} from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';
import ClockFace from '../../components/diary/ClockFace';
import BristolGlyph from '../../components/diary/BristolGlyph';
import PoopBlob from '../../components/diary/PoopBlob';

type Nav = NativeStackNavigationProp<DiaryStackParamList, 'DiaryEvac'>;

const BRISTOL_INFO: Record<number, { label: string; good: boolean }> = {
  1: { label: 'Bolinhas duras', good: false },
  2: { label: 'Tipo salsicha dura', good: false },
  3: { label: 'Tipo salsicha com rachaduras', good: true },
  4: { label: 'Lisa, como salsicha', good: true },
  5: { label: 'Pedaços macios', good: true },
  6: { label: 'Pastosa, mole', good: false },
  7: { label: 'Totalmente líquida', good: false },
};

const BRISTOL_COLORS: Record<number, string> = {
  1: '#8B6F47', 2: '#7E6A52', 3: '#9E8466', 4: '#B89773', 5: '#C7A584', 6: '#A8804A', 7: '#7E5A28',
};

const POOP_SIZES = [
  { key: 'small',  emoji: '🔵', label: 'Pequeno' },
  { key: 'medium', emoji: '🟡', label: 'Médio' },
  { key: 'large',  emoji: '🔴', label: 'Grande' },
];

function nowHM() {
  const d = new Date();
  return { h: d.getHours(), m: d.getMinutes() };
}

export default function DiaryEvacScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<Nav>();
  const addEntry = useAppStore(s => s.addEntry);
  const addStars = useAppStore(s => s.addStars);

  const [phase, setPhase] = useState<'form' | 'reward'>('form');
  const [time, setTime] = useState(nowHM());
  const [bristol, setBristol] = useState<1|2|3|4|5|6|7>(4);
  const [poopSize, setPoopSize] = useState('medium');
  const [note, setNote] = useState('');

  function adjustTime(field: 'h' | 'm', delta: number) {
    setTime(prev => {
      if (field === 'h') return { ...prev, h: (prev.h + delta + 24) % 24 };
      return { ...prev, m: (prev.m + delta + 60) % 60 };
    });
  }

  function handleSave() {
    addEntry({
      id: Date.now().toString(),
      type: 'evac',
      createdAt: (() => {
        const d = new Date();
        d.setHours(time.h, time.m, 0, 0);
        return d.toISOString();
      })(),
      bristol,
      poopSize,
      note,
    });
    addStars(5);
    setPhase('reward');
  }

  const bristolGood = BRISTOL_INFO[bristol].good;

  if (phase === 'reward') {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
        <View style={styles.rewardCenter}>
          <PoopBlob size={100} color={BRISTOL_COLORS[bristol]} />
          <Text style={[styles.rewardTitle, { color: theme.text }]}>Mandou bem!</Text>
          <Text style={[styles.rewardSub, { color: theme.muted }]}>
            {bristolGood ? 'Cocô saudável! 🌟' : 'Obrigado por registrar! Beber água ajuda.'}
          </Text>
          <View style={[styles.starsBadge, { backgroundColor: theme.accent + '33' }]}>
            <PlimIcon name="star" size={22} color={theme.accent} />
            <Text style={[styles.starsText, { color: theme.accent }]}>+5 ⭐</Text>
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Registro de Cocô</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Clock */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>Que horas foi?</Text>
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
            <ClockFace hour={time.h} minute={time.m} size={88} color="#B57F4F" />
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

        {/* Bristol scale */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>Tipo de cocô (Escala Bristol)</Text>
          <View style={styles.bristolGrid}>
            {([1, 2, 3, 4, 5, 6, 7] as const).map(t => {
              const sel = bristol === t;
              const good = BRISTOL_INFO[t].good;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setBristol(t)}
                  style={[
                    styles.bristolItem,
                    {
                      backgroundColor: sel ? BRISTOL_COLORS[t] + '22' : theme.softBg,
                      borderColor: sel ? BRISTOL_COLORS[t] : 'transparent',
                      borderWidth: 2,
                    },
                  ]}
                >
                  <BristolGlyph type={t} size={52} />
                  <Text style={[styles.bristolNum, { color: sel ? BRISTOL_COLORS[t] : theme.muted }]}>
                    Tipo {t}
                  </Text>
                  {good && <View style={[styles.goodDot, { backgroundColor: '#5FCB8E' }]} />}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={[styles.bristolInfo, { backgroundColor: bristolGood ? '#5FCB8E22' : '#FF8A7A22' }]}>
            <Text style={[styles.bristolInfoText, { color: bristolGood ? '#3DA070' : '#D45C52' }]}>
              {bristolGood ? '✓ Ótimo! ' : '⚠ '}
              {BRISTOL_INFO[bristol].label}
            </Text>
          </View>
        </View>

        {/* Poop size */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>Quantidade</Text>
          <View style={styles.sizeRow}>
            {POOP_SIZES.map(s => {
              const sel = poopSize === s.key;
              return (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => setPoopSize(s.key)}
                  style={[
                    styles.sizeChip,
                    {
                      backgroundColor: sel ? '#B57F4F22' : theme.softBg,
                      borderColor: sel ? '#B57F4F' : 'transparent',
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Text style={styles.sizeEmoji}>{s.emoji}</Text>
                  <Text style={[styles.sizeLabel, { color: sel ? '#B57F4F' : theme.muted }]}>{s.label}</Text>
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
            placeholder="Ex: sentiu dor, demorou muito..."
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

  section: { borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  sectionLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },

  clockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  clockControls: { alignItems: 'center', gap: spacing.xs },
  arrowBtn: { padding: spacing.xs },
  arrowDown: { transform: [{ rotate: '180deg' }] },
  clockNum: { fontFamily: fontFamily.heading, fontSize: fontSize.xl },

  bristolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  bristolItem: {
    width: '13%',
    minWidth: 62,
    flex: 1,
    alignItems: 'center',
    borderRadius: radius.chip,
    padding: spacing.xs,
    position: 'relative',
  },
  bristolNum: { fontFamily: fontFamily.body, fontSize: 9, textAlign: 'center', marginTop: 2 },
  goodDot: {
    position: 'absolute', top: 4, right: 4,
    width: 8, height: 8, borderRadius: 4,
  },
  bristolInfo: {
    borderRadius: radius.chip, padding: spacing.sm,
    alignItems: 'center',
  },
  bristolInfoText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  sizeRow: { flexDirection: 'row', gap: spacing.sm },
  sizeChip: {
    flex: 1, alignItems: 'center', borderRadius: radius.chip,
    paddingVertical: spacing.sm, gap: spacing.xxs,
  },
  sizeEmoji: { fontSize: 28 },
  sizeLabel: { fontFamily: fontFamily.body, fontSize: fontSize.xs },

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
  rewardTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl, textAlign: 'center' },
  rewardSub: { fontFamily: fontFamily.body, fontSize: fontSize.base, textAlign: 'center' },
  starsBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 24 },
  starsText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl },
  rewardBtnWrap: { width: '100%', marginTop: spacing.md },
});
