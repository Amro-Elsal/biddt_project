// src/screens/FlashAuctionsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, typography, spacing, borderRadius } from '../theme';
import { Timer } from '../components/Timer';

const { width } = Dimensions.get('window');

interface FlashAuctionScreenProps {
  navigation: any;
  theme: Theme;
}

interface FlashItem {
  id: string;
  title: string;
  image: string;
  originalPrice: number;
  flashPrice: number;
  discount: number;
  endTime: Date;
  quantity: number;
  sold: number;
  bidders: number;
}

export const FlashAuctionsScreen: React.FC<FlashAuctionScreenProps> = ({
  navigation,
  theme,
}) => {
  const { colors } = theme;
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 15 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashItems: FlashItem[] = [
    {
      id: '1',
      title: 'Sony WH-1000XM5 Headphones',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
      originalPrice: 399,
      flashPrice: 249,
      discount: 38,
      endTime: new Date(Date.now() + 15 * 60 * 1000),
      quantity: 50,
      sold: 32,
      bidders: 89,
    },
    {
      id: '2',
      title: 'Nintendo Switch OLED',
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
      originalPrice: 349,
      flashPrice: 279,
      discount: 20,
      endTime: new Date(Date.now() + 12 * 60 * 1000),
      quantity: 30,
      sold: 18,
      bidders: 156,
    },
    {
      id: '3',
      title: 'iPad Air 5th Gen',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      originalPrice: 599,
      flashPrice: 449,
      discount: 25,
      endTime: new Date(Date.now() + 8 * 60 * 1000),
      quantity: 25,
      sold: 21,
      bidders: 234,
    },
    {
      id: '4',
      title: 'Dyson V15 Detect',
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
      originalPrice: 749,
      flashPrice: 549,
      discount: 27,
      endTime: new Date(Date.now() + 5 * 60 * 1000),
      quantity: 15,
      sold: 12,
      bidders: 67,
    },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderFlashItem = ({ item }: { item: FlashItem }) => {
    const progress = (item.sold / item.quantity) * 100;
    const isAlmostSold = progress > 80;

    return (
      <TouchableOpacity
        style={[styles.itemCard, { backgroundColor: colors.surface }]}
        onPress={() => navigation.navigate('ProductDetail', { listing: item })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          
          <View style={[styles.discountBadge, { backgroundColor: colors.live }]} >
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>

          {isAlmostSold && (
            <View style={[styles.almostGoneBadge, { backgroundColor: colors.warning }]} >
              <Text style={styles.almostGoneText}>Almost Gone!</Text>
            </View>
          )}
        </View>

        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.textPrimary }]} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.flashPrice, { color: colors.success }]} >
              ${item.flashPrice}
            </Text>
            <Text style={[styles.originalPrice, { color: colors.textMuted }]} >
              ${item.originalPrice}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]} >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: isAlmostSold ? colors.warning : colors.success,
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
            
            <Text style={[styles.progressText, { color: colors.textMuted }]} >
              {item.sold}/{item.quantity} sold • {item.bidders} bidding
            </Text>
          </View>

          {/* Timer */}
          <View style={[styles.timerContainer, { backgroundColor: colors.background }]}>
            <Ionicons name="flash" size={16} color={colors.live} />
            <Text style={[styles.timerLabel, { color: colors.live }]} >Flash ends in:</Text>
            <Timer endTime={item.endTime} theme={theme} size="sm" showLabels={false} />
          </View>

          <TouchableOpacity
            style={[styles.bidButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Payment', { listing: item })}
          >
            <Text style={[styles.bidText, { color: colors.textPrimary }]} >Bid Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Ionicons name="flash" size={24} color={colors.live} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]} >
            Flash Auctions
          </Text>
        </View>
        
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Round Timer */}
      <View style={[styles.roundTimer, { backgroundColor: colors.live }]} >
        <Text style={styles.roundTimerLabel}>Current Round Ends In:</Text>
        <Text style={styles.roundTimerValue}>{formatTime(timeLeft)}</Text>
        <Text style={styles.roundTimerSubtext}>New items every 15 minutes!</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'live' && { borderBottomColor: colors.live, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('live')}
        >
          <View style={styles.tabContent}>
            <Ionicons
              name="flash"
              size={16}
              color={activeTab === 'live' ? colors.live : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'live' ? colors.live : colors.textMuted,
                },
              ]}
            >
              Live Now
            </Text>
            <View style={[styles.liveDot, { backgroundColor: colors.live }]} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'upcoming' ? colors.textPrimary : colors.textMuted,
              },
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <FlatList
        data={flashItems}
        keyExtractor={item => item.id}
        renderItem={renderFlashItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
  roundTimer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  roundTimerLabel: {
    color: '#fff',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    opacity: 0.9,
  },
  roundTimerValue: {
    color: '#fff',
    fontSize: typography.sizes.hero,
    fontFamily: typography.fontFamily.extrabold,
    marginVertical: spacing.xs,
  },
  roundTimerSubtext: {
    color: '#fff',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    opacity: 0.8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  tabText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  listContent: {
    padding: spacing.xxxl,
    gap: spacing.lg,
  },
  itemCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: '#fff',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
  },
  almostGoneBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  almostGoneText: {
    color: '#fff',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
  },
  itemInfo: {
    padding: spacing.lg,
  },
  itemTitle: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  flashPrice: {
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
    marginRight: spacing.sm,
  },
  originalPrice: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    textDecorationLine: 'line-through',
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  timerLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.semibold,
    marginLeft: spacing.xs,
    marginRight: spacing.sm,
  },
  bidButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  bidText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.bold,
  },
});
