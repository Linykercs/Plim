import type { DiaryEntry, KidProfile, MissionsDone, Redemption } from '../store/useAppStore';

// Dados de demonstração: 3 semanas de uso realista para apresentações
// (banca, professora, famílias). A história que os dados contam: criança
// com enurese e constipação melhorando com o uso, escapes caindo de 4
// na primeira semana para 1 na última, Bristol indo de 2 para 4, e
// hidratação subindo. A lagoa fica na fase 3 (Lagoa Acordando).

function at(daysAgo: number, h: number, m: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export interface DemoData {
  profile: KidProfile;
  entries: DiaryEntry[];
  waterHistory: { date: string; cups: number }[];
  waterToday: number;
  stars: number;
  starsLifetime: number;
  redemptions: Redemption[];
  savingFor: string | null;
  unlockedAvatars: number[];
  missionsDone: MissionsDone;
}

export function buildDemoData(): DemoData {
  const entries: DiaryEntry[] = [];
  const waterHistory: { date: string; cups: number }[] = [];

  // Dias de escape, do mais antigo ao mais recente: 4 na semana 1,
  // 2 na semana 2, 1 na semana 3
  const escapeDays = new Set([20, 18, 16, 14, 12, 9, 3]);

  for (let daysAgo = 20; daysAgo >= 1; daysAgo--) {
    const week = daysAgo > 13 ? 0 : daysAgo > 6 ? 1 : 2; // 0 = mais antiga

    // 3 a 4 registros de xixi por dia
    const micTimes: [number, number][] = [[7, 40], [12, 15], [16, 30]];
    if (daysAgo % 2 === 0) micTimes.push([20, 10]);
    micTimes.forEach(([h, m], idx) => {
      const colors = week === 0 ? ['c3', 'c3', 'c2'] : week === 1 ? ['c2', 'c2', 'c1'] : ['c1', 'c2', 'c1'];
      entries.push({
        id: `demo-mic-${daysAgo}-${idx}`,
        type: 'mic',
        createdAt: at(daysAgo, h, m),
        cups: 1 + ((daysAgo + idx) % 2),
        color: colors[idx % colors.length],
        triggers: idx === 0 ? ['do'] : idx === 1 ? ['es'] : ['br'],
        note: '',
      });
    });

    // Cocô em dias alternados, Bristol melhorando: 2 -> 3 -> 4
    if (daysAgo % 2 === 0) {
      const bristol = (week === 0 ? 2 : week === 1 ? 3 : 4) as 2 | 3 | 4;
      entries.push({
        id: `demo-evac-${daysAgo}`,
        type: 'evac',
        createdAt: at(daysAgo, 8, 20),
        bristol,
        poopSize: 'medium',
        note: '',
      });
    }

    // Escapes noturnos em queda
    if (escapeDays.has(daysAgo)) {
      entries.push({
        id: `demo-inc-${daysAgo}`,
        type: 'inc',
        createdAt: at(daysAgo, 6, 50),
        note: daysAgo === 3 ? 'Acordou e avisou sozinha' : undefined,
      });
    }

    // Hidratação subindo: ~3 copos na semana 1 até ~7 na semana 3
    const baseCups = 3 + week * 2;
    const histDate = new Date();
    histDate.setDate(histDate.getDate() - daysAgo);
    waterHistory.push({ date: histDate.toDateString(), cups: baseCups + (daysAgo % 2) });
  }

  // Hoje: registro da manhã feito, água em andamento
  entries.push({
    id: 'demo-mic-0',
    type: 'mic',
    createdAt: at(0, 7, 35),
    cups: 1,
    color: 'c1',
    triggers: ['do'],
    note: '',
  });

  const profile: KidProfile = {
    id: 'demo-kid',
    name: 'Sofia',
    age: 7,
    avatarColor: 0,
    conditions: ['enuresis', 'constipation'],
    professional: { name: 'Dra. Ana (uroterapia)' },
    createdAt: at(21, 10, 0),
  };

  return {
    profile,
    entries,
    waterHistory,
    waterToday: 2,
    // Saldo coerente: 240 ganhos na vida, menos sorvete (30),
    // cinema (60) e um avatar (25)
    stars: 125,
    starsLifetime: 240,
    redemptions: [
      { id: 'demo-red-1', rewardId: 'r1', redeemedAt: at(10, 17, 0), status: 'delivered' },
      { id: 'demo-red-2', rewardId: 'r2', redeemedAt: at(2, 18, 30), status: 'pending' },
    ],
    savingFor: 'r5',
    unlockedAvatars: [0, 2],
    missionsDone: { mic: true, water: true, game: false, learn: false, evac: false },
  };
}
