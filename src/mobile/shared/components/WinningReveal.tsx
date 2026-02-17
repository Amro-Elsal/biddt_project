import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '../theme/colors';

interface WinningRevealProps {
  itemName: string;
  finalBid: number;
  onComplete?: () => void;
}

export const WinningReveal: React.FC<WinningRevealProps> = ({
  itemName,
  finalBid,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  React.useEffect(() => {
    // Animate in sequence
    scale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1, { damping: 15 })
    );
    opacity.value = withDelay(200, withSpring(1));
    translateY.value = withDelay(400, withSpring(0));
  }, []);

  const diamondStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.diamondGradient}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.diamondContainer, diamondStyle]}>
          <View style={styles.diamond}>
            <Text style={styles.diamondText}>💎</Text>
          </View>
          <View style={styles.sparkles}>
            <Text style={styles.sparkle}>✦</Text>
            <Text style={[styles.sparkle, styles.sparkle2]}>✦</Text>
            <Text style={[styles.sparkle, styles.sparkle3]}>✦</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.content, contentStyle]}>
          <Text style={styles.youWon}>YOU WON!</Text>
          <Text style={styles.itemName} numberOfLines={2}>{itemName}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Final Bid</Text>
            <Text style={styles.price}>${(finalBid / 100).toFixed(2)}</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  diamondContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  diamond: {
    width: 120,
    height: 120,
    backgroundColor: colors.textInverse,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadows?.lg,
  },
  diamondText: {
    fontSize: 60,
  },
  sparkles: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 24,
    color: colors.sparkGold,
    top: 0,
    left: 40,
  },
  sparkle2: {
    top: 20,
    right: 40,
    left: 'auto',
  },
  sparkle3: {
    top: 60,
    left: 80,
  },
  content: {
    alignItems: 'center',
  },
  youWon: {
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.extrabold,
    color: colors.textInverse,
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  itemName: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.semibold,
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.9,
  },
  priceContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  priceLabel: {
    fontSize: typography.sizes.body,
    color: colors.textInverse,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
  },
});
