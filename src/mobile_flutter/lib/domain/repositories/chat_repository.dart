import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/chat_message.dart';

/// Repository interface for chat-related operations
abstract class ChatRepository {
  /// Get or create a chat between two users for a listing
  Future<Result<String>> getOrCreateChat({
    required String listingId,
    required String buyerId,
    required String sellerId,
  });

  /// Send a message
  Future<Result<ChatMessage>> sendMessage({
    required String chatId,
    required String senderId,
    required String text,
    List<String>? imageUrls,
  });

  /// Get messages for a chat
  Future<Result<List<ChatMessage>>> getMessages(
    String chatId, {
    int limit = 50,
    String? lastMessageId,
  });

  /// Mark messages as read
  Future<Result<void>> markAsRead(String chatId, String userId);

  /// Get user's chats
  Future<Result<List<Map<String, dynamic>>>> getUserChats(String userId);

  /// Stream of messages for real-time updates
  Stream<List<ChatMessage>> watchMessages(String chatId);

  /// Stream of unread count
  Stream<int> watchUnreadCount(String userId);
}
