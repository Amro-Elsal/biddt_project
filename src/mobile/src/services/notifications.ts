// src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_SETTINGS_KEY = '@biddt_notification_settings';

export interface NotificationSettings {
  outbid: boolean;
  auctionEnding: boolean;
  auctionWon: boolean;
  priceDrop: boolean;
  newListings: boolean;
  messages: boolean;
  dailyTreasure: boolean;
  flashAuctions: boolean;
}

export const defaultSettings: NotificationSettings = {
  outbid: true,
  auctionEnding: true,
  auctionWon: true,
  priceDrop: true,
  newListings: false,
  messages: true,
  dailyTreasure: true,
  flashAuctions: true,
};

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async (): Promise<string | null> => {
  let token = null;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

export const loadNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading notification settings:', error);
  }
  return defaultSettings;
};

export const saveNotificationSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

// Local notification triggers
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>,
  trigger?: Notifications.NotificationTriggerInput
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: 'default',
    },
    trigger: trigger || null,
  });
};

// Specific notification types
export const notifyOutbid = async (itemName: string, newBid: number) => {
  const settings = await loadNotificationSettings();
  if (!settings.outbid) return;

  await scheduleLocalNotification(
    'You\'ve Been Outbid!',
    `Someone bid $${newBid} on "${itemName}". Don\'t let it slip away!`,
    { type: 'outbid', itemName, newBid }
  );
};

export const notifyAuctionEnding = async (itemName: string, minutesLeft: number) => {
  const settings = await loadNotificationSettings();
  if (!settings.auctionEnding) return;

  await scheduleLocalNotification(
    'Auction Ending Soon!',
    `"${itemName}" ends in ${minutesLeft} minutes. Place your final bid!`,
    { type: 'auction_ending', itemName, minutesLeft },
    { seconds: 1 }
  );
};

export const notifyAuctionWon = async (itemName: string, finalPrice: number) => {
  const settings = await loadNotificationSettings();
  if (!settings.auctionWon) return;

  await scheduleLocalNotification(
    '🎉 You Won!',
    `Congratulations! You won "${itemName}" for $${finalPrice}.`,
    { type: 'auction_won', itemName, finalPrice }
  );
};

export const notifyPriceDrop = async (itemName: string, newPrice: number, originalPrice: number) => {
  const settings = await loadNotificationSettings();
  if (!settings.priceDrop) return;

  const discount = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
  
  await scheduleLocalNotification(
    '💰 Price Drop Alert!',
    `"${itemName}" dropped ${discount}% to $${newPrice}!`,
    { type: 'price_drop', itemName, newPrice, discount }
  );
};

export const notifyDailyTreasure = async () => {
  const settings = await loadNotificationSettings();
  if (!settings.dailyTreasure) return;

  await scheduleLocalNotification(
    '🎁 Daily Treasure Available!',
    'Your exclusive daily deal is waiting. Open the app to claim it!',
    { type: 'daily_treasure' }
  );
};

export const notifyFlashAuction = async () => {
  const settings = await loadNotificationSettings();
  if (!settings.flashAuctions) return;

  await scheduleLocalNotification(
    '⚡ Flash Auction Starting!',
    'New 15-minute lightning deals are live. Up to 70% off!',
    { type: 'flash_auction' }
  );
};

export const notifyNewMessage = async (senderName: string) => {
  const settings = await loadNotificationSettings();
  if (!settings.messages) return;

  await scheduleLocalNotification(
    'New Message',
    `${senderName} sent you a message.`,
    { type: 'message', senderName }
  );
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Get badge count
export const getBadgeCount = async (): Promise<number> => {
  return await Notifications.getBadgeCountAsync();
};

// Set badge count
export const setBadgeCount = async (count: number): Promise<void> => {
  await Notifications.setBadgeCountAsync(count);
};
