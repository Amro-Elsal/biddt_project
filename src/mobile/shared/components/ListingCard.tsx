import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/colors';

interface ListingCardProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  bidCount: number;
  endsAt: Date;
  isLive?: boolean;
  onPress: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  title,
  image,
  currentBid,
  bidCount,
  endsAt,
  isLive = false,
  onPress,
}) => {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  
  const getTimeRemaining = () => {
    const diff = endsAt.getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m left`;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.bidLabel}>Current Bid</Text>
            <Text style={styles.bidAmount}>{formatPrice(currentBid)}</Text>
          </View>
          
          <View style={styles.meta}>
            <Text style={styles.bidCount}>{bidCount} bids</Text>
            <Text style={styles.timeRemaining}>{getTimeRemaining()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
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
    backgroundColor: colors.sparkOrange,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textInverse,
    marginRight: 4,
  },
  liveText: {
    color: colors.textInverse,
    fontSize: typography.sizes.tag,
    fontWeight: typography.weights.bold,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bidLabel: {
    fontSize: typography.sizes.caption,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  bidAmount: {
    fontSize: typography.sizes.price,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  meta: {
    alignItems: 'flex-end',
  },
  bidCount: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  timeRemaining: {
    fontSize: typography.sizes.caption,
    color: colors.sparkOrange,
    fontWeight: typography.weights.medium,
  },
});
