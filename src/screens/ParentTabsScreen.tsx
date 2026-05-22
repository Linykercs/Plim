import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontFamily, fontSize } from '../theme/typography';
import { useTheme } from '../store/useAppStore';

// Placeholder — será substituído pelo bottom-tab navigator dos pais
export default function ParentTabsScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <Text style={[styles.emoji]}>👨‍👩‍👧</Text>
      <Text style={[styles.label, { color: theme.text }]}>Área dos Pais</Text>
      <Text style={[styles.sub, { color: theme.muted }]}>Overview, Gráficos, Relatório... em breve!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emoji: { fontSize: 64 },
  label: { fontFamily: fontFamily.heading,  fontSize: fontSize.xxl },
  sub:   { fontFamily: fontFamily.body,     fontSize: fontSize.base, textAlign: 'center', paddingHorizontal: 32 },
});
