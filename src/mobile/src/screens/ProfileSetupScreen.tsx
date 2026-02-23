// src/screens/ProfileSetupScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Avatar } from '../components/Avatar';
import { Theme, typography, spacing } from '../theme';

interface ProfileSetupScreenProps {
  navigation: any;
  theme: Theme;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ 
  navigation, 
  theme 
}) => {
  const { colors } = theme;
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access gallery is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleContinue = async () => {
    if (!displayName.trim()) {
      setError('Please enter your display name');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    
    // Navigate to main app
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            Create your profile
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
            This is how other users will see you on Biddt.
          </Text>

          {/* Avatar Upload */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
              <Avatar
                uri={avatar}
                name={displayName || 'User'}
                size="xl"
                theme={theme}
              />
              
              <View
                style={[
                  styles.cameraBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </TouchableOpacity>
            
            <Text
              style={[
                styles.changePhotoText,
                {
                  color: colors.primary,
                  fontFamily: typography.fontFamily.medium,
                },
              ]}
            >
              {avatar ? 'Change photo' : 'Add photo'}
            </Text>
          </View>

          {/* Display Name Input */}
          <Input
            label="Display Name"
            placeholder="Enter your display name"
            value={displayName}
            onChangeText={(text) => {
              setDisplayName(text);
              setError('');
            }}
            error={error}
            theme={theme}
          />

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text
              style={[
                styles.tipsTitle,
                {
                  color: colors.textSecondary,
                  fontFamily: typography.fontFamily.semibold,
                },
              ]}
            >
              Tips for a great profile:
            </Text>
            
            {[
              'Use a clear photo of yourself',
              'Choose a name that represents you',
              'You can always update this later',
            ].map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <Text style={[styles.tipBullet, { color: colors.primary }]} >•</Text>
                <Text
                  style={[
                    styles.tipText,
                    {
                      color: colors.textMuted,
                      fontFamily: typography.fontFamily.regular,
                    },
                  ]}
                >
                  {tip}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Complete Setup"
            onPress={handleContinue}
            loading={loading}
            size="lg"
            theme={theme}
            style={{ marginTop: spacing.xxl }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xxl,
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatarWrapper: {
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIcon: {
    fontSize: 16,
  },
  changePhotoText: {
    fontSize: typography.sizes.body,
    marginTop: spacing.md,
  },
  tipsContainer: {
    marginTop: spacing.lg,
  },
  tipsTitle: {
    fontSize: typography.sizes.caption,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  tipBullet: {
    fontSize: typography.sizes.body,
    marginRight: spacing.sm,
  },
  tipText: {
    fontSize: typography.sizes.caption,
    flex: 1,
  },
});
