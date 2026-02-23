import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme/stitch';

interface PricePredictionProps {
  currentBid: number;
  suggestedBid: number;
  confidence: number;
  reasoning: string[];
}

export const PricePredictor: React.FC<PricePredictionProps> = ({
  currentBid,
  suggestedBid,
  confidence,
  reasoning,
}) => {
  const savings = suggestedBid - currentBid;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💡</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>AI Price Suggestion</Text>
          <Text style={styles.confidence}>{confidence}% confidence</Text>
        </View>
      </View>

      <View style={styles.suggestionRow}>
        <View>
          <Text style={styles.suggestionLabel}>AI Suggests</Text>
          <Text style={styles.suggestionPrice}>${suggestedBid}</Text>
        </View>
        
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsText}>Save ${savings}</Text>
        </View>
      </View>

      <View style={styles.reasoningContainer}>
        {reasoning.map((reason, index) => (
          <View key={index} style={styles.reasonItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.applyButton}>
        㰎xt style={styles.applyButtonText}>Apply Suggested Bid</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 217, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  confidence: {
    fontSize: 12,
    color: colors.textMuted,
  },
  suggestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  suggestionLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  suggestionPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  savingsBadge: {
    backgroundColor: '#00c853',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  reasoningContainer: {
    marginBottom: spacing.md,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bullet: {
    fontSize: 14,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.glow,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
