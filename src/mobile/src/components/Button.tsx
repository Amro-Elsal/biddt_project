import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium' 
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'gold': return colors.sparkGold;
      case 'secondary': return 'transparent';
      default: return colors.diamondCyan;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'gold': return colors.deepNavy;
      case 'secondary': return colors.diamondCyan;
      default: return colors.deepNavy;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small': return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large': return { paddingVertical: 18, paddingHorizontal: 32 };
      default: return { paddingVertical: 14, paddingHorizontal: 24 };
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.button, 
        { backgroundColor: getBackgroundColor() },
        getPadding(),
        variant === 'secondary' && { borderWidth: 2, borderColor: colors.diamondCyan }
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
