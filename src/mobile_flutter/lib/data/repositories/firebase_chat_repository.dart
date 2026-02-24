import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/errors/failures.dart';
import '../../../core/utils/result.dart';
import '../../../domain/entities/chat_message.dart';
import '../../../domain/repositories/chat_repository.dart';

/// Firebase implementation of ChatRepository
class FirebaseChatRepository implements ChatRepository {
  final FirebaseFirestore _firestore;

  FirebaseChatRepository({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Future<Result<String>> getOrCreateChat({
    required String listingId,
    required String buyerId,
    required String sellerId,
  }) async {
    try {
      // Check if chat already exists
      final existingChats = await _firestore
          .collection('chats')
          .where('listingId', isEqualTo: listingId)
          .where('participants', arrayContains: buyerId)
          .get();

      for (final doc in existingChats.docs) {
        final participants = List<String>.from(doc.data()['participants'] ?? []);
        if (participants.contains(sellerId)) {
          return Success(doc.id);
        }
      }

      // Create new chat
      final chatRef = _firestore.collection('chats').doc();
      await chatRef.set({
        'listingId': listingId,
        'participants': [buyerId, sellerId],
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
        'lastMessage': null,
      });

      return Success(chatRef.id);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to create chat: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<ChatMessage>> sendMessage({
    required String chatId,
    required String senderId,
    required String text,
    List<String>? imageUrls,
  }) async {
    try {
      final messageRef = _firestore
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .doc();

      final message = ChatMessage(
        id: messageRef.id,
        chatId: chatId,
        senderId: senderId,
        text: text,
        imageUrls: imageUrls,
        sentAt: DateTime.now(),
        isRead: false,
      );

      await _firestore.runTransaction((tx) async {
        // Add message
        tx.set(messageRef, {
          'senderId': message.senderId,
          'text': message.text,
          'imageUrls': message.imageUrls,
          'sentAt': Timestamp.fromDate(message.sentAt),
          'isRead': message.isRead,
        });

        // Update chat last message
        tx.update(
          _firestore.collection('chats').doc(chatId),
          {
            'lastMessage': {
              'text': text,
              'senderId': senderId,
              'sentAt': Timestamp.fromDate(message.sentAt),
            },
            'updatedAt': FieldValue.serverTimestamp(),
          },
        );
      });

      return Success(message);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to send message: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<List<ChatMessage>>> getMessages(
    String chatId, {
    int limit = 50,
    String? lastMessageId,
  }) async {
    try {
      Query<Map<String, dynamic>> query = _firestore
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .orderBy('sentAt', descending: true)
          .limit(limit);

      if (lastMessageId != null) {
        final lastDoc = await _firestore
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .doc(lastMessageId)
            .get();
        query = query.startAfterDocument(lastDoc);
      }

      final snapshot = await query.get();

      final messages = snapshot.docs
          .map((doc) => _mapDocumentToMessage(doc, chatId))
          .toList();

      return Success(messages);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get messages: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<void>> markAsRead(String chatId, String userId) async {
    try {
      final unreadMessages = await _firestore
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .where('senderId', isNotEqualTo: userId)
          .where('isRead', isEqualTo: false)
          .get();

      final batch = _firestore.batch();
      for (final doc in unreadMessages.docs) {
        batch.update(doc.reference, {'isRead': true});
      }
      await batch.commit();

      return const Success(null);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to mark as read: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<List<Map<String, dynamic>>>> getUserChats(String userId) async {
    try {
      final snapshot = await _firestore
          .collection('chats')
          .where('participants', arrayContains: userId)
          .orderBy('updatedAt', descending: true)
          .get();

      final chats = await Future.wait(
        snapshot.docs.map((doc) async {
          final data = doc.data();
          final participants = List<String>.from(data['participants'] ?? []);
          final otherUserId = participants.firstWhere(
            (id) => id != userId,
            orElse: () => '',
          );

          // Get other user info
          final userDoc = await _firestore
              .collection('users')
              .doc(otherUserId)
              .get();

          return {
            'chatId': doc.id,
            'listingId': data['listingId'],
            'otherUser': userDoc.data(),
            'lastMessage': data['lastMessage'],
            'updatedAt': data['updatedAt'],
          };
        }),
      );

      return Success(chats);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get user chats: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Stream<List<ChatMessage>> watchMessages(String chatId) {
    return _firestore
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('sentAt', descending: true)
        .limit(50)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => _mapDocumentToMessage(doc, chatId))
            .toList());
  }

  @override
  Stream<int> watchUnreadCount(String userId) {
    return _firestore
        .collectionGroup('messages')
        .where('senderId', isNotEqualTo: userId)
        .where('isRead', isEqualTo: false)
        .snapshots()
        .map((snapshot) => snapshot.docs.length);
  }

  ChatMessage _mapDocumentToMessage(
    DocumentSnapshot<Map<String, dynamic>> doc,
    String chatId,
  ) {
    final data = doc.data()!;
    return ChatMessage(
      id: doc.id,
      chatId: chatId,
      senderId: data['senderId'] ?? '',
      text: data['text'] ?? '',
      imageUrls: data['imageUrls'] != null
          ? List<String>.from(data['imageUrls'])
          : null,
      sentAt: (data['sentAt'] as Timestamp).toDate(),
      isRead: data['isRead'] ?? false,
    );
  }
}
