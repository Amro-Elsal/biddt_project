import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
  ActivityIndicator
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './src/theme/stitch';

const { width } = Dimensions.get('window');

// Material Symbols Icons as text
const Icon = ({ name, size = 24, color = colors.textPrimary, style }: { name: string, size?: number, color?: string, style?: any }) => (
  <Text style={[{ fontSize: size, color, fontFamily: 'MaterialSymbols' }, style]}>{name}</Text>
);

// Mock data matching Stitch designs
const CATEGORIES = ['All', 'Sneakers', 'Tech', 'Vintage', 'Watches', 'Art'];

const LIVE_AUCTIONS = [
  {
    id: '1',
    title: 'Vintage Leica M3',
    subtitle: 'Mint condition, original lens',
    price: '$450',
    timeLeft: '04m 12s',
    watchers: 12,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
  },
  {
    id: '2',
    title: 'Air Jordan 1 Retro',
    subtitle: 'Size 10 US, Never Worn',
    price: '$210',
    timeLeft: '12m 30s',
    watchers: 8,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400',
  },
];

const ENDING_SOON = [
  {
    id: '3',
    title: 'Seiko 5 Sports',
    subtitle: 'Vintage 1980s',
    price: '$85',
    bids: 12,
    timeLeft: '2h left',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
  },
  {
    id: '4',
    title: 'Gameboy Color',
    subtitle: 'Teal, Working',
    price: '$120',
    bids: 8,
    timeLeft: '45m left',
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400',
  },
  {
    id: '5',
    title: 'Nike Air Max',
    subtitle: 'Red, Size 9',
    price: '$95',
    bids: 5,
    timeLeft: '1h 15m left',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  },
];

// Components
const CategoryPill = ({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      styles.categoryPill,
      active && styles.categoryPillActive
    ]}
  >
    <Text style={[
      styles.categoryText,
      active && styles.categoryTextActive
    ]}>{label}</Text>
  </TouchableOpacity>
);

const LiveAuctionCard = ({ item }: { item: typeof LIVE_AUCTIONS[0] }) => (
  <View style={styles.liveCard}>
    <Image source={{ uri: item.image }} style={styles.liveCardImage} />
    
    {/* Badges */}
    <View style={styles.liveBadges}>
      <View style={styles.liveBadge}>
        <Text style={styles.liveBadgeText}>🔥 Live</Text>
      </View>
      <View style={styles.watchingBadge}>
        <Text style={styles.watchingBadgeText}>{item.watchers} Watching</Text>
      </View>
    </View>
    
    {/* Glassmorphism Overlay */}
    <View style={styles.liveCardOverlay}>
      <View style={styles.liveCardHeader}>
        <View>
          <Text style={styles.liveCardTitle}>{item.title}</Text>
          <Text style={styles.liveCardSubtitle}>{item.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={{ fontSize: 20 }}>♡</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.liveCardFooter}>
        <View>
          <Text style={styles.currentBidLabel}>Current Bid</Text>
          <Text style={styles.currentBidPrice}>{item.price}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>⏱ {item.timeLeft}</Text>
          </View>
          <TouchableOpacity style={styles.bidButton}>
            <Text style={styles.bidButtonText}>Bid Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const EndingSoonCard = ({ item }: { item: typeof ENDING_SOON[0] }) => (
  <View style={styles.endingCard}>
    <View style={styles.endingCardImageContainer}>
      <Image source={{ uri: item.image }} style={styles.endingCardImage} />
      <View style={styles.endingTimeBadge}>
        <Text style={styles.endingTimeText}>{item.timeLeft}</Text>
      </View>
    </View>
    <View style={styles.endingCardContent}>
      <Text style={styles.endingCardTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.endingCardSubtitle}>{item.subtitle}</Text>
      <View style={styles.endingCardFooter}>
        <Text style={styles.endingCardPrice}>{item.price}</Text>
        <Text style={styles.endingCardBids}>{item.bids} bids</Text>
      </View>
    </View>
  </View>
);

// Main App
export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Simulate splash screen
    setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2000);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.splashContent}>
          <Text style={styles.splashIcon}>💎</Text>
          <Text style={styles.splashTitle}>Biddt</Text>
          <Text style={styles.splashTagline}>Win Your Treasure</Text>
          <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>J</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>Jessica M.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={{ fontSize: 24 }}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 20, color: colors.textMuted }}>🔍</Text>
          <TextInput 
            style={styles.searchInput}
            placeholder="Search vintage cameras, sneakers..."
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity>
            <Text style={{ fontSize: 20, color: colors.textMuted }}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill 
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* Live Auctions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Live Auctions</Text>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {LIVE_AUCTIONS.map((item) => (
            <LiveAuctionCard key={item.id} item={item} />
          ))}
        </View>

        {/* Ending Soon */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ending Soon</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.endingSoonContainer}
          >
            {ENDING_SOON.map((item) => (
              <EndingSoonCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 24, color: colors.primary }}>🏠</Text>
          <Text style={[styles.navLabel, { color: colors.primary }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 24, color: colors.textMuted }}>🔍</Text>
          <Text style={styles.navLabel}>Search</Text>
        </TouchableOpacity>
        
        {/* Floating Sell Button */}
        <TouchableOpacity style={styles.sellButton}>
          <Text style={{ fontSize: 28, color: colors.textPrimary }}>＋</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 24, color: colors.textMuted }}>💬</Text>
          <Text style={styles.navLabel}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 24, color: colors.textMuted }}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Splash Screen
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -1,
  },
  splashTagline: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
  },
  
  // Main Container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  welcomeText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  
  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  
  // Categories
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  categoryPill: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  
  // Sections
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.live,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  
  // Live Auction Card
  liveCard: {
    height: 400,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  liveCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  liveBadges: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  liveBadge: {
    backgroundColor: 'rgba(255, 23, 68, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  watchingBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  watchingBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  liveCardOverlay: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  liveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  liveCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  liveCardSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  currentBidLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  currentBidPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  timerBadge: {
    backgroundColor: 'rgba(255, 23, 68, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.live,
  },
  bidButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    ...shadows.glow,
  },
  bidButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  
  // Ending Soon
  endingSoonContainer: {
    gap: spacing.lg,
  },
  endingCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  endingCardImageContainer: {
    height: 128,
    position: 'relative',
  },
  endingCardImage: {
    width: '100%',
    height: '100%',
  },
  endingTimeBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  endingTimeText: {
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  endingCardContent: {
    padding: spacing.md,
  },
  endingCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  endingCardSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  endingCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  endingCardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  endingCardBids: {
    fontSize: 10,
    color: colors.textMuted,
  },
  
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    width: 48,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
  },
  sellButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
    marginBottom: spacing.md,
    ...shadows.glow,
  },
});
