import { create } from 'zustand';
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
  avatarColor: number; // 0-5 index
  conditions: KidCondition[];
  professional?: { name: string; email?: string };
  createdAt: Date;
}

export type DiaryEntry =
  | { type: 'mic'; time: Date; amount: 1 | 2 | 3; color: 'c1' | 'c2' | 'c3' | 'c4' | 'c5'; trigger?: string }
  | { type: 'evac'; time: Date; bristol: 1 | 2 | 3 | 4 | 5 | 6 | 7; amount: 'pouco' | 'medio' | 'muito' }
  | { type: 'inc'; time: Date; note?: string };

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
  icon: string; // emoji
  cost: number;
  category?: string;
}

export interface Redemption {
  id: string;
  rewardId: string;
  redeemedAt: Date;
  status: 'pending' | 'delivered';
}

export interface GameSession {
  id: string;
  game: 'rocket' | 'balloon' | 'frog';
  playedAt: Date;
  reps?: number;
  perfects?: number;
  starsEarned: number;
}

export interface MissionsDone {
  mic: boolean;
  water: boolean;
  game: boolean;
  learn: boolean;
}

// ─── Default data ──────────────────────────────────────────────

const DEFAULT_ALARMS: Alarm[] = [
  { id: 'a1', label: 'Acordar', time: '07:30', days: 'todo dia', on: true, kind: 'day' },
  { id: 'a2', label: 'Antes da escola', time: '08:15', days: 'seg-sex', on: true, kind: 'day' },
  { id: 'a3', label: 'Recreio', time: '10:00', days: 'seg-sex', on: true, kind: 'day' },
  { id: 'a4', label: 'Depois do almoço', time: '13:30', days: 'todo dia', on: true, kind: 'day' },
  { id: 'a5', label: 'Lanchinho', time: '15:30', days: 'todo dia', on: true, kind: 'day' },
  { id: 'a6', label: 'Jantar', time: '18:30', days: 'todo dia', on: true, kind: 'day' },
  { id: 'a7', label: 'Antes de dormir', time: '20:30', days: 'todo dia', on: true, kind: 'day' },
  { id: 'a8', label: 'Madrugada', time: '02:00', days: 'todo dia', on: false, kind: 'night' },
];

const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', name: 'Sorvete', icon: '🍦', cost: 30 },
  { id: 'r2', name: 'Cinema', icon: '🎬', cost: 60 },
  { id: 'r3', name: 'Hambúrguer', icon: '🍔', cost: 80 },
  { id: 'r4', name: 'Pula-pula', icon: '🎪', cost: 120 },
  { id: 'r5', name: 'Brinquedo', icon: '🧸', cost: 200 },
  { id: 'r6', name: 'Piscina', icon: '🏊', cost: 150 },
  { id: 'r7', name: 'Livro', icon: '📚', cost: 100 },
  { id: 'r8', name: 'Disney+', icon: '🏰', cost: 1500 },
];

// ─── Store ─────────────────────────────────────────────────────

interface AppState {
  // onboarding
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;

  // mode & profile
  mode: 'kid' | 'parent';
  setMode: (m: 'kid' | 'parent') => void;
  profile: KidProfile | null;
  setProfile: (p: KidProfile) => void;

  // theme
  palette: Palette;
  setPalette: (p: Palette) => void;

  // stars & rewards
  stars: number;
  rewards: Reward[];
  redemptions: Redemption[];
  savingFor: string | null;
  earnStars: (n: number) => void;
  redeemReward: (id: string) => void;
  addReward: (r: Reward) => void;
  deleteReward: (id: string) => void;
  markDelivered: (redemptionId: string) => void;
  setSavingFor: (id: string | null) => void;

  // diary
  entries: DiaryEntry[];
  addEntry: (e: DiaryEntry) => void;

  // alarms
  alarms: Alarm[];
  toggleAlarm: (id: string) => void;

  // missions (reset at midnight — simplified: per-session)
  missionsDone: MissionsDone;
  completeMission: (key: keyof MissionsDone) => void;
  resetMissions: () => void;
}

export const useAppStore = create<AppState>((set) => ({
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
  redeemReward: (id) =>
    set((s) => {
      const reward = s.rewards.find((r) => r.id === id);
      if (!reward || s.stars < reward.cost) return s;
      const redemption: Redemption = {
        id: Date.now().toString(),
        rewardId: id,
        redeemedAt: new Date(),
        status: 'pending',
      };
      return {
        stars: s.stars - reward.cost,
        redemptions: [...s.redemptions, redemption],
        savingFor: s.savingFor === id ? null : s.savingFor,
      };
    }),
  addReward: (r) => set((s) => ({ rewards: [...s.rewards, r] })),
  deleteReward: (id) => set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) })),
  markDelivered: (redemptionId) =>
    set((s) => ({
      redemptions: s.redemptions.map((r) =>
        r.id === redemptionId ? { ...r, status: 'delivered' } : r,
      ),
    })),
  setSavingFor: (id) => set({ savingFor: id }),

  entries: [],
  addEntry: (e) => set((s) => ({ entries: [...s.entries, e] })),

  alarms: DEFAULT_ALARMS,
  toggleAlarm: (id) =>
    set((s) => ({
      alarms: s.alarms.map((a) => (a.id === id ? { ...a, on: !a.on } : a)),
    })),

  missionsDone: { mic: false, water: false, game: false, learn: false },
  completeMission: (key) =>
    set((s) => ({ missionsDone: { ...s.missionsDone, [key]: true } })),
  resetMissions: () =>
    set({ missionsDone: { mic: false, water: false, game: false, learn: false } }),
}));
