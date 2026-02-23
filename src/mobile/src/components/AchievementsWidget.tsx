// src/components/AchievementsWidget.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
}

interface AchievementsWidgetProps {
  theme: Theme;
  onViewAll?: () => void;
}

export const AchievementsWidget: React.FC<AchievementsWidgetProps> = ({
  theme,
  onViewAll,
}) => {
  const { colors } = theme;
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const achievements: Achievement[] = [
    {
      id: '1',
      icon: 'trophy',
      title: 'First Win',
      description: 'Win your first auction',
      unlocked: true,
      unlockedAt: '2 days ago',
      rarity: 'common',
    },
    {
      id: '2',
      icon: 'flame',
      title: 'Bidding Streak',
      description: 'Bid 7 days in a row',
      unlocked: true,
      unlockedAt: 'Today',
      rarity: 'rare',
    },
    {
      id: '3',
      icon: 'zap',
      title: 'Speed Demon',
      description: 'Win an auction in the last 10 seconds',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'epic',
    },
    {
      id: '4',
      icon: 'diamond',
      title: 'Treasure Hunter',
      description: 'Claim 5 daily treasures',
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      rarity: 'rare',
    },
    {
      id: '5',
      icon: 'trending-up',
      title: 'Power Seller',
      description: 'Sell 50 items',
      unlocked: false,
      progress: 42,
      maxProgress: 50,
      rarity: 'epic',
    },
    {
      id: '6',
      icon: 'crown',
      title: 'Auction Master',
      description: 'Win 100 auctions',
      unlocked: false,
      progress: 23,
      maxProgress: 100,
      rarity: 'legendary',
    },
  ];

  const rarityColors = {
    common: '#8B8B8B',
    rare: '#00D9FF',
    epic: '#7B61FF',
    legendary: '#FFD700',
  };

  const filteredAchievements = selectedRarity
    ? achievements.filter(a => a.rarity === selectedRarity)
    : achievements;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]} >
            Achievements
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} >
            {unlockedCount}/{achievements.length} Unlocked
          </Text>
        </View>
        
        <TouchableOpacity onPress={onViewAll}>
          <Text style={[styles.viewAll, { color: colors.primary }]} >View All →</Text>
        </TouchableOpacity>
      </View>

      {/* Rarity Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: selectedRarity === null ? colors.primary : colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
          onPress={() => setSelectedRarity(null)}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: selectedRarity === null ? colors.textPrimary : colors.textSecondary,
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {Object.entries(rarityColors).map(([rarity, color]) => (
          <TouchableOpacity
            key={rarity}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedRarity === rarity ? color + '30' : colors.surface,
                borderColor: selectedRarity === rarity ? color : colors.border,
                borderWidth: 2,
              },
            ]}
            onPress={() => setSelectedRarity(rarity)}
          >
            <View style={[styles.rarityDot, { backgroundColor: color }]} />
            <Text
              style={[
                styles.filterText,
                {
                  color: selectedRarity === rarity ? color : colors.textSecondary,
                },
              ]}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Achievements Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsContainer}
      >
        {filteredAchievements.map((achievement) => (
          <TouchableOpacity
            key={achievement.id}
            style={[
              styles.achievementCard,
              {
                backgroundColor: achievement.unlocked
                  ? rarityColors[achievement.rarity] + '15'
                  : colors.surface,
                borderColor: achievement.unlocked
                  ? rarityColors[achievement.rarity]
                  : colors.border,
                borderWidth: 2,
                opacity: achievement.unlocked ? 1 : 0.7,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: achievement.unlocked
                    ? rarityColors[achievement.rarity]
                    : colors.border,
                },
              ]}
            >
              <Ionicons
                name={achievement.icon as any}
                size={24}
                color={achievement.unlocked ? '#fff' : colors.textMuted}
              />
              
              {achievement.unlocked && (
                <View style={styles.unlockedBadge}>
                  <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
              )}
            </View>

            <Text
              style={[styles.achievementTitle, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {achievement.title}
            </Text>
            
            <Text
              style={[styles.achievementDesc, { color: colors.textMuted }]}
              numberOfLines={2}
            >
              {achievement.description}
            </Text>

            {!achievement.unlocked && achievement.progress !== undefined && (
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: rarityColors[achievement.rarity],
                        width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%`,
                      },
                    ]}
                  />
                </View>
                
                <Text style={[styles.progressText, { color: colors.textMuted }]} >
                  {achievement.progress}/{achievement.maxProgress}
                </Text>
              </View>
            )}

            {achievement.unlocked && achievement.unlockedAt && (
              <Text style={[styles.unlockedAt, { color: colors.textMuted }]} >
                Unlocked {achievement.unlockedAt}
              </Text>
            )}

            <View
              style={[
                styles.rarityBadge,
                { backgroundColor: rarityColors[achievement.rarity] },
              ]}
            >
              <Text style={styles.rarityText}>
                {achievement.rarity.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xxxl,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  viewAll: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  filterContainer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  filterText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'capitalize',
  },
  achievementsContainer: {
    paddingHorizontal: spacing.xxxl,
    gap: spacing.md,
  },
  achievementCard: {
    width: 140,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  unlockedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  achievementTitle: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  achievementDesc: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: typography.sizes.overline,
    fontFamily: typography.fontFamily.medium,
  },
  unlockedAt: {
    fontSize: typography.sizes.overline,
    fontFamily: typography.fontFamily.regular,
  },
  rarityBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rarityText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
  },
});
