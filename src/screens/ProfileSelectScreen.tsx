import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { defaultPalette } from '../theme/palettes';
import { fontFamily } from '../theme/typography';

// Placeholder — será implementada na próxima fase
export default function ProfileSelectScreen() {
  const theme = defaultPalette;
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        {'ProfileSelect — em breve 🐸'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fontFamily.heading, fontSize: 24 },
});
