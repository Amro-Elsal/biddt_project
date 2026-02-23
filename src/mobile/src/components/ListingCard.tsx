import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
}) => {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toLocaleString()}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
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
          <Text style={styles.currentBid}>{formatPrice(currentBid)}</Text>
          <Text style={styles.bidCount}>{bidCount} bids</Text>
        </View>
        
        <View style={styles.sellerRow}>
          <Text style={styles.sellerName}>{seller.name}</Text>
          <Text style={styles.rating}>★ {seller.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.midnight,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 217, 255, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginRight: 4,
  },
  liveText: {
    color: colors.deepNavy,
    fontSize: 12,
    fontWeight: '700',
  },
  timeBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(10, 14, 39, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    color: colors.sparkOrange,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    color: colors.white,
    fontSize: typography.h3.size,
    fontWeight: typography.h3.weight,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  currentBid: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  bidCount: {
    color: colors.muted,
    fontSize: 14,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    color: colors.softWhite,
    fontSize: 14,
    marginRight: spacing.sm,
  },
  rating: {
    color: colors.sparkGold,
    fontSize: 14,
    fontWeight: '600',
  },
});
