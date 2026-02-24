import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Mock providers for demo
final bidsForListingProvider = FutureProvider.family((ref, listingId) => Future.value([]));
final bidsStreamProvider = StreamProvider.family((ref, listingId) => const Stream.empty());
final highestBidProvider = FutureProvider.family((ref, listingId) => Future.value(null));
final userBidsProvider = FutureProvider.family((ref, userId) => Future.value([]));
