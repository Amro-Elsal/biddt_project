import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/listing.dart';
import '../repositories/listing_repository.dart';

/// Use case: Get active listings
class GetActiveListingsUseCase {
  final ListingRepository _repository;

  const GetActiveListingsUseCase(this._repository);

  Future<Result<List<Listing>>> call({
    String? category,
    String? searchQuery,
    int limit = 20,
    String? lastListingId,
  }) async {
    return await _repository.getActiveListings(
      category: category,
      searchQuery: searchQuery,
      limit: limit,
      lastListingId: lastListingId,
    );
  }
}

/// Use case: Get listing details
class GetListingDetailsUseCase {
  final ListingRepository _repository;

  const GetListingDetailsUseCase(this._repository);

  Future<Result<Listing>> call(String listingId) async {
    return await _repository.getListingById(listingId);
  }
}

/// Use case: Create listing
class CreateListingUseCase {
  final ListingRepository _repository;

  const CreateListingUseCase(this._repository);

  Future<Result<Listing>> call(Listing listing) async {
    return await _repository.createListing(listing);
  }
}

/// Use case: Get trending listings
class GetTrendingListingsUseCase {
  final ListingRepository _repository;

  const GetTrendingListingsUseCase(this._repository);

  Future<Result<List<Listing>>> call({int limit = 10}) async {
    return await _repository.getTrendingListings(limit: limit);
  }
}
