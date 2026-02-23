// src/screens/PhoneAuthScreen.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface PhoneAuthScreenProps {
  navigation: any;
  theme: Theme;
}

export const PhoneAuthScreen: React.FC<PhoneAuthScreenProps> = ({ 
  navigation, 
  theme 
}) => {
  const { colors } = theme;
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const otpRefs = useRef<TextInput[]>([]);

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleSendOtp = async () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    
    // Navigate to profile setup
    navigation.navigate('ProfileSetup');
  };

  const handleResendOtp = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: typography.fontFamily.extrabold,
              },
            ]}
          >
            {step === 'phone' ? 'Enter your phone' : 'Verify your number'}
          </Text>
          
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontFamily: typography.fontFamily.regular,
              },
            ]}
          >
            {step === 'phone'
              ? "We'll send you a verification code to get started."
              : `Enter the 6-digit code sent to ${phoneNumber}`}
          </Text>

          {step === 'phone' ? (
            <View style={styles.phoneContainer}>
              <View
                style={[
                  styles.phoneInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: error ? colors.error : colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text style={[styles.countryCode, { color: colors.textPrimary }]} >+1</Text>
                <TextInput
                  style={[
                    styles.phoneTextInput,
                    {
                      color: colors.textPrimary,
                      fontFamily: typography.fontFamily.regular,
                      fontSize: typography.sizes.h3,
                    },
                  ]}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  placeholder="(555) 000-0000"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  maxLength={14}
                  autoFocus
                />
              </View>
            </View>
          ) : (
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => { if (ref) otpRefs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: error ? colors.error : colors.border,
                      borderWidth: 2,
                      color: colors.textPrimary,
                      fontFamily: typography.fontFamily.bold,
                      fontSize: typography.sizes.h2,
                    },
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>
          )}

          {error ? (
            <Text style={[styles.error, { color: colors.error }]} >{error}</Text>
          ) : null}

          {step === 'otp' && (
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={loading}
              style={styles.resendContainer}
            >
              <Text
                style={[
                  styles.resendText,
                  {
                    color: colors.primary,
                    fontFamily: typography.fontFamily.semibold,
                  },
                ]}
              >
                Resend code
              </Text>
            </TouchableOpacity>
          )}

          <Button
            title={step === 'phone' ? 'Continue' : 'Verify'}
            onPress={step === 'phone' ? handleSendOtp : handleVerifyOtp}
            loading={loading}
            size="lg"
            theme={theme}
            style={{ marginTop: spacing.xxl }}
          />

          {step === 'otp' && (
            <Button
              title="Change number"
              variant="ghost"
              onPress={() => setStep('phone')}
              theme={theme}
              style={{ marginTop: spacing.md }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.h1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.body,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  phoneContainer: {
    marginTop: spacing.lg,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    height: 56,
  },
  countryCode: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.medium,
    marginRight: spacing.sm,
  },
  phoneTextInput: {
    flex: 1,
    height: '100%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    textAlign: 'center',
  },
  error: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  resendContainer: {
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  resendText: {
    fontSize: typography.sizes.body,
  },
});
