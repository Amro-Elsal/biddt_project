// src/screens/ChatListScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface ChatListScreenProps {
  navigation: any;
  theme: Theme;
}

// Mock chat data
const mockChats = [
  {
    id: '1',
    name: 'SneakerHead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s1',
    lastMessage: 'Is the price negotiable?',
    timestamp: '2m ago',
    unread: 2,
    item: {
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200',
      title: 'Nike Air Jordan 1',
    },
  },
  {
    id: '2',
    name: 'VintageFinds',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s2',
    lastMessage: 'Thanks for the purchase! Shipping tomorrow.',
    timestamp: '1h ago',
    unread: 0,
    item: {
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200',
      title: 'Leica M6 Camera',
    },
  },
  {
    id: '3',
    name: 'HypeBeast',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s3',
    lastMessage: 'Can you send more photos?',
    timestamp: '3h ago',
    unread: 1,
    item: {
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200',
      title: 'Supreme Hoodie',
    },
  },
  {
    id: '4',
    name: 'TechDeals',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s4',
    lastMessage: 'Deal confirmed!',
    timestamp: '1d ago',
    unread: 0,
    item: {
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200',
      title: 'Apple Watch Ultra',
    },
  },
];

export const ChatListScreen: React.FC<ChatListScreenProps> = ({ 
  navigation, 
  theme 
}) => {
  const { colors } = theme;

  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity
      style={[styles.chatItem, { borderBottomColor: colors.border }]}
      onPress={() => navigation.navigate('Chat', { chatId: item.id })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.name, { color: colors.textPrimary }]} >
            {item.name}
          </Text>
          
          <Text style={[styles.timestamp, { color: colors.textMuted }]} >
            {item.timestamp}
          </Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.message,
              {
                color: item.unread > 0 ? colors.textPrimary : colors.textSecondary,
                fontFamily: item.unread > 0 ? typography.fontFamily.semibold : typography.fontFamily.regular,
              },
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          
          {item.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} >
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.itemPreview}>
          <Image source={{ uri: item.item.image }} style={styles.itemImage} />
          <Text style={[styles.itemTitle, { color: colors.textMuted }]} >
            {item.item.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} >Messages</Text>
        
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="create-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockChats}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    paddingHorizontal: spacing.xxxl,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  timestamp: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: typography.sizes.body,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#1a1a1a',
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.bold,
  },
  itemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  itemImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  itemTitle: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
});
