import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { defaultPalette } from '../../theme/palettes';
import { fontFamily, fontSize } from '../../theme/typography';

export default function StoreScreen() {
  const theme = defaultPalette;
  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <Text style={styles.emoji}>⭐</Text>
      <Text style={[styles.label, { color: theme.text }]}>Lojinha</Text>
      <Text style={[styles.sub, { color: theme.muted }]}>Troque estrelas por prêmios reais — em breve!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emoji: { fontSize: 56 },
  label: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  sub:   { fontFamily: fontFamily.body, fontSize: fontSize.base, textAlign: 'center', paddingHorizontal: 32 },
});
