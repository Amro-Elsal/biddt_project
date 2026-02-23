import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { colors, spacing, typography } from '../theme';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  currentBid: number;
  bidCount: number;
  image: string;
  seller: { name: string; rating: number };
  timeLeft: string;
  isLive: boolean;
  onPress: () => void;
  index?: number;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  title,
  currentBid,
  bidCount,
  image,
  seller,
  timeLeft,
  isLive,
  onPress,
  index = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toLocaleString()}`;
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          
          {isLive && (
            <View style={styles.liveBadge}>
              <LiveDot />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
          
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{timeLeft}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Current Bid</Text>
              <Text style={styles.currentBid}>{formatPrice(currentBid)}</Text>
            </View>
            <View style={styles.bidInfo}>
              <Text style={styles.bidCount}>{bidCount} bids</Text>
            </View>
          </View>
          
          <View style={styles.sellerRow}>
            <View style={styles.sellerInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{seller.name[0]}</Text>
              </View>
              <Text style={styles.sellerName}>{seller.name}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{seller.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LiveDot = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        marginRight: 6,
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.midnight,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.diamondCyan,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveText: {
    color: colors.deepNavy,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.sparkOrange,
  },
  timeText: {
    color: colors.sparkOrange,
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  priceLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  currentBid: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '800',
  },
  bidInfo: {
    alignItems: 'flex-end',
  },
  bidCount: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.twilight,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.diamondPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  sellerName: {
    color: colors.softWhite,
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  star: {
    color: colors.sparkGold,
    fontSize: 12,
    marginRight: 2,
  },
  rating: {
    color: colors.sparkGold,
    fontSize: 13,
    fontWeight: '700',
  },
});
