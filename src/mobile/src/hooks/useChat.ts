import { useState, useEffect } from 'react';
import {
  getUserChats,
  getMessages,
  sendMessage as sendMessageService,
  subscribeToMessages,
} from '../services/localStorage';

export const useChat = (userId: string) => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadChats();
    }
  }, [userId]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await getUserChats(userId);
      setChats(data);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { chats, loading, refresh: loadChats };
};

export const useMessages = (chatId: string, userId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      loadMessages();
      const unsubscribe = subscribeToMessages(chatId, (updatedMessages) => {
        setMessages(updatedMessages);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [chatId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    await sendMessageService(chatId, {
      text,
      senderId: userId,
    });
    await loadMessages();
  };

  return { messages, loading, sendMessage, refresh: loadMessages };
};
