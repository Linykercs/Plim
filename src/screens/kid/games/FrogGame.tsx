import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSequence, withTiming,
  Easing, cancelAnimation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { spacing } from '../../../theme/tokens';
import { fontFamily, fontSize } from '../../../theme/typography';
import { useAppStore , useTheme} from '../../../store/useAppStore';
import { AVATAR_COLORS } from '../../../theme/palettes';
import { FROG_PROTOCOL } from '../../../content/difficulty';
import PlimMascot from '../../../components/mascot/PlimMascot';
import PlimIcon from '../../../components/ui/PlimIcon';

// Protocolo validado pela equipe de uroterapia: 10 contrações rápidas
// consecutivas (1 pulo = 1 contração), 30s de intervalo, 3 séries.

const PAD_COUNT = 8;
const JUMPS = FROG_PROTOCOL.jumpsPerSeries;
const SERIES = FROG_PROTOCOL.series;
const REST_SECONDS = FROG_PROTOCOL.restSeconds;
const TOTAL_JUMPS = JUMPS * SERIES;

export default function FrogGame() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const nav = useNavigation();
  const addStars = useAppStore(s => s.addStars);
  const completeMission = useAppStore(s => s.completeMission);
  const profile = useAppStore(s => s.profile);

  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [serie, setSerie] = useState(1);
  const [jumps, setJumps] = useState(0);
  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(0);

  const totalJumpsRef = useRef(0);
  const earnedRef = useRef(0);
  const finishedRef = useRef(false);
  const restTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Frog position: which pad (0 = leftmost)
  const [padIdx, setPadIdx] = useState(0);
  const padIdxRef = useRef(0);
  const frogX = useSharedValue(0);
  const frogY = useSharedValue(0);

  const frogStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: frogX.value },
      { translateY: frogY.value },
    ],
  }));

  function startGame() {
    finishedRef.current = false;
    totalJumpsRef.current = 0;
    earnedRef.current = 0;
    padIdxRef.current = 0;
    setSerie(1);
    setJumps(0);
    setPadIdx(0);
    setResting(false);
    frogX.value = 0;
    frogY.value = 0;
    setPhase('playing');
  }

  function finishGame() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    // Tentar sempre rende pelo menos 1 estrela; recompensa cheia só na
    // primeira conclusão do dia, para repetir não virar farm
    const base = Math.max(1, Math.round((Math.min(totalJumpsRef.current, TOTAL_JUMPS) / TOTAL_JUMPS) * 10));
    const reward = useAppStore.getState().missionsDone.game ? 1 : base;
    earnedRef.current = reward;
    addStars(reward);
    if (totalJumpsRef.current >= TOTAL_JUMPS) completeMission('game');
    setPhase('done');
  }

  function startRest() {
    setResting(true);
    setRestLeft(REST_SECONDS);
    // O sapo volta pra primeira vitória-régia durante o descanso
    padIdxRef.current = 0;
    setPadIdx(0);
    frogX.value = withTiming(0, { duration: 600, easing: Easing.inOut(Easing.quad) });
    restTimerRef.current = setInterval(() => {
      setRestLeft(prev => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current!);
          setResting(false);
          setSerie(s => s + 1);
          setJumps(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleJump() {
    if (phase !== 'playing' || resting) return;

    totalJumpsRef.current += 1;
    const jumpsInSerie = jumps + 1;
    setJumps(jumpsInSerie);

    padIdxRef.current = (padIdxRef.current + 1) % PAD_COUNT;
    const nextPad = padIdxRef.current;
    setPadIdx(nextPad);

    // Jump arc: move right, arc up then land
    const padSpacing = 38;
    cancelAnimation(frogY);
    frogX.value = withTiming(nextPad * padSpacing, { duration: 200, easing: Easing.out(Easing.quad) });
    frogY.value = withSequence(
      withTiming(-44, { duration: 140, easing: Easing.out(Easing.quad) }),
      withTiming(0,   { duration: 180, easing: Easing.in(Easing.quad) }),
    );

    if (jumpsInSerie >= JUMPS) {
      if (serie >= SERIES) {
        finishTimerRef.current = setTimeout(() => finishGame(), 400);
      } else {
        startRest();
      }
    }
  }

  function handleBack() {
    // Sair no meio do treino ainda conta o esforço (nunca zero)
    if (phase === 'playing' && totalJumpsRef.current > 0) {
      finishGame();
      return;
    }
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    nav.goBack();
  }

  useEffect(() => {
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      cancelAnimation(frogX);
      cancelAnimation(frogY);
    };
  }, []);

  const mascotColor = AVATAR_COLORS[profile?.avatarColor ?? 0];

  if (phase === 'done') {
    const stars = earnedRef.current;
    return (
      <View style={[styles.root, { backgroundColor: '#0D2B1A', paddingTop: insets.top }]}>
        <View style={styles.center}>
          <PlimMascot size={120} mood="cheer" primary={mascotColor} />
          <Text style={[styles.doneTitle, { color: '#fff' }]}>
            {totalJumpsRef.current >= TOTAL_JUMPS ? 'Treino completo!' : 'Muito bem!'}
          </Text>
          <Text style={[styles.doneSub, { color: '#aaa' }]}>
            {totalJumpsRef.current >= TOTAL_JUMPS
              ? `${SERIES} séries de ${JUMPS} pulos rapidinhos!`
              : `${totalJumpsRef.current} pulos! Da próxima a gente completa as ${SERIES} séries.`}
          </Text>
          <View style={[styles.starsBadge, { backgroundColor: theme.accent + '33' }]}>
            <PlimIcon name="star" size={22} color={theme.accent} />
            <Text style={[styles.starsText, { color: theme.accent }]}>+{stars} ⭐</Text>
          </View>
          <View style={styles.closeBtnWrap}>
            <View style={[styles.btnShadow, { backgroundColor: theme.btnDark }]} />
            <Pressable
              style={({ pressed }) => [styles.btn, { backgroundColor: theme.btn, borderColor: theme.btnDark, borderBottomWidth: pressed ? 2 : 4, transform: [{ translateY: pressed ? 2 : 0 }] }]}
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
    <View style={[styles.root, { backgroundColor: '#0D2B1A' }]}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color="#fff" />
        </Pressable>
        <Text style={[styles.gameTitle, { color: '#fff' }]}>Pulo do Sapo</Text>
        <View style={[styles.statBadge, { backgroundColor: '#ffffff22' }]}>
          <Text style={[styles.statText, { color: '#fff' }]}>
            {phase === 'playing' ? `Série ${serie}/${SERIES}` : `${SERIES}x${JUMPS}`}
          </Text>
        </View>
      </View>

      {/* Série progress */}
      {phase === 'playing' && (
        <View style={styles.serieWrap}>
          {[...Array(JUMPS)].map((_, i) => (
            <View key={i} style={[styles.serieDot, { backgroundColor: i < jumps ? theme.accent : '#ffffff33' }]} />
          ))}
        </View>
      )}

      {/* Game area */}
      <View style={styles.gameArea}>
        {/* Water */}
        <View style={[styles.water, { backgroundColor: '#1A4D6E' }]} />

        {/* Lily pads */}
        <View style={styles.padsRow}>
          {[...Array(PAD_COUNT)].map((_, i) => (
            <View key={i} style={[styles.pad, { backgroundColor: i === padIdx ? '#3DA070' : '#2D7A52', opacity: i <= padIdx ? 1 : 0.5 }]} />
          ))}
        </View>

        {/* Frog */}
        <View style={styles.frogBase}>
          <Animated.View style={frogStyle}>
            <PlimMascot size={64} mood={resting ? 'sleepy' : phase === 'playing' ? 'focus' : 'happy'} primary={mascotColor} />
          </Animated.View>
        </View>
      </View>

      {/* Instructions */}
      <Text style={[styles.hint, { color: '#ffffff88' }]}>
        {phase === 'idle'
          ? `${SERIES} séries de ${JUMPS} pulos rapidinhos, com descanso entre elas!`
          : resting
            ? `Descansa... ${restLeft}s pra série ${serie + 1}`
            : `Pula! Faltam ${JUMPS - jumps} na série ${serie}`}
      </Text>

      {/* Jump button */}
      <View style={[styles.jumpBtnArea, { paddingBottom: tabBarHeight + spacing.md }]}>
        {phase === 'idle' ? (
          <View style={styles.mainBtnWrap}>
            <View style={[styles.btnShadow, { backgroundColor: theme.btnDark }]} />
            <Pressable
              style={({ pressed }) => [styles.mainBtn, { backgroundColor: theme.btn, borderColor: theme.btnDark, borderBottomWidth: pressed ? 2 : 4, transform: [{ translateY: pressed ? 2 : 0 }] }]}
              onPress={startGame}
            >
              <PlimIcon name="play" size={20} color="#fff" />
              <Text style={styles.btnLabel}>Começar</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.jumpBtnWrap}>
            <View style={[styles.jumpBtnShadow, { backgroundColor: theme.btnDark }]} />
            <Pressable
              style={({ pressed }) => [
                styles.jumpBtn,
                {
                  backgroundColor: theme.btn,
                  borderColor: theme.btnDark,
                  opacity: resting ? 0.5 : 1,
                  borderBottomWidth: pressed && !resting ? 1 : 5,
                  transform: [{ translateY: pressed && !resting ? 4 : 0 }],
                },
              ]}
              onPress={handleJump}
            >
              <Text style={styles.jumpBtnLabel}>{resting ? '😴 Descansa...' : '🐸 Pular!'}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  gameTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 12 },
  statText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  serieWrap: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: spacing.sm },
  serieDot: { width: 12, height: 12, borderRadius: 6 },

  gameArea: { flex: 1, position: 'relative', justifyContent: 'flex-end' },
  water: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  padsRow: { flexDirection: 'row', gap: 6, paddingHorizontal: spacing.md, marginBottom: 28, alignItems: 'flex-end' },
  pad: { width: 32, height: 14, borderRadius: 16 },
  frogBase: {
    position: 'absolute', bottom: 32, left: spacing.md,
    flexDirection: 'row',
  },

  hint: { fontFamily: fontFamily.body, fontSize: fontSize.sm, textAlign: 'center', marginVertical: spacing.sm, paddingHorizontal: spacing.lg },

  jumpBtnArea: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs },
  mainBtnWrap: { position: 'relative' },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  mainBtn: { borderRadius: 16, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderWidth: 0 },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.lg, color: '#fff' },

  jumpBtnWrap: { position: 'relative' },
  jumpBtnShadow: { position: 'absolute', top: 5, left: 0, right: 0, bottom: 0, borderRadius: 24 },
  jumpBtn: {
    borderRadius: 24,
    paddingVertical: spacing.lg + 4, alignItems: 'center', justifyContent: 'center',
    borderWidth: 0,
  },
  jumpBtnLabel: { fontFamily: fontFamily.bodyBold, fontSize: 32, color: '#fff' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  doneTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  doneSub: { fontFamily: fontFamily.body, fontSize: fontSize.base, textAlign: 'center', lineHeight: 22 },
  starsBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 24 },
  starsText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl },
  closeBtnWrap: { width: '100%', marginTop: spacing.sm, position: 'relative' },
  btn: { borderRadius: 16, paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center', borderWidth: 0 },
});
