import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/chat_message.dart';
import '../repositories/chat_repository.dart';

/// Use case: Get or create chat
class GetOrCreateChatUseCase {
  final ChatRepository _repository;

  const GetOrCreateChatUseCase(this._repository);

  Future<Result<String>> call({
    required String listingId,
    required String buyerId,
    required String sellerId,
  }) async {
    return await _repository.getOrCreateChat(
      listingId: listingId,
      buyerId: buyerId,
      sellerId: sellerId,
    );
  }
}

/// Use case: Send message
class SendMessageUseCase {
  final ChatRepository _repository;

  const SendMessageUseCase(this._repository);

  Future<Result<ChatMessage>> call({
    required String chatId,
    required String senderId,
    required String text,
    List<String>? imageUrls,
  }) async {
    return await _repository.sendMessage(
      chatId: chatId,
      senderId: senderId,
      text: text,
      imageUrls: imageUrls,
    );
  }
}

/// Use case: Get messages
class GetMessagesUseCase {
  final ChatRepository _repository;

  const GetMessagesUseCase(this._repository);

  Future<Result<List<ChatMessage>>> call(
    String chatId, {
    int limit = 50,
    String? lastMessageId,
  }) async {
    return await _repository.getMessages(
      chatId,
      limit: limit,
      lastMessageId: lastMessageId,
    );
  }
}

/// Use case: Get user chats
class GetUserChatsUseCase {
  final ChatRepository _repository;

  const GetUserChatsUseCase(this._repository);

  Future<Result<List<Map<String, dynamic>>>> call(String userId) async {
    return await _repository.getUserChats(userId);
  }
}
