import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import PlimMascot from '../components/mascot/PlimMascot';
import PlimIcon, { type IconName } from '../components/ui/PlimIcon';
import PlimButton from '../components/ui/PlimButton';
import { defaultPalette, type Palette } from '../theme/palettes';
import { fontFamily, fontSize } from '../theme/typography';
import { useAppStore, type KidCondition } from '../store/useAppStore';
import type { RootStackParamList } from '../navigation/types';

// ─── Types ────────────────────────────────────────────────────

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

interface OnbData {
  name: string;
  age: number;
  avatar: number;
  conditions: KidCondition[];
  professional: { has: boolean | null; name: string };
}

const STEPS = ['welcome', 'kid', 'condition', 'pro', 'ready'] as const;
const AVATAR_COLORS = ['#5FCB8E', '#7DC9E8', '#FF8A7A', '#C497F0', '#FFCE5C', '#FF8E72'];

// ─── Main screen ──────────────────────────────────────────────

export default function OnboardingScreen({ navigation }: { navigation: Nav }) {
  const theme = defaultPalette;
  const { setProfile, setHasOnboarded } = useAppStore();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnbData>({
    name: '',
    age: 6,
    avatar: 0,
    conditions: [],
    professional: { has: null, name: '' },
  });

  const set = <K extends keyof OnbData>(key: K, val: OnbData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () => {
    setProfile({
      id: Date.now().toString(),
      name: data.name || 'Amigo',
      age: data.age,
      avatarColor: data.avatar,
      conditions: data.conditions,
      professional: data.professional.has
        ? { name: data.professional.name }
        : undefined,
      createdAt: new Date(),
    });
    setHasOnboarded(true);
    navigation.replace('ProfileSelect');
  };

  const isLast = step === STEPS.length - 1;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <Pressable
          onPress={step === 0 ? finish : back}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <PlimIcon
            name={step === 0 ? 'close' : 'back'}
            color={theme.text}
            size={20}
          />
        </Pressable>

        {/* progress dots */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === step ? 28 : 8,
                  backgroundColor: i <= step ? theme.primary : theme.softBg,
                },
              ]}
            />
          ))}
        </View>

        <Pressable onPress={finish} hitSlop={8}>
          <Text style={[styles.skip, { color: theme.muted }]}>pular</Text>
        </Pressable>
      </View>

      {/* ── Step content ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && <StepWelcome theme={theme} />}
          {step === 1 && <StepKid theme={theme} data={data} set={set} />}
          {step === 2 && <StepCondition theme={theme} data={data} set={set} />}
          {step === 3 && <StepPro theme={theme} data={data} set={set} />}
          {step === 4 && <StepReady theme={theme} data={data} />}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Bottom CTA ── */}
      <View style={[styles.footer, { backgroundColor: theme.bg }]}>
        <PlimButton
          color={theme.primary}
          darkColor={theme.primaryDark}
          fullWidth
          onPress={isLast ? finish : next}
        >
          {isLast ? 'Vamos brincar!' : 'Continuar'}
        </PlimButton>
      </View>
    </SafeAreaView>
  );
}

// ─── Step 0: Welcome ──────────────────────────────────────────

function StepWelcome({ theme }: { theme: Palette }) {
  const features: { icon: IconName; color: string; title: string; sub: string }[] = [
    { icon: 'diary', color: theme.secondary,   title: 'Diário fácil',     sub: 'xixi e cocô com desenhos' },
    { icon: 'play',  color: theme.coral,        title: 'Treino brincando', sub: 'foguete, balão, sapo' },
    { icon: 'bell',  color: theme.accent,       title: 'Lembretes',        sub: 'banheiro a cada 2-3h' },
    { icon: 'pdf',   color: theme.primaryDark,  title: 'Relatório médico', sub: 'PDF pro consultório' },
  ];

  return (
    <View style={styles.stepPad}>
      <View style={styles.centered}>
        <PlimMascot size={150} mood="cheer" primary={theme.primary} accent={theme.coral} dark={theme.text} />
      </View>
      <Text style={[styles.h1, { color: theme.text, marginTop: 4 }]}>Oi, sou o Plim!</Text>
      <Text style={[styles.sub, { color: theme.muted, marginBottom: 24 }]}>
        {'Vou te ajudar a treinar o xixi e o cocô\ncom joguinhos divertidos —\ne mandar um relatório bonitinho pro seu fisio.'}
      </Text>
      <View style={{ gap: 10 }}>
        {features.map((f) => (
          <View key={f.title} style={[styles.featureRow, { backgroundColor: theme.surface }]}>
            <View style={[styles.featureIcon, { backgroundColor: f.color + '22' }]}>
              <PlimIcon name={f.icon} color={f.color} size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>{f.title}</Text>
              <Text style={[styles.featureSub, { color: theme.muted }]}>{f.sub}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Step 1: Kid info ─────────────────────────────────────────

function StepKid({
  theme,
  data,
  set,
}: {
  theme: Palette;
  data: OnbData;
  set: <K extends keyof OnbData>(k: K, v: OnbData[K]) => void;
}) {
  const ages = [4, 5, 6, 7, 8, 9, 10];

  return (
    <View style={styles.stepPad}>
      <Text style={[styles.h1, { color: theme.text }]}>Quem é a criança?</Text>
      <Text style={[styles.sub, { color: theme.muted, marginBottom: 20 }]}>
        Vamos personalizar o app pra ela 💛
      </Text>

      <Text style={[styles.label, { color: theme.muted }]}>NOME</Text>
      <TextInput
        value={data.name}
        onChangeText={(v) => set('name', v)}
        placeholder="ex: Theo"
        placeholderTextColor={theme.muted}
        style={[styles.input, { borderColor: theme.softBg, color: theme.text }]}
        autoCapitalize="words"
        returnKeyType="done"
      />

      <Text style={[styles.label, { color: theme.muted }]}>IDADE</Text>
      <View style={styles.ageRow}>
        {ages.map((a) => {
          const sel = data.age === a;
          return (
            <Pressable
              key={a}
              onPress={() => set('age', a)}
              style={[
                styles.ageBtn,
                {
                  backgroundColor: sel ? theme.primary : theme.surface,
                  borderBottomWidth: sel ? 3 : 1,
                  borderBottomColor: sel ? theme.primaryDark : theme.softBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.ageBtnTxt,
                  { color: sel ? '#fff' : theme.text },
                ]}
              >
                {a}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.label, { color: theme.muted, marginTop: 18 }]}>ESCOLHE UM AMIGO</Text>
      <View style={styles.avatarGrid}>
        {AVATAR_COLORS.map((c, i) => {
          const sel = data.avatar === i;
          return (
            <Pressable
              key={i}
              onPress={() => set('avatar', i)}
              style={[
                styles.avatarCell,
                {
                  backgroundColor: theme.surface,
                  borderColor: sel ? theme.primary : 'transparent',
                  borderWidth: 3,
                },
              ]}
            >
              <PlimMascot size={62} mood={sel ? 'cheer' : 'happy'} primary={c} accent={theme.coral} dark={theme.text} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Step 2: Condition ────────────────────────────────────────

const CONDITIONS: { id: KidCondition; label: string; emoji: string; desc: string }[] = [
  { id: 'enuresis',     label: 'Enurese (xixi na cama)',  emoji: '🌙', desc: 'escapa à noite' },
  { id: 'hyperactive',  label: 'Bexiga hiperativa',        emoji: '⚡', desc: 'urgência, vários escapes' },
  { id: 'constipation', label: 'Constipação',              emoji: '🌳', desc: 'cocô preso, com dor' },
  { id: 'incont-fec',   label: 'Incontinência fecal',      emoji: '🍂', desc: 'cocô escapando' },
  { id: 'training',     label: 'Treino esfincteriano',     emoji: '🎯', desc: 'tirar fralda' },
  { id: 'dont-know',    label: 'Não sei ainda',            emoji: '🤔', desc: 'em investigação' },
];

function StepCondition({
  theme,
  data,
  set,
}: {
  theme: Palette;
  data: OnbData;
  set: <K extends keyof OnbData>(k: K, v: OnbData[K]) => void;
}) {
  const toggle = (id: KidCondition) => {
    const next = data.conditions.includes(id)
      ? data.conditions.filter((x) => x !== id)
      : [...data.conditions, id];
    set('conditions', next);
  };

  return (
    <View style={styles.stepPad}>
      <Text style={[styles.h1, { color: theme.text }]}>O que vamos trabalhar?</Text>
      <Text style={[styles.sub, { color: theme.muted, marginBottom: 20 }]}>
        Pode marcar mais de um. Plim vai adaptar o protocolo.
      </Text>

      <View style={{ gap: 10 }}>
        {CONDITIONS.map((o) => {
          const sel = data.conditions.includes(o.id);
          return (
            <Pressable
              key={o.id}
              onPress={() => toggle(o.id)}
              style={[
                styles.condRow,
                {
                  backgroundColor: sel ? theme.softBg : theme.surface,
                  borderColor: sel ? theme.primary : 'transparent',
                },
              ]}
            >
              <Text style={{ fontSize: 26 }}>{o.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.featureTitle, { color: theme.text }]}>{o.label}</Text>
                <Text style={[styles.featureSub, { color: theme.muted }]}>{o.desc}</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: sel ? theme.primary : 'transparent',
                    borderColor: sel ? theme.primary : theme.softBg,
                  },
                ]}
              >
                {sel && <PlimIcon name="check" color="#fff" size={14} strokeWidth={3} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.disclaimer, { backgroundColor: theme.accent + '30' }]}>
        <PlimIcon name="sparkle" color={theme.text} size={16} />
        <Text style={[styles.disclaimerTxt, { color: theme.text }]}>
          Plim é <Text style={{ fontFamily: fontFamily.bodyBold }}>complementar ao tratamento</Text>. Sempre siga as orientações do seu fisio/médico.
        </Text>
      </View>
    </View>
  );
}

// ─── Step 3: Professional ─────────────────────────────────────

function StepPro({
  theme,
  data,
  set,
}: {
  theme: Palette;
  data: OnbData;
  set: <K extends keyof OnbData>(k: K, v: OnbData[K]) => void;
}) {
  const has = data.professional.has;

  return (
    <View style={styles.stepPad}>
      <Text style={[styles.h1, { color: theme.text }]}>Tem fisio ou médico?</Text>
      <Text style={[styles.sub, { color: theme.muted, marginBottom: 20 }]}>
        Quem for acompanhar pode receber o relatório direto.
      </Text>

      <View style={styles.toggleRow}>
        {([true, false] as const).map((v) => {
          const sel = has === v;
          return (
            <Pressable
              key={String(v)}
              onPress={() => set('professional', { ...data.professional, has: v })}
              style={[
                styles.toggleBtn,
                {
                  backgroundColor: sel ? theme.primary : theme.surface,
                  borderBottomWidth: sel ? 3 : 1,
                  borderBottomColor: sel ? theme.primaryDark : theme.softBg,
                },
              ]}
            >
              <Text style={[styles.toggleTxt, { color: sel ? '#fff' : theme.text }]}>
                {v ? 'Sim, já tenho' : 'Ainda não'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {has === true && (
        <View>
          <Text style={[styles.label, { color: theme.muted }]}>NOME OU E-MAIL</Text>
          <TextInput
            value={data.professional.name}
            onChangeText={(v) => set('professional', { ...data.professional, name: v })}
            placeholder="Dra. Maria · maria@clinica.com"
            placeholderTextColor={theme.muted}
            style={[styles.input, { borderColor: theme.softBg, color: theme.text }]}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
          />
          <Text style={[styles.hint, { color: theme.muted }]}>
            Você pode mudar isso depois nas configurações.
          </Text>
        </View>
      )}

      {has === false && (
        <View style={[styles.noProCard, { backgroundColor: theme.softBg }]}>
          <PlimMascot size={56} mood="focus" primary={theme.primary} accent={theme.coral} dark={theme.text} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Sem problema!</Text>
            <Text style={[styles.featureSub, { color: theme.muted, marginTop: 4, lineHeight: 18 }]}>
              Plim funciona contigo. Mas se os sintomas continuarem, procura um{' '}
              <Text style={{ fontFamily: fontFamily.bodyBold }}>uropediatra</Text> ou{' '}
              <Text style={{ fontFamily: fontFamily.bodyBold }}>fisio pélvico infantil</Text>.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Step 4: Ready ────────────────────────────────────────────

function StepReady({ theme, data }: { theme: Palette; data: OnbData }) {
  const pills: { icon: IconName; label: string }[] = [
    { icon: 'user',   label: `${data.name || '—'}, ${data.age} anos` },
    { icon: 'target', label: `${data.conditions.length} foco(s)` },
    ...(data.professional.has
      ? [{ icon: 'family' as IconName, label: data.professional.name || 'profissional' }]
      : []),
  ];

  return (
    <View style={[styles.stepPad, styles.centered]}>
      <PlimMascot size={150} mood="cheer" primary={theme.primary} accent={theme.coral} dark={theme.text} />
      <Text style={[styles.h1, { color: theme.text, textAlign: 'center', marginTop: 8 }]}>
        Tudo pronto, {data.name || 'amigo'}!
      </Text>
      <Text style={[styles.sub, { color: theme.muted, textAlign: 'center', marginBottom: 24 }]}>
        Bora começar pela{' '}
        <Text style={{ fontFamily: fontFamily.bodyBold }}>primeira missão</Text>: registrar o próximo xixi.
      </Text>
      <View style={{ gap: 10, alignItems: 'center' }}>
        {pills.map((p) => (
          <View key={p.icon} style={[styles.pill, { backgroundColor: theme.surface }]}>
            <PlimIcon name={p.icon} color={theme.primary} size={16} />
            <Text style={[styles.pillTxt, { color: theme.text }]}>{p.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  // top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot:  { height: 8, borderRadius: 4 },
  skip: { fontFamily: fontFamily.body, fontSize: fontSize.sm, paddingHorizontal: 4, paddingVertical: 8 },

  // scroll
  scrollContent: { paddingBottom: 24 },

  // footer
  footer: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 8 },

  // shared step layout
  stepPad: { paddingHorizontal: 22, paddingTop: 12 },
  centered: { alignItems: 'center' },

  h1: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xxxl,
    lineHeight: 34,
    marginBottom: 6,
  },
  sub: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    lineHeight: 22,
  },
  label: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.xs,
    letterSpacing: 0.4,
    marginBottom: 8,
  },

  // feature bullets
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: { fontFamily: fontFamily.headingSemi, fontSize: fontSize.md },
  featureSub:   { fontFamily: fontFamily.body,        fontSize: fontSize.sm },

  // text input
  input: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: '#fff',
    fontFamily: fontFamily.body,
    fontSize: fontSize.lg,
    marginBottom: 18,
  },

  // age buttons
  ageRow: { flexDirection: 'row', gap: 6 },
  ageBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  ageBtnTxt: { fontFamily: fontFamily.heading, fontSize: fontSize.xl },

  // avatar grid
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarCell: {
    width: '30%',
    borderRadius: 22,
    paddingVertical: 10,
    alignItems: 'center',
  },

  // condition rows
  condRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 22,
    borderWidth: 2.5,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },
  disclaimerTxt: { fontFamily: fontFamily.body, fontSize: fontSize.sm, lineHeight: 18, flex: 1 },

  // pro step
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  toggleTxt: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },
  hint: { fontFamily: fontFamily.body, fontSize: fontSize.sm, marginTop: 8 },
  noProCard: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 22,
    padding: 18,
    alignItems: 'flex-start',
  },

  // ready step
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  pillTxt: { fontFamily: fontFamily.body, fontSize: fontSize.sm },
});
