import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Mock providers for demo
final chatMessagesProvider = FutureProvider.family((ref, chatId) => Future.value([]));
final chatMessagesStreamProvider = StreamProvider.family((ref, chatId) => const Stream.empty());
final userChatsProvider = FutureProvider.family((ref, userId) => Future.value([]));
final unreadCountStreamProvider = StreamProvider.family((ref, userId) => const Stream.empty());
