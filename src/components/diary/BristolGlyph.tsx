import React from 'react';
import Svg, { Ellipse, Circle, Path, Rect, G } from 'react-native-svg';

interface Props {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  size?: number;
}

const COLORS: Record<number, string> = {
  1: '#8B6F47', 2: '#7E6A52', 3: '#9E8466', 4: '#B89773', 5: '#C7A584', 6: '#A8804A', 7: '#7E5A28',
};

function T1() {
  return (
    <G>
      {[10, 26, 42, 22, 34].map((cx, i) => (
        <Circle key={i} cx={cx} cy={i < 3 ? 32 : 44} r={7} fill={COLORS[1]} />
      ))}
    </G>
  );
}

function T2() {
  return (
    <G>
      <Ellipse cx={32} cy={32} rx={18} ry={9} fill={COLORS[2]} />
      {[14, 24, 36, 46].map((cx, i) => (
        <Circle key={i} cx={cx} cy={32} r={4} fill={COLORS[2] + 'BB'} />
      ))}
    </G>
  );
}

function T3() {
  return (
    <G>
      <Ellipse cx={32} cy={32} rx={18} ry={9} fill={COLORS[3]} />
      <Path d="M16 28 Q22 32 28 28 Q34 32 40 28 Q46 32 48 28" fill="none" stroke={COLORS[1]} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M16 36 Q22 32 28 36 Q34 32 40 36 Q46 32 48 36" fill="none" stroke={COLORS[1]} strokeWidth={1.5} strokeLinecap="round" />
    </G>
  );
}

function T4() {
  return <Ellipse cx={32} cy={32} rx={18} ry={9} fill={COLORS[4]} />;
}

function T5() {
  return (
    <G>
      {[18, 32, 46].map((cx, i) => (
        <Ellipse key={i} cx={cx} cy={32} rx={8} ry={10} fill={COLORS[5]} />
      ))}
    </G>
  );
}

function T6() {
  return (
    <G>
      <Path d="M14 26 Q18 20 22 26 Q26 32 30 26 Q34 20 38 26 Q42 32 46 26 Q50 20 50 26 L50 38 Q46 44 42 38 Q38 32 34 38 Q30 44 26 38 Q22 32 18 38 Q14 44 14 38 Z" fill={COLORS[6]} />
    </G>
  );
}

function T7() {
  return <Ellipse cx={32} cy={36} rx={20} ry={8} fill={COLORS[7]} />;
}

const SHAPES = { 1: T1, 2: T2, 3: T3, 4: T4, 5: T5, 6: T6, 7: T7 };

export default function BristolGlyph({ type, size = 64 }: Props) {
  const Shape = SHAPES[type];
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Shape />
    </Svg>
  );
}
