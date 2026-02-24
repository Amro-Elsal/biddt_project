import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../domain/entities/user.dart';
import '../../../domain/repositories/user_repository.dart';
import 'repository_providers.dart';

/// Current user stream provider
final currentUserStreamProvider = StreamProvider<User?>((ref) {
  final repository = ref.watch(userRepositoryProvider);
  return repository.currentUserStream;
});

/// Current user provider
final currentUserProvider = Provider<AsyncValue<User?>>((ref) {
  return ref.watch(currentUserStreamProvider);
});

/// User ID provider
final currentUserIdProvider = Provider<String?>((ref) {
  final userAsync = ref.watch(currentUserProvider);
  return userAsync.when(
    data: (user) => user?.id,
    loading: () => null,
    error: (_, __) => null,
  );
});

/// User stats provider
final userStatsProvider = FutureProvider.family<Map<String, dynamic>, String>(
  (ref, userId) async {
    final repository = ref.watch(userRepositoryProvider);
    final result = await repository.getUserStats(userId);
    return result.getOrElse({});
  },
);
