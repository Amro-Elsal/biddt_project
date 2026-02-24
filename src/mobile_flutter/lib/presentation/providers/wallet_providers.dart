import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Mock providers for demo
final walletBalanceProvider = FutureProvider.family((ref, userId) => Future.value(0));
final walletBalanceStreamProvider = StreamProvider.family((ref, userId) => const Stream.empty());
final transactionHistoryProvider = FutureProvider.family((ref, userId) => Future.value([]));
