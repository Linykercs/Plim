// A Lagoa do Plim: a narrativa central do app. Cada dia com registro
// devolve vida à lagoa; ela só floresce, nunca murcha de volta.

export interface LagoonPhase {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  /** Dias ativos necessários para a PRÓXIMA fase (undefined na última) */
  nextAt?: number;
}

const PHASES: { minDays: number; phase: LagoonPhase }[] = [
  { minDays: 0,  phase: { level: 1, name: 'Lagoa Adormecida',    nextAt: 3 } },
  { minDays: 3,  phase: { level: 2, name: 'Primeiro Broto',      nextAt: 10 } },
  { minDays: 10, phase: { level: 3, name: 'Lagoa Acordando',     nextAt: 25 } },
  { minDays: 25, phase: { level: 4, name: 'Festa dos Vagalumes', nextAt: 50 } },
  { minDays: 50, phase: { level: 5, name: 'Lagoa Encantada' } },
];

export function lagoonPhase(activeDays: number): LagoonPhase {
  let current = PHASES[0].phase;
  for (const p of PHASES) {
    if (activeDays >= p.minDays) current = p.phase;
  }
  return current;
}
