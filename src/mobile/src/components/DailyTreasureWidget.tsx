import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme/stitch';

const { width } = Dimensions.get('window');

interface DailyTreasure {
  id: string;
  title: string;
  subtitle: string;
  treasurePrice: number;
  originalPrice: number;
  discount: number;
  quantity: number;
  claimedCount: number;
  image: string;
}

const MOCK_TREASURE: DailyTreasure = {
  id: 'treasure-1',
  title: 'Vintage Rolex Submariner',
  subtitle: '1967, Original Box & Papers',
  treasurePrice: 8500,
  originalPrice: 12000,
  discount: 29,
  quantity: 1,
  claimedCount: 0,
  image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600',
};

export const DailyTreasureWidget: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 });
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.treasureBadge}>
          <Text style={styles.treasureBadgeText}>💎 Today's Treasure</Text>
        </View>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>
            ⏱ {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Animated.View style={[styles.treasureGlow, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.glowInner} />
        </Animated.View>
        <View style={styles.treasureImage}>
          <Text style={styles.treasureEmoji}>⌚</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{MOCK_TREASURE.title}</Text>
        <Text style={styles.subtitle}>{MOCK_TREASURE.subtitle}</Text>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.treasurePrice}>${MOCK_TREASURE.treasurePrice.toLocaleString()}</Text>
            <Text style={styles.originalPrice}>${MOCK_TREASURE.originalPrice.toLocaleString()}</Text>
          </View>
          
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{MOCK_TREASURE.discount}%</Text>
          </View>
        </View>

        <View style={styles.quantityRow}>
          <Text style={styles.quantityText}>🔥 Only {MOCK_TREASURE.quantity} available!</Text>
        </View>

        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimButtonText}>Claim Treasure</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  treasureBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  treasureBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timerBadge: {
    backgroundColor: 'rgba(255, 23, 68, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ff1744',
  },
  imageContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  treasureGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 217, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 217, 0, 0.3)',
  },
  treasureImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  treasureEmoji: {
    fontSize: 60,
  },
  infoContainer: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  treasurePrice: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#00c853',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  quantityRow: {
    marginBottom: spacing.lg,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff1744',
  },
  claimButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.glow,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
