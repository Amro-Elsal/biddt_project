// src/components/DailyTreasureWidget.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, typography, spacing, borderRadius } from '../theme';
import { Timer } from './Timer';

interface DailyTreasureWidgetProps {
  theme: Theme;
  onPress?: () => void;
}

interface TreasureDeal {
  id: string;
  title: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  image: string;
  endsAt: Date;
  claimed: boolean;
}

export const DailyTreasureWidget: React.FC<DailyTreasureWidgetProps> = ({
  theme,
  onPress,
}) => {
  const { colors } = theme;
  const [pulseAnim] = useState(new Animated.Value(1));
  const [treasure, setTreasure] = useState<TreasureDeal>({
    id: 'treasure-1',
    title: 'Nike Air Jordan 1 Retro',
    originalPrice: 450,
    dealPrice: 299,
    discount: 34,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400',
    endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    claimed: false,
  });

  useEffect(() => {
    // Pulse animation for the treasure chest
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleClaim = () => {
    setTreasure({ ...treasure, claimed: true });
    onPress?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons name="gift" size={28} color={colors.primary} />
          </Animated.View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Daily Treasure
          </Text>
          <View style={[styles.badge, { backgroundColor: colors.live }]}>
            <Text style={styles.badgeText}>LIVE</Text>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Exclusive deal expires soon!
        </Text>
      </View>

      {/* Deal Card */}
      <View style={[styles.dealCard, { backgroundColor: colors.background }]}>
        <View style={styles.dealInfo}>
          <Text style={[styles.dealTitle, { color: colors.textPrimary }]} numberOfLines={2}>
            {treasure.title}
          </Text>
          
          <View style={styles.priceRow}>
            <Text style={[styles.dealPrice, { color: colors.success }]}>
              ${treasure.dealPrice}
            </Text>
            <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
              ${treasure.originalPrice}
            </Text>
            <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.discountText, { color: colors.textPrimary }]}>
                -{treasure.discount}%
              </Text>
            </View>
          </View>

          {/* Countdown */}
          <View style={styles.countdownContainer}>
            <Ionicons name="time-outline" size={16} color={colors.warning} />
            <Text style={[styles.countdownLabel, { color: colors.warning }]}>
              Ends in:
            </Text>            <Timer endTime={treasure.endsAt} theme={theme} size="sm" showLabels={false} />
          </View>
        </View>

        {/* Claim Button */}
        <TouchableOpacity
          style={[
            styles.claimButton,
            {
              backgroundColor: treasure.claimed ? colors.success : colors.primary,
            },
          ]}
          onPress={handleClaim}
          disabled={treasure.claimed}
        >
          <Ionicons
            name={treasure.claimed ? 'checkmark-circle' : 'gift'}
            size={20}
            color={colors.textPrimary}
          />
          <Text style={[styles.claimText, { color: colors.textPrimary }]}>
            {treasure.claimed ? 'Claimed!' : 'Claim Deal'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Streak Info */}
      <View style={[styles.streakContainer, { borderTopColor: colors.border }]}>
        <Ionicons name="flame" size={16} color={colors.warning} />
        <Text style={[styles.streakText, { color: colors.textSecondary }]}>
          5-day streak! Come back tomorrow for more treasures.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.xxxl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: typography.sizes.overline,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  dealCard: {
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  dealInfo: {
    marginBottom: spacing.md,
  },
  dealTitle: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dealPrice: {
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
    marginRight: spacing.sm,
  },
  originalPrice: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    textDecorationLine: 'line-through',
    marginRight: spacing.sm,
  },
  discountBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.xs,
    marginRight: spacing.sm,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  claimText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    gap: spacing.xs,
  },
  streakText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
  },
});
