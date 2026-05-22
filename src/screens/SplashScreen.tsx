import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PlimLogo from '../components/mascot/PlimLogo';
import { fontFamily, fontSize } from '../theme/typography';
import { useAppStore , useTheme} from '../store/useAppStore';
import type { RootStackParamList } from '../navigation/types';

const { width, height } = Dimensions.get('window');

interface BubbleConfig {
  x: number;
  y: number;
  s: number;
  delay: number;
}

const BUBBLES: BubbleConfig[] = [
  { x: 0.08, y: 0.12, s: 28, delay: 0 },
  { x: 0.82, y: 0.19, s: 18, delay: 300 },
  { x: 0.12, y: 0.75, s: 36, delay: 600 },
  { x: 0.78, y: 0.70, s: 22, delay: 900 },
  { x: 0.50, y: 0.82, s: 14, delay: 1200 },
];

function FloatingBubble({ config }: { config: BubbleConfig }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bubble,
        animStyle,
        {
          left: config.x * width,
          top: config.y * height,
          width: config.s,
          height: config.s,
          borderRadius: config.s / 2,
        },
      ]}
    />
  );
}

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
}

export default function SplashScreen({ navigation }: Props) {
  const theme = useTheme();
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);

  const logoScale = useSharedValue(0.4);
  const logoTranslateY = useSharedValue(40);
  const logoOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo entrance — spring with overshoot (mimics cubic-bezier .34,1.56,.64,1)
    logoScale.value = withSpring(1, { damping: 8, stiffness: 110, mass: 0.7 });
    logoTranslateY.value = withSpring(0, { damping: 8, stiffness: 110, mass: 0.7 });
    logoOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });

    // Tagline fades in 300ms later
    taglineOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
    );

    // Auto-navigate after 2400ms — Onboarding on first launch, ProfileSelect after
    const timer = setTimeout(() => {
      navigation.replace(hasOnboarded ? 'ProfileSelect' : 'Onboarding');
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value },
    ],
  }));

  const taglineAnimStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[theme.primary, theme.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* floating bubbles */}
      {BUBBLES.map((b, i) => (
        <FloatingBubble key={i} config={b} />
      ))}

      {/* logo */}
      <Animated.View style={[styles.logoWrapper, logoAnimStyle]}>
        <PlimLogo
          variant="A"
          size={92}
          primary="#FFF7EC"
          accent={theme.accent}
          textColor="#FFFFFF"
        />
      </Animated.View>

      {/* tagline */}
      <Animated.View style={[styles.taglineWrapper, taglineAnimStyle]}>
        <Text style={styles.tagline}>
          {'brincar, treinar, melhorar —\nseu xixi e cocô em paz'}
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  taglineWrapper: {
    paddingHorizontal: 24,
  },
  tagline: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.lg,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    lineHeight: 26,
  },
});
