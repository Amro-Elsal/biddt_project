// src/screens/CreateListingScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Theme, typography, spacing, borderRadius } from '../theme';
import { Category } from '../types';

interface CreateListingScreenProps {
  navigation: any;
  theme: Theme;
}

const categories: { key: Category; label: string; icon: string }[] = [
  { key: 'sneakers', label: 'Sneakers', icon: 'footsteps-outline' },
  { key: 'tech', label: 'Tech', icon: 'phone-portrait-outline' },
  { key: 'vintage', label: 'Vintage', icon: 'time-outline' },
  { key: 'streetwear', label: 'Streetwear', icon: 'shirt-outline' },
  { key: 'collectibles', label: 'Collectibles', icon: 'trophy-outline' },
  { key: 'watches', label: 'Watches', icon: 'watch-outline' },
  { key: 'art', label: 'Art', icon: 'color-palette-outline' },
];

const conditions = [
  { key: 'new', label: 'New', description: 'Never worn/used, original packaging' },
  { key: 'like_new', label: 'Like New', description: 'Used once or twice, no flaws' },
  { key: 'good', label: 'Good', description: 'Gently used, minor signs of wear' },
  { key: 'fair', label: 'Fair', description: 'Used, visible wear but functional' },
];

export const CreateListingScreen: React.FC<CreateListingScreenProps> = ({ 
  navigation, 
  theme 
}) => {
  const { colors } = theme;
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [startingPrice, setStartingPrice] = useState('');
  const [buyNowPrice, setBuyNowPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const pickImage = async () => {
    if (images.length >= 8) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 8 - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 8) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    navigation.navigate('Home');
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return images.length > 0;
      case 2: return title.length >= 3 && description.length >= 10 && selectedCategory;
      case 3: return selectedCondition && startingPrice && parseFloat(startingPrice) > 0;
      case 4: return true;
      default: return false;
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={[styles.stepTitle, { color: colors.textPrimary }]} >
        Add Photos
      </Text>
      
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]} >
        Add up to 8 photos. First photo will be the cover image.
      </Text>

      <View style={styles.imageGrid}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            
            {index === 0 && (
              <View style={[styles.coverBadge, { backgroundColor: colors.primary }]} >
                <Text style={styles.coverText}>Cover</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: colors.error }]}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
        
        {images.length < 8 && (
          <>
            <TouchableOpacity
              style={[styles.addButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={pickImage}
            >
              <Ionicons name="images-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.addButtonText, { color: colors.textMuted }]} >Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.addButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.addButtonText, { color: colors.textMuted }]} >Camera</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={[styles.stepTitle, { color: colors.textPrimary }]} >
        Item Details
      </Text>

      <Input
        label="Title"
        placeholder="What are you selling?"
        value={title}
        onChangeText={setTitle}
        theme={theme}
      />

      <Input
        label="Description"
        placeholder="Describe your item..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: 'top' }}
        theme={theme}
      />

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]} >Category</Text>
      
      <View style={styles.categoriesGrid}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === cat.key ? colors.primary : colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Ionicons 
              name={cat.icon as any} 
              size={20} 
              color={selectedCategory === cat.key ? colors.textPrimary : colors.textSecondary} 
            />
            <Text
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === cat.key ? colors.textPrimary : colors.textSecondary,
                },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={[styles.stepTitle, { color: colors.textPrimary }]} >
        Condition & Pricing
      </Text>

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]} >Condition</Text>
      
      <View style={styles.conditionsList}>
        {conditions.map(cond => (
          <TouchableOpacity
            key={cond.key}
            style={[
              styles.conditionButton,
              {
                backgroundColor: selectedCondition === cond.key ? colors.primary : colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => setSelectedCondition(cond.key)}
          >
            <Text
              style={[
                styles.conditionLabel,
                {
                  color: selectedCondition === cond.key ? colors.textPrimary : colors.textPrimary,
                },
              ]}
            >
              {cond.label}
            </Text>
            
            <Text
              style={[
                styles.conditionDesc,
                {
                  color: selectedCondition === cond.key ? colors.textSecondary : colors.textMuted,
                },
              ]}
            >
              {cond.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Starting Price ($)"
        placeholder="0.00"
        value={startingPrice}
        onChangeText={setStartingPrice}
        keyboardType="decimal-pad"
        theme={theme}
      />

      <Input
        label="Buy Now Price ($) - Optional"
        placeholder="0.00"
        value={buyNowPrice}
        onChangeText={setBuyNowPrice}
        keyboardType="decimal-pad"
        theme={theme}
      />
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={[styles.stepTitle, { color: colors.textPrimary }]} >
        Review & Publish
      </Text>

      <Card theme={theme} style={styles.previewCard}>
        {images.length > 0 && (
          <Image source={{ uri: images[0] }} style={styles.previewImage} />
        )}
        
        <View style={styles.previewContent}>
          <Text style={[styles.previewTitle, { color: colors.textPrimary }]} >
            {title || 'No title'}
          </Text>
          
          <Text style={[styles.previewCategory, { color: colors.textMuted }]} >
            {selectedCategory ? categories.find(c => c.key === selectedCategory)?.label : 'No category'}
            {' • '}
            {selectedCondition ? conditions.find(c => c.key === selectedCondition)?.label : 'No condition'}
          </Text>
          
          <Text style={[styles.previewPrice, { color: colors.textPrimary }]} >
            Starting at ${startingPrice || '0'}
          </Text>
        </View>
      </Card>

      <Text style={[styles.termsText, { color: colors.textMuted }]} >
        By publishing, you agree to our Terms of Service and confirm this item is authentic and accurately described.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4].map(s => (
            <View
              key={s}
              style={[
                styles.stepDot,
                {
                  backgroundColor: s === step ? colors.primary : s < step ? colors.success : colors.border,
                },
              ]}
            />
          ))}
        </View>
        
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button
          title={step === 4 ? 'Publish Listing' : 'Continue'}
          onPress={handleNext}
          disabled={!isStepValid()}
          loading={loading}
          size="lg"
          theme={theme}
          style={{ flex: 1 }}
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
  stepIndicator: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
  },
  stepTitle: {
    fontSize: typography.sizes.h2,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.lg,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  coverText: {
    fontSize: typography.sizes.overline,
    fontFamily: typography.fontFamily.bold,
    color: '#1a1a1a',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  categoryText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.medium,
  },
  conditionsList: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  conditionButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  conditionLabel: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: 2,
  },
  conditionDesc: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  previewCard: {
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  previewContent: {
    padding: spacing.md,
  },
  previewTitle: {
    fontSize: typography.sizes.h4,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
  },
  previewCategory: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.sm,
  },
  previewPrice: {
    fontSize: typography.sizes.h3,
    fontFamily: typography.fontFamily.bold,
  },
  termsText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
});
