import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { colors, spacing } from '../theme';
import { db, User } from '../data/database';

export const ProfileSetupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (name.length < 2) {
      Alert.alert('Invalid Name', 'Please enter your full name');
      return;
    }

    setLoading(true);

    const currentUser = await db.getCurrentUser();
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name,
        email: email || undefined,
      };
      
      await db.setCurrentUser(updatedUser);
      
      // Initialize wallet with fake balance
      await db.updateWalletBalance(50000); // $500 starting balance
      
      setTimeout(() => {
        setLoading(false);
        navigation.replace('Main');
      }, 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>👤</Text>
        
        <Text style={styles.title}>Complete Your Profile</Text>
        
        <Text style={styles.description}>
          Tell us a bit about yourself to get started
        </Text>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : '?'}</Text>
          </View>
          <TouchableOpacity style={styles.changeAvatar}>
            <Text style={styles.changeAvatarText}>Add Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Setting up...' : 'Complete Setup'}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  icon: {
    fontSize: 50,
    textAlign: 'center',
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.diamondPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.white,
  },
  changeAvatar: {
    padding: spacing.sm,
  },
  changeAvatarText: {
    color: colors.diamondCyan,
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    color: colors.softWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.twilight,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    color: colors.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  button: {
    backgroundColor: colors.diamondCyan,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: spacing.lg,
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
