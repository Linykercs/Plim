import sharp from 'sharp';
import { writeFileSync } from 'fs';

const SIZE = 512;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6FD9A0"/>
      <stop offset="100%" stop-color="#3DA070"/>
    </linearGradient>
    <linearGradient id="dropGrad" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#C8F0DC" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="frogGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5FCB8E"/>
      <stop offset="100%" stop-color="#2E9060"/>
    </linearGradient>
  </defs>

  <!-- Background rounded square -->
  <rect width="512" height="512" rx="112" ry="112" fill="url(#bg)"/>

  <!-- Subtle inner glow ring -->
  <rect x="12" y="12" width="488" height="488" rx="104" ry="104"
        fill="none" stroke="#ffffff" stroke-width="3" stroke-opacity="0.18"/>

  <!-- Water drop body -->
  <path d="M256 108
           C256 108 168 210 168 278
           C168 325 207 362 256 362
           C305 362 344 325 344 278
           C344 210 256 108 256 108 Z"
        fill="url(#dropGrad)"/>

  <!-- Drop shine highlight -->
  <ellipse cx="232" cy="218" rx="18" ry="28"
           fill="#ffffff" opacity="0.55" transform="rotate(-20 232 218)"/>

  <!-- Frog eyes on top of drop -->
  <!-- Left eye white -->
  <circle cx="220" cy="172" r="26" fill="#ffffff" opacity="0.95"/>
  <!-- Right eye white -->
  <circle cx="292" cy="172" r="26" fill="#ffffff" opacity="0.95"/>
  <!-- Left pupil -->
  <circle cx="222" cy="174" r="14" fill="#1F3A4D"/>
  <circle cx="216" cy="168" r="5" fill="#ffffff"/>
  <!-- Right pupil -->
  <circle cx="294" cy="174" r="14" fill="#1F3A4D"/>
  <circle cx="288" cy="168" r="5" fill="#ffffff"/>

  <!-- Smile -->
  <path d="M232 310 Q256 332 280 310"
        fill="none" stroke="#3DA070" stroke-width="7"
        stroke-linecap="round"/>

  <!-- Cheek blushes -->
  <ellipse cx="210" cy="300" rx="16" ry="10" fill="#FF8A7A" opacity="0.45"/>
  <ellipse cx="302" cy="300" rx="16" ry="10" fill="#FF8A7A" opacity="0.45"/>

  <!-- "plim" text -->
  <text x="256" y="434"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-weight="800"
        font-size="72"
        letter-spacing="4"
        text-anchor="middle"
        fill="#ffffff"
        opacity="0.96">plim</text>

  <!-- Small sparkles -->
  <circle cx="140" cy="148" r="6" fill="#ffffff" opacity="0.7"/>
  <circle cx="372" cy="130" r="4" fill="#ffffff" opacity="0.55"/>
  <circle cx="390" cy="320" r="5" fill="#ffffff" opacity="0.5"/>
  <circle cx="122" cy="340" r="4" fill="#ffffff" opacity="0.45"/>
</svg>`;

const buf = Buffer.from(svg);

await sharp(buf)
  .resize(512, 512)
  .png()
  .toFile('assets/icon.png');

// Also write smaller versions needed by Expo
await sharp(buf).resize(192, 192).png().toFile('assets/android-icon-foreground.png');
await sharp(buf).resize(192, 192).png().toFile('assets/favicon.png');
await sharp(buf).resize(200, 200).png().toFile('assets/splash-icon.png');

console.log('Icons generated successfully.');
