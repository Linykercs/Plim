import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { fontFamily, fontSize as fs } from '../../theme/typography';

const SIZE = {
  sm: { ph: 14, pv: 8,  fz: fs.md,   r: 14 },
  md: { ph: 18, pv: 12, fz: fs.base,  r: 18 },
  lg: { ph: 22, pv: 14, fz: fs.lg,    r: 22 },
  xl: { ph: 26, pv: 18, fz: 19,       r: 26 },
} as const;

interface PlimButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  color: string;
  /** Bottom shadow colour — defaults to color at 75% opacity */
  darkColor?: string;
  textColor?: string;
  size?: keyof typeof SIZE;
  style?: ViewStyle;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function PlimButton({
  children,
  onPress,
  color,
  darkColor,
  textColor = '#FFFFFF',
  size = 'lg',
  style,
  disabled = false,
  fullWidth = false,
}: PlimButtonProps) {
  const cfg = SIZE[size];
  // Approximate the hex shadow: same colour slightly darker (append BB = ~73% opacity)
  const shadow = darkColor ?? color + 'BB';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: color,
          borderRadius: cfg.r,
          paddingHorizontal: cfg.ph,
          paddingVertical: cfg.pv,
          borderBottomWidth: pressed ? 2 : 4,
          borderBottomColor: shadow,
          transform: [{ translateY: pressed ? 2 : 0 }],
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? ('stretch' as const) : ('auto' as const),
        },
        style,
      ]}
    >
      {({ pressed: _ }) => (
        typeof children === 'string' ? (
          <Text style={[styles.label, { fontSize: cfg.fz, color: textColor }]}>
            {children}
          </Text>
        ) : (
          <View style={styles.row}>{children}</View>
        )
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    // cancel left/right/top border so only bottom shows
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  label: {
    fontFamily: fontFamily.bodyBold,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
