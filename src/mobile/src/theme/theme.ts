// src/theme/theme.ts
// Complete theme system with Light and Dark mode support

export const colors = {
  // Primary Brand Colors
  primary: '#ffd900',
  primaryDark: '#e6c400',
  primaryLight: '#ffe433',
  
  // Background Colors
  background: '#f8f8f5',
  backgroundDark: '#1a1a1a',
  
  // Surface Colors
  surface: '#ffffff',
  surfaceDark: '#2a2a2a',
  surfaceSecondary: '#f1f1ef',
  surfaceSecondaryDark: '#333333',
  
  // Border Colors
  border: '#e5e5e0',
  borderDark: '#404040',
  borderLight: '#d4d4cf',
  
  // Text Colors
  textPrimary: '#1a1a1a',
  textPrimaryDark: '#ffffff',
  textSecondary: '#525252',
  textSecondaryDark: '#a0a0a0',
  textMuted: '#737373',
  textMutedDark: '#808080',
  textInverse: '#ffffff',
  textInverseDark: '#1a1a1a',
  
  // Semantic Colors
  success: '#00C853',
  error: '#FF1744',
  warning: '#FA5400',
  info: '#00D9FF',
  
  // Live Indicator
  live: '#FF1744',
  
  // Trust Score
  trustHigh: '#00C853',
  trustMedium: '#FFAB00',
  trustLow: '#FF1744',
  
  // Glassmorphism
  glassLight: 'rgba(255, 255, 255, 0.8)',
  glassDark: 'rgba(30, 30, 30, 0.8)',
  glassBorderLight: 'rgba(255, 255, 255, 0.3)',
  glassBorderDark: 'rgba(255, 255, 255, 0.1)',
};

export const lightTheme = {
  colors: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    background: colors.background,
    surface: colors.surface,
    surfaceSecondary: colors.surfaceSecondary,
    border: colors.border,
    borderLight: colors.borderLight,
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    textMuted: colors.textMuted,
    textInverse: colors.textInverse,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    live: colors.live,
    trustHigh: colors.trustHigh,
    trustMedium: colors.trustMedium,
    trustLow: colors.trustLow,
    glass: colors.glassLight,
    glassBorder: colors.glassBorderLight,
  },
  isDark: false,
};

export const darkTheme = {
  colors: {
    primary: colors.primary,
    primaryDark: colors.primaryDark,
    primaryLight: colors.primaryLight,
    background: colors.backgroundDark,
    surface: colors.surfaceDark,
    surfaceSecondary: colors.surfaceSecondaryDark,
    border: colors.borderDark,
    borderLight: colors.borderDark,
    textPrimary: colors.textPrimaryDark,
    textSecondary: colors.textSecondaryDark,
    textMuted: colors.textMutedDark,
    textInverse: colors.textInverseDark,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    live: colors.live,
    trustHigh: colors.trustHigh,
    trustMedium: colors.trustMedium,
    trustLow: colors.trustLow,
    glass: colors.glassDark,
    glassBorder: colors.glassBorderDark,
  },
  isDark: true,
};

export type Theme = typeof lightTheme;

export const typography = {
  fontFamily: {
    regular: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    semibold: 'PlusJakartaSans-SemiBold',
    bold: 'PlusJakartaSans-Bold',
    extrabold: 'PlusJakartaSans-ExtraBold',
  },
  
  sizes: {
    hero: 48,
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    bodyLarge: 16,
    body: 14,
    caption: 12,
    overline: 10,
  },
  
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#ffd900',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 0,
  },
};

export const glassmorphism = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  dark: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
};
