import React, { useState } from 'react';
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
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { ListingCard } from '../components/ListingCard';
import { mockListings, categories } from '../data/mock';

export const HomeScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = mockListings.filter(listing => {
    if (searchQuery) {
      return listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.categoryPill,
        selectedCategory === item.id && styles.categoryPillActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>💎</Text>
          <Text style={styles.logoText}>Biddt</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for treasure..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />

        {/* Live Auctions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Live Auctions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {filteredListings.map(listing => (
            <ListingCard
              key={listing.id}
              {...listing}
              onPress={() => navigation.navigate('ProductDetail', { listing })}
            />
          ))}
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📈 Trending Now</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {filteredListings.slice(0, 3).map(listing => (
            <ListingCard
              key={`trending-${listing.id}`}
              {...listing}
              onPress={() => navigation.navigate('ProductDetail', { listing })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepNavy,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 28,
    marginRight: spacing.xs,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.diamondCyan,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.twilight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.twilight,
    marginHorizontal: spacing.lg,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.twilight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: colors.diamondCyan,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.deepNavy,
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: typography.h2.size,
    fontWeight: typography.h2.weight,
    color: colors.white,
  },
  seeAll: {
    color: colors.diamondCyan,
    fontSize: 14,
  },
});
