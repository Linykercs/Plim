import { Platform } from 'react-native';

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  chip: 12,
  pill: 14,
  button: 18,
  buttonLg: 22,
  buttonXl: 26,
  card: 22,
  cardLg: 26,
  modal: 28,
  modalLg: 32,
  circle: 9999,
} as const;

export const shadow = {
  card: Platform.select({
    ios: {
      shadowColor: '#1F3A4D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: { elevation: 3 },
    default: {},
  }),
  cardPress: Platform.select({
    ios: {
      shadowColor: '#5FCB8E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: { elevation: 6 },
    default: {},
  }),
  modal: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
    },
    android: { elevation: 12 },
    default: {},
  }),
} as const;
