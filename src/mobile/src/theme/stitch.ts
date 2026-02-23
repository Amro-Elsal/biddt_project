// Stitch Design System - Light Mode
// Colors, Typography, and Spacing based on Stitch MCP output

export const colors = {
  // Primary Brand Colors
  primary: '#ffd900',        // Spark Gold
  primaryDark: '#e6c400',
  
  // Background Colors
  background: '#f8f8f5',     // Pearl White / Off-white
  backgroundDark: '#23200f', // Dark mode fallback
  
  // Surface Colors
  surface: '#ffffff',
  surfaceSecondary: '#f1f1ef',
  
  // Border Colors
  border: '#e5e5e0',
  borderDark: '#d4d4cf',
  
  // Text Colors
  textPrimary: '#1a1a1a',
  textSecondary: '#525252',
  textMuted: '#737373',
  textInverse: '#ffffff',
  
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
};

export const typography = {
  fontFamily: 'Plus Jakarta Sans',
  
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
  glow: {
    shadowColor: '#ffd900',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 0,
  },
};
