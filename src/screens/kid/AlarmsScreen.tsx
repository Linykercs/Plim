import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { spacing, radius, shadow } from '../../theme/tokens';
import { fontFamily, fontSize } from '../../theme/typography';
import { useAppStore, type Alarm , useTheme} from '../../store/useAppStore';
import PlimIcon from '../../components/ui/PlimIcon';
import { scheduleAlarm, cancelAlarm } from '../../services/notifications';

const DAYS_OPTIONS: Array<Alarm['days']> = ['todo dia', 'seg-sex', 'sab-dom'];
const DAYS_LABELS: Record<Alarm['days'], string> = {
  'todo dia': 'Todo dia',
  'seg-sex':  'Seg–Sex',
  'sab-dom':  'Sáb–Dom',
};

function parseTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return { h, m };
}

function fmtTime(h: number, m: number) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

interface EditState { id: string; h: number; m: number; days: Alarm['days'] }

export default function AlarmsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const alarms = useAppStore(s => s.alarms);
  const toggleAlarm = useAppStore(s => s.toggleAlarm);
  const updateAlarm = useAppStore(s => s.updateAlarm);

  const [editing, setEditing] = useState<EditState | null>(null);

  const dayAlarms = alarms.filter(a => a.kind === 'day');
  const nightAlarms = alarms.filter(a => a.kind === 'night');

  function openEdit(alarm: Alarm) {
    const { h, m } = parseTime(alarm.time);
    setEditing({ id: alarm.id, h, m, days: alarm.days });
  }

  function saveEdit() {
    if (!editing) return;
    const patch = { time: fmtTime(editing.h, editing.m), days: editing.days };
    updateAlarm(editing.id, patch);
    const alarm = alarms.find(a => a.id === editing.id);
    if (alarm?.on) scheduleAlarm({ ...alarm, ...patch });
    setEditing(null);
  }

  function adjH(d: number) {
    setEditing(e => e ? { ...e, h: (e.h + d + 24) % 24 } : e);
  }
  function adjM(d: number) {
    setEditing(e => e ? { ...e, m: (e.m + d + 60) % 60 } : e);
  }

  function renderAlarm(alarm: Alarm) {
    return (
      <TouchableOpacity
        key={alarm.id}
        activeOpacity={0.8}
        onPress={() => openEdit(alarm)}
        style={[styles.alarmRow, { backgroundColor: theme.surface, ...shadow.card }]}
      >
        <View style={styles.alarmLeft}>
          <View style={[styles.alarmIconBox, { backgroundColor: alarm.kind === 'night' ? '#7DC9E822' : theme.primary + '22' }]}>
            <PlimIcon name={alarm.kind === 'night' ? 'moon' : 'bell'} size={18} color={alarm.kind === 'night' ? '#7DC9E8' : theme.primary} />
          </View>
          <View style={styles.alarmInfo}>
            <Text style={[styles.alarmLabel, { color: theme.text }]}>{alarm.label}</Text>
            <Text style={[styles.alarmDays, { color: theme.muted }]}>{DAYS_LABELS[alarm.days]}</Text>
          </View>
        </View>
        <View style={styles.alarmRight}>
          <Text style={[styles.alarmTime, { color: alarm.on ? theme.text : theme.muted }]}>
            {alarm.time}
          </Text>
          <Switch
            value={alarm.on}
            onValueChange={() => {
              toggleAlarm(alarm.id);
              const updated = { ...alarm, on: !alarm.on };
              if (updated.on) scheduleAlarm(updated); else cancelAlarm(alarm.id);
            }}
            trackColor={{ false: theme.softBg2, true: theme.primary + '88' }}
            thumbColor={alarm.on ? theme.primary : '#ccc'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
          <PlimIcon name="back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Lembretes</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Day alarms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <PlimIcon name="sun" size={16} color={theme.accent} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Dia</Text>
          </View>
          {dayAlarms.map(renderAlarm)}
        </View>

        {/* Night alarms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <PlimIcon name="moon" size={16} color="#7DC9E8" />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Noite</Text>
          </View>
          {nightAlarms.map(renderAlarm)}
        </View>

        <Text style={[styles.tip, { color: theme.muted }]}>
          Toque em um lembrete para ajustar o horário.
        </Text>
      </ScrollView>

      {/* Edit modal */}
      <Modal visible={!!editing} transparent animationType="slide">
        <Pressable style={styles.backdrop} onPress={() => setEditing(null)} />
        {editing && (
          <View style={[styles.sheet, { backgroundColor: theme.surface, paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Editar horário</Text>

            {/* Time picker */}
            <View style={styles.timePicker}>
              {/* Hours */}
              <View style={styles.timeCol}>
                <TouchableOpacity onPress={() => adjH(1)} style={styles.arrowBtn}>
                  <PlimIcon name="chevron" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.timeNum, { color: theme.text }]}>
                  {String(editing.h).padStart(2, '0')}
                </Text>
                <TouchableOpacity onPress={() => adjH(-1)} style={[styles.arrowBtn, { transform: [{ rotate: '180deg' }] }]}>
                  <PlimIcon name="chevron" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.timeSep, { color: theme.text }]}>:</Text>

              {/* Minutes */}
              <View style={styles.timeCol}>
                <TouchableOpacity onPress={() => adjM(5)} style={styles.arrowBtn}>
                  <PlimIcon name="chevron" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.timeNum, { color: theme.text }]}>
                  {String(editing.m).padStart(2, '0')}
                </Text>
                <TouchableOpacity onPress={() => adjM(-5)} style={[styles.arrowBtn, { transform: [{ rotate: '180deg' }] }]}>
                  <PlimIcon name="chevron" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Days */}
            <View style={styles.daysRow}>
              {DAYS_OPTIONS.map(d => {
                const sel = editing.days === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setEditing(e => e ? { ...e, days: d } : e)}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: sel ? theme.primary + '22' : theme.softBg,
                        borderColor: sel ? theme.primary : 'transparent',
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Text style={[styles.dayChipLabel, { color: sel ? theme.primary : theme.muted }]}>
                      {DAYS_LABELS[d]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Save */}
            <View style={styles.saveBtnWrap}>
              <View style={[styles.saveShadow, { backgroundColor: theme.primaryDark }]} />
              <Pressable
                style={({ pressed }) => [
                  styles.saveBtn,
                  { backgroundColor: theme.primary, borderBottomWidth: pressed ? 2 : 4, borderColor: theme.primaryDark, transform: [{ translateY: pressed ? 2 : 0 }] },
                ]}
                onPress={saveEdit}
              >
                <PlimIcon name="check" size={20} color="#fff" />
                <Text style={styles.saveBtnLabel}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },
  scroll: { paddingHorizontal: spacing.md, gap: spacing.xs },

  section: { gap: spacing.xs, marginBottom: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  sectionTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.base },

  alarmRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: radius.card, padding: spacing.sm, gap: spacing.sm,
  },
  alarmLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  alarmIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  alarmInfo: { flex: 1 },
  alarmLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.base },
  alarmDays: { fontFamily: fontFamily.body, fontSize: fontSize.xs },
  alarmRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  alarmTime: { fontFamily: fontFamily.heading, fontSize: fontSize.lg },

  tip: { fontFamily: fontFamily.body, fontSize: fontSize.xs, textAlign: 'center', marginTop: spacing.sm },

  backdrop: { flex: 1, backgroundColor: '#00000044' },
  sheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: spacing.lg, gap: spacing.md,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: spacing.xs },
  sheetTitle: { fontFamily: fontFamily.heading, fontSize: fontSize.xl, textAlign: 'center' },

  timePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  timeCol: { alignItems: 'center', gap: spacing.xs },
  arrowBtn: { padding: spacing.xs },
  timeNum: { fontFamily: fontFamily.heading, fontSize: 52, lineHeight: 60 },
  timeSep: { fontFamily: fontFamily.heading, fontSize: 40, marginBottom: spacing.xs },

  daysRow: { flexDirection: 'row', gap: spacing.sm },
  dayChip: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.chip },
  dayChipLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm },

  saveBtnWrap: { position: 'relative' },
  saveShadow: { position: 'absolute', top: 4, left: 0, right: 0, bottom: 0, borderRadius: 16 },
  saveBtn: {
    borderRadius: 16, paddingVertical: spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    borderWidth: 0,
  },
  saveBtnLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.lg, color: '#fff' },
});
