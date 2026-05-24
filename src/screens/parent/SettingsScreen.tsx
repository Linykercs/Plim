import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Pressable, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { palettes, AVATAR_COLORS, type Palette } from '../../theme/palettes';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore , useTheme} from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';
import PlimMascot from '../../components/mascot/PlimMascot';

const PALETTES: { key: string; label: string; palette: Palette; primary: string }[] = [
  { key: 'fresh', label: 'Menta',  palette: palettes.fresh, primary: palettes.fresh.primary },
  { key: 'ocean', label: 'Oceano', palette: palettes.ocean, primary: palettes.ocean.primary },
  { key: 'sweet', label: 'Doce',   palette: palettes.sweet, primary: palettes.sweet.primary },
];

const AGE_OPTIONS = [4, 5, 6, 7, 8, 9, 10];

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const profile = useAppStore(s => s.profile);
  const setProfile = useAppStore(s => s.setProfile);
  const setMode = useAppStore(s => s.setMode);
  const setHasOnboarded = useAppStore(s => s.setHasOnboarded);
  const setPalette = useAppStore(s => s.setPalette);

  const [name, setName] = useState(profile?.name ?? '');
  const [age, setAge] = useState(profile?.age ?? 6);
  const [avatarColor, setAvatarColor] = useState(profile?.avatarColor ?? 0);
  const [proName, setProName] = useState(profile?.professional?.name ?? '');
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    if (!profile) return;
    setProfile({
      ...profile,
      name: name.trim() || profile.name,
      age,
      avatarColor,
      professional: proName.trim() ? { ...profile.professional, name: proName.trim() } : profile.professional,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    Alert.alert(
      'Reiniciar app',
      'Isso apagará todos os dados e voltará ao início. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar', style: 'destructive',
          onPress: () => {
            setHasOnboarded(false);
            setMode('kid');
            nav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Splash' }] }));
          },
        },
      ],
    );
  }

  const mascotColor = AVATAR_COLORS[avatarColor];

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Perfil da criança</Text>

          {/* Avatar preview */}
          <View style={styles.avatarPreview}>
            <PlimMascot size={80} mood="happy" primary={mascotColor} />
          </View>

          {/* Avatar color */}
          <Text style={[styles.fieldLabel, { color: theme.muted }]}>Cor do personagem</Text>
          <View style={styles.colorRow}>
            {AVATAR_COLORS.map((c, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setAvatarColor(i)}
                style={[styles.colorDot, { backgroundColor: c, borderWidth: avatarColor === i ? 3 : 0, borderColor: theme.text }]}
              />
            ))}
          </View>

          {/* Name */}
          <Text style={[styles.fieldLabel, { color: theme.muted }]}>Nome</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.softBg2 }]}
            value={name}
            onChangeText={setName}
            placeholder={profile?.name ?? 'Nome'}
            placeholderTextColor={theme.muted}
            maxLength={30}
          />

          {/* Age */}
          <Text style={[styles.fieldLabel, { color: theme.muted }]}>Idade</Text>
          <View style={styles.ageRow}>
            {AGE_OPTIONS.map(a => (
              <TouchableOpacity
                key={a}
                onPress={() => setAge(a)}
                style={[styles.ageBtn, { backgroundColor: age === a ? theme.primary : theme.softBg, borderColor: age === a ? theme.primaryDark : 'transparent', borderWidth: 2 }]}
              >
                <Text style={[styles.ageBtnLabel, { color: age === a ? '#fff' : theme.muted }]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Professional */}
          <Text style={[styles.fieldLabel, { color: theme.muted }]}>Profissional de saúde</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.softBg2 }]}
            value={proName}
            onChangeText={setProName}
            placeholder="Ex: Dra. Ana Silva"
            placeholderTextColor={theme.muted}
            maxLength={60}
          />

          {/* Save */}
          <View style={styles.saveBtnWrap}>
            <View style={[styles.btnShadow, { backgroundColor: saved ? '#3DA070' : theme.primaryDark }]} />
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                { backgroundColor: saved ? '#5FCB8E' : theme.primary, borderColor: saved ? '#3DA070' : theme.primaryDark, borderBottomWidth: pressed ? 2 : 4, transform: [{ translateY: pressed ? 2 : 0 }] },
              ]}
              onPress={saveProfile}
            >
              <PlimIcon name={saved ? 'check' : 'refresh'} size={18} color="#fff" />
              <Text style={styles.saveBtnLabel}>{saved ? 'Salvo!' : 'Salvar perfil'}</Text>
            </Pressable>
          </View>
        </View>

        {/* Theme */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Tema</Text>
          <View style={styles.themeRow}>
            {PALETTES.map(p => (
              <TouchableOpacity
                key={p.key}
                onPress={() => setPalette(p.palette)}
                style={[styles.themeChip, { backgroundColor: p.primary + '22', borderColor: p.primary, borderWidth: 2 }]}
              >
                <View style={[styles.themeDot, { backgroundColor: p.primary }]} />
                <Text style={[styles.themeLabel, { color: p.primary }]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Switch mode */}
        <TouchableOpacity
          style={[styles.rowBtn, { backgroundColor: theme.surface, ...shadow.card }]}
          onPress={() => { setMode('kid'); nav.replace('ProfileSelect'); }}
        >
          <View style={[styles.rowIcon, { backgroundColor: theme.secondary + '22' }]}>
            <PlimIcon name="family" size={18} color={theme.secondary} />
          </View>
          <Text style={[styles.rowLabel, { color: theme.text }]}>Trocar para modo criança</Text>
          <PlimIcon name="chevron" size={18} color={theme.muted} />
        </TouchableOpacity>

        {/* Danger zone */}
        <View style={[styles.section, { backgroundColor: theme.surface, ...shadow.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.coral }]}>Zona de perigo</Text>
          <TouchableOpacity
            style={[styles.dangerBtn, { borderColor: theme.coral }]}
            onPress={handleReset}
          >
            <PlimIcon name="refresh" size={16} color={theme.coral} />
            <Text style={[styles.dangerLabel, { color: theme.coral }]}>Reiniciar aplicativo</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: theme.muted }]}>Plim v1.0 • Feito com 💚</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  title: { fontFamily: fontFamily.heading, fontSize: fontSize.xxl },
  scroll: { paddingHorizontal: spacing.md, gap: spacing.sm },

  section: { borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
  sectionTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.base },

  avatarPreview: { alignItems: 'center', paddingVertical: spacing.sm },
  fieldLabel: { fontFamily: fontFamily.body, fontSize: fontSize.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  colorRow: { flexDirection: 'row', gap: spacing.sm },
  colorDot: { width: 36, height: 36, borderRadius: 18 },

  input: { borderWidth: 1.5, borderRadius: radius.chip, padding: spacing.sm, fontFamily: fontFamily.body, fontSize: fontSize.base },

  ageRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  ageBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ageBtnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },

  saveBtnWrap: { position: 'relative', marginTop: spacing.xs },
  btnShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 14 },
  saveBtn: { borderRadius: 14, paddingVertical: spacing.sm + 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderWidth: 0 },
  saveBtnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base, color: '#fff' },

  themeRow: { flexDirection: 'row', gap: spacing.sm },
  themeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, borderRadius: radius.pill },
  themeDot: { width: 12, height: 12, borderRadius: 6 },
  themeLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  rowBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.card },
  rowIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontFamily: fontFamily.body, fontSize: fontSize.base, flex: 1 },

  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, borderRadius: radius.chip, borderWidth: 1.5 },
  dangerLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },

  version: { fontFamily: fontFamily.body, fontSize: fontSize.xs, textAlign: 'center', paddingVertical: spacing.sm },
});
