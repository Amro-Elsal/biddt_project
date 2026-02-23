import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { colors, spacing } from '../theme';
import { db, generateId } from '../data/database';

export const PhoneAuthScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSendOTP = () => {
    if (phone.length < 10) {
      shake();
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    
    // Generate fake OTP
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(fakeOtp);
    
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      Alert.alert(
        'OTP Sent!',
        `Your verification code is: ${fakeOtp}\n\n(In production, this would be sent via SMS)`,
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      shake();
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      if (otp === generatedOtp) {
        // Create new user
        const newUser = {
          id: generateId(),
          phone: phone,
          name: '',
          rating: 0,
          transactions: 0,
          verified: false,
          createdAt: new Date().toISOString(),
        };
        
        await db.setCurrentUser(newUser);
        setLoading(false);
        navigation.replace('ProfileSetup');
      } else {
        setLoading(false);
        shake();
        Alert.alert('Invalid OTP', 'The code you entered is incorrect');
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📱</Text>
        
        <Text style={styles.title}>
          {step === 'phone' ? 'Enter Your Phone' : 'Verify OTP'}
        </Text>
        
        <Text style={styles.description}>
          {step === 'phone' 
            ? 'We\'ll send you a verification code to get started'
            : `Enter the 6-digit code sent to ${phone}`}
        </Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          {step === 'phone' ? (
            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+1</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
                autoFocus
              />
            </View>
          ) : (
            <View style={styles.otpContainer}>
              <TextInput
                style={styles.otpInput}
                placeholder="000000"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                autoFocus
              />
            </View>
          )}
        </Animated.View>

        {step === 'otp' && (
          <TouchableOpacity 
            style={styles.resendButton}
            onPress={() => {
              setOtp('');
              setStep('phone');
            }}
          >
            <Text style={styles.resendText}>Wrong number? Change it</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={step === 'phone' ? handleSendOTP : handleVerifyOTP}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading 
              ? 'Please wait...' 
              : step === 'phone' 
                ? 'Send OTP' 
                : 'Verify'}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
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
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.twilight,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  countryCode: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: spacing.sm,
    paddingRight: spacing.sm,
    borderRightWidth: 1,
    borderRightColor: colors.muted,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 18,
    paddingVertical: 18,
  },
  otpContainer: {
    alignItems: 'center',
  },
  otpInput: {
    backgroundColor: colors.twilight,
    borderRadius: 16,
    paddingHorizontal: spacing.xl,
    paddingVertical: 18,
    color: colors.white,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: 200,
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  resendText: {
    color: colors.diamondCyan,
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.diamondCyan,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.deepNavy,
    fontSize: 18,
    fontWeight: '800',
  },
});
