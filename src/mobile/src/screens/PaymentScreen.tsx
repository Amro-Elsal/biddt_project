import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { colors, spacing } from '../theme';
import { db, formatPrice, Transaction, Listing, User } from '../data/database';

export const PaymentScreen = ({ route, navigation }: any) => {
  const { listing, bidAmount }: { listing: Listing; bidAmount: number } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [walletBalance, setWalletBalance] = React.useState(0);

  React.useEffect(() => {
    loadWalletBalance();
  }, []);

  const loadWalletBalance = async () => {
    const balance = await db.getWalletBalance();
    setWalletBalance(balance);
  };

  const handlePayment = async () => {
    if (walletBalance < bidAmount) {
      Alert.alert('Insufficient Funds', 'Please add funds to your wallet');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(async () => {
      const currentUser = await db.getCurrentUser();
      if (!currentUser) return;

      // Deduct from wallet
      await db.updateWalletBalance(walletBalance - bidAmount);

      // Create transaction
      const transaction: Transaction = {
        id: Math.random().toString(36).substring(2, 15),
        listing: listing,
        buyer: currentUser,
        seller: listing.seller,
        amount: bidAmount,
        status: 'paid',
        qrCode: '',
        qrExpiresAt: '',
        meetupLocation: 'Halifax Police Station - 1975 Gottingen St',
        createdAt: new Date().toISOString(),
      };

      await db.createTransaction(transaction);
      setLoading(false);

      // Navigate to QR code screen
      navigation.replace('QRCode', { transaction });
    }, 2000);
  };

  const paymentMethods = [
    { id: 'wallet', name: 'Biddt Wallet', icon: '💰', balance: walletBalance },
    { id: 'card', name: 'Credit Card', icon: '💳', balance: null },
    { id: 'apple', name: 'Apple Pay', icon: '🍎', balance: null },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Item</Text>
            <Text style={styles.itemValue} numberOfLines={1}>{listing.title}</Text>
          </View>
          
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Your Bid</Text>
            <Text style={styles.itemValue}>{formatPrice(bidAmount)}</Text>
          </View>
          
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Service Fee</Text>
            <Text style={styles.itemValue}>{formatPrice(Math.round(bidAmount * 0.05))}</Text>
          </View>
          
          <View style={[styles.itemRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(Math.round(bidAmount * 1.05))}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardSelected,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Text style={styles.methodIcon}>{method.icon}</Text>
            
003cView style={styles.methodInfo}>
              <Text style={styles.methodName}>{method.name}</Text>
              {method.balance !== null && (
                <Text style={styles.methodBalance}>
                  Balance: {formatPrice(method.balance)}
                </Text>
              )}
            </View>
            <View style={styles.radioButton}>
              {selectedMethod === method.id && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Safe Exchange Info */}
        <View style={styles.safeExchangeCard}>
          <Text style={styles.safeIcon}>🔒</Text>
          <View>
            <Text style={styles.safeTitle}>Safe Exchange Protected</Text>
            <Text style={styles.safeText}>
              Your payment is held securely until you verify the item with QR code
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : `Pay ${formatPrice(Math.round(bidAmount * 1.05))}`}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  backButton: {
    color: colors.white,
    fontSize: 24,
    width: 40,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.midnight,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  itemLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  itemValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 200,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.twilight,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  totalLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    color: colors.sparkGold,
    fontSize: 24,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.midnight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: colors.diamondCyan,
  },
  methodIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  methodBalance: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.diamondCyan,
  },
  safeExchangeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 83, 0.3)',
  },
  safeIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  safeTitle: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
  safeText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.twilight,
  },
  payButton: {
    backgroundColor: colors.sparkGold,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: colors.deepNavy,
    fontSize: 18,
    fontWeight: '800',
  },
});
