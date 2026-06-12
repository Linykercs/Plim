import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore, useTheme } from '../../store/useAppStore';
import { AVATAR_COLORS } from '../../theme/palettes';
import PlimMascot from '../../components/mascot/PlimMascot';
import PlimIcon from '../../components/ui/PlimIcon';
import { speak } from '../../services/speech';

// Escape é parte do tratamento, nunca punição: a tela usa o tema claro
// normal, o Plim acolhe, e registrar vale as mesmas estrelas do xixi.

export default function DiaryIncScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const addEntry = useAppStore(s => s.addEntry);
  const addStars = useAppStore(s => s.addStars);
  const completeMission = useAppStore(s => s.completeMission);
  const profile = useAppStore(s => s.profile);

  const [note, setNote] = useState('');
  const [phase, setPhase] = useState<'form' | 'reward'>('form');
  const [earned, setEarned] = useState(0);

  const mascotColor = AVATAR_COLORS[profile?.avatarColor ?? 0];

  // Leitura assistida: o acolhimento precisa chegar a quem não lê
  useEffect(() => {
    if (phase === 'reward') {
      speak('Obrigado por me contar! Splash! Acontece com todo sapo, até comigo.');
    }
  }, [phase]);

  function handleSave() {
    addEntry({
      id: Date.now().toString(),
      type: 'inc',
      createdAt: new Date().toISOString(),
      note: note.trim() || undefined,
    });
    // Escape é um evento de xixi: vale a mesma missão e as mesmas estrelas
    // do registro no banheiro, para nunca premiar esconder o acidente.
    const { missionsDone } = useAppStore.getState();
    if (!missionsDone.mic) {
      addStars(3);
      completeMission('mic');
      setEarned(3);
    }
    setPhase('reward');
  }

  if (phase === 'reward') {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
        <View style={styles.content}>
          <PlimMascot size={130} mood="splash" primary={mascotColor} accent={theme.coral} dark={theme.text} />
          <Text style={[styles.rewardTitle, { color: theme.text }]}>Obrigado por me contar!</Text>
          <Text style={[styles.rewardSub, { color: theme.muted }]}>
            Splash! Acontece com todo sapo, até comigo.{'\n'}Amanhã a gente pula de novo, juntos.
          </Text>
          {earned > 0 && (
            <View style={[styles.starsBadge, { backgroundColor: theme.accent + '33' }]}>
              <PlimIcon name="star" size={22} color={theme.accent} />
              <Text style={[styles.starsText, { color: theme.text }]}>+{earned} ⭐</Text>
            </View>
          )}
          <View style={styles.btnWrap}>
            <View style={[styles.btnShadow, { backgroundColor: theme.btnDark }]} />
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: theme.btn,
                  borderColor: theme.btnDark,
                  borderBottomWidth: pressed ? 2 : 4,
                  transform: [{ translateY: pressed ? 2 : 0 }],
                },
              ]}
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
    <View style={[styles.root, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => nav.goBack()} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Registrar escape</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <PlimMascot size={110} mood="splash" primary={mascotColor} accent={theme.coral} dark={theme.text} />

        <Text style={[styles.subtitle, { color: theme.text }]}>
          Escapou um xixi?{'\n'}Tudo bem, acontece!
        </Text>
        <Text style={[styles.helper, { color: theme.muted }]}>
          Me contar ajuda muito no seu treino.
        </Text>

        <TextInput
          style={[styles.noteInput, {
            borderColor: theme.softBg2,
            backgroundColor: theme.surface,
            color: theme.text,
          }]}
          placeholder="Quer contar mais alguma coisa?"
          placeholderTextColor={theme.muted + '99'}
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={200}
        />

        <View style={styles.btnWrap}>
          <View style={[styles.btnShadow, { backgroundColor: theme.btnDark }]} />
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              {
                backgroundColor: theme.btn,
                borderColor: theme.btnDark,
                borderBottomWidth: pressed ? 2 : 4,
                transform: [{ translateY: pressed ? 2 : 0 }],
              },
            ]}
            onPress={handleSave}
          >
            <PlimIcon name="check" size={20} color="#fff" />
            <Text style={styles.btnLabel}>Registrar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl, gap: spacing.md,
  },
  subtitle: {
    fontFamily: fontFamily.heading, fontSize: fontSize.xl,
    textAlign: 'center', lineHeight: 28,
  },
  helper: {
    fontFamily: fontFamily.body, fontSize: fontSize.base,
    textAlign: 'center',
  },
  noteInput: {
    width: '100%', borderWidth: 2, borderRadius: 16,
    padding: spacing.md,
    fontFamily: fontFamily.body, fontSize: fontSize.base,
    minHeight: 80, textAlignVertical: 'top',
  },
  rewardTitle: {
    fontFamily: fontFamily.heading, fontSize: fontSize.xxl, textAlign: 'center',
  },
  rewardSub: {
    fontFamily: fontFamily.body, fontSize: fontSize.base,
    textAlign: 'center', lineHeight: 24,
  },
  starsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 24,
  },
  starsText: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl },
  btnWrap: { position: 'relative', width: '100%', marginTop: spacing.sm },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 18 },
  btn: {
    borderRadius: 18, paddingVertical: spacing.md + 2,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, borderWidth: 0,
  },
  btnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.xl, color: '#fff' },
});
