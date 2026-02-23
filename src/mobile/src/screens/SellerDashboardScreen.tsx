// src/screens/SellerDashboardScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface SellerDashboardScreenProps {
  navigation: any;
  theme: Theme;
}

export const SellerDashboardScreen: React.FC<SellerDashboardScreenProps> = ({ 
  navigation, 
  theme 
}) => {
  const { colors } = theme;
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'drafts'>('active');

  const stats = {
    totalSales: 12450,
    activeListings: 8,
    soldItems: 42,
    pendingShipments: 3,
    averageRating: 4.9,
    responseRate: 98,
  };

  const activeListings = [
    {
      id: '1',
      title: 'Nike Air Jordan 1 Retro High OG',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200',
      currentBid: 450,
      bids: 12,
      watchers: 23,
      endsIn: '12h 30m',
      views: 156,
    },
    {
      id: '2',
      title: 'Vintage Leica M6 Camera',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200',
      currentBid: 1850,
      bids: 8,
      watchers: 45,
      endsIn: '2h 15m',
      views: 289,
    },
  ];

  const soldItems = [
    {
      id: 's1',
      title: 'Supreme Box Logo Hoodie',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200',
      soldFor: 520,
      buyer: 'sneaker_king',
      date: '2 days ago',
      status: 'shipped',
    },
    {
      id: 's2',
      title: 'Apple Watch Ultra 2',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200',
      soldFor: 750,
      buyer: 'tech_enthusiast',
      date: '5 days ago',
      status: 'delivered',
    },
  ];

  const renderListingItem = ({ item }: { item: typeof activeListings[0] }) => (
    <Card theme={theme} style={styles.listingCard}>
      <View style={styles.listingRow}>
        <Image source={{ uri: item.image }} style={styles.listingImage} />
        
        <View style={styles.listingInfo}>
          <Text style={[styles.listingTitle, { color: colors.textPrimary }]} >
            {item.title}
          </Text>
          
          <Text style={[styles.listingPrice, { color: colors.textPrimary }]} >
            Current: ${item.currentBid}
          </Text>
          
          <View style={styles.listingStats}>
            <View style={styles.stat}>
              <Ionicons name="people-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.statText, { color: colors.textMuted }]} >{item.bids} bids</Text>
            </View>
            
            <View style={styles.stat}>
              <Ionicons name="eye-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.statText, { color: colors.textMuted }]} >{item.views} views</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.listingActions}>
          <View style={[styles.timerBadge, { backgroundColor: colors.warning + '20' }]} >
            <Text style={[styles.timerText, { color: colors.warning }]} >{item.endsIn}</Text>
          </View>
          
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderSoldItem = ({ item }: { item: typeof soldItems[0] }) => (
    <Card theme={theme} style={styles.listingCard}>
      <View style={styles.listingRow}>
        <Image source={{ uri: item.image }} style={styles.listingImage} />
        
        <View style={styles.listingInfo}>
          <Text style={[styles.listingTitle, { color: colors.textPrimary }]} >
            {item.title}
          </Text>
          
          <Text style={[styles.soldPrice, { color: colors.success }]} >
            Sold for ${item.soldFor}
          </Text>
          
          <Text style={[styles.buyerText, { color: colors.textMuted }]} >
            To: {item.buyer} • {item.date}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { 
          backgroundColor: item.status === 'shipped' ? colors.info + '20' : colors.success + '20' 
        }]} >
          <Text style={[styles.statusText, { 
            color: item.status === 'shipped' ? colors.info : colors.success 
          }]} >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </Card>
  );

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
        
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} >Seller Dashboard</Text>
        
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="settings-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <Card theme={theme} style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]} >
              ${stats.totalSales.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]} >Total Sales</Text>
          </Card>
          
          <Card theme={theme} style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]} >
              {stats.averageRating}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]} >Rating</Text>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card theme={theme} style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]} >
              {stats.activeListings}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]} >Active</Text>
          </Card>
          
          <Card theme={theme} style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]} >
              {stats.soldItems}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]} >Sold</Text>
          </Card>
          
          <Card theme={theme} style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.primary }]} >
              {stats.pendingShipments}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]} >To Ship</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Create New Listing"
            onPress={() => navigation.navigate('CreateListing')}
            theme={theme}
            style={{ flex: 1 }}
          />
          
          <Button
            title="Promote"
            variant="secondary"
            onPress={() => {}}
            theme={theme}
            style={{ flex: 1, marginLeft: spacing.md }}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['active', 'sold', 'drafts'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === tab ? colors.textPrimary : colors.textMuted,
                    fontFamily: activeTab === tab 
                      ? typography.fontFamily.semibold 
                      : typography.fontFamily.medium,
                  },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Listings */}
        <View style={styles.listingsContainer}>
          {activeTab === 'active' && (
            <FlatList
              data={activeListings}
              keyExtractor={item => item.id}
              renderItem={renderListingItem}
              scrollEnabled={false}
              contentContainerStyle={{ gap: spacing.md }}
            />
          )}
          
          {activeTab === 'sold' && (
            <FlatList
              data={soldItems}
              keyExtractor={item => item.id}
              renderItem={renderSoldItem}
              scrollEnabled={false}
              contentContainerStyle={{ gap: spacing.md }}
            />
          )}
          
          {activeTab === 'drafts' && (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]} >
                No drafts yet
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerTitle: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xxxl,
    marginBottom: spacing.md,
  },
  statCard: {
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxxl,
    marginBottom: spacing.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  tabText: {
    fontSize: typography.sizes.body,
    textTransform: 'capitalize',
  },
  listingsContainer: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.lg,
  },
  listingCard: {
    padding: spacing.md,
  },
  listingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listingImage: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: 2,
  },
  listingPrice: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
  },
  soldPrice: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
  },
  listingStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  listingActions: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  timerBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  timerText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.semibold,
  },
  buyerText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.semibold,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.md,
  },
});
