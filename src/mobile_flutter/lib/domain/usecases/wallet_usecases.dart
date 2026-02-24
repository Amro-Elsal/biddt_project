import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/transaction.dart';
import '../repositories/wallet_repository.dart';

/// Use case: Get user balance
class GetBalanceUseCase {
  final WalletRepository _repository;

  const GetBalanceUseCase(this._repository);

  Future<Result<double>> call(String userId) async {
    return await _repository.getBalance(userId);
  }
}

/// Use case: Add funds
class AddFundsUseCase {
  final WalletRepository _repository;

  const AddFundsUseCase(this._repository);

  Future<Result<Transaction>> call({
    required String userId,
    required double amount,
    required String paymentMethodId,
  }) async {
    return await _repository.addFunds(
      userId: userId,
      amount: amount,
      paymentMethodId: paymentMethodId,
    );
  }
}

/// Use case: Get transaction history
class GetTransactionHistoryUseCase {
  final WalletRepository _repository;

  const GetTransactionHistoryUseCase(this._repository);

  Future<Result<List<Transaction>>> call(
    String userId, {
    int limit = 20,
    String? lastTransactionId,
  }) async {
    return await _repository.getTransactionHistory(
      userId,
      limit: limit,
      lastTransactionId: lastTransactionId,
    );
  }
}
