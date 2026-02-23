// src/components/ListingCard.tsx
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Listing } from '../types';
import { Theme, typography, spacing, borderRadius } from '../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.xxxl * 2) / 2;

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  variant?: 'grid' | 'horizontal' | 'featured';
  theme: Theme;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onPress,
  variant = 'grid',
  theme,
}) => {
  const { colors } = theme;

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const isLive = listing.status === 'live';
  const isEndingSoon = listing.status === 'ending_soon';

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity onPress={onPress} style={styles.horizontalContainer}>
        <View style={[styles.horizontalCard, { backgroundColor: colors.surface }]}>
          <Image source={{ uri: listing.images[0] }} style={styles.horizontalImage} />
          <View style={styles.horizontalContent}>
            <Text 
              style={[styles.title, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {listing.title}
            </Text>
            <Text style={[styles.lotNumber, { color: colors.textMuted }]}>
              Lot #{listing.lotNumber}
            </Text>
            
            <View style={styles.priceRow}>
              <Text style={[styles.currentPrice, { color: colors.textPrimary }]}>
                ${listing.currentPrice.toLocaleString()}
              </Text>
              <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
                ${listing.startingPrice.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.footer}>
              {(isLive || isEndingSoon) && (
                <View style={[styles.liveBadge, { backgroundColor: isEndingSoon ? colors.warning : colors.live }]} >
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>
                    {isEndingSoon ? 'Ending Soon' : 'LIVE'}
                  </Text>
                </View>
              )}
              <Text style={[styles.timeLeft, { color: colors.textSecondary }]} >
                {formatTimeLeft(listing.endTime)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity onPress={onPress} style={styles.featuredContainer}>
        <View style={styles.featuredCard}>
          <Image source={{ uri: listing.images[0] }} style={styles.featuredImage} />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.featuredGradient}
          >
            <View style={styles.featuredBadge}>
              <View style={[styles.liveBadgeLarge, { backgroundColor: colors.live }]} >
                <View style={styles.liveDot} />
                <Text style={styles.liveTextLarge}>LIVE AUCTION</Text>
              </View>
            </View>
            
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {listing.title}
              </Text>
              
              <View style={styles.featuredFooter}>
                <View>
                  <Text style={styles.featuredLabel}>Current Bid</Text>
                  <Text style={styles.featuredPrice}>
                    ${listing.currentPrice.toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.timerContainer}>
                  <Text style={styles.timerLabel}>Ends in</Text>
                  <Text style={styles.timerValue}>{formatTimeLeft(listing.endTime)}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Glassmorphism overlay */}
          <View style={[styles.glassOverlay, { backgroundColor: colors.glass }]} >
            <Text style={[styles.glassText, { color: colors.textPrimary }]} >
              {listing.bids?.length || 0} bids
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid variant (default)
  return (
    <TouchableOpacity onPress={onPress} style={styles.gridContainer}>
      <View style={[styles.gridCard, { backgroundColor: colors.surface }]} >
        <Image source={{ uri: listing.images[0] }} style={styles.gridImage} />
        
        {(isLive || isEndingSoon) && (
          <View style={[styles.gridBadge, { backgroundColor: isEndingSoon ? colors.warning : colors.live }]} >
            <View style={styles.liveDot} />
            <Text style={styles.gridBadgeText}>
              {isEndingSoon ? 'Ending' : 'LIVE'}
            </Text>
          </View>
        )}
        
        <View style={styles.gridContent}>
          <Text style={[styles.gridTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {listing.title}
          </Text>
          
          <Text style={[styles.gridPrice, { color: colors.textPrimary }]}>
            ${listing.currentPrice.toLocaleString()}
          </Text>
          
          <Text style={[styles.gridTime, { color: colors.textMuted }]} >
            {formatTimeLeft(listing.endTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid styles
  gridContainer: {
    width: CARD_WIDTH,
    marginBottom: spacing.lg,
  },
  gridCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: CARD_WIDTH,
    resizeMode: 'cover',
  },
  gridBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  gridBadgeText: {
    color: '#fff',
    fontSize: typography.sizes.overline,
    fontFamily: typography.fontFamily.bold,
    marginLeft: 4,
  },
  gridContent: {
    padding: spacing.md,
  },
  gridTitle: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  gridPrice: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
  },
  gridTime: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },

  // Horizontal styles
  horizontalContainer: {
    marginRight: spacing.lg,
  },
  horizontalCard: {
    flexDirection: 'row',
    width: 280,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  horizontalImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  horizontalContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  lotNumber: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  currentPrice: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
    marginRight: spacing.sm,
  },
  originalPrice: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: typography.sizes.overline,
    fontFamily: typography.fontFamily.bold,
  },
  timeLeft: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
  },

  // Featured styles
  featuredContainer: {
    marginHorizontal: spacing.xxxl,
    marginBottom: spacing.lg,
  },
  featuredCard: {
    height: 320,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: spacing.xxl,
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
  },
  liveBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  liveTextLarge: {
    color: '#fff',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
    marginLeft: spacing.xs,
  },
  featuredContent: {
    marginTop: 'auto',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  featuredLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  featuredPrice: {
    color: '#fff',
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  timerValue: {
    color: '#fff',
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
  glassOverlay: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  glassText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.semibold,
  },
});
