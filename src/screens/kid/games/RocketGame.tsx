import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing,
} from 'react-native-reanimated';
import Svg, { Ellipse, Rect, Circle, Polygon, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { spacing, radius } from '../../../theme/tokens';
import { fontFamily, fontSize } from '../../../theme/typography';
import { useAppStore , useTheme} from '../../../store/useAppStore';
import PlimIcon from '../../../components/ui/PlimIcon';

const TOTAL_REPS = 8;
const HOLD_MS = 3000;

function RocketSvg({ flameOn }: { flameOn: boolean }) {
  return (
    <Svg width={80} height={160} viewBox="0 0 80 160">
      {/* Body */}
      <Rect x={25} y={40} width={30} height={80} rx={4} fill="#E8E8F0" />
      {/* Nose */}
      <Polygon points="40,8 25,40 55,40" fill="#FF8A7A" />
      {/* Window */}
      <Circle cx={40} cy={70} r={10} fill="#7DC9E8" />
      <Circle cx={40} cy={70} r={7} fill="#B8E4F7" />
      {/* Fins */}
      <Polygon points="25,100 10,120 25,120" fill="#FF8A7A" />
      <Polygon points="55,100 70,120 55,120" fill="#FF8A7A" />
      {/* Flame */}
      {flameOn && (
        <>
          <Ellipse cx={40} cy={128} rx={10} ry={14} fill="#FFCE5C" />
          <Ellipse cx={40} cy={134} rx={6} ry={10} fill="#FF8A7A" />
        </>
      )}
    </Svg>
  );
}

export default function RocketGame() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const addStars = useAppStore(s => s.addStars);
  const completeMission = useAppStore(s => s.completeMission);

  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [reps, setReps] = useState(0);
  const [holding, setHolding] = useState(false);
  const [flash, setFlash] = useState(false);

  const rocketY = useSharedValue(0);
  const holdProgress = useSharedValue(0);
  const holdStart = useRef<number>(0);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const repsRef = useRef(0);

  const rocketStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rocketY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${holdProgress.value * 100}%` as `${number}%`,
  }));

  const onPressIn = useCallback(() => {
    if (phase === 'done') return;
    if (phase === 'idle') setPhase('playing');
    setHolding(true);
    holdStart.current = Date.now();
    rocketY.value = withSpring(-160, { damping: 12, stiffness: 60 });
    holdProgress.value = withTiming(1, { duration: HOLD_MS, easing: Easing.linear });

    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - holdStart.current;
      if (elapsed >= HOLD_MS) {
        clearInterval(holdTimer.current!);
        repsRef.current += 1;
        setReps(repsRef.current);
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
        if (repsRef.current >= TOTAL_REPS) {
          addStars(8);
          completeMission('game');
          setPhase('done');
        }
        holdProgress.value = 0;
      }
    }, 100);
  }, [phase]);

  const onPressOut = useCallback(() => {
    setHolding(false);
    if (holdTimer.current) clearInterval(holdTimer.current);
    rocketY.value = withSpring(0, { damping: 10, stiffness: 80 });
    holdProgress.value = withTiming(0, { duration: 300 });
  }, []);

  if (phase === 'done') {
    return (
      <View style={[styles.root, { backgroundColor: '#0A0E2E', paddingTop: insets.top }]}>
        <View style={styles.center}>
          <Text style={styles.doneEmoji}>🚀</Text>
          <Text style={[styles.doneTitle, { color: '#fff' }]}>Missão completa!</Text>
          <Text style={[styles.doneSub, { color: '#aaa' }]}>{TOTAL_REPS} contrações longas feitas!</Text>
          <View style={[styles.starsBadge, { backgroundColor: theme.accent + '33' }]}>
            <PlimIcon name="star" size={22} color={theme.accent} />
            <Text style={[styles.starsText, { color: theme.accent }]}>+8 ⭐</Text>
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
    <View style={[styles.root, { backgroundColor: '#0A0E2E' }]}>
      {/* Back */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => nav.goBack()} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color="#fff" />
        </Pressable>
        <Text style={[styles.gameTitle, { color: '#fff' }]}>Foguete</Text>
        <View style={[styles.repsBadge, { backgroundColor: theme.primary + '33' }]}>
          <Text style={[styles.repsText, { color: theme.primary }]}>{reps}/{TOTAL_REPS}</Text>
        </View>
      </View>

      {/* Stars */}
      {[...Array(3)].map((_, i) => (
        <View key={i} style={[styles.star, { top: 60 + i * 80, left: 20 + (i % 2) * 200 }]}>
          <Text style={{ color: '#fff', fontSize: 10, opacity: 0.4 }}>✦</Text>
        </View>
      ))}

      {/* Rocket */}
      <View style={styles.rocketArea}>
        <Animated.View style={[rocketStyle, flash && { opacity: 0.4 }]}>
          <RocketSvg flameOn={holding} />
        </Animated.View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBg, { backgroundColor: '#ffffff22' }]}>
        <Animated.View style={[styles.progressFill, { backgroundColor: '#FFCE5C' }, progressStyle]} />
      </View>
      <Text style={[styles.hint, { color: '#ffffffAA' }]}>
        {phase === 'idle' ? 'Segure o botão para lançar!' : holding ? 'Segurando... não solte!' : 'Segure novamente!'}
      </Text>

      {/* Hold button */}
      <View style={[styles.holdBtnArea, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={({ pressed }) => [
            styles.holdBtn,
            {
              backgroundColor: holding ? theme.coral : theme.primary,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <PlimIcon name="rocket" size={32} color="#fff" />
          <Text style={styles.holdBtnLabel}>Segurar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  gameTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  repsBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 12 },
  repsText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },

  star: { position: 'absolute' },

  rocketArea: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: spacing.xl },

  progressBg: { marginHorizontal: spacing.lg, height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  hint: { fontFamily: fontFamily.body, fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm },

  holdBtnArea: { alignItems: 'center', paddingTop: spacing.lg },
  holdBtn: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
  },
  holdBtnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xs, color: '#fff' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  doneEmoji: { fontSize: 72 },
  doneTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  doneSub: { fontFamily: fontFamily.body, fontSize: fontSize.base, textAlign: 'center' },
  starsBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 24 },
  starsText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl },
  closeBtnWrap: { width: '100%', marginTop: spacing.sm, position: 'relative' },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  btn: { borderRadius: 16, paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center', borderWidth: 0 },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.lg, color: '#fff' },
});
