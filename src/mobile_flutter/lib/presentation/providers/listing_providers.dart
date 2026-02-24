import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Mock providers for demo
final activeListingsProvider = FutureProvider.family((ref, params) => Future.value([]));
final listingDetailsProvider = FutureProvider.family((ref, listingId) => Future.value(null));
final listingStreamProvider = StreamProvider.family((ref, listingId) => const Stream.empty());
final trendingListingsProvider = FutureProvider((ref) => Future.value([]));
final sellerListingsProvider = FutureProvider.family((ref, sellerId) => Future.value([]));
