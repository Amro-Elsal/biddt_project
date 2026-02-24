import 'package:equatable/equatable.dart';

/// Transaction entity representing a wallet transaction
class Transaction extends Equatable {
  final String id;
  final String userId;
  final TransactionType type;
  final double amount;
  final TransactionStatus status;
  final String? description;
  final String? relatedListingId;
  final DateTime createdAt;
  final Map<String, dynamic>? metadata;

  const Transaction({
    required this.id,
    required this.userId,
    required this.type,
    required this.amount,
    this.status = TransactionStatus.completed,
    this.description,
    this.relatedListingId,
    required this.createdAt,
    this.metadata,
  });

  bool get isCredit => amount > 0;
  bool get isDebit => amount < 0;

  @override
  List<Object?> get props => [
        id,
        userId,
        type,
        amount,
        status,
        description,
        relatedListingId,
        createdAt,
        metadata,
      ];
}

enum TransactionType {
  deposit,
  withdrawal,
  bidPlacement,
  bidRefund,
  saleProceeds,
  fee,
}

enum TransactionStatus {
  pending,
  completed,
  failed,
  cancelled,
}
