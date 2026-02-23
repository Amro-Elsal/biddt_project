// src/hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  getUserChats, 
  createChat, 
  sendMessage, 
  subscribeToMessages 
} from '../services/firebase';
import { Chat, ChatMessage } from '../types';

export const useChats = (userId: string) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadChats = async () => {
      try {
        const data = await getUserChats(userId);
        setChats(data as Chat[]);
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [userId]);

  const startChat = useCallback(async (participants: string[], listingId?: string) => {
    try {
      const chatId = await createChat(participants, listingId);
      return { success: true, chatId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  return { chats, loading, startChat };
};

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeToMessages(chatId, (data) => {
      setMessages(data as ChatMessage[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const send = useCallback(async (text: string, senderId: string) => {
    try {
      await sendMessage(chatId, {
        text,
        senderId,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [chatId]);

  return { messages, loading, send };
};
