import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Button } from '../components/Button';

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { listing } = route.params;
  const [bidAmount, setBidAmount] = useState('');
  const [showBidInput, setShowBidInput] = useState(false);

  const formatPrice = (cents: number) => `$${(cents / 100).toLocaleString()}`;
  
  const minBid = listing.currentBid + 500;

  const handlePlaceBid = () => {
    const bid = parseInt(bidAmount) * 100;
    if (bid >= minBid) {
      alert(`Bid placed: ${formatPrice(bid)}`);
      setShowBidInput(false);
      setBidAmount('');
    } else {
      alert(`Minimum bid is ${formatPrice(minBid)}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.shareButton}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Image */}
        <Image source={{ uri: listing.image }} style={styles.image} />

        {/* Live Badge */}
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE AUCTION</Text>
          <Text style={styles.watcherCount}>12 watching</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{listing.title}</Text>
          
          <View style={styles.sellerRow}>
            <Text style={styles.sellerName}>👤 {listing.seller.name}</Text>
            <Text style={styles.rating}>★ {listing.seller.rating}</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Current Bid</Text>
              <Text style={styles.currentPrice}>{formatPrice(listing.currentBid)}</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Ends in</Text>
              <Text style={styles.timeValue}>{listing.timeLeft}</Text>
            </View>
          </View>

          {/* Bid History */}
          <View style={styles.bidHistory}>
            <Text style={styles.sectionTitle}>Bid History ({listing.bidCount} bids)</Text>
            {[1, 2, 3].map((_, i) => (
              <View key={i} style={styles.bidRow}>
                <Text style={styles.bidder}>Bidder {listing.bidCount - i}</Text>
                <Text style={styles.bidAmount}>{formatPrice(listing.currentBid - (i * 1000))}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {showBidInput ? (
          <View style={styles.bidInputContainer}>
            <TextInput
              style={styles.bidInput}
              placeholder={`Min ${formatPrice(minBid)}`}
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={bidAmount}
              onChangeText={setBidAmount}
            />
            <View style={styles.bidButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBidInput(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Button 
                title="Place Bid" 
                onPress={handlePlaceBid}
                variant="gold"
                size="small"
              />
            </View>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <Button 
              title="Watch" 
              onPress={() => {}}
              variant="secondary"
              size="medium"
            />
            <Button 
              title="Place Bid" 
              onPress={() => setShowBidInput(true)}
              variant="gold"
              size="medium"
            />
          </View>
        )}
      </View>
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
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  shareButton: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.diamondCyan,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: -20,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
    fontWeight: '700',
    marginRight: spacing.md,
  },
  watcherCount: {
    color: colors.deepNavy,
    fontSize: 12,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sellerName: {
    color: colors.softWhite,
    fontSize: 16,
    marginRight: spacing.md,
  },
  rating: {
    color: colors.sparkGold,
    fontSize: 16,
    fontWeight: '600',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.midnight,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  priceLabel: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  currentPrice: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '800',
  },
  timeBox: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 4,
  },
  timeValue: {
    color: colors.sparkOrange,
    fontSize: 20,
    fontWeight: '700',
  },
  bidHistory: {
    backgroundColor: colors.midnight,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: spacing.md,
  },
  bidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.twilight,
  },
  bidder: {
    color: colors.softWhite,
  },
  bidAmount: {
    color: colors.white,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: spacing.xl,
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  bottomBar: {
    backgroundColor: colors.midnight,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.twilight,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bidInputContainer: {
    gap: spacing.md,
  },
  bidInput: {
    backgroundColor: colors.twilight,
    color: colors.white,
    fontSize: 20,
    padding: spacing.md,
    borderRadius: 12,
    textAlign: 'center',
  },
  bidButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.muted,
    fontSize: 16,
  },
});
