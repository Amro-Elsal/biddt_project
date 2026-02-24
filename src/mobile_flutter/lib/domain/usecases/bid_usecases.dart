import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/bid.dart';
import '../repositories/bid_repository.dart';

/// Use case: Place a bid
class PlaceBidUseCase {
  final BidRepository _repository;

  const PlaceBidUseCase(this._repository);

  Future<Result<Bid>> call({
    required String listingId,
    required String bidderId,
    required double amount,
    bool isAutoBid = false,
    double? autoBidMax,
  }) async {
    return await _repository.placeBid(
      listingId: listingId,
      bidderId: bidderId,
      amount: amount,
      isAutoBid: isAutoBid,
      autoBidMax: autoBidMax,
    );
  }
}

/// Use case: Get bids for listing
class GetBidsForListingUseCase {
  final BidRepository _repository;

  const GetBidsForListingUseCase(this._repository);

  Future<Result<List<Bid>>> call(String listingId) async {
    return await _repository.getBidsForListing(listingId);
  }
}

/// Use case: Get highest bid
class GetHighestBidUseCase {
  final BidRepository _repository;

  const GetHighestBidUseCase(this._repository);

  Future<Result<Bid?>> call(String listingId) async {
    return await _repository.getHighestBid(listingId);
  }
}
