// src/screens/PaymentScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface PaymentScreenProps {
  navigation: any;
  route?: { params?: { listing?: any } };
  theme: Theme;
}

const paymentMethods = [
  { id: 'card', name: 'Credit Card', icon: 'card-outline' },
  { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
  { id: 'apple', name: 'Apple Pay', icon: 'logo-apple' },
  { id: 'google', name: 'Google Pay', icon: 'logo-google' },
];

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ 
  navigation, 
  route,
  theme 
}) => {
  const { colors } = theme;
  const listing = route?.params?.listing;
  const [amount, setAmount] = useState(listing ? String(listing.currentPrice + 50) : '100');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    if (listing) {
      navigation.navigate('ProductDetail', { listing });
    } else {
      navigation.goBack();
    }
  };

  const quickAmounts = [50, 100, 250, 500, 1000];

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
        
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} >
          Add Funds
        </Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <Card theme={theme} style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: colors.textMuted }]} >Current Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.textPrimary }]} >$0.00</Text>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <Text style={[styles.balanceLabel, { color: colors.textMuted }]} >Buying Power</Text>
          <Text style={[styles.buyingPowerAmount, { color: colors.primary }]} >$0.00</Text>
        </Card>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]} >Amount</Text>
          
          <View style={[styles.amountInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.dollarSign, { color: colors.textPrimary }]} >$</Text>
            <TextInput
              style={[
                styles.amountText,
                {
                  color: colors.textPrimary,
                  fontFamily: typography.fontFamily.bold,
                },
              ]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Quick Amounts */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map(amt => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.quickAmount,
                  {
                    backgroundColor: parseFloat(amount) === amt ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setAmount(String(amt))}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    {
                      color: parseFloat(amount) === amt ? colors.textPrimary : colors.textSecondary,
                    },
                  ]}
                >
                  ${amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]} >Payment Method</Text>
          
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodItem,
                {
                  backgroundColor: selectedMethod === method.id ? colors.primary + '20' : colors.surface,
                  borderColor: selectedMethod === method.id ? colors.primary : colors.border,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.methodIcon, { backgroundColor: colors.surfaceSecondary }]} >
                  <Ionicons name={method.icon as any} size={24} color={colors.textPrimary} />
                </View>
                
                <Text style={[styles.methodName, { color: colors.textPrimary }]} >
                  {method.name}
                </Text>
              </View>
              
              {selectedMethod === method.id && (
                <View style={[styles.checkmark, { backgroundColor: colors.primary }]} >
                  <Ionicons name="checkmark" size={16} color={colors.textPrimary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark" size={20} color={colors.success} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]} >
              Your payment information is secure and encrypted
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]} >
              Funds are available immediately after deposit
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]} >Total</Text>
          <Text style={[styles.totalAmount, { color: colors.textPrimary }]} >
            ${parseFloat(amount || '0').toFixed(2)}
          </Text>
        </View>
        
        <Button
          title={listing ? 'Deposit & Place Bid' : 'Add Funds'}
          onPress={handleDeposit}
          loading={loading}
          size="lg"
          theme={theme}
        />
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.lg,
  },
  balanceCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: typography.sizes.h1,
    fontFamily: typography.fontFamily.extrabold,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  buyingPowerAmount: {
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
  },
  amountSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    height: 64,
  },
  dollarSign: {
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
    marginRight: spacing.xs,
  },
  amountText: {
    flex: 1,
    fontSize: typography.sizes.h2,
    height: '100%',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  quickAmount: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  quickAmountText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  methodsSection: {
    marginBottom: spacing.lg,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodName: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginTop: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    marginLeft: spacing.sm,
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
  },
  totalAmount: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
});
