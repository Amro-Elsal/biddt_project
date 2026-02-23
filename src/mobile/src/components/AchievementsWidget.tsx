import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme/stitch';

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

const BADGES: Badge[] = [
  {
    id: '1',
    icon: '🎯',
    name: 'First Bid',
    description: 'Place your first bid',
    unlocked: true,
  },
  {
    id: '2',
    icon: '🏆',
    name: 'Winner',
    description: 'Win your first auction',
    unlocked: true,
  },
  {
    id: '3',
    icon: '💎',
    name: 'Treasure Hunter',
    description: 'Win 10 auctions',
    unlocked: false,
    progress: 7,
    total: 10,
  },
  {
    id: '4',
    icon: '💰',
    name: 'High Roller',
    description: 'Spend $1,000+ total',
    unlocked: false,
    progress: 650,
    total: 1000,
  },
  {
    id: '5',
    icon: '⚡',
    name: 'Speed Demon',
    description: 'Win with last-second bid',
    unlocked: false,
  },
  {
    id: '6',
    icon: '📦',
    name: 'First Sale',
    description: 'Complete your first sale',
    unlocked: false,
  },
  {
    id: '7',
    icon: '⭐',
    name: 'Top Rated',
    description: 'Maintain 4.9+ rating',
    unlocked: true,
  },
  {
    id: '8',
    icon: '🚀',
    name: 'Quick Shipper',
    description: 'Average <24h ship time',
    unlocked: false,
    progress: 18,
    total: 20,
  },
];

export const AchievementsWidget: React.FC = () => {
  const unlockedCount = BADGES.filter(b => b.unlocked).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>{unlockedCount} of {BADGES.length} unlocked</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BADGES.slice(0, 4).map((badge) => (
          <TouchableOpacity
            key={badge.id}
            style={[
              styles.badgeCard,
              !badge.unlocked && styles.badgeCardLocked,
            ]}
          >
            <View style={[
              styles.iconContainer,
              !badge.unlocked && styles.iconContainerLocked,
            ]}>
              <Text style={styles.icon}>{badge.icon}</Text>
              {!badge.unlocked && (
                <View style={styles.lockOverlay}>
                  <Text>🔒</Text>
                </View>
              )}
            </View>
            
            <Text style={[
              styles.badgeName,
              !badge.unlocked && styles.badgeNameLocked,
            ]}>{badge.name}</Text>
            
            {badge.progress !== undefined && badge.total !== undefined && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(badge.progress / badge.total) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{badge.progress}/{badge.total}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  badgeCard: {
    width: 100,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  badgeCardLocked: {
    borderColor: colors.border,
    opacity: 0.7,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 217, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  iconContainerLocked: {
    backgroundColor: colors.surfaceSecondary,
  },
  icon: {
    fontSize: 28,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: colors.textMuted,
  },
  progressContainer: {
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
