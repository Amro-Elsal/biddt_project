import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/bid.dart';
import '../../domain/repositories/bid_repository.dart';
import 'repository_providers.dart';

/// Bids for listing provider
final bidsForListingProvider = FutureProvider.family<List<Bid>, String>(
  (ref, listingId) async {
    final repository = ref.watch(bidRepositoryProvider);
    final result = await repository.getBidsForListing(listingId);
    return result.getOrElse([]);
  },
);

/// Bids stream provider (real-time)
final bidsStreamProvider = StreamProvider.family<List<Bid>, String>(
  (ref, listingId) {
    final repository = ref.watch(bidRepositoryProvider);
    return repository.watchBidsForListing(listingId);
  },
);

/// Highest bid provider
final highestBidProvider = FutureProvider.family<Bid?, String>(
  (ref, listingId) async {
    final repository = ref.watch(bidRepositoryProvider);
    final result = await repository.getHighestBid(listingId);
    return result.value;
  },
);

/// User bids provider
final userBidsProvider = FutureProvider.family<List<Bid>, String>(
  (ref, userId) async {
    final repository = ref.watch(bidRepositoryProvider);
    final result = await repository.getBidsByUser(userId);
    return result.getOrElse([]);
  },
);
