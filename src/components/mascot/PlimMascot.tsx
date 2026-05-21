import React from 'react';
import Svg, { Ellipse, Circle, Path } from 'react-native-svg';

export type MascotMood = 'happy' | 'cheer' | 'sleepy' | 'focus' | 'water' | 'splash';

interface PlimMascotProps {
  size?: number;
  mood?: MascotMood;
  primary?: string;
  accent?: string;
  dark?: string;
}

const EYE_CONFIGS: Record<MascotMood, { lx: number; ly: number; rx: number; ry: number; py: number; blink: boolean; look: number }> = {
  happy:  { lx: 70, ly: 70, rx: 130, ry: 70, py: 4, blink: false, look: 0 },
  cheer:  { lx: 68, ly: 60, rx: 132, ry: 60, py: 0, blink: false, look: 0 },
  sleepy: { lx: 70, ly: 78, rx: 130, ry: 78, py: 6, blink: true,  look: 0 },
  focus:  { lx: 70, ly: 76, rx: 130, ry: 76, py: 0, blink: false, look: -3 },
  water:  { lx: 70, ly: 70, rx: 130, ry: 70, py: 4, blink: false, look: 0 },
  splash: { lx: 68, ly: 62, rx: 132, ry: 62, py: -3, blink: false, look: 0 },
};

export default function PlimMascot({
  size = 120,
  mood = 'happy',
  primary = '#5FCB8E',
  accent = '#FF8A7A',
  dark = '#1F3A4D',
}: PlimMascotProps) {
  const belly = '#FFF7EC';
  const bellyDark = '#E9C97B';
  const e = EYE_CONFIGS[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* legs behind body */}
      <Ellipse cx="38" cy="170" rx="20" ry="12" fill={primary} />
      <Ellipse cx="162" cy="170" rx="20" ry="12" fill={primary} />
      <Circle cx="22" cy="172" r="6" fill={primary} />
      <Circle cx="178" cy="172" r="6" fill={primary} />

      {/* body */}
      <Ellipse cx="100" cy="130" rx="78" ry="58" fill={primary} />

      {/* belly */}
      <Ellipse cx="100" cy="143" rx="52" ry="40" fill={belly} opacity="0.95" />
      <Ellipse cx="100" cy="143" rx="52" ry="40" fill="none" stroke={bellyDark} strokeWidth="2" opacity="0.35" />

      {/* eye bumps */}
      <Circle cx={e.lx} cy={e.ly} r="30" fill={primary} />
      <Circle cx={e.rx} cy={e.ry} r="30" fill={primary} />

      {/* eye whites */}
      <Circle cx={e.lx} cy={e.ly + 2} r="23" fill="white" />
      <Circle cx={e.rx} cy={e.ry + 2} r="23" fill="white" />

      {/* pupils or blink */}
      {e.blink ? (
        <>
          <Path
            d={`M ${e.lx - 14} ${e.ly + 2} Q ${e.lx} ${e.ly + 8} ${e.lx + 14} ${e.ly + 2}`}
            stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round"
          />
          <Path
            d={`M ${e.rx - 14} ${e.ry + 2} Q ${e.rx} ${e.ry + 8} ${e.rx + 14} ${e.ry + 2}`}
            stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <Circle cx={e.lx + e.look} cy={e.ly + e.py + 2} r="11" fill={dark} />
          <Circle cx={e.rx + e.look} cy={e.ry + e.py + 2} r="11" fill={dark} />
          <Circle cx={e.lx + e.look + 4} cy={e.ly + e.py - 2} r="4" fill="white" />
          <Circle cx={e.rx + e.look + 4} cy={e.ry + e.py - 2} r="4" fill="white" />
        </>
      )}

      {/* cheeks */}
      <Ellipse cx="50" cy="140" rx="12" ry="8" fill={accent} opacity="0.55" />
      <Ellipse cx="150" cy="140" rx="12" ry="8" fill={accent} opacity="0.55" />

      {/* mouth by mood */}
      {(mood === 'happy' || mood === 'water') && (
        <Path d="M 78 142 Q 100 162 122 142" stroke={dark} strokeWidth="5" fill="none" strokeLinecap="round" />
      )}
      {(mood === 'cheer' || mood === 'splash') && (
        <Path
          d={mood === 'cheer'
            ? "M 72 138 Q 100 172 128 138 Q 100 158 72 138 Z"
            : "M 72 138 Q 100 178 128 138 Q 100 158 72 138 Z"}
          fill={dark} stroke={dark} strokeWidth="2" strokeLinejoin="round"
        />
      )}
      {mood === 'sleepy' && (
        <Path d="M 88 148 Q 100 156 112 148" stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
      {mood === 'focus' && (
        <Path d="M 86 148 L 114 148" stroke={dark} strokeWidth="5" fill="none" strokeLinecap="round" />
      )}

      {/* mood extras */}
      {mood === 'water' && (
        <>
          <Path d="M 100 22 Q 110 38 110 48 A 10 10 0 1 1 90 48 Q 90 38 100 22 Z" fill="#7DC9E8" opacity="0.85" />
          <Circle cx="96" cy="42" r="3" fill="white" opacity="0.7" />
        </>
      )}
      {mood === 'splash' && (
        <>
          <Circle cx="30" cy="50" r="6" fill="#7DC9E8" />
          <Circle cx="170" cy="50" r="5" fill="#7DC9E8" />
          <Circle cx="20" cy="100" r="4" fill="#7DC9E8" />
          <Circle cx="180" cy="95" r="4" fill="#7DC9E8" />
        </>
      )}
      {mood === 'cheer' && (
        <>
          <Path d="M 30 60 L 22 50 M 25 75 L 12 75 M 30 90 L 22 100" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <Path d="M 170 60 L 178 50 M 175 75 L 188 75 M 170 90 L 178 100" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}
