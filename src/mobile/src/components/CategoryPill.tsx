// src/components/CategoryPill.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme, typography, borderRadius, spacing } from '../theme';
import { Category } from '../types';

interface CategoryPillProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
  theme: Theme;
}

const categoryLabels: Record<Category, string> = {
  all: 'All',
  sneakers: 'Sneakers',
  tech: 'Tech',
  vintage: 'Vintage',
  streetwear: 'Streetwear',
  collectibles: 'Collectibles',
  watches: 'Watches',
  art: 'Art',
};

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  isSelected,
  onPress,
  theme,
}) => {
  const { colors } = theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          {
            color: isSelected ? colors.textPrimary : colors.textSecondary,
            fontFamily: isSelected 
              ? typography.fontFamily.semibold 
              : typography.fontFamily.medium,
          },
        ]}
      >
        {categoryLabels[category]}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  text: {
    fontSize: typography.sizes.body,
  },
});
