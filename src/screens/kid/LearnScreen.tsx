import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSequence,
  withRepeat, Easing, cancelAnimation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import PlimIcon from '../../components/ui/PlimIcon';
import { useTheme } from '../../store/useAppStore';

// ─── Content ──────────────────────────────────────────────────

type Category = 'postura' | 'relaxamento' | 'hidratacao';

const CATEGORIES: { key: Category; label: string; emoji: string; color: string }[] = [
  { key: 'postura',     label: 'Postura',     emoji: '🪑', color: '#C497F0' },
  { key: 'relaxamento', label: 'Relaxamento', emoji: '🌬️',  color: '#7DC9E8' },
  { key: 'hidratacao',  label: 'Hidratação',  emoji: '💧', color: '#5FCB8E' },
];

interface TipCard {
  icon: string;
  title: string;
  body: string;
}

const CONTENT: Record<Category, TipCard[]> = {
  postura: [
    {
      icon: '🦵',
      title: 'Pés apoiados',
      body: 'Coloque os pés no chão ou num banquinho. Os joelhos devem ficar um pouquinho acima dos quadris — assim o corpo relaxa mais fácil!',
    },
    {
      icon: '🏋️',
      title: 'Inclina pra frente',
      body: 'Incline o corpo levemente para a frente e apoie os cotovelos nos joelhos. Essa posição abre bem o caminho do xixi e do cocô.',
    },
    {
      icon: '🫁',
      title: 'Barriga solta',
      body: 'Durante o xixi, relaxe a barriga como se fosse um balão murcho. Não force — deixa sair sozinho!',
    },
    {
      icon: '⏱️',
      title: 'Sem pressa',
      body: 'Fica no banheiro pelo menos 5 minutinhos. O corpo precisa de tempo para relaxar de verdade.',
    },
  ],
  relaxamento: [
    {
      icon: '🫧',
      title: 'Respira com a barriga',
      body: 'Coloca uma mão na barriga. Quando inspirar, a barriga deve crescer — não o peito. Tente fazer isso toda vez no banheiro.',
    },
    {
      icon: '🐢',
      title: 'Devagar é mais rápido',
      body: 'Quanto mais devagar e calmo você fica, mais o músculo do xixi relaxa. Funciona de verdade!',
    },
    {
      icon: '🎈',
      title: 'Imagine um balão',
      body: 'Imagine que sua barriga é um balão. Inspire enchendo o balão... solte devagar esvaziando. Repita 3 vezes.',
    },
  ],
  hidratacao: [
    {
      icon: '🥤',
      title: 'Quantos copos?',
      body: 'Crianças de 4 a 10 anos precisam de 6 a 8 copos de água por dia — cerca de 1,2 a 1,5 litros. Distribua ao longo do dia!',
    },
    {
      icon: '🕐',
      title: 'Beber de pouquinho',
      body: 'Beber tudo de uma vez não funciona. Tome um copinho a cada 1–2 horas. Os alarmes do Diário ajudam com isso!',
    },
    {
      icon: '🚫',
      title: 'Evitar',
      body: 'Refrigerantes, suco de laranja e limão irritam a bexiga e podem piorar o xixi. Prefira água, água de coco ou chá sem cafeína.',
    },
    {
      icon: '🟡',
      title: 'Cor do xixi',
      body: 'Xixi amarelo clarinho = hidratado! Xixi escuro = beba mais água agora. Use a escala de cores no Diário para acompanhar.',
    },
  ],
};

// ─── Breathing exercise ───────────────────────────────────────

const PHASES = [
  { label: 'Inspire',  duration: 4000, scale: 1.4 },
  { label: 'Segura',   duration: 2000, scale: 1.4 },
  { label: 'Expire',   duration: 6000, scale: 1.0 },
];

const MAX_BREATH_CYCLES = 3;

function BreathingExercise() {
  const theme = useTheme();
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [finished, setFinished] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    let idx = 0;
    let cycles = 0;

    function tick() {
      if (cancelled) return;
      const phase = PHASES[idx];
      setPhaseIdx(idx);
      scale.value = withTiming(phase.scale, { duration: phase.duration, easing: Easing.inOut(Easing.ease) });
      opacity.value = withTiming(phase.scale === 1.4 ? 0.9 : 0.5, { duration: phase.duration, easing: Easing.inOut(Easing.ease) });

      const nextIdx = (idx + 1) % PHASES.length;
      // Count a cycle when we wrap around (finish the 'expire' phase)
      if (nextIdx === 0) cycles += 1;

      setTimeout(() => {
        if (cancelled) return;
        if (nextIdx === 0 && cycles >= MAX_BREATH_CYCLES) {
          // Done — stop after the last expire
          setRunning(false);
          setFinished(true);
          scale.value = withTiming(1, { duration: 800 });
          opacity.value = withTiming(0.5, { duration: 800 });
          setCompletedCycles(cycles);
          return;
        }
        idx = nextIdx;
        tick();
      }, phase.duration);
    }

    tick();
    return () => { cancelled = true; };
  }, [running]);

  function start() {
    setFinished(false);
    setCompletedCycles(0);
    setPhaseIdx(0);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
    cancelAnimation(scale);
    cancelAnimation(opacity);
    scale.value = withTiming(1, { duration: 600 });
    opacity.value = withTiming(0.5, { duration: 600 });
    setPhaseIdx(0);
  }

  const currentPhase = PHASES[phaseIdx];

  return (
    <View style={[breathStyles.card, { backgroundColor: theme.surface, ...shadow.card }]}>
      <Text style={[breathStyles.title, { color: theme.text }]}>Exercício de respiração</Text>
      <Text style={[breathStyles.sub, { color: theme.muted }]}>
        {finished ? `✓ ${MAX_BREATH_CYCLES} vezes completado!` : running ? currentPhase.label : 'Toque para começar'}
      </Text>

      <View style={breathStyles.circleWrap}>
        <Animated.View style={[breathStyles.outerCircle, { borderColor: (finished ? '#5FCB8E' : theme.secondary) + '55' }, animStyle]} />
        <View style={[breathStyles.innerCircle, { backgroundColor: finished ? '#5FCB8E' : theme.secondary }]}>
          <Text style={breathStyles.breathEmoji}>{finished ? '✓' : '🌬️'}</Text>
        </View>
      </View>

      {running && (
        <View style={breathStyles.countRow}>
          {PHASES.map((p, i) => (
            <View key={p.label} style={[breathStyles.countDot, { backgroundColor: i === phaseIdx ? theme.secondary : theme.softBg2 }]} />
          ))}
        </View>
      )}

      {!finished && (
        <View style={breathStyles.btnWrap}>
          <View style={[breathStyles.btnShadow, { backgroundColor: running ? theme.coral + 'AA' : theme.primaryDark }]} />
          <Pressable
            onPress={running ? stop : start}
            style={({ pressed }) => [
              breathStyles.btn,
              {
                backgroundColor: running ? theme.coral : theme.primary,
                borderColor: running ? theme.coral + 'AA' : theme.primaryDark,
                borderBottomWidth: pressed ? 2 : 4,
                transform: [{ translateY: pressed ? 2 : 0 }],
              },
            ]}
          >
            <PlimIcon name={running ? 'pause' : 'play'} size={18} color="#fff" />
            <Text style={breathStyles.btnLabel}>{running ? 'Parar' : 'Começar'}</Text>
          </Pressable>
        </View>
      )}

      {finished && (
        <View style={breathStyles.btnWrap}>
          <View style={[breathStyles.btnShadow, { backgroundColor: '#2D7A52' }]} />
          <Pressable
            onPress={start}
            style={({ pressed }) => [
              breathStyles.btn,
              { backgroundColor: '#5FCB8E', borderColor: '#2D7A52', borderBottomWidth: pressed ? 2 : 4, transform: [{ translateY: pressed ? 2 : 0 }] },
            ]}
          >
            <PlimIcon name="play" size={18} color="#fff" />
            <Text style={breathStyles.btnLabel}>Repetir</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────

export default function LearnScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<Category>('postura');
  const activeCat = CATEGORIES.find(c => c.key === active)!;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Aprender</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Dicas para um xixi saudável</Text>
      </View>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {CATEGORIES.map(cat => {
          const sel = active === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setActive(cat.key)}
              style={[
                styles.tab,
                {
                  backgroundColor: sel ? cat.color + '22' : theme.softBg,
                  borderColor: sel ? cat.color : 'transparent',
                  borderWidth: 2,
                },
              ]}
            >
              <Text style={styles.tabEmoji}>{cat.emoji}</Text>
              <Text style={[styles.tabLabel, { color: sel ? cat.color : theme.muted }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Breathing exercise — only in Relaxamento */}
        {active === 'relaxamento' && <BreathingExercise />}

        {/* Tip cards */}
        {CONTENT[active].map((tip, i) => (
          <View key={i} style={[styles.tipCard, { backgroundColor: theme.surface, ...shadow.card }]}>
            <View style={[styles.tipIconBox, { backgroundColor: activeCat.color + '22' }]}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipTitle, { color: theme.text }]}>{tip.title}</Text>
              <Text style={[styles.tipBody, { color: theme.muted }]}>{tip.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  subtitle: { fontFamily: fontFamily.body, fontSize: fontSize.sm, marginTop: 2 },

  tabs: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  tabEmoji: { fontSize: 18 },
  tabLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  scroll: { paddingHorizontal: spacing.md, gap: spacing.sm },

  tipCard: {
    borderRadius: radius.card, padding: spacing.md,
    flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start',
  },
  tipIconBox: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  tipIcon: { fontSize: 26 },
  tipTitle: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base, marginBottom: 4 },
  tipBody: { fontFamily: fontFamily.body, fontSize: fontSize.sm, lineHeight: 20 },
});

const breathStyles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  sub: { fontFamily: fontFamily.body, fontSize: fontSize.base },

  circleWrap: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.md },
  outerCircle: {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 3,
  },
  innerCircle: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: 'center', justifyContent: 'center',
  },
  breathEmoji: { fontSize: 36 },

  countRow: { flexDirection: 'row', gap: spacing.sm },
  countDot: { width: 10, height: 10, borderRadius: 5 },

  btnWrap: { width: '100%', position: 'relative' },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  btn: {
    borderRadius: 16, paddingVertical: spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    borderWidth: 0,
  },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.lg, color: '#fff' },
});
