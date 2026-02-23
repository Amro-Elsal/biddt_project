// src/screens/OnboardingScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Theme, typography, spacing } from '../theme';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
  theme: Theme;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ 
  navigation, 
  theme 
}) => {
  const { colors } = theme;

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
      title: 'Bid on Exclusive Items',
      description: 'Discover rare sneakers, vintage collectibles, and unique tech from verified sellers worldwide.',
    },
    {
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      title: 'Sell with Confidence',
      description: 'List your items in minutes. Our verified badge system builds trust with buyers.',
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      title: 'Safe Exchange',
      description: 'Complete transactions securely with QR code verification and in-app payments.',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: slide.image }} style={styles.image} />
              <View style={[styles.overlay, { backgroundColor: colors.background }]} />
            </View>
            
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
                {slide.title}
              </Text>
              
              <Text
                style={[
                  styles.description,
                  {
                    color: colors.textSecondary,
                    fontFamily: typography.fontFamily.regular,
                  },
                ]}
              >
                {slide.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('PhoneAuth')}
          size="lg"
          theme={theme}
          style={{ marginBottom: spacing.md }}
        />
        
        <Button
          title="I already have an account"
          variant="ghost"
          onPress={() => navigation.navigate('PhoneAuth')}
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
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.55,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    opacity: 0.9,
  },
  content: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: typography.sizes.h1,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.bodyLarge,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
});
