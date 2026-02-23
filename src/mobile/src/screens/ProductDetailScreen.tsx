import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
  Easing,
  Modal,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Button } from '../components/Button';

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { listing } = route.params;
  const [bidAmount, setBidAmount] = useState('');
  const [showBidInput, setShowBidInput] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [currentBid, setCurrentBid] = useState(listing.currentBid);
  const [isOutbid, setIsOutbid] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatPrice = (cents: number) => `$${(cents / 100).toLocaleString()}`;
  
  const minBid = currentBid + 500;

  const handlePlaceBid = () => {
    const bid = parseInt(bidAmount) * 100;
    if (bid >= minBid) {
      setCurrentBid(bid);
      setShowBidInput(false);
      setBidAmount('');
      setShowWinModal(true);
      
      // Animate win modal
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => setShowWinModal(false), 3000);
    } else {
      alert(`Minimum bid is ${formatPrice(minBid)}`);
    }
  };

  const quickBids = [5, 10, 25, 50];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image source={{ uri: listing.image }} style={styles.image} />
        </Animated.View>

        {/* Live Badge */}
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE AUCTION</Text>
          <View style={styles.watcherBadge}>
            <Text style={styles.watcherText}>👥 12 watching</Text>
          </View>
        </View>

        {/* Content */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.title}>{listing.title}</Text>
          
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>{listing.seller.name[0]}</Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{listing.seller.name}</Text>
              <View style={styles.sellerStats}>
                <Text style={styles.sellerRating}>★ {listing.seller.rating}</Text>
                <Text style={styles.sellerDivider}>•</Text>
                <Text style={styles.sellerSales}>234 sales</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>

          {/* Price Section */}
          <View style={styles.priceCard}>
            <View style={styles.priceMain}>
              <Text style={styles.priceLabel}>Current Bid</Text>
              <Text style={[
                styles.currentPrice,
                isOutbid && styles.outbidPrice
              ]}>
                {formatPrice(currentBid)}
              </Text>
              {isOutbid && (
                <Text style={styles.outbidText}>You've been outbid!</Text>
              )}
            </View>
            
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Ends in</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeValue}>{listing.timeLeft}</Text>
              </View>
            </View>
          </View>

          {/* Bid History */}
          <View style={styles.bidHistory}>
            <View style={styles.bidHistoryHeader}>
              <Text style={styles.sectionTitle}>Bid History</Text>
              <View style={styles.bidCountBadge}>
                <Text style={styles.bidCountText}>{listing.bidCount} bids</Text>
              </View>
            </View>
            
            {[1, 2, 3].map((_, i) => (
              <View key={i} style={styles.bidRow}>
                <View style={styles.bidderInfo}>
                  <View style={styles.bidderAvatar}>
                    <Text style={styles.bidderAvatarText}>B</Text>
                  </View>
                  <Text style={styles.bidder}>Bidder {listing.bidCount - i}</Text>
                </View>
                <Text style={styles.bidAmount}>{formatPrice(currentBid - (i * 1000))}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
            
            <View style={styles.tags}>
              {['Vintage', 'Authentic', 'Verified'].map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>✓ {tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {showBidInput ? (
          <View style={styles.bidInputContainer}>
            <Text style={styles.minBidText}>Min bid: {formatPrice(minBid)}</Text>
            
            <View style={styles.quickBids}>
              {quickBids.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickBidButton}
                  onPress={() => {
                    const newBid = Math.round((currentBid/100 + amount));
                    setBidAmount(newBid.toString());
                  }}
                >
                  <Text style={styles.quickBidText}>+${amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.bidInputRow}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.bidInput}
                placeholder="0"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={bidAmount}
                onChangeText={setBidAmount}
                autoFocus
              />
            </View>
            
            <View style={styles.bidButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowBidInput(false);
                  setBidAmount('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.placeBidButton}
                onPress={handlePlaceBid}
              >
                <Text style={styles.placeBidText}>Place Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.watchButton}>
              <Text style={styles.watchIcon}>♡</Text>
              <Text style={styles.watchText}>Watch</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.bidButton}
              onPress={() => setShowBidInput(true)}
            >
              <Text style={styles.bidButtonText}>Place Bid</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Win Modal */}
      <Modal
        visible={showWinModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <View style={styles.confetti}>
              <Text style={styles.confettiText}>🎉</Text>
            </View>
            
            <View style={styles.trophy}>
              <Text style={styles.trophyText}>🏆</Text>
            </View>
            
            <Text style={styles.winTitle}>You're Winning!</Text>
            <Text style={styles.winAmount}>{formatPrice(currentBid)}</Text>
            
            <Text style={styles.winSubtitle}>Keep watching to maintain your lead</Text>
          </Animated.View>
        </View>
      </Modal>
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
    padding: spacing.md,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    color: colors.white,
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.diamondCyan,
    marginHorizontal: spacing.lg,
    marginTop: -20,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: colors.diamondCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginRight: 8,
  },
  liveText: {
    color: colors.deepNavy,
    fontWeight: '800',
    marginRight: spacing.md,
  },
  watcherBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  watcherText: {
    color: colors.deepNavy,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.md,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.midnight,
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.diamondPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  sellerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sellerName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  sellerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sellerRating: {
    color: colors.sparkGold,
    fontSize: 14,
  },
  sellerDivider: {
    color: colors.muted,
    marginHorizontal: spacing.xs,
  },
  sellerSales: {
    color: colors.muted,
    fontSize: 14,
  },
  contactButton: {
    backgroundColor: colors.twilight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  contactButtonText: {
    color: colors.diamondCyan,
    fontWeight: '600',
  },
  priceCard: {
    flexDirection: 'row',
    backgroundColor: colors.midnight,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  priceMain: {
    flex: 1,
  },
  priceLabel: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  currentPrice: {
    color: colors.white,
    fontSize: 40,
    fontWeight: '800',
  },
  outbidPrice: {
    color: colors.error,
  },
  outbidText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  timeSection: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  timeBox: {
    backgroundColor: colors.twilight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.sparkOrange,
  },
  timeValue: {
    color: colors.sparkOrange,
    fontSize: 18,
    fontWeight: '700',
  },
  bidHistory: {
    backgroundColor: colors.midnight,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  bidHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  bidCountBadge: {
    backgroundColor: colors.twilight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bidCountText: {
    color: colors.muted,
    fontSize: 12,
  },
  bidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.twilight,
  },
  bidderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.twilight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  bidderAvatarText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  bidder: {
    color: colors.softWhite,
  },
  bidAmount: {
    color: colors.white,
    fontWeight: '700',
  },
  descriptionSection: {
    marginBottom: spacing.xl,
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  tagText: {
    color: colors.diamondCyan,
    fontSize: 13,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 120,
  },
  bottomBar: {
    backgroundColor: colors.midnight,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.twilight,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.twilight,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    gap: spacing.xs,
  },
  watchIcon: {
    fontSize: 20,
  },
  watchText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bidButton: {
    flex: 1,
    backgroundColor: colors.sparkGold,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.sparkGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  bidButtonText: {
    color: colors.deepNavy,
    fontSize: 18,
    fontWeight: '800',
  },
  bidInputContainer: {
    gap: spacing.sm,
  },
  minBidText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  quickBids: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  quickBidButton: {
    backgroundColor: colors.twilight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  quickBidText: {
    color: colors.diamondCyan,
    fontWeight: '600',
  },
  bidInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.twilight,
    borderRadius: 16,
    padding: spacing.md,
  },
  dollarSign: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '300',
  },
  bidInput: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
    minWidth: 100,
    textAlign: 'center',
  },
  bidButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.twilight,
    borderRadius: 16,
  },
  cancelText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '600',
  },
  placeBidButton: {
    flex: 2,
    backgroundColor: colors.sparkGold,
    padding: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  placeBidText: {
    color: colors.deepNavy,
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors.midnight,
    padding: spacing.xl,
    borderRadius: 24,
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: colors.sparkGold,
  },
  confetti: {
    position: 'absolute',
    top: -20,
  },
  confettiText: {
    fontSize: 40,
  },
  trophy: {
    marginBottom: spacing.md,
  },
  trophyText: {
    fontSize: 60,
  },
  winTitle: {
    color: colors.sparkGold,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  winAmount: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  winSubtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
});
