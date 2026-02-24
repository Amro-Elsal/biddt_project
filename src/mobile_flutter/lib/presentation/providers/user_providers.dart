import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Mock providers for demo
final currentUserStreamProvider = StreamProvider((ref) => const Stream.empty());
final currentUserProvider = Provider((ref) => null);
final currentUserIdProvider = Provider((ref) => null);
final userStatsProvider = FutureProvider.family((ref, userId) => Future.value({}));
