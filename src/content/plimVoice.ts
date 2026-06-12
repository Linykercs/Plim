// Voz do Plim: frases curtas e calorosas, vocabulário de 5 a 11 anos.
// Regras do personagem: acidente nunca é culpa, honestidade sempre é
// celebrada, e o Plim fala como um amigo, não como um aplicativo.

export type PlimContext =
  | 'welcome'    // Home, dia normal
  | 'allDone'    // Home, todas as missões do dia completas
  | 'diaryMic'   // recompensa do registro de xixi
  | 'diaryEvac'  // recompensa do registro de cocô
  | 'escape'     // registro de escape
  | 'gameDone'   // fim de minigame
  | 'water'      // hidratação
  | 'night';     // lembretes noturnos

const PHRASES: Record<PlimContext, string[]> = {
  welcome: [
    'Bora brincar?',
    'Que bom te ver!',
    'Pronto pra missão?',
    'Eu estava te esperando!',
  ],
  allDone: [
    'Você brilhou hoje!',
    'Tudo completo! Uhu!',
    'Que dia incrível!',
  ],
  diaryMic: [
    'Ótimo registro!',
    'Anotado! Valeu por me contar!',
    'Você cuida muito bem do seu corpo!',
  ],
  diaryEvac: [
    'Mandou bem!',
    'Registrado! Você é demais!',
  ],
  escape: [
    'Splash! Acontece com todo sapo, até comigo.',
    'Obrigado por me contar. Isso ajuda muito!',
  ],
  gameDone: [
    'Treino feito! Que força!',
    'Arrasou no treino!',
    'Você fica mais forte a cada dia!',
  ],
  water: [
    'Glub glub! Água é vida de sapo!',
    'Sua bexiga agradece!',
  ],
  night: [
    'Aaahm... um xixizinho antes de dormir?',
    'Sapo dorme melhor depois do xixi!',
  ],
};

export function plimSay(ctx: PlimContext): string {
  const list = PHRASES[ctx];
  return list[Math.floor(Math.random() * list.length)];
}
