import React from 'react';
import Svg, { Ellipse, Circle, Path, G } from 'react-native-svg';

// Cena da Lagoa do Plim: ganha elementos conforme a fase sobe.
// Fase 1: água e uma pedra. 2: primeira vitória-régia com broto.
// 3: peixinho e juncos. 4: vagalumes. 5: flores abertas por toda parte.

interface Props {
  phase: 1 | 2 | 3 | 4 | 5;
  width?: number;
  height?: number;
}

export default function LagoonScene({ phase, width = 320, height = 64 }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 320 64">
      {/* Água */}
      <Ellipse cx={160} cy={50} rx={155} ry={14} fill="#FFFFFF" opacity={0.28} />
      <Ellipse cx={160} cy={52} rx={130} ry={10} fill="#FFFFFF" opacity={0.22} />

      {/* Pedra (sempre) */}
      <Ellipse cx={42} cy={48} rx={16} ry={8} fill="#FFFFFF" opacity={0.45} />

      {/* Fase 2+: primeira vitória-régia com broto */}
      {phase >= 2 && (
        <G>
          <Ellipse cx={110} cy={50} rx={18} ry={6} fill="#A7E8C3" />
          <Path d="M110 50 L122 47 L118 52 Z" fill="#7FD6A4" />
          <Path d="M108 44 Q110 36 112 44" stroke="#7FD6A4" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </G>
      )}

      {/* Fase 3+: peixinho, juncos e segunda vitória-régia */}
      {phase >= 3 && (
        <G>
          <Ellipse cx={210} cy={52} rx={14} ry={5} fill="#A7E8C3" />
          <Path d="M250 50 Q254 44 258 50 L252 52 Z" fill="#FFD66B" />
          <Circle cx={255} cy={48} r={1.4} fill="#1F3A4D" />
          <Path d="M284 50 Q283 34 285 30" stroke="#7FD6A4" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <Path d="M292 50 Q293 38 291 34" stroke="#7FD6A4" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <Ellipse cx={285} cy={28} rx={3} ry={5} fill="#C497F0" />
        </G>
      )}

      {/* Fase 4+: vagalumes */}
      {phase >= 4 && (
        <G>
          <Circle cx={70} cy={20} r={3} fill="#FFE9A8" opacity={0.95} />
          <Circle cx={70} cy={20} r={6} fill="#FFE9A8" opacity={0.3} />
          <Circle cx={180} cy={12} r={2.5} fill="#FFE9A8" opacity={0.95} />
          <Circle cx={180} cy={12} r={5} fill="#FFE9A8" opacity={0.3} />
          <Circle cx={245} cy={24} r={2.5} fill="#FFE9A8" opacity={0.95} />
          <Circle cx={245} cy={24} r={5} fill="#FFE9A8" opacity={0.3} />
        </G>
      )}

      {/* Fase 5: flores abertas e brilhos */}
      {phase >= 5 && (
        <G>
          <Flower cx={110} cy={40} />
          <Flower cx={210} cy={44} />
          <Path d="M150 16 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#FFFFFF" opacity={0.85} />
          <Path d="M30 26 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5 Z" fill="#FFFFFF" opacity={0.7} />
        </G>
      )}
    </Svg>
  );
}

function Flower({ cx, cy }: { cx: number; cy: number }) {
  return (
    <G>
      <Circle cx={cx - 4} cy={cy - 2} r={3.4} fill="#F9A8D4" />
      <Circle cx={cx + 4} cy={cy - 2} r={3.4} fill="#F9A8D4" />
      <Circle cx={cx} cy={cy - 6} r={3.4} fill="#F9A8D4" />
      <Circle cx={cx} cy={cy + 2} r={3.4} fill="#F9A8D4" />
      <Circle cx={cx} cy={cy - 2} r={2.6} fill="#FFD66B" />
    </G>
  );
}
