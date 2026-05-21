import React from 'react';
import Svg, { Path, Circle, Polygon, Ellipse } from 'react-native-svg';

export type IconName =
  | 'home' | 'diary' | 'drop' | 'poop' | 'bell' | 'play' | 'star' | 'book'
  | 'chart' | 'pdf' | 'plus' | 'check' | 'chevron' | 'back' | 'close'
  | 'settings' | 'user' | 'family' | 'moon' | 'sun' | 'fire' | 'target'
  | 'sparkle' | 'rocket' | 'balloon' | 'frog' | 'refresh' | 'clock' | 'share' | 'pause';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function PlimIcon({ name, size = 24, color = '#1F3A4D', strokeWidth = 2 }: Props) {
  const s = {
    fill: 'none' as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const icons: Record<IconName, React.ReactNode> = {
    home: <Path {...s} d="M3 11L12 3l9 8v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" />,
    diary: (
      <>
        <Path {...s} d="M5 4a2 2 0 012-2h12v18H7a2 2 0 01-2-2z" />
        <Path {...s} d="M5 18a2 2 0 002 2" />
      </>
    ),
    drop: <Path {...s} d="M12 3c4 5 7 8 7 12a7 7 0 11-14 0c0-4 3-7 7-12z" />,
    poop: (
      <>
        <Path {...s} d="M9 7a3 3 0 113 3M6 11a3 3 0 102 5h8a3 3 0 102-5" />
        <Path {...s} d="M5 17h14" />
      </>
    ),
    bell: (
      <>
        <Path {...s} d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9z" />
        <Path {...s} d="M10 21a2 2 0 004 0" />
      </>
    ),
    play: <Polygon {...s} fill={color} points="6 4 20 12 6 20" />,
    star: <Polygon {...s} fill={color} points="12 3 14.9 9.3 22 10.3 17 15 18.2 22 12 18.8 5.8 22 7 15 2 10.3 9.1 9.3" />,
    book: (
      <>
        <Path {...s} d="M4 19a2 2 0 002 2h14V3H6a2 2 0 00-2 2z" />
        <Path {...s} d="M4 19V5M9 7h7M9 11h7" />
      </>
    ),
    chart: <Path {...s} d="M3 21h18M6 17V9m6 8V5m6 12v-6" />,
    pdf: (
      <>
        <Path {...s} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <Path {...s} d="M14 2v6h6M9 13h6M9 17h4" />
      </>
    ),
    plus: <Path {...s} d="M12 5v14M5 12h14" />,
    check: <Path {...s} d="M5 12l5 5 9-11" />,
    chevron: <Path {...s} d="M9 6l6 6-6 6" />,
    back: <Path {...s} d="M15 6l-6 6 6 6" />,
    close: <Path {...s} d="M6 6l12 12M6 18L18 6" />,
    settings: (
      <>
        <Circle {...s} cx="12" cy="12" r="3" />
        <Path {...s} d="M19 12a7 7 0 00-.1-1.3l2-1.5-2-3.4-2.4.8a7 7 0 00-2.2-1.3L14 3h-4l-.3 2.3a7 7 0 00-2.2 1.3L5 5.8 3 9.2l2 1.5a7 7 0 000 2.6l-2 1.5 2 3.4 2.4-.8a7 7 0 002.2 1.3L10 21h4l.3-2.3a7 7 0 002.2-1.3l2.4.8 2-3.4-2-1.5c0-.4.1-.9.1-1.3z" />
      </>
    ),
    user: (
      <>
        <Circle {...s} cx="12" cy="8" r="4" />
        <Path {...s} d="M4 21c0-4 4-7 8-7s8 3 8 7" />
      </>
    ),
    family: (
      <>
        <Circle {...s} cx="9" cy="8" r="3" />
        <Circle {...s} cx="17" cy="9" r="2.5" />
        <Path {...s} d="M3 20c0-3 3-6 6-6s6 3 6 6M13 20c.4-2 2.4-4 4-4s3.6 2 4 4" />
      </>
    ),
    moon: <Path {...s} d="M21 13A9 9 0 1111 3a7 7 0 0010 10z" />,
    sun: (
      <>
        <Circle {...s} cx="12" cy="12" r="4" />
        <Path {...s} d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    fire: <Path {...s} d="M12 3s4 5 4 9a4 4 0 11-8 0c0-2 1-3 1-3s-2 4 1 6" />,
    target: (
      <>
        <Circle {...s} cx="12" cy="12" r="9" />
        <Circle {...s} cx="12" cy="12" r="5" />
        <Circle {...s} cx="12" cy="12" r="1.5" fill={color} />
      </>
    ),
    sparkle: <Path {...s} d="M12 3v6M12 15v6M3 12h6M15 12h6" />,
    rocket: (
      <>
        <Path {...s} d="M14 4s6 0 6 6c0 0-3 3-6 3l-3-3c0-3 3-6 3-6z" />
        <Path {...s} d="M11 13l-4 4M5 19l3-3M9 13l2 2M5 15l-2 2 1 3 3 1 2-2" />
      </>
    ),
    balloon: (
      <>
        <Ellipse {...s} cx="12" cy="9" rx="6" ry="7" />
        <Path {...s} d="M12 16v6M10 22h4" />
      </>
    ),
    frog: (
      <>
        <Circle {...s} cx="8" cy="9" r="2" />
        <Circle {...s} cx="16" cy="9" r="2" />
        <Path {...s} d="M5 13c0 3 3 6 7 6s7-3 7-6" />
      </>
    ),
    refresh: (
      <>
        <Path {...s} d="M21 12a9 9 0 11-3-6.7L21 8" />
        <Path {...s} d="M21 3v5h-5" />
      </>
    ),
    clock: (
      <>
        <Circle {...s} cx="12" cy="12" r="9" />
        <Path {...s} d="M12 7v5l3 2" />
      </>
    ),
    share: (
      <>
        <Circle {...s} cx="18" cy="5" r="2.5" />
        <Circle {...s} cx="6" cy="12" r="2.5" />
        <Circle {...s} cx="18" cy="19" r="2.5" />
        <Path {...s} d="M8 11l8-5M8 13l8 5" />
      </>
    ),
    pause: <Path {...s} d="M7 5v14M17 5v14" />,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {icons[name]}
    </Svg>
  );
}
