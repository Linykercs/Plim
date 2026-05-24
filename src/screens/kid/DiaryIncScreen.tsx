import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore, useTheme } from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';

export default function DiaryIncScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const addEntry = useAppStore(s => s.addEntry);

  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    addEntry({
      id: Date.now().toString(),
      type: 'inc',
      createdAt: new Date().toISOString(),
      note: note.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => nav.goBack(), 800);
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => nav.goBack()} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Registrar escape</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: theme.coral + '33' }]}>
          <Text style={styles.emoji}>💧</Text>
        </View>

        <Text style={styles.subtitle}>
          Aconteceu um escape?{'\n'}Vamos anotar aqui.
        </Text>

        <TextInput
          style={styles.noteInput}
          placeholder="Observação (opcional)"
          placeholderTextColor="#ffffff55"
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={200}
        />

        <View style={styles.btnWrap}>
          <View style={[styles.btnShadow, { backgroundColor: '#6B1030' }]} />
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              {
                backgroundColor: saved ? '#5FCB8E' : theme.coral,
                borderColor: saved ? '#3DA070' : '#6B1030',
                borderBottomWidth: pressed ? 2 : 4,
                transform: [{ translateY: pressed ? 2 : 0 }],
              },
            ]}
            onPress={handleSave}
            disabled={saved}
          >
            <PlimIcon name={saved ? 'check' : 'plus'} size={20} color="#fff" />
            <Text style={styles.btnLabel}>{saved ? 'Registrado!' : 'Registrar'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2B1020' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.lg, color: '#fff' },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl, gap: spacing.lg,
  },
  iconCircle: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 48 },
  subtitle: {
    fontFamily: fontFamily.body, fontSize: fontSize.lg,
    color: '#ffffffCC', textAlign: 'center', lineHeight: 28,
  },
  noteInput: {
    width: '100%', borderWidth: 1.5, borderRadius: 16, borderColor: '#ffffff33',
    backgroundColor: '#ffffff12', padding: spacing.md,
    fontFamily: fontFamily.body, fontSize: fontSize.base, color: '#fff',
    minHeight: 80, textAlignVertical: 'top',
  },
  btnWrap: { position: 'relative', width: '100%' },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 18 },
  btn: {
    borderRadius: 18, paddingVertical: spacing.md + 2,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, borderWidth: 0,
  },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl, color: '#fff' },
});
