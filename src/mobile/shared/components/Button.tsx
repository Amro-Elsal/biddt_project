import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, borderRadius, shadows } from './colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'treasure' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
}) => {
  const buttonStyles = [
    styles.base,
    styles[size],
    styles[variant],
    (disabled || loading) && styles.disabled,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  const content = loading ? (
    <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.sparkOrange} />
  ) : (
    <View style={styles.content}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={textStyles}>{title}</Text>
    </View>
  );

  if (variant === 'treasure') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
        <LinearGradient
          colors={colors.diamondGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[buttonStyles, styles.treasureGradient]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyles}
      activeOpacity={0.8}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontWeight: typography.weights.semibold,
  },
  
  // Sizes
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  md: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  lg: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  smText: {
    fontSize: typography.sizes.caption,
  },
  mdText: {
    fontSize: typography.sizes.button,
  },
  lgText: {
    fontSize: typography.sizes.h3,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.sparkOrange,
    ...shadows.md,
  },
  primaryText: {
    color: colors.textInverse,
  },
  
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.diamondCyan,
  },
  secondaryText: {
    color: colors.diamondCyan,
  },
  
  treasureGradient: {
    ...shadows.glow,
  },
  treasure: {},
  treasureText: {
    color: colors.textInverse,
    fontWeight: typography.weights.bold,
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.sparkOrange,
  },
  
  disabled: {
    opacity: 0.5,
  },
});
