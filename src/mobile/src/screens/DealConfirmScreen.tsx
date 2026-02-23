import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
} from 'react-native';
import { colors, spacing } from '../theme';
import { db, Transaction, formatPrice } from '../data/database';

export const DealConfirmScreen = ({ route, navigation }: any) => {
  const { transaction }: { transaction: Transaction } = route.params;
  const [confirmed, setConfirmed] = useState(false);
  const [buyerRating, setBuyerRating] = useState(0);
  const [sellerRating, setSellerRating] = useState(0);
  const [buyerReview, setBuyerReview] = useState('');
  const [sellerReview, setSellerReview] = useState('');
  const [step, setStep] = useState<'confirm' | 'rate'>('confirm');
  
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (confirmed) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [confirmed]);

  const handleConfirm = async () => {
    const updatedTransaction = {
      ...transaction,
      status: 'scanned' as const,
    };
    await db.updateTransaction(updatedTransaction);
    setConfirmed(true);
    
    setTimeout(() => {
      setStep('rate');
    }, 2000);
  };

  const handleComplete = async () => {
    const updatedTransaction = {
      ...transaction,
      status: 'completed' as const,
      buyerRating,
      sellerRating,
      buyerReview,
      sellerReview,
      completedAt: new Date().toISOString(),
    };
    await db.updateTransaction(updatedTransaction);
    
    // Update seller wallet
    const sellerBalance = await db.getWalletBalance();
    await db.updateWalletBalance(sellerBalance + transaction.amount);
    
    navigation.replace('Home');
  };

  const StarRating = ({ 
    rating, 
    onRate 
  }: { 
    rating: number; 
    onRate: (r: number) => void 
  }) => (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onRate(star)}>
          <Text style={[styles.star, star <= rating && styles.starFilled]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {!confirmed ? (
            <>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📦</Text>
              </View>
              
              <Text style={styles.title}>Confirm Exchange</Text>
              
              <Text style={styles.description}>
                Have you received the item and verified it's as described?
              </Text>

              <View style={styles.itemCard}>
                <Text style={styles.itemName}>{transaction.listing.title}</Text>
                <Text style={styles.itemPrice}>{formatPrice(transaction.amount)}</Text>
              </View>

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.button, styles.disputeButton]}
                  onPress={() => {}}
                >
                  <Text style={styles.disputeText}>⚠️ Report Issue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmText}>✓ Confirm Received</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Animated.View
              style={[
                styles.successContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <View style={styles.successIcon}>
                <Text style={styles.successEmoji}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Exchange Confirmed!</Text>
              <Text style={styles.successText}>Redirecting to rating...</Text>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⭐</Text>
        
        <Text style={styles.title}>Rate Your Experience</Text>
        
        <Text style={styles.description}>
          How was your transaction with {transaction.seller.name}?
        </Text>

        <View style={styles.ratingCard}>
          <Text style={styles.ratingLabel}>Rate the Seller</Text>
          <StarRating rating={sellerRating} onRate={setSellerRating} />
          
          <TextInput
            style={styles.reviewInput}
            placeholder="Write a review (optional)"
            placeholderTextColor={colors.muted}
            value={sellerReview}
            onChangeText={setSellerReview}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.completeButton, sellerRating === 0 && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={sellerRating === 0}
        >
          <Text style={styles.completeText}>Complete & Release Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepNavy,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.twilight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  itemCard: {
    backgroundColor: colors.midnight,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
  },
  itemName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  itemPrice: {
    color: colors.sparkGold,
    fontSize: 24,
    fontWeight: '800',
  },
  buttons: {
    width: '100%',
    gap: spacing.md,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  confirmText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  disputeButton: {
    backgroundColor: colors.twilight,
  },
  disputeText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successEmoji: {
    fontSize: 60,
    color: colors.white,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.success,
    marginBottom: spacing.sm,
  },
  successText: {
    color: colors.muted,
    fontSize: 16,
  },
  ratingCard: {
    backgroundColor: colors.midnight,
    borderRadius: 20,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
  },
  ratingLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  star: {
    fontSize: 40,
    color: colors.twilight,
    marginHorizontal: spacing.xs,
  },
  starFilled: {
    color: colors.sparkGold,
  },
  reviewInput: {
    backgroundColor: colors.twilight,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.white,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  completeButton: {
    backgroundColor: colors.diamondCyan,
    paddingVertical: 18,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  completeText: {
    color: colors.deepNavy,
    fontSize: 18,
    fontWeight: '800',
  },
});
