// Theme colors - Biddt brand
export const colors = {
  // Brand colors
  diamondCyan: '#00D9FF',
  diamondPurple: '#7B61FF',
  sparkOrange: '#FA5400',
  sparkGold: '#FFD700',
  
  // Backgrounds
  deepNavy: '#0A0E27',
  midnight: '#121636',
  twilight: '#1A1F45',
  
  // Text
  white: '#FFFFFF',
  softWhite: '#E8E8E8',
  muted: '#8B92B4',
  disabled: '#5A6078',
  
  // Semantic
  success: '#00C853',
  error: '#FF1744',
  warning: '#FFAB00',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  hero: { size: 48, weight: '800' as const },
  h1: { size: 32, weight: '700' as const },
  h2: { size: 24, weight: '600' as const },
  h3: { size: 20, weight: '600' as const },
  body: { size: 16, weight: '400' as const },
  caption: { size: 14, weight: '400' as const },
  small: { size: 12, weight: '400' as const },
};
