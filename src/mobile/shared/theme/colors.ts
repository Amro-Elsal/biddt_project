import { StyleSheet } from 'react-native';

// Biddt Design System - Winning the Treasure

export const colors = {
  // Diamond Palette
  diamondCyan: '#00D9FF',
  diamondPurple: '#7B61FF',
  diamondGradient: ['#00D9FF', '#7B61FF'] as const,
  
  // Spark Palette
  sparkOrange: '#FA5400',
  sparkGold: '#FFD700',
  sparkGradient: ['#FA5400', '#FFD700'] as const,
  
  // Foundation
  midnightNavy: '#0A0E1A',
  surfaceNavy: '#141B2D',
  elevatedNavy: '#1E2945',
  highlightNavy: '#2A3655',
  
  // Light Mode
  pureWhite: '#FFFFFF',
  surfaceWhite: '#F8F9FA',
  surfaceGray: '#F5F5F5',
  
  // Semantic
  success: '#00C853',
  successLight: '#00E676',
  warning: '#FFD600',
  warningLight: '#FFAB00',
  error: '#FF1744',
  errorLight: '#FF4569',
  info: '#2979FF',
  infoLight: '#448AFF',
  
  // Text
  textPrimary: '#111111',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const typography = {
  sizes: {
    hero: 40,
    h1: 32,
    h2: 24,
    h3: 20,
    price: 28,
    body: 16,
    bodySmall: 14,
    caption: 12,
    button: 16,
    tag: 11,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  pill: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.diamondCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 0,
  },
};

export const animations = {
  durations: {
    micro: 150,
    standard: 300,
    dramatic: 500,
    celebration: 800,
  },
  easings: {
    standard: 'easeOut',
    enter: 'easeOut',
    exit: 'easeIn',
    bounce: 'spring',
  },
};
