// src/screens/QRCodeScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface QRCodeScreenProps {
  navigation: any;
  route?: { params?: { type?: string; data?: any } };
  theme: Theme;
}

export const QRCodeScreen: React.FC<QRCodeScreenProps> = ({ 
  navigation, 
  route,
  theme 
}) => {
  const { colors } = theme;
  const type = route?.params?.type || 'exchange';
  
  // Generate a unique QR code value
  const qrValue = JSON.stringify({
    type,
    id: `BIDDT_${Date.now()}`,
    timestamp: new Date().toISOString(),
    data: route?.params?.data || {},
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Scan this QR code to complete the ${type} on Biddt!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    // In a real app, this would save the QR code to the device
    alert('QR Code saved to gallery!');
  };

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
          Safe Exchange
        </Text>
        
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Status Card */}
        <Card theme={theme} style={styles.statusCard}>
          <View style={[styles.statusIcon, { backgroundColor: colors.success + '20' }]} >
            <Ionicons name="shield-checkmark" size={32} color={colors.success} />
          </View>
          
          <Text style={[styles.statusTitle, { color: colors.textPrimary }]} >
            Exchange Ready
          </Text>
          
          <Text style={[styles.statusDesc, { color: colors.textSecondary }]} >
            Show this QR code to the {type === 'exchange' ? 'seller' : 'buyer'} to complete the transaction securely.
          </Text>
        </Card>

        {/* QR Code Card */}
        <Card theme={theme} style={styles.qrCard}>
          <View style={styles.qrContainer}>
            <View style={[styles.qrWrapper, { backgroundColor: '#fff', padding: spacing.lg }]} >
              <QRCode
                value={qrValue}
                size={200}
                color="#1a1a1a"
                backgroundColor="#fff"
              />
            </View>
            
            <Text style={[styles.qrLabel, { color: colors.textMuted }]} >
              Scan to verify
            </Text>
          </View>

          {/* Exchange Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textMuted }]} >Exchange ID</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]} >
                #EX-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textMuted }]} >Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]} >
                <Text style={[styles.statusBadgeText, { color: colors.success }]} >Pending</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textMuted }]} >Expires</Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]} >24 hours</Text>
            </View>
          </View>
        </Card>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={[styles.instructionsTitle, { color: colors.textPrimary }]} >
            How it works:
          </Text>
          
          {[
            'Show this QR code to the other party',
            'They scan it with their Biddt app',
            'Both parties confirm the exchange',
            'Payment is released automatically',
          ].map((step, index) => (
            <View key={index} style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]} >
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textSecondary }]} >
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Download QR Code"
            variant="secondary"
            onPress={handleDownload}
            theme={theme}
            style={{ marginBottom: spacing.md }}
          />
          
          <Button
            title="Mark as Complete"
            onPress={() => navigation.navigate('Home')}
            theme={theme}
          />
        </View>
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
  statusCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusTitle: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
  },
  statusDesc: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
  qrCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrWrapper: {
    borderRadius: borderRadius.lg,
  },
  qrLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.md,
  },
  detailsContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
  },
  detailValue: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusBadgeText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
  },
  instructionsContainer: {
    marginBottom: spacing.lg,
  },
  instructionsTitle: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    color: '#1a1a1a',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
  },
  stepText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    flex: 1,
  },
  actions: {
    marginTop: 'auto',
    marginBottom: spacing.xxl,
  },
});
