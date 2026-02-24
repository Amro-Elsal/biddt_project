import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../domain/entities/listing.dart';
import '../../../domain/repositories/listing_repository.dart';
import 'repository_providers.dart';

/// Active listings provider
final activeListingsProvider = FutureProvider.family<
    List<Listing>,
    ({String? category, String? searchQuery})>(
  (ref, params) async {
    final repository = ref.watch(listingRepositoryProvider);
    final result = await repository.getActiveListings(
      category: params.category,
      searchQuery: params.searchQuery,
    );
    return result.getOrElse([]);
  },
);

/// Listing details provider
final listingDetailsProvider = FutureProvider.family<Listing?, String>(
  (ref, listingId) async {
    final repository = ref.watch(listingRepositoryProvider);
    final result = await repository.getListingById(listingId);
    return result.value;
  },
);

/// Listing stream provider (real-time updates)
final listingStreamProvider = StreamProvider.family<Listing, String>(
  (ref, listingId) {
    final repository = ref.watch(listingRepositoryProvider);
    return repository.watchListing(listingId);
  },
);

/// Trending listings provider
final trendingListingsProvider = FutureProvider<List<Listing>>((ref) async {
  final repository = ref.watch(listingRepositoryProvider);
  final result = await repository.getTrendingListings();
  return result.getOrElse([]);
});

/// Seller listings provider
final sellerListingsProvider = FutureProvider.family<List<Listing>, String>(
  (ref, sellerId) async {
    final repository = ref.watch(listingRepositoryProvider);
    final result = await repository.getListingsBySeller(sellerId);
    return result.getOrElse([]);
  },
);
