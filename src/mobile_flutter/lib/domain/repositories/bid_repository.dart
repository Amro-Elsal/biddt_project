import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/bid.dart';

/// Repository interface for bid-related operations
abstract class BidRepository {
  /// Place a new bid
  Future<Result<Bid>> placeBid({
    required String listingId,
    required String bidderId,
    required double amount,
    bool isAutoBid = false,
    double? autoBidMax,
  });

  /// Get bids for a listing
  Future<Result<List<Bid>>> getBidsForListing(String listingId);

  /// Get bids by user
  Future<Result<List<Bid>>> getBidsByUser(String userId);

  /// Get highest bid for a listing
  Future<Result<Bid?>> getHighestBid(String listingId);

  /// Watch bids for real-time updates
  Stream<List<Bid>> watchBidsForListing(String listingId);

  /// Cancel a bid (if allowed)
  Future<Result<void>> cancelBid(String bidId);
}
