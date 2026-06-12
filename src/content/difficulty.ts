// Protocolos de exercício VALIDADOS pela equipe de uroterapia da
// Pós-Graduação em Estomaterapia (Hospital Israelita Albert Einstein),
// em 12/06/2026. Não alterar sem nova validação clínica.

// Contração lenta (Foguete): contração 5s, relaxamento 5s, 10 repetições.
// Uma sessão de jogo = 1 série; recomendação clínica: 3 séries por dia.
export const ROCKET_PROTOCOL = {
  holdMs: 5000,
  restMs: 5000,
  reps: 10,
  seriesPerDay: 3,
} as const;

// Contrações rápidas (Pulo do Sapo): 10 contrações rápidas consecutivas,
// intervalo de 30 segundos, 3 séries.
export const FROG_PROTOCOL = {
  jumpsPerSeries: 10,
  restSeconds: 30,
  series: 3,
} as const;

// Respiração diafragmática (Balão): 5 a 10 ciclos, 3 vezes ao dia,
// antes dos exercícios do assoalho pélvico. Dentro da faixa validada,
// os menores fazem menos ciclos.
export function balloonCycles(age?: number): number {
  if (age !== undefined && age <= 5) return 5;
  if (age !== undefined && age <= 7) return 6;
  return 8;
}
