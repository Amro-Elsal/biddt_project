// src/screens/NotificationsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, typography, spacing, borderRadius } from '../theme';
import { 
  NotificationSettings, 
  defaultSettings,
  loadNotificationSettings,
  saveNotificationSettings 
} from '../services/notifications';

interface NotificationsScreenProps {
  navigation: any;
  theme: Theme;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
  theme,
}) => {
  const { colors } = theme;
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loaded = await loadNotificationSettings();
    setSettings(loaded);
    setLoading(false);
  };

  const toggleSetting = async (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await saveNotificationSettings(newSettings);
  };

  const notificationCategories = [
    {
      title: 'Bidding',
      items: [
        { key: 'outbid', label: 'Outbid Alerts', icon: 'trending-up', description: 'When someone outbids you' },
        { key: 'auctionEnding', label: 'Ending Soon', icon: 'time', description: '1 hour before your auctions end' },
        { key: 'auctionWon', label: 'Win Notifications', icon: 'trophy', description: 'When you win an auction' },
        { key: 'priceDrop', label: 'Price Drops', icon: 'arrow-down', description: 'When watched items drop in price' },
      ],
    },
    {
      title: 'Discover',
      items: [
        { key: 'dailyTreasure', label: 'Daily Treasure', icon: 'gift', description: 'New daily deals available' },
        { key: 'flashAuctions', label: 'Flash Auctions', icon: 'flash', description: '15-minute lightning deals' },
        { key: 'newListings', label: 'New Listings', icon: 'add-circle', description: 'From sellers you follow' },
      ],
    },
    {
      title: 'Social',
      items: [
        { key: 'messages', label: 'Messages', icon: 'chatbubble', description: 'New messages from buyers/sellers' },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} >
          Notifications
        </Text>
        
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]} >
              <Ionicons name="mail-unread" size={20} color={colors.primary} />
            </View>
            <View style={styles.quickActionText}>
              <Text style={[styles.quickActionTitle, { color: colors.textPrimary }]} >
                Mark all as read
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.error + '20' }]} >
              <Ionicons name="trash" size={20} color={colors.error} />
            </View>
            <View style={styles.quickActionText}>
              <Text style={[styles.quickActionTitle, { color: colors.textPrimary }]} >
                Clear all notifications
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.settingsTitle, { color: colors.textPrimary }]} >
            Notification Preferences
          </Text>
          
          {notificationCategories.map((category, categoryIndex) => (
            <View key={category.title} style={styles.category}>
              <Text style={[styles.categoryTitle, { color: colors.textMuted }]} >
                {category.title}
              </Text>
              
              <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
                {category.items.map((item, itemIndex) => (
                  <View
                    key={item.key}
                    style={[
                      styles.settingItem,
                      itemIndex < category.items.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: colors.background }]} >
                        <Ionicons name={item.icon as any} size={18} color={colors.textSecondary} />
                      </View>
                      
                      <View>
                        <Text style={[styles.settingLabel, { color: colors.textPrimary }]} >
                          {item.label}
                        </Text>
                        <Text style={[styles.settingDescription, { color: colors.textMuted }]} >
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    
                    <Switch
                      value={settings[item.key as keyof NotificationSettings]}
                      onValueChange={() => toggleSetting(item.key as keyof NotificationSettings)}
                      trackColor={{ false: colors.border, true: colors.primary + '50' }}
                      thumbColor={settings[item.key as keyof NotificationSettings] ? colors.primary : colors.textMuted}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Quiet Hours */}
        <View style={styles.category}>
          <Text style={[styles.categoryTitle, { color: colors.textMuted }]} >Quiet Hours</Text>
          
          <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.background }]} >
                  <Ionicons name="moon" size={18} color={colors.textSecondary} />
                </View>
                
                <View>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]} >
                    Do Not Disturb
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textMuted }]} >
                    10:00 PM - 8:00 AM
                  </Text>
                </View>
              </View>
              
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: colors.border, true: colors.primary + '50' }}
                thumbColor={colors.textMuted}
              />
            </View>
          </View>
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
  headerTitle: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
  quickActions: {
    marginHorizontal: spacing.xxxl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    marginLeft: spacing.md,
  },
  quickActionTitle: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.md,
  },
  settingsContainer: {
    paddingHorizontal: spacing.xxxl,
  },
  settingsTitle: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  category: {
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  categoryCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
});
