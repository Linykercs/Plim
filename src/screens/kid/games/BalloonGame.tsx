import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing, cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Ellipse, Path, Line, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { spacing, radius } from '../../../theme/tokens';
import { fontFamily, fontSize } from '../../../theme/typography';
import { useAppStore , useTheme} from '../../../store/useAppStore';
import PlimIcon from '../../../components/ui/PlimIcon';

const PHASES = [
  { key: 'inspire', label: 'Inspire...', duration: 4000, targetScale: 1.4, color: '#7DC9E8' },
  { key: 'hold',    label: 'Segure!',   duration: 2000, targetScale: 1.4, color: '#5FCB8E' },
  { key: 'expire',  label: 'Expire...', duration: 6000, targetScale: 0.7, color: '#C497F0' },
] as const;

type PhaseKey = typeof PHASES[number]['key'];

const TOTAL_CYCLES = 5;

function BalloonSvg({ color }: { color: string }) {
  return (
    <Svg width={120} height={170} viewBox="0 0 120 170">
      {/* Balloon body */}
      <Ellipse cx={60} cy={68} rx={50} ry={60} fill={color} />
      {/* Shine */}
      <Ellipse cx={42} cy={44} rx={14} ry={18} fill="#ffffff44" />
      {/* Knot */}
      <Path d="M54 128 Q60 136 66 128" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      {/* String */}
      <Path d="M60 136 Q50 150 60 165" fill="none" stroke="#aaa" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export default function BalloonGame() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const addStars = useAppStore(s => s.addStars);
  const completeMission = useAppStore(s => s.completeMission);

  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [done, setDone] = useState(false);

  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0.85);
  const cancelRef = useRef(false);
  const cyclesRef = useRef(0);

  const balloonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (!running) return;
    cancelRef.current = false;
    let idx = 0;

    function runPhase() {
      if (cancelRef.current) return;
      const phase = PHASES[idx];
      setPhaseIdx(idx);
      scale.value = withTiming(phase.targetScale, {
        duration: phase.duration,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(phase.key === 'inspire' ? 0.95 : phase.key === 'hold' ? 1 : 0.75, {
        duration: phase.duration,
        easing: Easing.inOut(Easing.ease),
      });

      setTimeout(() => {
        if (cancelRef.current) return;
        idx = (idx + 1) % PHASES.length;
        if (idx === 0) {
          cyclesRef.current += 1;
          setCycles(cyclesRef.current);
          if (cyclesRef.current >= TOTAL_CYCLES) {
            cancelRef.current = true;
            cancelAnimation(scale);
            cancelAnimation(opacity);
            addStars(5);
            completeMission('game');
            setDone(true);
            setRunning(false);
            return;
          }
        }
        runPhase();
      }, phase.duration);
    }

    runPhase();
    return () => { cancelRef.current = true; };
  }, [running]);

  function handleStart() {
    cyclesRef.current = 0;
    setCycles(0);
    setPhaseIdx(0);
    setRunning(true);
  }

  function handleStop() {
    cancelRef.current = true;
    setRunning(false);
    scale.value = withTiming(0.7, { duration: 600 });
    opacity.value = withTiming(0.85, { duration: 600 });
  }

  const currentPhase = PHASES[phaseIdx];

  if (done) {
    return (
      <View style={[styles.root, { backgroundColor: '#1A1040', paddingTop: insets.top }]}>
        <View style={styles.center}>
          <Text style={styles.doneEmoji}>🎈</Text>
          <Text style={[styles.doneTitle, { color: '#fff' }]}>Arrasou!</Text>
          <Text style={[styles.doneSub, { color: '#bbb' }]}>{TOTAL_CYCLES} ciclos completos de respiração!</Text>
          <View style={[styles.starsBadge, { backgroundColor: theme.accent + '33' }]}>
            <PlimIcon name="star" size={22} color={theme.accent} />
            <Text style={[styles.starsText, { color: theme.accent }]}>+5 ⭐</Text>
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
    <View style={[styles.root, { backgroundColor: '#1A1040' }]}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => { handleStop(); nav.goBack(); }} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color="#fff" />
        </Pressable>
        <Text style={[styles.gameTitle, { color: '#fff' }]}>Balão</Text>
        <View style={[styles.cyclesBadge, { backgroundColor: '#ffffff22' }]}>
          <Text style={[styles.cyclesText, { color: '#fff' }]}>{cycles}/{TOTAL_CYCLES}</Text>
        </View>
      </View>

      {/* Phase label */}
      <Text style={[styles.phaseLabel, { color: running ? currentPhase.color : '#ffffff88' }]}>
        {running ? currentPhase.label : 'Respire junto com o balão'}
      </Text>

      {/* Balloon */}
      <View style={styles.balloonArea}>
        <Animated.View style={balloonStyle}>
          <BalloonSvg color={running ? currentPhase.color : '#7DC9E8'} />
        </Animated.View>
      </View>

      {/* Cycle dots */}
      <View style={styles.dotsRow}>
        {[...Array(TOTAL_CYCLES)].map((_, i) => (
          <View key={i} style={[styles.cycleDot, { backgroundColor: i < cycles ? theme.primary : '#ffffff33' }]} />
        ))}
      </View>

      {/* Phase dots */}
      {running && (
        <View style={styles.phaseDots}>
          {PHASES.map((p, i) => (
            <View key={p.key} style={[styles.phaseDot, { backgroundColor: i === phaseIdx ? currentPhase.color : '#ffffff33' }]} />
          ))}
        </View>
      )}

      {/* Button */}
      <View style={[styles.btnArea, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.mainBtnWrap}>
          <View style={[styles.btnShadow, { backgroundColor: running ? '#A83000' : theme.primaryDark }]} />
          <Pressable
            style={({ pressed }) => [
              styles.mainBtn,
              {
                backgroundColor: running ? theme.coral : theme.primary,
                borderColor: running ? '#A83000' : theme.primaryDark,
                borderBottomWidth: pressed ? 2 : 5,
                transform: [{ translateY: pressed ? 3 : 0 }],
              },
            ]}
            onPress={running ? handleStop : handleStart}
          >
            <PlimIcon name={running ? 'pause' : 'play'} size={24} color="#fff" />
            <Text style={styles.btnLabel}>{running ? 'Pausar' : 'Começar'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  gameTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  cyclesBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 12 },
  cyclesText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },

  phaseLabel: { fontFamily: fontFamily.heading, fontSize: fontSize.xl, textAlign: 'center', marginTop: spacing.md, minHeight: 32 },

  balloonArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  dotsRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.sm },
  cycleDot: { width: 12, height: 12, borderRadius: 6 },

  phaseDots: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.md },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },

  btnArea: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  mainBtnWrap: { position: 'relative' },
  btnShadow: { position: 'absolute', top: 5, left: 0, right: 0, bottom: 0, borderRadius: 20 },
  mainBtn: { borderRadius: 20, paddingVertical: spacing.md + 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 0 },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl, color: '#fff' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  doneEmoji: { fontSize: 72 },
  doneTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  doneSub: { fontFamily: fontFamily.body, fontSize: fontSize.base, textAlign: 'center' },
  starsBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 24 },
  starsText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl },
  closeBtnWrap: { width: '100%', marginTop: spacing.sm, position: 'relative' },
  btn: { borderRadius: 16, paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center', borderWidth: 0 },
});
