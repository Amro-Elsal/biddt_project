import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/listing.dart';

/// Repository interface for listing-related operations
abstract class ListingRepository {
  /// Get all active listings
  Future<Result<List<Listing>>> getActiveListings({
    String? category,
    String? searchQuery,
    int limit = 20,
    String? lastListingId,
  });

  /// Get listing by ID
  Future<Result<Listing>> getListingById(String listingId);

  /// Get listings by seller ID
  Future<Result<List<Listing>>> getListingsBySeller(String sellerId);

  /// Create a new listing
  Future<Result<Listing>> createListing(Listing listing);

  /// Update a listing
  Future<Result<Listing>> updateListing(Listing listing);

  /// Delete a listing
  Future<Result<void>> deleteListing(String listingId);

  /// Watch a listing for real-time updates
  Stream<Listing> watchListing(String listingId);

  /// Get trending listings
  Future<Result<List<Listing>>> getTrendingListings({int limit = 10});
}
