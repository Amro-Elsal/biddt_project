import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { colors, spacing } from '../theme';
import { db, generateQRCode, Transaction } from '../data/database';

// Simple QR Code component (without external library for now)
const SimpleQRCode = ({ value, size = 200 }: { value: string; size?: number }) => {
  const blocks = 25;
  const blockSize = size / blocks;
  
  // Generate pseudo-random pattern based on value
  const pattern = React.useMemo(() => {
    const chars = value.split('');
    const grid = [];
    for (let i = 0; i < blocks; i++) {
      const row = [];
      for (let j = 0; j < blocks; j++) {
        const charIndex = (i * blocks + j) % chars.length;
        const charCode = chars[charIndex].charCodeAt(0);
        row.push((charCode + i + j) % 2 === 0);
      }
      grid.push(row);
    }
    return grid;
  }, [value]);

  return (
    <View style={[styles.qrContainer, { width: size, height: size }]}>
      {pattern.map((row, i) =>
        row.map((filled, j) => (
          <View
            key={`${i}-${j}`}
            style={[
              styles.qrBlock,
              {
                width: blockSize,
                height: blockSize,
                left: j * blockSize,
                top: i * blockSize,
                backgroundColor: filled ? colors.deepNavy : 'transparent',
              },
            ]}
          />
        ))
      )}
      <!-- Corner markers -->
      <View style={[styles.qrCorner, { top: 0, left: 0 }]} />
      <View style={[styles.qrCorner, { top: 0, right: 0 }]} />
      <View style={[styles.qrCorner, { bottom: 0, left: 0 }]} />
    </View>
  );
};

export const QRCodeScreen = ({ route, navigation }: any) => {
  const { transaction }: { transaction: Transaction } = route.params;
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Generate QR code
    const qr = generateQRCode();
    setQrValue(qr);
    
    // Update transaction with QR
    const updatedTransaction = {
      ...transaction,
      qrCode: qr,
      qrExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      status: 'qr_generated' as const,
    };
    db.updateTransaction(updatedTransaction);

    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulateScan = () => {
    // For demo: simulate the other party scanning
    navigation.navigate('DealConfirm', { transaction: { ...transaction, qrCode: qrValue } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safe Exchange</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoTitle}>Show this QR code to the seller</Text>
          <Text style={styles.infoText}>
            Meet at the safe location and have the seller scan this code to verify the exchange
          </Text>
        </View>

        <View style={styles.qrWrapper}>
          <Animated.View
            style={[
              styles.qrCard,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.qrBackground}>
              {qrValue ? (
                <SimpleQRCode value={qrValue} size={220} />
              ) : (
                <Text style={styles.loadingText}>Generating...</Text>
              )}
            </View>
            
            <Text style={styles.qrCode}>{qrValue}</Text>
          </Animated.View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Expires in</Text>
            <Text style={[styles.timerValue, timeLeft < 60 && styles.timerWarning]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.locationIcon}>📍</Text>
          <View>
            <Text style={styles.locationTitle}>Meetup Location</Text>
            <Text style={styles.locationText}>{transaction.meetupLocation}</Text>
          </View>
        </View>

        {/* Demo button */}
        <TouchableOpacity style={styles.demoButton} onPress={handleSimulateScan}>
          <Text style={styles.demoButtonText}>Demo: Simulate QR Scan</Text>
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
  infoCard: {
    backgroundColor: colors.midnight,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  infoTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  qrWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.diamondCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  qrBackground: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 16,
  },
  qrContainer: {
    position: 'relative',
    backgroundColor: colors.white,
  },
  qrBlock: {
    position: 'absolute',
  },
  qrCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.deepNavy,
    borderWidth: 6,
  },
  qrCode: {
    color: colors.deepNavy,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.md,
    letterSpacing: 2,
  },
  loadingText: {
    color: colors.deepNavy,
    fontSize: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  timerLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  timerValue: {
    color: colors.diamondCyan,
    fontSize: 32,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  timerWarning: {
    color: colors.sparkOrange,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: colors.midnight,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  locationTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  locationText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 2,
  },
  demoButton: {
    backgroundColor: colors.twilight,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  demoButtonText: {
    color: colors.diamondCyan,
    fontSize: 14,
    fontWeight: '600',
  },
});
