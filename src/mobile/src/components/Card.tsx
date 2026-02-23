// src/components/Card.tsx
import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewStyle,
  TouchableOpacity
} from 'react-native';
import { Theme, borderRadius, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  onPress?: () => void;
  style?: ViewStyle;
  theme: Theme;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  theme,
}) => {
  const { colors } = theme;

  const getBackgroundColor = () => {
    switch (variant) {
      case 'glass': return colors.glass;
      case 'elevated': return colors.surface;
      default: return colors.surface;
    }
  };

  const getShadow = () => {
    switch (variant) {
      case 'elevated': return shadows.lg;
      case 'glass': return shadows.md;
      default: return shadows.sm;
    }
  };

  const getBorder = () => {
    if (variant === 'glass') {
      return {
        borderWidth: 1,
        borderColor: colors.glassBorder,
      };
    }
    return {};
  };

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: borderRadius.lg,
          ...getShadow(),
          ...getBorder(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
