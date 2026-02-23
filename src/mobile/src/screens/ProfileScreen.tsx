// src/screens/ProfileScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { TrustScore } from '../components/TrustScore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface ProfileScreenProps {
  navigation: any;
  theme: Theme;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  navigation, 
  theme 
}) => {
  const { colors } = theme;

  // Mock user data
  const user = {
    displayName: 'Alex Collector',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    verified: true,
    trustScore: 98,
    soldCount: 42,
    activeBids: 5,
    replyTime: '<1hr',
    memberSince: '2024',
    walletBalance: 1250,
    buyingPower: 2500,
  };

  const stats = [
    { label: 'Sold', value: user.soldCount },
    { label: 'Active Bids', value: user.activeBids },
    { label: 'Reply Time', value: user.replyTime },
  ];

  const menuItems = [
    { icon: 'wallet-outline', label: 'Wallet & Payments', screen: 'Wallet' },
    { icon: 'cube-outline', label: 'My Listings', screen: 'MyListings' },
    { icon: 'heart-outline', label: 'Watchlist', screen: 'Watchlist' },
    { icon: 'chatbubble-outline', label: 'Messages', screen: 'ChatList' },
    { icon: 'star-outline', label: 'Reviews', screen: 'Reviews' },
    { icon: 'shield-checkmark-outline', label: 'Verification', screen: 'Verification' },
    { icon: 'settings-outline', label: 'Settings', screen: 'Settings' },
    { icon: 'help-circle-outline', label: 'Help & Support', screen: 'Support' },
  ];

  const recentReviews = [
    {
      id: '1',
      reviewer: 'sneaker_king',
      rating: 5,
      text: 'Great seller! Item exactly as described, fast shipping.',
      item: 'Nike Air Jordan 1',
      date: '2 days ago',
    },
    {
      id: '2',
      reviewer: 'collector_99',
      rating: 5,
      text: 'Excellent communication and packaging. Would buy again!',
      item: 'Vintage Leica M6',
      date: '1 week ago',
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
        
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} >Profile</Text>
        
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarSection}>
            <Avatar
              uri={user.avatar}
              name={user.displayName}
              size="xl"
              verified={user.verified}
              theme={theme}
            />
            
            <TrustScore score={user.trustScore} theme={theme} />
          </View>

          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: colors.textPrimary }]} >
                {user.displayName}
              </Text>
              
              {user.verified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]} >
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.memberSince, { color: colors.textMuted }]} >
              Member since {user.memberSince}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View 
              key={index} 
              style={[
                styles.statItem,
                index < stats.length - 1 && { borderRightWidth: 1, borderRightColor: colors.border }
              ]}
            >
              <Text style={[styles.statValue, { color: colors.textPrimary }]} >
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]} >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Wallet Card */}
        <Card theme={theme} style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={[styles.walletTitle, { color: colors.textPrimary }]} >Wallet</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
              <Text style={[styles.viewAll, { color: colors.primary }]} >View All →</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.walletBalances}>
            <View style={styles.balanceItem}>
              <Text style={[styles.balanceLabel, { color: colors.textMuted }]} >Balance</Text>
              <Text style={[styles.balanceValue, { color: colors.textPrimary }]} >
                ${user.walletBalance.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.balanceItem}>
              <Text style={[styles.balanceLabel, { color: colors.textMuted }]} >Buying Power</Text>
              <Text style={[styles.balanceValue, { color: colors.textPrimary }]} >
                ${user.buyingPower.toLocaleString()}
              </Text>
            </View>
          </View>
          
          <Button
            title="Add Funds"
            onPress={() => navigation.navigate('Payment')}
            theme={theme}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: colors.surfaceSecondary }]} >
                  <Ionicons name={item.icon as any} size={20} color={colors.textPrimary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.textPrimary }]} >
                  {item.label}
                </Text>
              </View>
              
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Reviews */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.reviewsTitle, { color: colors.textPrimary }]} >
              Recent Reviews
            </Text>
            
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.primary }]} >See All</Text>
            </TouchableOpacity>
          </View>

          {recentReviews.map(review => (
            <Card key={review.id} theme={theme} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={[styles.reviewerName, { color: colors.textPrimary }]} >
                  {review.reviewer}
                </Text>
                
                <View style={styles.ratingContainer}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < review.rating ? 'star' : 'star-outline'}
                      size={14}
                      color={colors.primary}
                    />
                  ))}
                </View>
              </View>
              
              <Text style={[styles.reviewText, { color: colors.textSecondary }]} >
                "{review.text}"
              </Text>
              
              <View style={styles.reviewFooter}>
                <Text style={[styles.reviewItem, { color: colors.textMuted }]} >
                  {review.item}
                </Text>
                <Text style={[styles.reviewDate, { color: colors.textMuted }]} >
                  {review.date}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Logout */}
        <Button
          title="Log Out"
          variant="ghost"
          onPress={() => navigation.navigate('Onboarding')}
          theme={theme}
          style={{ marginTop: spacing.lg, marginBottom: spacing.xxl }}
        />

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
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  nameSection: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  displayName: {
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
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
  memberSince: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginHorizontal: spacing.xxxl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
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
  walletCard: {
    marginHorizontal: spacing.xxxl,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  walletTitle: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
  },
  viewAll: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.semibold,
  },
  walletBalances: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {},
  balanceLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  balanceValue: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
  menuContainer: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.xxxl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
  },
  reviewsSection: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.xxxl,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reviewsTitle: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
  },
  reviewCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewerName: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewItem: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
  },
  reviewDate: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
});
