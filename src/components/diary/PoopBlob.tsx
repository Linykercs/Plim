import React from 'react';
import Svg, { Ellipse, Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export default function PoopBlob({ size = 64, color = '#B89773' }: Props) {
  const cx = size / 2;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Ellipse cx={32} cy={52} rx={18} ry={10} fill={color} />
      <Ellipse cx={32} cy={42} rx={14} ry={10} fill={color} />
      <Ellipse cx={32} cy={33} rx={10} ry={9} fill={color} />
      <Ellipse cx={32} cy={26} rx={7} ry={7} fill={color} />
      {/* Eyes */}
      <Circle cx={29} cy={25} r={1.8} fill="#fff" />
      <Circle cx={35} cy={25} r={1.8} fill="#fff" />
      <Circle cx={29.6} cy={25.4} r={0.9} fill="#1F3A4D" />
      <Circle cx={35.6} cy={25.4} r={0.9} fill="#1F3A4D" />
      {/* Smile */}
      <Path d="M29 28.5 Q32 31 35 28.5" fill="none" stroke="#1F3A4D" strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}
