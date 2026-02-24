import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/errors/failures.dart';
import '../../../core/utils/result.dart';
import '../../../domain/entities/transaction.dart';
import '../../../domain/repositories/wallet_repository.dart';

/// Firebase implementation of WalletRepository
class FirebaseWalletRepository implements WalletRepository {
  final FirebaseFirestore _firestore;

  FirebaseWalletRepository({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Future<Result<double>> getBalance(String userId) async {
    try {
      final doc = await _firestore
          .collection('wallets')
          .doc(userId)
          .get();

      if (!doc.exists) {
        return const Success(0.0);
      }

      final balance = (doc.data()?['balance'] ?? 0.0).toDouble();
      return Success(balance);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get balance: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Transaction>> addFunds({
    required String userId,
    required double amount,
    required String paymentMethodId,
  }) async {
    try {
      final transactionRef = _firestore.collection('transactions').doc();
      final transaction = Transaction(
        id: transactionRef.id,
        userId: userId,
        type: TransactionType.deposit,
        amount: amount,
        status: TransactionStatus.completed,
        description: 'Added funds via Stripe',
        createdAt: DateTime.now(),
        metadata: {'paymentMethodId': paymentMethodId},
      );

      await _firestore.runTransaction((tx) async {
        // Update wallet balance
        final walletRef = _firestore.collection('wallets').doc(userId);
        final walletDoc = await tx.get(walletRef);

        if (walletDoc.exists) {
          tx.update(walletRef, {
            'balance': FieldValue.increment(amount),
            'updatedAt': FieldValue.serverTimestamp(),
          });
        } else {
          tx.set(walletRef, {
            'balance': amount,
            'userId': userId,
            'createdAt': FieldValue.serverTimestamp(),
            'updatedAt': FieldValue.serverTimestamp(),
          });
        }

        // Create transaction record
        tx.set(transactionRef, {
          'userId': transaction.userId,
          'type': transaction.type.name,
          'amount': transaction.amount,
          'status': transaction.status.name,
          'description': transaction.description,
          'createdAt': Timestamp.fromDate(transaction.createdAt),
          'metadata': transaction.metadata,
        });
      });

      return Success(transaction);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to add funds: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Transaction>> withdraw({
    required String userId,
    required double amount,
    required String bankAccountId,
  }) async {
    try {
      // Check balance
      final balanceResult = await getBalance(userId);
      if (balanceResult.isFailure) {
        return FailureResult(balanceResult.failure!);
      }

      final currentBalance = balanceResult.value!;
      if (currentBalance < amount) {
        return FailureResult(
          InsufficientFundsFailure(),
        );
      }

      final transactionRef = _firestore.collection('transactions').doc();
      final transaction = Transaction(
        id: transactionRef.id,
        userId: userId,
        type: TransactionType.withdrawal,
        amount: -amount,
        status: TransactionStatus.pending,
        description: 'Withdrawal to bank account',
        createdAt: DateTime.now(),
        metadata: {'bankAccountId': bankAccountId},
      );

      await _firestore.runTransaction((tx) async {
        // Update wallet balance
        tx.update(
          _firestore.collection('wallets').doc(userId),
          {
            'balance': FieldValue.increment(-amount),
            'updatedAt': FieldValue.serverTimestamp(),
          },
        );

        // Create transaction record
        tx.set(transactionRef, {
          'userId': transaction.userId,
          'type': transaction.type.name,
          'amount': transaction.amount,
          'status': transaction.status.name,
          'description': transaction.description,
          'createdAt': Timestamp.fromDate(transaction.createdAt),
          'metadata': transaction.metadata,
        });
      });

      return Success(transaction);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to withdraw: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Transaction>> holdFunds({
    required String userId,
    required double amount,
    required String listingId,
  }) async {
    try {
      // Check balance
      final balanceResult = await getBalance(userId);
      if (balanceResult.isFailure) {
        return FailureResult(balanceResult.failure!);
      }

      final currentBalance = balanceResult.value!;
      if (currentBalance < amount) {
        return FailureResult(
          InsufficientFundsFailure(),
        );
      }

      final transactionRef = _firestore.collection('transactions').doc();
      final transaction = Transaction(
        id: transactionRef.id,
        userId: userId,
        type: TransactionType.bidPlacement,
        amount: -amount,
        status: TransactionStatus.completed,
        description: 'Bid placement hold',
        relatedListingId: listingId,
        createdAt: DateTime.now(),
      );

      await _firestore.runTransaction((tx) async {
        // Update wallet balance
        tx.update(
          _firestore.collection('wallets').doc(userId),
          {
            'balance': FieldValue.increment(-amount),
            'heldBalance': FieldValue.increment(amount),
            'updatedAt': FieldValue.serverTimestamp(),
          },
        );

        // Create transaction record
        tx.set(transactionRef, {
          'userId': transaction.userId,
          'type': transaction.type.name,
          'amount': transaction.amount,
          'status': transaction.status.name,
          'description': transaction.description,
          'relatedListingId': transaction.relatedListingId,
          'createdAt': Timestamp.fromDate(transaction.createdAt),
        });
      });

      return Success(transaction);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to hold funds: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Transaction>> releaseHold({
    required String userId,
    required String listingId,
  }) async {
    try {
      // Find the hold transaction
      final snapshot = await _firestore
          .collection('transactions')
          .where('userId', isEqualTo: userId)
          .where('relatedListingId', isEqualTo: listingId)
          .where('type', isEqualTo: TransactionType.bidPlacement.name)
          .limit(1)
          .get();

      if (snapshot.docs.isEmpty) {
        return FailureResult(
          UnknownFailure(message: 'No hold found for this listing'),
        );
      }

      final holdDoc = snapshot.docs.first;
      final holdAmount = (holdDoc.data()['amount'] as num).abs();

      final transactionRef = _firestore.collection('transactions').doc();
      final transaction = Transaction(
        id: transactionRef.id,
        userId: userId,
        type: TransactionType.bidRefund,
        amount: holdAmount,
        status: TransactionStatus.completed,
        description: 'Bid refund - outbid',
        relatedListingId: listingId,
        createdAt: DateTime.now(),
      );

      await _firestore.runTransaction((tx) async {
        // Update wallet balance
        tx.update(
          _firestore.collection('wallets').doc(userId),
          {
            'balance': FieldValue.increment(holdAmount),
            'heldBalance': FieldValue.increment(-holdAmount),
            'updatedAt': FieldValue.serverTimestamp(),
          },
        );

        // Create refund transaction
        tx.set(transactionRef, {
          'userId': transaction.userId,
          'type': transaction.type.name,
          'amount': transaction.amount,
          'status': transaction.status.name,
          'description': transaction.description,
          'relatedListingId': transaction.relatedListingId,
          'createdAt': Timestamp.fromDate(transaction.createdAt),
        });
      });

      return Success(transaction);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to release hold: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<List<Transaction>>> getTransactionHistory(
    String userId, {
    int limit = 20,
    String? lastTransactionId,
  }) async {
    try {
      Query<Map<String, dynamic>> query = _firestore
          .collection('transactions')
          .where('userId', isEqualTo: userId)
          .orderBy('createdAt', descending: true)
          .limit(limit);

      if (lastTransactionId != null) {
        final lastDoc = await _firestore
            .collection('transactions')
            .doc(lastTransactionId)
            .get();
        query = query.startAfterDocument(lastDoc);
      }

      final snapshot = await query.get();

      final transactions = snapshot.docs
          .map((doc) => _mapDocumentToTransaction(doc))
          .toList();

      return Success(transactions);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get transaction history: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Stream<double> watchBalance(String userId) {
    return _firestore
        .collection('wallets')
        .doc(userId)
        .snapshots()
        .map((doc) => (doc.data()?['balance'] ?? 0.0).toDouble());
  }

  Transaction _mapDocumentToTransaction(
      DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data()!;
    return Transaction(
      id: doc.id,
      userId: data['userId'] ?? '',
      type: TransactionType.values.firstWhere(
        (e) => e.name == data['type'],
        orElse: () => TransactionType.deposit,
      ),
      amount: (data['amount'] ?? 0.0).toDouble(),
      status: TransactionStatus.values.firstWhere(
        (e) => e.name == data['status'],
        orElse: () => TransactionStatus.completed,
      ),
      description: data['description'],
      relatedListingId: data['relatedListingId'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      metadata: data['metadata'],
    );
  }
}
