import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../../../theme/tokens';
import { fontFamily, fontSize } from '../../../theme/typography';
import { useAppStore , useTheme} from '../../../store/useAppStore';
import { AVATAR_COLORS } from '../../../theme/palettes';
import PlimMascot from '../../../components/mascot/PlimMascot';
import PlimIcon from '../../../components/ui/PlimIcon';

const TOTAL_JUMPS = 15;
const GAME_SECONDS = 30;
const PAD_COUNT = 8;

export default function FrogGame() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const addStars = useAppStore(s => s.addStars);
  const completeMission = useAppStore(s => s.completeMission);
  const profile = useAppStore(s => s.profile);

  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [jumps, setJumps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);

  const jumpsRef = useRef(0);
  const finishedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    jumpsRef.current = 0;
    padIdxRef.current = 0;
    setJumps(0);
    setPadIdx(0);
    frogX.value = 0;
    frogY.value = 0;
    setTimeLeft(GAME_SECONDS);
    setPhase('playing');

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function finishGame() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearInterval(timerRef.current!);
    const stars = Math.round((Math.min(jumpsRef.current, TOTAL_JUMPS) / TOTAL_JUMPS) * 10);
    addStars(stars);
    if (jumpsRef.current >= TOTAL_JUMPS) completeMission('game');
    setPhase('done');
  }

  function handleJump() {
    if (phase !== 'playing') return;

    jumpsRef.current += 1;
    setJumps(jumpsRef.current);

    padIdxRef.current = (padIdxRef.current + 1) % PAD_COUNT;
    const nextPad = padIdxRef.current;
    setPadIdx(nextPad);

    // Jump arc: move right, arc up then land
    const padSpacing = 38;
    cancelAnimation(frogY);
    frogX.value = withSpring(nextPad * padSpacing, { damping: 14, stiffness: 200 });
    frogY.value = withSequence(
      withTiming(-40, { duration: 150 }),
      withSpring(0, { damping: 10, stiffness: 200 }),
    );

    if (jumpsRef.current >= TOTAL_JUMPS) {
      clearInterval(timerRef.current!);
      finishTimerRef.current = setTimeout(() => finishGame(), 400);
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
      cancelAnimation(frogX);
      cancelAnimation(frogY);
    };
  }, []);

  const mascotColor = AVATAR_COLORS[profile?.avatarColor ?? 0];

  if (phase === 'done') {
    const stars = Math.round((Math.min(jumpsRef.current, TOTAL_JUMPS) / TOTAL_JUMPS) * 10);
    return (
      <View style={[styles.root, { backgroundColor: '#0D2B1A', paddingTop: insets.top }]}>
        <View style={styles.center}>
          <PlimMascot size={120} mood="cheer" primary={mascotColor} />
          <Text style={[styles.doneTitle, { color: '#fff' }]}>
            {jumpsRef.current >= TOTAL_JUMPS ? 'Perfeito!' : 'Muito bem!'}
          </Text>
          <Text style={[styles.doneSub, { color: '#aaa' }]}>
            {jumpsRef.current} pulos • {stars} estrelas
          </Text>
          <View style={[styles.starsBadge, { backgroundColor: theme.accent + '33' }]}>
            <PlimIcon name="star" size={22} color={theme.accent} />
            <Text style={[styles.starsText, { color: theme.accent }]}>+{stars} ⭐</Text>
          </View>
          <View style={styles.closeBtnWrap}>
            <View style={[styles.btnShadow, { backgroundColor: theme.primaryDark }]} />
            <Pressable
              style={({ pressed }) => [styles.btn, { backgroundColor: theme.primary, borderColor: theme.primaryDark, borderBottomWidth: pressed ? 2 : 4, transform: [{ translateY: pressed ? 2 : 0 }] }]}
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
        <Pressable onPress={() => { if (timerRef.current) clearInterval(timerRef.current); nav.goBack(); }} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color="#fff" />
        </Pressable>
        <Text style={[styles.gameTitle, { color: '#fff' }]}>Sapo Pulo</Text>
        <View style={[styles.statBadge, { backgroundColor: '#ffffff22' }]}>
          <PlimIcon name="star" size={13} color={theme.accent} />
          <Text style={[styles.statText, { color: '#fff' }]}>{jumps}</Text>
        </View>
      </View>

      {/* Timer bar */}
      {phase === 'playing' && (
        <View style={styles.timerWrap}>
          <View style={[styles.timerBg, { backgroundColor: '#ffffff22' }]}>
            <View style={[styles.timerFill, { backgroundColor: timeLeft > 10 ? theme.primary : theme.coral, width: `${(timeLeft / GAME_SECONDS) * 100}%` as `${number}%` }]} />
          </View>
          <Text style={[styles.timerText, { color: '#fff' }]}>{timeLeft}s</Text>
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

        {/* Frog on first pad */}
        <View style={styles.frogBase}>
          <Animated.View style={frogStyle}>
            <PlimMascot size={64} mood={phase === 'playing' ? 'cheer' : 'happy'} primary={mascotColor} />
          </Animated.View>
        </View>
      </View>

      {/* Instructions */}
      <Text style={[styles.hint, { color: '#ffffff88' }]}>
        {phase === 'idle' ? `Faça o sapo pular ${TOTAL_JUMPS} vezes em ${GAME_SECONDS}s!` : `Pule! ${TOTAL_JUMPS - jumps} pulos restantes`}
      </Text>

      {/* Jump button */}
      <View style={[styles.jumpBtnArea, { paddingBottom: insets.bottom + spacing.lg }]}>
        {phase === 'idle' ? (
          <View style={styles.mainBtnWrap}>
            <View style={[styles.btnShadow, { backgroundColor: theme.primaryDark }]} />
            <Pressable
              style={({ pressed }) => [styles.mainBtn, { backgroundColor: theme.primary, borderColor: theme.primaryDark, borderBottomWidth: pressed ? 2 : 4, transform: [{ translateY: pressed ? 2 : 0 }] }]}
              onPress={startGame}
            >
              <PlimIcon name="play" size={20} color="#fff" />
              <Text style={styles.btnLabel}>Começar</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.jumpBtnWrap}>
            <View style={[styles.jumpBtnShadow, { backgroundColor: '#2D7A52' }]} />
            <Pressable
              style={({ pressed }) => [
                styles.jumpBtn,
                { borderBottomWidth: pressed ? 1 : 5, transform: [{ translateY: pressed ? 4 : 0 }] },
              ]}
              onPress={handleJump}
            >
              <Text style={styles.jumpBtnLabel}>🐸 Pular!</Text>
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
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  gameTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 12 },
  statText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },

  timerWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  timerBg: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  timerFill: { height: 8, borderRadius: 4 },
  timerText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm, width: 28, textAlign: 'right' },

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
    backgroundColor: '#3DA070', borderRadius: 24,
    paddingVertical: spacing.lg + 4, alignItems: 'center', justifyContent: 'center',
    borderColor: '#2D7A52', borderWidth: 0,
  },
  jumpBtnLabel: { fontFamily: fontFamily.bodyBold, fontSize: 32, color: '#fff' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  doneTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  doneSub: { fontFamily: fontFamily.body, fontSize: fontSize.base, textAlign: 'center' },
  starsBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 24 },
  starsText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl },
  closeBtnWrap: { width: '100%', marginTop: spacing.sm, position: 'relative' },
  btn: { borderRadius: 16, paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center', borderWidth: 0 },
});
