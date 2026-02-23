// src/components/TrustScore.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme, typography, spacing, colors as themeColors } from '../theme';

interface TrustScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  theme: Theme;
}

export const TrustScore: React.FC<TrustScoreProps> = ({
  score,
  size = 'md',
  showLabel = true,
  theme,
}) => {
  const { colors } = theme;

  const getSize = () => {
    switch (size) {
      case 'sm': return 40;
      case 'md': return 60;
      case 'lg': return 80;
      default: return 60;
    }
  };

  const getStrokeWidth = () => {
    switch (size) {
      case 'sm': return 3;
      case 'md': return 4;
      case 'lg': return 5;
      default: return 4;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return typography.sizes.caption;
      case 'md': return typography.sizes.body;
      case 'lg': return typography.sizes.h3;
      default: return typography.sizes.body;
    }
  };

  const getScoreColor = () => {
    if (score >= 90) return colors.trustHigh;
    if (score >= 70) return colors.trustMedium;
    return colors.trustLow;
  };

  const s = getSize();
  const strokeWidth = getStrokeWidth();
  const radius = (s - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={{ width: s, height: s }}>
        {/* Background circle */}
        <View
          style={[
            styles.circle,
            {
              width: s,
              height: s,
              borderRadius: s / 2,
              borderWidth: strokeWidth,
              borderColor: colors.border,
            },
          ]}
        />
        
        {/* Progress arc */}
        <View
          style={[
            styles.progressArc,
            {
              width: s,
              height: s,
              borderRadius: s / 2,
              borderWidth: strokeWidth,
              borderColor: getScoreColor(),
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [
                { rotate: '-90deg' },
                { rotate: `${(score / 100) * 360}deg` },
              ],
            },
          ]}
        />
        
        {/* Score text */}
        <View style={[styles.scoreContainer, { width: s, height: s }]}>
          <Text
            style={[
              styles.score,
              {
                fontSize: getFontSize(),
                color: colors.textPrimary,
                fontFamily: typography.fontFamily.bold,
              },
            ]}
          >
            {score}
          </Text>
        </View>
      </View>
      
      {showLabel && (
        <Text style={[styles.label, { color: colors.textMuted }]}>
          Trust Score
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
  progressArc: {
    position: 'absolute',
  },
  scoreContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {},
  label: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.xs,
  },
});
