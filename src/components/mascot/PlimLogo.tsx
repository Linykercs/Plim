import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PlimMascot from './PlimMascot';
import { fontFamily } from '../../theme/typography';

export type LogoVariant = 'A' | 'B' | 'C' | 'D';

interface PlimLogoProps {
  variant?: LogoVariant;
  primary?: string;
  accent?: string;
  textColor?: string;
  size?: number;
}

export default function PlimLogo({
  variant = 'A',
  primary = '#5FCB8E',
  accent = '#FF8A7A',
  textColor = '#1F3A4D',
  size = 80,
}: PlimLogoProps) {
  const wordmarkStyle = {
    fontFamily: fontFamily.heading,
    fontSize: size * 0.85,
    color: textColor,
    letterSpacing: -1.5,
    lineHeight: size * 0.9,
  };

  if (variant === 'A') {
    return (
      <View style={styles.row}>
        <PlimMascot size={size} mood="happy" primary={primary} accent={accent} dark={textColor} />
        <View style={{ marginLeft: size * 0.12 }}>
          <Text style={wordmarkStyle}>
            {'plim'}
            <Text style={{ color: primary }}>{'.'}</Text>
          </Text>
        </View>
      </View>
    );
  }

  if (variant === 'B') {
    const badgeW = size * 1.1;
    const badgeH = size * 1.3;
    return (
      <View style={styles.col}>
        <View style={{ width: badgeW, height: badgeH }}>
          <Svg width={badgeW} height={badgeH} viewBox="0 0 110 130" style={StyleSheet.absoluteFill}>
            <Path
              d="M 55 5 C 78 35 100 55 100 80 A 45 45 0 1 1 10 80 C 10 55 32 35 55 5 Z"
              fill={primary}
            />
          </Svg>
          <View style={[StyleSheet.absoluteFill, styles.badgeInner]}>
            <PlimMascot size={size * 0.72} mood="happy" primary="#FFF7EC" accent={accent} dark={textColor} />
          </View>
        </View>
        <Text style={[wordmarkStyle, { fontSize: size * 0.5, letterSpacing: -0.5, marginTop: size * 0.08 }]}>
          {'plim'}
        </Text>
      </View>
    );
  }

  if (variant === 'C') {
    const dotSize = size * 0.18;
    return (
      <View style={styles.row}>
        <Text style={wordmarkStyle}>{'pl'}</Text>
        <View style={{ position: 'relative' }}>
          <Text style={wordmarkStyle}>{'i'}</Text>
          <View
            style={{
              position: 'absolute',
              top: -(dotSize * 0.5),
              left: '50%',
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: primary,
              transform: [{ translateX: -(dotSize / 2) }],
            }}
          />
        </View>
        <Text style={wordmarkStyle}>
          {'m'}
          <Text style={{ color: primary }}>{'.'}</Text>
        </Text>
      </View>
    );
  }

  // Variant D — frog peeking out
  return (
    <View style={styles.row}>
      <View style={{ width: size, height: size * 0.65, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -(size * 0.35) }}>
          <PlimMascot size={size} mood="splash" primary={primary} accent={accent} dark={textColor} />
        </View>
      </View>
      <Text style={[wordmarkStyle, { marginLeft: size * 0.08 }]}>
        {'plim'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    alignItems: 'center',
  },
  badgeInner: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
});
