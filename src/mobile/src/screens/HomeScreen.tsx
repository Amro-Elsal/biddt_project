import React, { useState, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { ListingCard } from '../components/ListingCard';
import { mockListings, categories } from '../data/mock';

export const HomeScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState(mockListings);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setListings([...mockListings].reverse());
      setRefreshing(false);
    }, 1500);
  }, []);

  const filteredListings = listings.filter(listing => {
    if (searchQuery) {
      return listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const renderCategory = ({ item, index }: any) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryPill,
          isSelected && styles.categoryPillActive
        ]}
        onPress={() => setSelectedCategory(item.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={[
          styles.categoryText,
          isSelected && styles.categoryTextActive
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header Background */}
      <Animated.View 
        style={[
          styles.headerBackground,
          { opacity: headerOpacity }
        ]} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>💎</Text>
          </View>
          <View>
            <Text style={styles.logoText}>Biddt</Text>
            <Text style={styles.logoTagline}>Win Your Treasure</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.diamondCyan}
            colors={[colors.diamondCyan]}
          />
        }
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for treasure..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1,247</Text>
            <Text style={styles.statLabel}>Live Auctions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$2.4M</Text>
            <Text style={styles.statLabel}>Total Bids Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>89%</Text>
            <Text style={styles.statLabel}>Safe Exchanges</Text>
          </View>
        </View>

        {/* Live Auctions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.liveIndicator}>
                <View style={styles.pulseDot} />
              </View>
              <Text style={styles.sectionTitle}>Live Auctions</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAll}>See All</Text>
              <Text style={styles.seeAllArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {filteredListings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              {...listing}
              index={index}
              onPress={() => navigation.navigate('ProductDetail', { listing })}
            />
          ))}
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAll}>See All</Text>
              <Text style={styles.seeAllArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {filteredListings.slice(0, 3).map((listing, index) => (
            <ListingCard
              key={`trending-${listing.id}`}
              {...listing}
              index={index + filteredListings.length}
              onPress={() => navigation.navigate('ProductDetail', { listing })}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepNavy,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: colors.midnight,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    zIndex: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.diamondCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    shadowColor: colors.diamondCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIconText: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  logoTagline: {
    fontSize: 12,
    color: colors.muted,
    marginTop: -2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.twilight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.twilight,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    paddingVertical: 14,
  },
  clearIcon: {
    color: colors.muted,
    fontSize: 16,
    padding: spacing.xs,
  },
  categoriesSection: {
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.twilight,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  categoryPillActive: {
    backgroundColor: colors.diamondCyan,
    borderColor: colors.diamondCyan,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.deepNavy,
    fontWeight: '700',
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: colors.midnight,
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.twilight,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    marginRight: spacing.sm,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.sparkOrange,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: colors.diamondCyan,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  seeAllArrow: {
    color: colors.diamondCyan,
    fontSize: 14,
  },
  bottomPadding: {
    height: 100,
  },
});
