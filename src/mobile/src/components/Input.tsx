// src/components/Input.tsx
import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle
} from 'react-native';
import { Theme, typography, borderRadius, spacing } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  theme: Theme;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  theme,
  style,
  ...textInputProps
}) => {
  const { colors } = theme;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            borderWidth: 1,
            borderRadius: borderRadius.md,
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
            style,
          ]}
          placeholderTextColor={colors.textMuted}
          {...textInputProps}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  error: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.xs,
  },
});
