// src/screens/ProductDetailScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Timer } from '../components/Timer';
import { Card } from '../components/Card';
import { PricePredictor } from '../components/PricePredictor';
import { Theme, typography, spacing, borderRadius } from '../theme';
import { Listing } from '../types';

const { width } = Dimensions.get('window');

interface ProductDetailScreenProps {
  navigation: any;
  route?: { params?: { listing?: Listing } };
  theme: Theme;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ 
  navigation, 
  route,
  theme 
}) => {
  const { colors } = theme;
  const { listing } = route?.params || {};
  if (!listing) return null;
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'bids'>('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'details', label: 'Details' },
    { key: 'bids', label: 'Bid History' },
  ];

  const mockBids = [
    { id: '1', bidder: 'sneaker_king', amount: 450, time: '2 min ago' },
    { id: '2', bidder: 'collector_99', amount: 425, time: '15 min ago' },
    { id: '3', bidder: 'jordan_fan', amount: 400, time: '32 min ago' },
    { id: '4', bidder: 'bid_master', amount: 375, time: '1 hour ago' },
  ];

  const similarItems = [
    {
      id: 's1',
      title: 'Air Jordan 4 Retro',
      price: 380,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    },
    {
      id: 's2',
      title: 'Nike Dunk Low',
      price: 220,
      image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
    },
    {
      id: 's3',
      title: 'Yeezy Boost 350',
      price: 290,
      image: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="heart-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <FlatList
            data={listing.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          
          {/* 360 View Badge */}
          <View style={[styles.view360Badge, { backgroundColor: colors.surface }]}>
            <Ionicons name="scan-circle" size={16} color={colors.textPrimary} />
            <Text style={[styles.view360Text, { color: colors.textPrimary }]} >360°</Text>
          </View>
          
          {/* Image Dots */}
          <View style={styles.dotsContainer}>
            {listing.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentImageIndex 
                      ? colors.primary 
                      : 'rgba(255,255,255,0.5)',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Lot Number & Timer */}
          <View style={styles.lotRow}>
            <Text style={[styles.lotNumber, { color: colors.textMuted }]} >
              Lot #{listing.lotNumber}
            </Text>
            
            <View style={[styles.liveBadge, { backgroundColor: colors.live }]} >
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]} >
            {listing.title}
          </Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <View>
              <Text style={[styles.currentBidLabel, { color: colors.textMuted }]} >
                Current Bid
              </Text>
              <Text style={[styles.currentBid, { color: colors.textPrimary }]} >
                ${listing.currentPrice.toLocaleString()}
              </Text>
            </View>
            
            <Text style={[styles.originalPrice, { color: colors.textMuted }]} >
              ${listing.startingPrice.toLocaleString()}
            </Text>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <Text style={[styles.timerLabel, { color: colors.textSecondary }]} >
              Auction ends in:
            </Text>
            <Timer endTime={new Date(listing.endTime)} theme={theme} />
          </View>

          {/* Buying Power Card */}
          <Card theme={theme} style={styles.buyingPowerCard}>
            <View style={styles.buyingPowerContent}>
              <View>
                <Text style={[styles.buyingPowerLabel, { color: colors.textMuted }]} >
                  Your Buying Power
                </Text>
                <Text style={[styles.buyingPowerAmount, { color: colors.textPrimary }]} >
                  $0
                </Text>
              </View>
              
              <Button
                title="Add Funds"
                variant="outline"
                size="sm"
                onPress={() => navigation.navigate('Payment')}
                theme={theme}
              />
            </View>
          </Card>

          {/* Smart Price Predictor */}
          <PricePredictor
            currentPrice={listing.currentPrice}
            similarSoldPrice={listing.currentPrice * 1.1}
            bidCount={listing.bids?.length || 0}
            watchers={listing.watchers}
            timeLeft={4}
            theme={theme}
            onAcceptSuggestion={(amount) => navigation.navigate('Payment', { listing: { ...listing, suggestedBid: amount } })}
          />

          {/* Seller Info */}
          <TouchableOpacity style={styles.sellerRow}>
            <Avatar
              uri={listing.seller.avatar}
              name={listing.seller.displayName}
              size="lg"
              verified={listing.seller.verified}
              theme={theme}
            />
            
            <View style={styles.sellerInfo}>
              <View style={styles.sellerNameRow}>
                <Text style={[styles.sellerName, { color: colors.textPrimary }]} >
                  {listing.seller.displayName}
                </Text>
                
                {listing.seller.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]} >
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              
              <Text style={[styles.sellerStats, { color: colors.textMuted }]} >
                {listing.seller.soldCount} sold • {listing.seller.replyTime} reply
              </Text>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
                ]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTab === tab.key ? colors.textPrimary : colors.textMuted,
                      fontFamily: activeTab === tab.key 
                        ? typography.fontFamily.semibold 
                        : typography.fontFamily.medium,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'description' && (
              <Text style={[styles.description, { color: colors.textSecondary }]} >
                {listing.description}
              </Text>
            )}
            
            {activeTab === 'details' && (
              <View>
                {[
                  { label: 'Condition', value: listing.condition },
                  { label: 'Category', value: listing.category },
                  { label: 'Location', value: listing.location },
                  { label: 'Shipping', value: `$${listing.shipping.cost}` },
                  { label: 'Watchers', value: listing.watchers.toString() },
                ].map((detail, index) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]} >
                      {detail.label}
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]} >
                      {detail.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {activeTab === 'bids' && (
              <View>
                {mockBids.map((bid, index) => (
                  <View key={bid.id} style={styles.bidRow}>
                    <View style={styles.bidderInfo}>
                      <Text style={[styles.bidderRank, { color: colors.textMuted }]} >
                        #{index + 1}
                      </Text>
                      <Text style={[styles.bidderName, { color: colors.textPrimary }]} >
                        {bid.bidder}
                      </Text>
                    </View>
                    <View style={styles.bidInfo}>
                      <Text style={[styles.bidAmount, { color: colors.textPrimary }]} >
                        ${bid.amount}
                      </Text>
                      <Text style={[styles.bidTime, { color: colors.textMuted }]} >
                        {bid.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Similar Auctions */}
          <View style={styles.similarSection}>
            <Text style={[styles.similarTitle, { color: colors.textPrimary }]} >
              Similar Auctions
            </Text>
            
            <FlatList
              data={similarItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.similarItem}>
                  <Image source={{ uri: item.image }} style={styles.similarImage} />
                  <Text 
                    style={[styles.similarItemTitle, { color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  
                  <Text style={[styles.similarItemPrice, { color: colors.textPrimary }]} >
                    ${item.price}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.similarList}
            />
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button
          title="Deposit & Bid"
          size="lg"
          onPress={() => navigation.navigate('Payment', { listing })}
          theme={theme}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageContainer: {
    height: 350,
    position: 'relative',
  },
  image: {
    width,
    height: 350,
    resizeMode: 'cover',
  },
  view360Badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  view360Text: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.semibold,
    marginLeft: 4,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.lg,
  },
  lotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  lotNumber: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
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
  title: {
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  currentBidLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  currentBid: {
    fontSize: typography.sizes.h1,
    fontFamily: typography.fontFamily.extrabold,
  },
  originalPrice: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    textDecorationLine: 'line-through',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  timerLabel: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.sm,
  },
  buyingPowerCard: {
    marginBottom: spacing.lg,
  },
  buyingPowerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  buyingPowerLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  buyingPowerAmount: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sellerName: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
    marginRight: spacing.sm,
  },
  verifiedBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  verifiedText: {
    color: '#fff',
    fontSize: typography.sizes.overline,
    fontFamily: typography.fontFamily.bold,
  },
  sellerStats: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: typography.sizes.body,
  },
  tabContent: {
    paddingVertical: spacing.lg,
  },
  description: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
  },
  detailValue: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  bidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  bidderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidderRank: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginRight: spacing.sm,
    width: 24,
  },
  bidderName: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
  },
  bidInfo: {
    alignItems: 'flex-end',
  },
  bidAmount: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.bold,
  },
  bidTime: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  similarSection: {
    marginTop: spacing.lg,
  },
  similarTitle: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  similarList: {
    paddingRight: spacing.xxxl,
  },
  similarItem: {
    width: 140,
    marginRight: spacing.md,
  },
  similarImage: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  similarItemTitle: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 2,
  },
  similarItemPrice: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.bold,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
});
