import * as Speech from 'expo-speech';

// Leitura assistida: metade do público (4 a 6 anos) ainda não lê.
// Voz em pt-BR, um pouco mais aguda e calma para soar como o Plim.

export function speak(text: string) {
  Speech.stop();
  Speech.speak(text, {
    language: 'pt-BR',
    pitch: 1.1,
    rate: 0.95,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
