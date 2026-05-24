import * as Notifications from 'expo-notifications';
import type { Alarm } from '../store/useAppStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Weekday mapping: 'seg-sex' → [2,3,4,5,6], 'sab-dom' → [7,1]
function weekdaysFor(days: Alarm['days']): number[] {
  if (days === 'todo dia') return [1, 2, 3, 4, 5, 6, 7];
  if (days === 'seg-sex')  return [2, 3, 4, 5, 6];
  return [7, 1]; // sab-dom
}

export async function scheduleAlarm(alarm: Alarm): Promise<void> {
  // Cancel existing notifications for this alarm first
  await cancelAlarm(alarm.id);
  if (!alarm.on) return;

  const [h, m] = alarm.time.split(':').map(Number);
  const weekdays = weekdaysFor(alarm.days);

  for (const weekday of weekdays) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${alarm.id}-${weekday}`,
      content: {
        title: alarm.kind === 'night' ? '🌙 Hora do xixi da madrugada' : '🐸 Hora do xixi!',
        body: alarm.label,
        sound: 'plim.wav',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour: h,
        minute: m,
      },
    });
  }
}

export async function cancelAlarm(alarmId: string): Promise<void> {
  // Cancel all weekday variants
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled
    .filter(n => n.identifier.startsWith(`${alarmId}-`))
    .map(n => n.identifier);
  await Promise.all(toCancel.map(id => Notifications.cancelScheduledNotificationAsync(id)));
}

export async function syncAllAlarms(alarms: Alarm[]): Promise<void> {
  for (const alarm of alarms) {
    if (alarm.on) {
      await scheduleAlarm(alarm);
    } else {
      await cancelAlarm(alarm.id);
    }
  }
}
