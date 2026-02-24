import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../domain/entities/transaction.dart';
import '../../../domain/repositories/wallet_repository.dart';
import 'repository_providers.dart';

/// Wallet balance provider
final walletBalanceProvider = FutureProvider.family<double, String>(
  (ref, userId) async {
    final repository = ref.watch(walletRepositoryProvider);
    final result = await repository.getBalance(userId);
    return result.getOrElse(0);
  },
);

/// Wallet balance stream provider
final walletBalanceStreamProvider = StreamProvider.family<double, String>(
  (ref, userId) {
    final repository = ref.watch(walletRepositoryProvider);
    return repository.watchBalance(userId);
  },
);

/// Transaction history provider
final transactionHistoryProvider =
    FutureProvider.family<List<Transaction>, String>(
  (ref, userId) async {
    final repository = ref.watch(walletRepositoryProvider);
    final result = await repository.getTransactionHistory(userId);
    return result.getOrElse([]);
  },
);
