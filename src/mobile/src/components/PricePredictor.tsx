// src/components/PricePredictor.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface PricePredictorProps {
  currentPrice: number;
  similarSoldPrice: number;
  bidCount: number;
  watchers: number;
  timeLeft: number; // in hours
  theme: Theme;
  onAcceptSuggestion?: (amount: number) => void;
}

interface Prediction {
  suggestedBid: number;
  confidence: number;
  reasoning: string[];
  winProbability: number;
}

export const PricePredictor: React.FC<PricePredictorProps> = ({
  currentPrice,
  similarSoldPrice,
  bidCount,
  watchers,
  timeLeft,
  theme,
  onAcceptSuggestion,
}) => {
  const { colors } = theme;
  const [expanded, setExpanded] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // AI Prediction Logic
  const generatePrediction = (): Prediction => {
    const baseIncrease = currentPrice * 0.05; // 5% minimum increase
    const competitionFactor = (bidCount / 10) * 0.02; // More bids = higher price
    const urgencyFactor = timeLeft < 1 ? 0.1 : timeLeft < 4 ? 0.05 : 0; // Last minute bidding
    const popularityFactor = (watchers / 50) * 0.03; // More watchers = more competition

    const suggestedBid = Math.ceil(
      currentPrice + baseIncrease + currentPrice * (competitionFactor + urgencyFactor + popularityFactor)
    );

    const confidence = Math.min(95, 70 + bidCount * 2 + (watchers > 20 ? 10 : 0));

    const reasoning = [
      bidCount > 5 ? '🔥 High competition detected' : '💡 Moderate interest',
      timeLeft < 2 ? '⏰ Final bidding phase' : '📊 Early bidding stage',
      watchers > 30 ? '👀 Many watchers - price may spike' : '👁️ Steady interest',
      similarSoldPrice > currentPrice
        ? `📈 Similar items sold for $${similarSoldPrice}`
        : '💎 Unique item - hard to predict',
    ];

    const winProbability = Math.max(30, 85 - bidCount * 3 - (watchers > 40 ? 15 : 0));

    return {
      suggestedBid,
      confidence,
      reasoning,
      winProbability,
    };
  };

  const prediction = generatePrediction();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return colors.success;
    if (confidence >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {/* Header */}
        <TouchableOpacity
          style={styles.header}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.9}
        >
          <View style={styles.headerLeft}>
            <View style={[styles.aiBadge, { backgroundColor: colors.primary + '20' }]} >
              <Ionicons name="sparkles" size={16} color={colors.primary} />
              <Text style={[styles.aiText, { color: colors.primary }]} >AI</Text>
            </View>
            
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]} >
              Smart Bid Suggestion
            </Text>
          </View>
          
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {/* Main Suggestion */}
        <View style={styles.suggestionContainer}>
          <View style={styles.priceBlock}>
            <Text style={[styles.suggestedPrice, { color: colors.textPrimary }]} >
              ${prediction.suggestedBid}
            </Text>
            
            <View style={styles.confidenceRow}>
              <Text style={[styles.confidenceLabel, { color: colors.textMuted }]} >
                Confidence:
              </Text>
              
              <View
                style={[
                  styles.confidenceBar,
                  { backgroundColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.confidenceFill,
                    {
                      backgroundColor: getConfidenceColor(prediction.confidence),
                      width: `${prediction.confidence}%`,
                    },
                  ]}
                />
              </View>
              
              <Text
                style={[
                  styles.confidenceValue,
                  { color: getConfidenceColor(prediction.confidence) },
                ]}
              >
                {prediction.confidence}%
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: colors.primary }]}
            onPress={() => onAcceptSuggestion?.(prediction.suggestedBid)}
          >
            <Text style={[styles.acceptText, { color: colors.textPrimary }]} >Use</Text>
          </TouchableOpacity>
        </View>

        {/* Win Probability */}
        <View style={[styles.probabilityContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="trophy-outline" size={16} color={colors.warning} />
          <Text style={[styles.probabilityText, { color: colors.textSecondary }]} >
            {prediction.winProbability}% chance to win at this price
          </Text>
        </View>

        {/* Expanded Analysis */}
        {expanded && (
          <View style={styles.analysisContainer}>
            <Text style={[styles.analysisTitle, { color: colors.textPrimary }]} >
              Why this price?
            </Text>
            
            {prediction.reasoning.map((reason, index) => (
              <View key={index} style={styles.reasonRow}>
                <Text style={[styles.reasonText, { color: colors.textSecondary }]} >
                  {reason}
                </Text>
              </View>
            ))}

            <View style={[styles.tipBox, { backgroundColor: colors.primary + '10' }]}>
              <Ionicons name="bulb-outline" size={16} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]} >
                💡 Tip: Bid in the final 30 seconds for best results
              </Text>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.xxxl,
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  aiText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  priceBlock: {
    flex: 1,
  },
  suggestedPrice: {
    fontSize: typography.sizes.h1,
    fontFamily: typography.fontFamily.extrabold,
    marginBottom: spacing.xs,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    marginRight: spacing.sm,
  },
  confidenceBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceValue: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
  },
  acceptButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  acceptText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  probabilityText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.xs,
  },
  analysisContainer: {
    padding: spacing.lg,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  analysisTitle: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: spacing.sm,
  },
  reasonRow: {
    marginBottom: spacing.xs,
  },
  reasonText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  tipText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.xs,
    flex: 1,
  },
});
