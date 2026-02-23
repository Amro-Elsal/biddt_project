// src/screens/ChatScreen.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, typography, spacing, borderRadius } from '../theme';

interface ChatScreenProps {
  navigation: any;
  route?: { params?: { chatId?: string } };
  theme: Theme;
}

// Mock messages
const mockMessages = [
  {
    id: '1',
    senderId: 'them',
    text: 'Hey! I saw your listing for the Jordan 1s.',
    timestamp: '2:30 PM',
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Hi! Yes, they\'re still available.',
    timestamp: '2:32 PM',
  },
  {
    id: '3',
    senderId: 'them',
    text: 'Great! Are they deadstock?',
    timestamp: '2:33 PM',
  },
  {
    id: '4',
    senderId: 'me',
    text: 'Yes, never worn. Original box and receipt included.',
    timestamp: '2:35 PM',
  },
  {
    id: '5',
    senderId: 'them',
    text: 'Is the price negotiable?',
    timestamp: '2:36 PM',
  },
  {
    id: '6',
    senderId: 'me',
    text: 'I can do $420 if you can complete the purchase today.',
    timestamp: '2:38 PM',
  },
  {
    id: '7',
    senderId: 'them',
    text: 'Deal! Let me add funds to my wallet.',
    timestamp: '2:40 PM',
  },
];

export const ChatScreen: React.FC<ChatScreenProps> = ({ 
  navigation, 
  route,
  theme 
}) => {
  const { colors } = theme;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: typeof mockMessages[0] }) => {
    const isMe = item.senderId === 'me';

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isMe ? colors.primary : colors.surface,
              borderBottomLeftRadius: isMe ? borderRadius.lg : 4,
              borderBottomRightRadius: isMe ? 4 : borderRadius.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              {
                color: isMe ? colors.textPrimary : colors.textPrimary,
              },
            ]}
          >
            {item.text}
          </Text>
        </View>
        
        <Text style={[styles.timestamp, { color: colors.textMuted }]} >
          {item.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Image
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=s1' }}
            style={styles.headerAvatar}
          />
          
          <View>
            <Text style={[styles.headerName, { color: colors.textPrimary }]} >SneakerHead</Text>
            <View style={styles.onlineIndicator}>
              <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.onlineText, { color: colors.textMuted }]} >Online</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Item Preview */}
      <View style={[styles.itemPreview, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200' }}
          style={styles.itemImage}
        />
        
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.textPrimary }]} >
            Nike Air Jordan 1 Retro High OG
          </Text>
          
          <Text style={[styles.itemPrice, { color: colors.textPrimary }]} >$450</Text>
        </View>
        
        <TouchableOpacity style={[styles.viewItemButton, { backgroundColor: colors.primary }]} >
          <Text style={[styles.viewItemText, { color: colors.textPrimary }]} >View</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={28} color={colors.textMuted} />
          </TouchableOpacity>
          
          <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  fontFamily: typography.fontFamily.regular,
                },
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
            />
          </View>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: message.trim() ? colors.primary : colors.border,
              },
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  headerName: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.semibold,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  onlineText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.regular,
  },
  itemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.bold,
  },
  viewItemButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  viewItemText: {
    fontSize: typography.sizes.caption,
    fontFamily: typography.fontFamily.semibold,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
  },
  messageContainer: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  messageText: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: typography.sizes.overline,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  attachButton: {
    marginRight: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    maxHeight: 100,
  },
  input: {
    fontSize: typography.sizes.body,
    paddingVertical: spacing.sm,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});
