import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/transaction.dart';

/// Repository interface for wallet/transaction operations
abstract class WalletRepository {
  /// Get user balance
  Future<Result<double>> getBalance(String userId);

  /// Add funds to wallet
  Future<Result<Transaction>> addFunds({
    required String userId,
    required double amount,
    required String paymentMethodId,
  });

  /// Withdraw funds from wallet
  Future<Result<Transaction>> withdraw({
    required String userId,
    required double amount,
    required String bankAccountId,
  });

  /// Hold funds for a bid
  Future<Result<Transaction>> holdFunds({
    required String userId,
    required double amount,
    required String listingId,
  });

  /// Release held funds
  Future<Result<Transaction>> releaseHold({
    required String userId,
    required String listingId,
  });

  /// Get transaction history
  Future<Result<List<Transaction>>> getTransactionHistory(
    String userId, {
    int limit = 20,
    String? lastTransactionId,
  });

  /// Stream of balance changes
  Stream<double> watchBalance(String userId);
}
