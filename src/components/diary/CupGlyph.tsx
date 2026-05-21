import React from 'react';
import Svg, { Path, Defs, ClipPath, Rect, G } from 'react-native-svg';

interface Props {
  fill?: number; // 0..1
  color?: string;
  size?: number;
}

export default function CupGlyph({ fill = 0.5, color = '#7DC9E8', size = 48 }: Props) {
  // Cup trapezoid: top wider, bottom narrower
  const w = size;
  const h = size;
  const topL = w * 0.12;
  const topR = w * 0.88;
  const botL = w * 0.22;
  const botR = w * 0.78;
  const cupTop = h * 0.1;
  const cupBot = h * 0.9;
  const cupPath = `M${topL},${cupTop} L${topR},${cupTop} L${botR},${cupBot} L${botL},${cupBot} Z`;

  const fillY = cupTop + (cupBot - cupTop) * (1 - fill);

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <ClipPath id="cup-clip">
          <Path d={cupPath} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#cup-clip)">
        <Rect x={0} y={fillY} width={w} height={h} fill={color + 'AA'} />
      </G>
      <Path d={cupPath} fill="none" stroke="#1F3A4D" strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}
