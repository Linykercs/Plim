import React from 'react';
import Svg, { Circle, Line, G } from 'react-native-svg';

interface Props {
  hour: number;
  minute: number;
  size?: number;
  color?: string;
}

export default function ClockFace({ hour, minute, size = 80, color = '#1F3A4D' }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const hourAngle = (((hour % 12) + minute / 60) * 30 - 90) * (Math.PI / 180);
  const minAngle = (minute * 6 - 90) * (Math.PI / 180);
  const hourLen = r * 0.5;
  const minLen = r * 0.7;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={cx} cy={cy} r={r} fill="#FFF7EC" stroke={color} strokeWidth={2} />
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180);
        const x1 = cx + (r - 4) * Math.cos(a);
        const y1 = cy + (r - 4) * Math.sin(a);
        const x2 = cx + r * Math.cos(a);
        const y2 = cy + r * Math.sin(a);
        return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={i % 3 === 0 ? 2 : 1} strokeLinecap="round" />;
      })}
      <Line
        x1={cx}
        y1={cy}
        x2={cx + hourLen * Math.cos(hourAngle)}
        y2={cy + hourLen * Math.sin(hourAngle)}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Line
        x1={cx}
        y1={cy}
        x2={cx + minLen * Math.cos(minAngle)}
        y2={cy + minLen * Math.sin(minAngle)}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={cx} cy={cy} r={3} fill={color} />
    </Svg>
  );
}
