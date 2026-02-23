// src/components/Avatar.tsx
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Theme, typography, borderRadius } from '../theme';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  theme: Theme;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  verified = false,
  theme,
}) => {
  const { colors } = theme;

  const getSize = () => {
    switch (size) {
      case 'xs': return 24;
      case 'sm': return 32;
      case 'md': return 48;
      case 'lg': return 64;
      case 'xl': return 96;
      default: return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'xs': return 10;
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 20;
      case 'xl': return 32;
      default: return 16;
    }
  };

  const getVerifiedSize = () => {
    switch (size) {
      case 'xs': return 8;
      case 'sm': return 10;
      case 'md': return 14;
      case 'lg': return 18;
      case 'xl': return 24;
      default: return 14;
    }
  };

  const s = getSize();
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <View style={[styles.container, { width: s, height: s }]} >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: s, height: s, borderRadius: s / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: s,
              height: s,
              borderRadius: s / 2,
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                fontSize: getFontSize(),
                color: colors.textPrimary,
                fontFamily: typography.fontFamily.bold,
              },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}
      
      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: getVerifiedSize(),
              height: getVerifiedSize(),
              borderRadius: getVerifiedSize() / 2,
              backgroundColor: colors.success,
              borderColor: colors.surface,
              borderWidth: 2,
            },
          ]}
        >
          <Text style={[styles.verifiedIcon, { fontSize: getVerifiedSize() * 0.6 }]} >✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    textAlign: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
