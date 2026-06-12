// Dificuldade dos jogos por faixa etária. Regra clínica do Foguete:
// o descanso entre contrações é sempre maior ou igual à contração.

export interface GameDifficulty {
  rocketHoldMs: number;
  rocketRestMs: number;
  rocketReps: number;
  balloonCycles: number;
  frogJumps: number;
  frogSeconds: number;
}

export function gameDifficulty(age?: number): GameDifficulty {
  if (age !== undefined && age <= 5) {
    return {
      rocketHoldMs: 3000, rocketRestMs: 6000, rocketReps: 5,
      balloonCycles: 4,
      frogJumps: 10, frogSeconds: 30,
    };
  }
  if (age !== undefined && age <= 7) {
    return {
      rocketHoldMs: 5000, rocketRestMs: 10000, rocketReps: 6,
      balloonCycles: 5,
      frogJumps: 15, frogSeconds: 30,
    };
  }
  return {
    rocketHoldMs: 8000, rocketRestMs: 10000, rocketReps: 8,
    balloonCycles: 6,
    frogJumps: 20, frogSeconds: 30,
  };
}
