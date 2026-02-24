import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/errors/failures.dart';
import '../../../core/utils/result.dart';
import '../../../domain/entities/bid.dart';
import '../../../domain/repositories/bid_repository.dart';

/// Firebase implementation of BidRepository
class FirebaseBidRepository implements BidRepository {
  final FirebaseFirestore _firestore;

  FirebaseBidRepository({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Future<Result<Bid>> placeBid({
    required String listingId,
    required String bidderId,
    required double amount,
    bool isAutoBid = false,
    double? autoBidMax,
  }) async {
    try {
      // Check if bid is higher than current price
      final listingDoc = await _firestore
          .collection('listings')
          .doc(listingId)
          .get();

      if (!listingDoc.exists) {
        return FailureResult(ListingNotFoundFailure());
      }

      final listingData = listingDoc.data()!;
      final currentPrice = (listingData['currentPrice'] ?? 
          listingData['startingPrice']).toDouble();

      if (amount <= currentPrice) {
        return FailureResult(
          BidFailure(message: 'Bid must be higher than current price'),
        );
      }

      // Create bid
      final bidRef = _firestore.collection('bids').doc();
      final bid = Bid(
        id: bidRef.id,
        listingId: listingId,
        bidderId: bidderId,
        amount: amount,
        placedAt: DateTime.now(),
        isAutoBid: isAutoBid,
        autoBidMax: autoBidMax,
      );

      // Run transaction to ensure atomicity
      await _firestore.runTransaction((transaction) async {
        // Add bid
        transaction.set(bidRef, {
          'listingId': bid.listingId,
          'bidderId': bid.bidderId,
          'amount': bid.amount,
          'placedAt': Timestamp.fromDate(bid.placedAt),
          'isAutoBid': bid.isAutoBid,
          'autoBidMax': bid.autoBidMax,
        });

        // Update listing current price
        transaction.update(
          _firestore.collection('listings').doc(listingId),
          {
            'currentPrice': amount,
            'highestBidderId': bidderId,
            'updatedAt': FieldValue.serverTimestamp(),
          },
        );
      });

      return Success(bid);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to place bid: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<List<Bid>>> getBidsForListing(String listingId) async {
    try {
      final snapshot = await _firestore
          .collection('bids')
          .where('listingId', isEqualTo: listingId)
          .orderBy('amount', descending: true)
          .get();

      final bids = snapshot.docs.map((doc) => _mapDocumentToBid(doc)).toList();
      return Success(bids);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get bids: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<List<Bid>>> getBidsByUser(String userId) async {
    try {
      final snapshot = await _firestore
          .collection('bids')
          .where('bidderId', isEqualTo: userId)
          .orderBy('placedAt', descending: true)
          .get();

      final bids = snapshot.docs.map((doc) => _mapDocumentToBid(doc)).toList();
      return Success(bids);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get user bids: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Bid?>> getHighestBid(String listingId) async {
    try {
      final snapshot = await _firestore
          .collection('bids')
          .where('listingId', isEqualTo: listingId)
          .orderBy('amount', descending: true)
          .limit(1)
          .get();

      if (snapshot.docs.isEmpty) {
        return const Success(null);
      }

      return Success(_mapDocumentToBid(snapshot.docs.first));
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get highest bid: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Stream<List<Bid>> watchBidsForListing(String listingId) {
    return _firestore
        .collection('bids')
        .where('listingId', isEqualTo: listingId)
        .orderBy('amount', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => _mapDocumentToBid(doc)).toList());
  }

  @override
  Future<Result<void>> cancelBid(String bidId) async {
    try {
      await _firestore.collection('bids').doc(bidId).delete();
      return const Success(null);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to cancel bid: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  Bid _mapDocumentToBid(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data()!;
    return Bid(
      id: doc.id,
      listingId: data['listingId'] ?? '',
      bidderId: data['bidderId'] ?? '',
      amount: (data['amount'] ?? 0.0).toDouble(),
      placedAt: (data['placedAt'] as Timestamp).toDate(),
      isAutoBid: data['isAutoBid'] ?? false,
      autoBidMax: data['autoBidMax']?.toDouble(),
    );
  }
}
