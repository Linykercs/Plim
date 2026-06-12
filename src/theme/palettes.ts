export type Palette = {
  name: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  coral: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  softBg: string;
  softBg2: string;
  // Fundos de botão de ação com rótulo branco: mais escuros que primary/coral
  // para contraste WCAG (texto grande em negrito pede 3:1, estes passam de 4:1)
  btn: string;
  btnDark: string;
  coralDark: string;
  // Âmbar escuro para quando o accent vira TEXTO sobre fundo claro
  // (o amarelo #FFCxxx é ilegível como texto, fica só em ícones)
  accentText: string;
};

export const palettes: Record<string, Palette> = {
  fresh: {
    name: 'Fresh Mint',
    primary: '#5FCB8E',
    primaryDark: '#3DA070',
    secondary: '#7DC9E8',
    accent: '#FFCE5C',
    coral: '#FF8A7A',
    bg: '#FFF7EC',
    surface: '#FFFFFF',
    text: '#1F3A4D',
    muted: '#54707F',
    softBg: '#EEF7F1',
    softBg2: '#F1F5F9',
    btn: '#2E8B5F',
    btnDark: '#1F6B47',
    coralDark: '#D54B38',
    accentText: '#9A7200',
  },
  ocean: {
    name: 'Ocean',
    primary: '#3BA3D4',
    primaryDark: '#2280B0',
    secondary: '#7AE0D4',
    accent: '#FFD66B',
    coral: '#FF8E72',
    bg: '#EFF8FB',
    surface: '#FFFFFF',
    text: '#0F3148',
    muted: '#476273',
    softBg: '#E1F0F6',
    softBg2: '#EAF4F7',
    btn: '#1F7FAD',
    btnDark: '#16607F',
    coralDark: '#D5503A',
    accentText: '#9A7200',
  },
  sweet: {
    name: 'Sweet',
    primary: '#C497F0',
    primaryDark: '#9D6FCB',
    secondary: '#F9A8D4',
    accent: '#FBD661',
    coral: '#FB7185',
    bg: '#FFF4FA',
    surface: '#FFFFFF',
    text: '#3F2E5C',
    muted: '#635378',
    softBg: '#F5EFFA',
    softBg2: '#FDEEF5',
    btn: '#8E5FC9',
    btnDark: '#6E46A3',
    coralDark: '#D5485E',
    accentText: '#9A7200',
  },
};

export const defaultPalette = palettes.fresh;

export const AVATAR_COLORS = ['#5FCB8E', '#7DC9E8', '#FF8A7A', '#C497F0', '#FFCE5C', '#FF8E72'] as const;
