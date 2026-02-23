// src/components/SearchBar.tsx
import React from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Text
} from 'react-native';
import { Theme, typography, borderRadius, spacing } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  theme: Theme;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search items...',
  theme,
}) => {
  const { colors } = theme;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.sizes.body,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
      />
      
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearButton}
        >
          <Text style={[styles.clearText, { color: colors.textMuted }]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearText: {
    fontSize: 20,
    fontWeight: '300',
  },
});
