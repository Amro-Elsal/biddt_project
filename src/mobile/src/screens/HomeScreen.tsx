// src/screens/HomeScreen.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ListingCard } from '../components/ListingCard';
import { CategoryPill } from '../components/CategoryPill';
import { SearchBar } from '../components/SearchBar';
import { Avatar } from '../components/Avatar';
import { DailyTreasureWidget } from '../components/DailyTreasureWidget';
import { AchievementsWidget } from '../components/AchievementsWidget';
import { Theme, typography, spacing, borderRadius } from '../theme';
import { Category, Listing } from '../types';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
  theme: Theme;
}

// Mock data for listings
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Nike Air Jordan 1 Retro High OG',
    description: 'Deadstock, never worn. Original box included.',
    images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'],
    category: 'sneakers',
    condition: 'new',
    startingPrice: 200,
    currentPrice: 450,
    seller: {
      id: 's1',
      phoneNumber: '',
      displayName: 'SneakerHead',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s1',
      verified: true,
      trustScore: 98,
      soldCount: 42,
      activeBids: 5,
      replyTime: '<1hr',
      createdAt: new Date(),
      walletBalance: 0,
      buyingPower: 0,
    },
    lotNumber: 'A001',
    startTime: new Date(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'live',
    bids: [],
    watchers: 23,
    views: 156,
    location: 'New York, NY',
    shipping: { cost: 15, methods: ['Standard', 'Express'] },
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Vintage Leica M6 Camera',
    description: 'Classic rangefinder camera in excellent condition.',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
    category: 'vintage',
    condition: 'good',
    startingPrice: 1200,
    currentPrice: 1850,
    seller: {
      id: 's2',
      phoneNumber: '',
      displayName: 'VintageFinds',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s2',
      verified: true,
      trustScore: 95,
      soldCount: 28,
      activeBids: 3,
      replyTime: '<2hr',
      createdAt: new Date(),
      walletBalance: 0,
      buyingPower: 0,
    },
    lotNumber: 'B023',
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'ending_soon',
    bids: [],
    watchers: 45,
    views: 289,
    location: 'Los Angeles, CA',
    shipping: { cost: 25, methods: ['Insured'] },
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Supreme Box Logo Hoodie FW23',
    description: 'Black colorway, size L. Authentic with receipt.',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    category: 'streetwear',
    condition: 'like_new',
    startingPrice: 300,
    currentPrice: 520,
    seller: {
      id: 's3',
      phoneNumber: '',
      displayName: 'HypeBeast',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s3',
      verified: false,
      trustScore: 78,
      soldCount: 12,
      activeBids: 8,
      replyTime: '<4hr',
      createdAt: new Date(),
      walletBalance: 0,
      buyingPower: 0,
    },
    lotNumber: 'C105',
    startTime: new Date(),
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
    status: 'live',
    bids: [],
    watchers: 67,
    views: 423,
    location: 'Chicago, IL',
    shipping: { cost: 12, methods: ['Standard'] },
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Apple Watch Ultra 2',
    description: 'Latest model, unopened in box.',
    images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'],
    category: 'tech',
    condition: 'new',
    startingPrice: 700,
    currentPrice: 750,
    seller: {
      id: 's4',
      phoneNumber: '',
      displayName: 'TechDeals',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s4',
      verified: true,
      trustScore: 92,
      soldCount: 156,
      activeBids: 2,
      replyTime: '<30min',
      createdAt: new Date(),
      walletBalance: 0,
      buyingPower: 0,
    },
    lotNumber: 'D089',
    startTime: new Date(),
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    status: 'live',
    bids: [],
    watchers: 34,
    views: 198,
    location: 'Seattle, WA',
    shipping: { cost: 0, methods: ['Free Shipping'] },
    createdAt: new Date(),
  },
];

const categories: Category[] = ['all', 'sneakers', 'tech', 'vintage', 'streetwear', 'collectibles', 'watches', 'art'];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, theme }) => {
  const { colors } = theme;
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = mockListings.filter(listing => 
    (selectedCategory === 'all' || listing.category === selectedCategory) &&
    (searchQuery === '' || listing.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const liveAuctions = filteredListings.filter(l => l.status === 'live');
  const endingSoon = filteredListings.filter(l => l.status === 'ending_soon');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar
            uri="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
            name="User"
            size="md"
            theme={theme}
          />
        </TouchableOpacity>
        
        <Text
          style={[
            styles.logo,
            {
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.extrabold,
            },
          ]}
        >
          Biddt
        </Text>
        
        <TouchableOpacity 
          style={[styles.notificationButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          <View style={[styles.badge, { backgroundColor: colors.live }]} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            theme={theme}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <CategoryPill
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              theme={theme}
            />
          ))}
        </ScrollView>

        {/* Daily Treasure */}
        <DailyTreasureWidget 
          theme={theme} 
          onPress={() => navigation.navigate('FlashAuctions')}
        />

        {/* Achievements */}
        <AchievementsWidget theme={theme} />

        {/* Live Auctions */}
        {liveAuctions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: typography.fontFamily.bold,
                  },
                ]}
              >
                Live Auctions
              </Text>
              
              <TouchableOpacity>
                <Text
                  style={[
                    styles.seeAll,
                    {
                      color: colors.primary,
                      fontFamily: typography.fontFamily.semibold,
                    },
                  ]}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={liveAuctions}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ListingCard
                  listing={item}
                  onPress={() => navigation.navigate('ProductDetail', { listing: item })}
                  variant="featured"
                  theme={theme}
                />
              )}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        )}

        {/* Ending Soon */}
        {endingSoon.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: typography.fontFamily.bold,
                  },
                ]}
              >
                Ending Soon
              </Text>
            </View>

            <FlatList
              data={endingSoon}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ListingCard
                  listing={item}
                  onPress={() => navigation.navigate('ProductDetail', { listing: item })}
                  variant="horizontal"
                  theme={theme}
                />
              )}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* All Listings Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: typography.fontFamily.bold,
                },
              ]}
            >
              {selectedCategory === 'all' ? 'Trending' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
            </Text>
          </View>

          <View style={styles.grid}>
            {filteredListings.map(item => (
              <ListingCard
                key={item.id}
                listing={item}
                onPress={() => navigation.navigate('ProductDetail', { listing: item })}
                variant="grid"
                theme={theme}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Sell Button */}
      <TouchableOpacity
        style={[styles.sellButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('CreateListing')}
      >
        <Ionicons name="add" size={28} color={colors.textPrimary} />
        <Text
          style={[
            styles.sellButtonText,
            {
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.semibold,
            },
          ]}
        >
          Sell
        </Text>
      </TouchableOpacity>
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
  logo: {
    fontSize: typography.sizes.h2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
  searchContainer: {
    paddingHorizontal: spacing.xxxl,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.md,
  },
  section: {
    marginTop: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.h3,
  },
  seeAll: {
    fontSize: typography.sizes.body,
  },
  featuredList: {
    paddingHorizontal: spacing.xxxl - 8,
  },
  horizontalList: {
    paddingHorizontal: spacing.xxxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
  },
  sellButton: {
    position: 'absolute',
    bottom: 100,
    right: spacing.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sellButtonText: {
    fontSize: typography.sizes.body,
    marginLeft: spacing.xs,
  },
});
