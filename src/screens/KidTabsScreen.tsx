import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { defaultPalette } from '../theme/palettes';
import { fontFamily, fontSize } from '../theme/typography';
import { useTheme } from '../store/useAppStore';

// Placeholder — será substituído pelo bottom-tab navigator da criança
export default function KidTabsScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <Text style={[styles.emoji]}>🐸</Text>
      <Text style={[styles.label, { color: theme.text }]}>Área da Criança</Text>
      <Text style={[styles.sub, { color: theme.muted }]}>Home, Diário, Jogos... em breve!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emoji: { fontSize: 64 },
  label: { fontFamily: fontFamily.heading,  fontSize: fontSize.xxl },
  sub:   { fontFamily: fontFamily.body,     fontSize: fontSize.base, textAlign: 'center', paddingHorizontal: 32 },
});
