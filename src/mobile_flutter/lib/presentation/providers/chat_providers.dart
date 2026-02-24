import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../domain/entities/chat_message.dart';
import '../../../domain/repositories/chat_repository.dart';
import 'repository_providers.dart';

/// Chat messages provider
final chatMessagesProvider = FutureProvider.family<
    List<ChatMessage>,
    String
>(
  (ref, chatId) async {
    final repository = ref.watch(chatRepositoryProvider);
    final result = await repository.getMessages(chatId);
    return result.getOrElse([]);
  },
);

/// Chat messages stream provider (real-time)
final chatMessagesStreamProvider = StreamProvider.family<
    List<ChatMessage>,
    String
>(
  (ref, chatId) {
    final repository = ref.watch(chatRepositoryProvider);
    return repository.watchMessages(chatId);
  },
);

/// User chats provider
final userChatsProvider = FutureProvider.family<
    List<Map<String, dynamic>>,
    String
>(
  (ref, userId) async {
    final repository = ref.watch(chatRepositoryProvider);
    final result = await repository.getUserChats(userId);
    return result.getOrElse([]);
  },
);

/// Unread count stream provider
final unreadCountStreamProvider = StreamProvider.family<int, String>(
  (ref, userId) {
    final repository = ref.watch(chatRepositoryProvider);
    return repository.watchUnreadCount(userId);
  },
);
