import { writeFileSync } from 'fs';

const SAMPLE_RATE = 44100;
const DURATION = 0.45; // seconds
const CHANNELS = 1;
const BIT_DEPTH = 16;

const numSamples = Math.floor(SAMPLE_RATE * DURATION);
const dataSize = numSamples * CHANNELS * (BIT_DEPTH / 8);
const fileSize = 44 + dataSize - 8;

const buf = Buffer.alloc(44 + dataSize);

// RIFF header
buf.write('RIFF', 0);
buf.writeUInt32LE(fileSize, 4);
buf.write('WAVE', 8);

// fmt chunk
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);           // chunk size
buf.writeUInt16LE(1, 20);            // PCM
buf.writeUInt16LE(CHANNELS, 22);
buf.writeUInt32LE(SAMPLE_RATE, 24);
buf.writeUInt32LE(SAMPLE_RATE * CHANNELS * (BIT_DEPTH / 8), 28); // byte rate
buf.writeUInt16LE(CHANNELS * (BIT_DEPTH / 8), 32);               // block align
buf.writeUInt16LE(BIT_DEPTH, 34);

// data chunk
buf.write('data', 36);
buf.writeUInt32LE(dataSize, 40);

// Plim = two-tone chime: 1047 Hz (C6) → 1319 Hz (E6), short attack, exponential decay
for (let i = 0; i < numSamples; i++) {
  const t = i / SAMPLE_RATE;

  // Frequency glides from 1047 → 880 Hz in first 30ms, then stays
  const freq = t < 0.03 ? 1047 + (880 - 1047) * (t / 0.03) : 880;

  // Exponential decay envelope (attack 5ms, then decay)
  const attack = Math.min(t / 0.005, 1);
  const decay = Math.exp(-t * 9);
  const envelope = attack * decay;

  // Second harmonic for a richer "water drop" timbre
  const sample = envelope * (
    0.7 * Math.sin(2 * Math.PI * freq * t) +
    0.2 * Math.sin(2 * Math.PI * freq * 2 * t) +
    0.1 * Math.sin(2 * Math.PI * freq * 3 * t)
  );

  const value = Math.max(-1, Math.min(1, sample));
  buf.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
}

writeFileSync('assets/sounds/plim.wav', buf);
console.log('Sound generated: assets/sounds/plim.wav');
