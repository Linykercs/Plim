import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultPalette, type Palette } from '../theme/palettes';

// ─── Domain types ─────────────────────────────────────────────

export type KidCondition =
  | 'enuresis'
  | 'hyperactive'
  | 'constipation'
  | 'incont-fec'
  | 'training'
  | 'dont-know';

export interface KidProfile {
  id: string;
  name: string;
  age: number;
  avatarColor: number;
  conditions: KidCondition[];
  professional?: { name: string; email?: string };
  createdAt: Date;
}

export type DiaryEntry =
  | { id: string; type: 'mic';  createdAt: string; cups: number; color: string; triggers: string[]; note: string }
  | { id: string; type: 'evac'; createdAt: string; bristol: 1 | 2 | 3 | 4 | 5 | 6 | 7; poopSize: string; note: string }
  | { id: string; type: 'inc';  createdAt: string; note?: string };

export interface Alarm {
  id: string;
  label: string;
  time: string; // "HH:MM"
  days: 'todo dia' | 'seg-sex' | 'sab-dom';
  on: boolean;
  kind: 'day' | 'night';
}

export interface Reward {
  id: string;
  name: string;
  icon: string;
  cost: number;
  category?: string;
}

export interface Redemption {
  id: string;
  rewardId: string;
  redeemedAt: Date;
  status: 'pending' | 'delivered';
}

export interface MissionsDone {
  mic: boolean;
  water: boolean;
  game: boolean;
  learn: boolean;
}

// ─── Streak helper ────────────────────────────────────────────

function calcStreak(entries: DiaryEntry[]): number {
  if (entries.length === 0) return 0;
  const days = new Set(entries.map(e => new Date(e.createdAt).toDateString()));
  let streak = 0;
  const d = new Date();
  // If today has no entry, streak starts from yesterday
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ─── Missions midnight reset ──────────────────────────────────

function shouldResetMissions(lastReset: string | null): boolean {
  if (!lastReset) return true;
  const last = new Date(lastReset).toDateString();
  return last !== new Date().toDateString();
}

// ─── Default data ──────────────────────────────────────────────

const DEFAULT_ALARMS: Alarm[] = [
  { id: 'a1', label: 'Acordar',          time: '07:30', days: 'todo dia', on: true,  kind: 'day'   },
  { id: 'a2', label: 'Antes da escola',  time: '08:15', days: 'seg-sex',  on: true,  kind: 'day'   },
  { id: 'a3', label: 'Recreio',          time: '10:00', days: 'seg-sex',  on: true,  kind: 'day'   },
  { id: 'a4', label: 'Depois do almoço', time: '13:30', days: 'todo dia', on: true,  kind: 'day'   },
  { id: 'a5', label: 'Lanchinho',        time: '15:30', days: 'todo dia', on: true,  kind: 'day'   },
  { id: 'a6', label: 'Jantar',           time: '18:30', days: 'todo dia', on: true,  kind: 'day'   },
  { id: 'a7', label: 'Antes de dormir',  time: '20:30', days: 'todo dia', on: true,  kind: 'day'   },
  { id: 'a8', label: 'Madrugada',        time: '02:00', days: 'todo dia', on: false, kind: 'night' },
];

const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', name: 'Sorvete',    icon: '🍦', cost: 30   },
  { id: 'r2', name: 'Cinema',     icon: '🎬', cost: 60   },
  { id: 'r3', name: 'Hambúrguer', icon: '🍔', cost: 80   },
  { id: 'r4', name: 'Pula-pula',  icon: '🎪', cost: 120  },
  { id: 'r5', name: 'Brinquedo',  icon: '🧸', cost: 200  },
  { id: 'r6', name: 'Piscina',    icon: '🏊', cost: 150  },
  { id: 'r7', name: 'Livro',      icon: '📚', cost: 100  },
  { id: 'r8', name: 'Disney+',    icon: '🏰', cost: 1500 },
];

// ─── Store ─────────────────────────────────────────────────────

interface AppState {
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;

  mode: 'kid' | 'parent';
  setMode: (m: 'kid' | 'parent') => void;
  profile: KidProfile | null;
  setProfile: (p: KidProfile) => void;

  palette: Palette;
  setPalette: (p: Palette) => void;

  stars: number;
  rewards: Reward[];
  redemptions: Redemption[];
  savingFor: string | null;
  earnStars: (n: number) => void;
  addStars: (n: number) => void;
  redeemReward: (id: string) => void;
  addReward: (r: Reward) => void;
  deleteReward: (id: string) => void;
  markDelivered: (redemptionId: string) => void;
  setSavingFor: (id: string | null) => void;

  entries: DiaryEntry[];
  addEntry: (e: DiaryEntry) => void;

  alarms: Alarm[];
  toggleAlarm: (id: string) => void;
  updateAlarm: (id: string, patch: Partial<Pick<Alarm, 'time' | 'days' | 'label'>>) => void;

  streak: number;
  setStreak: (n: number) => void;

  missionsDone: MissionsDone;
  missionsResetDate: string | null;
  completeMission: (key: keyof MissionsDone) => void;
  resetMissions: () => void;
  checkAndResetMissions: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      setHasOnboarded: (v) => set({ hasOnboarded: v }),

      mode: 'kid',
      setMode: (m) => set({ mode: m }),
      profile: null,
      setProfile: (p) => set({ profile: p }),

      palette: defaultPalette,
      setPalette: (p) => set({ palette: p }),

      stars: 0,
      rewards: DEFAULT_REWARDS,
      redemptions: [],
      savingFor: null,
      earnStars: (n) => set((s) => ({ stars: s.stars + n })),
      addStars:  (n) => set((s) => ({ stars: s.stars + n })),
      redeemReward: (id) =>
        set((s) => {
          const reward = s.rewards.find((r) => r.id === id);
          if (!reward || s.stars < reward.cost) return s;
          return {
            stars: s.stars - reward.cost,
            redemptions: [...s.redemptions, { id: Date.now().toString(), rewardId: id, redeemedAt: new Date(), status: 'pending' as const }],
            savingFor: s.savingFor === id ? null : s.savingFor,
          };
        }),
      addReward: (r) => set((s) => ({ rewards: [...s.rewards, r] })),
      deleteReward: (id) => set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) })),
      markDelivered: (rid) => set((s) => ({ redemptions: s.redemptions.map((r) => r.id === rid ? { ...r, status: 'delivered' as const } : r) })),
      setSavingFor: (id) => set({ savingFor: id }),

      entries: [],
      addEntry: (e) =>
        set((s) => {
          const entries = [...s.entries, e];
          return { entries, streak: calcStreak(entries) };
        }),

      alarms: DEFAULT_ALARMS,
      toggleAlarm: (id) => set((s) => ({ alarms: s.alarms.map((a) => a.id === id ? { ...a, on: !a.on } : a) })),
      updateAlarm: (id, patch) => set((s) => ({ alarms: s.alarms.map((a) => a.id === id ? { ...a, ...patch } : a) })),

      streak: 0,
      setStreak: (n) => set({ streak: n }),

      missionsDone: { mic: false, water: false, game: false, learn: false },
      missionsResetDate: null,
      completeMission: (key) => set((s) => ({ missionsDone: { ...s.missionsDone, [key]: true } })),
      resetMissions: () => set({ missionsDone: { mic: false, water: false, game: false, learn: false }, missionsResetDate: new Date().toISOString() }),
      checkAndResetMissions: () => {
        if (shouldResetMissions(get().missionsResetDate)) get().resetMissions();
      },
    }),
    {
      name: 'plim-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        hasOnboarded: s.hasOnboarded,
        profile: s.profile,
        palette: s.palette,
        stars: s.stars,
        rewards: s.rewards,
        redemptions: s.redemptions,
        savingFor: s.savingFor,
        entries: s.entries,
        alarms: s.alarms,
        streak: s.streak,
        missionsDone: s.missionsDone,
        missionsResetDate: s.missionsResetDate,
        mode: s.mode,
      }),
    },
  ),
);

// Convenience hook — reads reactive palette from store
export function useTheme() {
  return useAppStore((s) => s.palette);
}
