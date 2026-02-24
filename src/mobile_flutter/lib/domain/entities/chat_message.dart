import 'package:equatable/equatable.dart';

/// Chat message entity
class ChatMessage extends Equatable {
  final String id;
  final String chatId;
  final String senderId;
  final String text;
  final List<String>? imageUrls;
  final DateTime sentAt;
  final bool isRead;

  const ChatMessage({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.text,
    this.imageUrls,
    required this.sentAt,
    this.isRead = false,
  });

  ChatMessage copyWith({
    String? id,
    String? chatId,
    String? senderId,
    String? text,
    List<String>? imageUrls,
    DateTime? sentAt,
    bool? isRead,
  }) {
    return ChatMessage(
      id: id ?? this.id,
      chatId: chatId ?? this.chatId,
      senderId: senderId ?? this.senderId,
      text: text ?? this.text,
      imageUrls: imageUrls ?? this.imageUrls,
      sentAt: sentAt ?? this.sentAt,
      isRead: isRead ?? this.isRead,
    );
  }

  @override
  List<Object?> get props => [
        id,
        chatId,
        senderId,
        text,
        imageUrls,
        sentAt,
        isRead,
      ];
}
