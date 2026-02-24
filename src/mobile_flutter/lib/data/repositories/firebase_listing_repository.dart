import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/errors/failures.dart';
import '../../../core/utils/result.dart';
import '../../../domain/entities/listing.dart';
import '../../../domain/repositories/listing_repository.dart';

/// Firebase implementation of ListingRepository
class FirebaseListingRepository implements ListingRepository {
  final FirebaseFirestore _firestore;

  FirebaseListingRepository({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  @override
  Future<Result<List<Listing>>> getActiveListings({
    String? category,
    String? searchQuery,
    int limit = 20,
    String? lastListingId,
  }) async {
    try {
      Query<Map<String, dynamic>> query = _firestore
          .collection('listings')
          .where('status', isEqualTo: 'active')
          .where('endsAt', isGreaterThan: Timestamp.now())
          .orderBy('endsAt', descending: false)
          .limit(limit);

      if (category != null && category != 'All') {
        query = query.where('category', isEqualTo: category);
      }

      if (lastListingId != null) {
        final lastDoc = await _firestore
            .collection('listings')
            .doc(lastListingId)
            .get();
        query = query.startAfterDocument(lastDoc);
      }

      final snapshot = await query.get();

      final listings = snapshot.docs
          .map((doc) => _mapDocumentToListing(doc))
          .toList();

      return Success(listings);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get listings: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Listing>> getListingById(String listingId) async {
    try {
      final doc = await _firestore
          .collection('listings')
          .doc(listingId)
          .get();

      if (!doc.exists) {
        return FailureResult(
          ListingNotFoundFailure(),
        );
      }

      return Success(_mapDocumentToListing(doc));
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get listing: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<List<Listing>>> getListingsBySeller(String sellerId) async {
    try {
      final snapshot = await _firestore
          .collection('listings')
          .where('sellerId', isEqualTo: sellerId)
          .orderBy('createdAt', descending: true)
          .get();

      final listings = snapshot.docs
          .map((doc) => _mapDocumentToListing(doc))
          .toList();

      return Success(listings);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get seller listings: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Listing>> createListing(Listing listing) async {
    try {
      final docRef = _firestore.collection('listings').doc();
      final newListing = listing.copyWith(id: docRef.id);

      await docRef.set({
        'sellerId': newListing.sellerId,
        'title': newListing.title,
        'description': newListing.description,
        'images': newListing.images,
        'category': newListing.category,
        'condition': newListing.condition,
        'startingPrice': newListing.startingPrice,
        'currentPrice': newListing.currentPrice,
        'buyNowPrice': newListing.buyNowPrice,
        'createdAt': Timestamp.fromDate(newListing.createdAt),
        'endsAt': Timestamp.fromDate(newListing.endsAt),
        'status': newListing.status.name,
        'location': newListing.location,
        'metadata': newListing.metadata,
      });

      return Success(newListing);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to create listing: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Listing>> updateListing(Listing listing) async {
    try {
      await _firestore.collection('listings').doc(listing.id).update({
        'title': listing.title,
        'description': listing.description,
        'images': listing.images,
        'category': listing.category,
        'condition': listing.condition,
        'currentPrice': listing.currentPrice,
        'buyNowPrice': listing.buyNowPrice,
        'endsAt': Timestamp.fromDate(listing.endsAt),
        'status': listing.status.name,
        'location': listing.location,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      return Success(listing);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to update listing: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<void>> deleteListing(String listingId) async {
    try {
      await _firestore
          .collection('listings')
          .doc(listingId)
          .update({'status': 'cancelled'});

      return const Success(null);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to delete listing: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Stream<Listing> watchListing(String listingId) {
    return _firestore
        .collection('listings')
        .doc(listingId)
        .snapshots()
        .map((doc) => _mapDocumentToListing(doc));
  }

  @override
  Future<Result<List<Listing>>> getTrendingListings({int limit = 10}) async {
    try {
      final snapshot = await _firestore
          .collection('listings')
          .where('status', isEqualTo: 'active')
          .orderBy('viewCount', descending: true)
          .limit(limit)
          .get();

      final listings = snapshot.docs
          .map((doc) => _mapDocumentToListing(doc))
          .toList();

      return Success(listings);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get trending listings: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  Listing _mapDocumentToListing(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data()!;
    return Listing(
      id: doc.id,
      sellerId: data['sellerId'] ?? '',
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      images: List<String>.from(data['images'] ?? []),
      category: data['category'] ?? '',
      condition: data['condition'] ?? '',
      startingPrice: (data['startingPrice'] ?? 0.0).toDouble(),
      currentPrice: data['currentPrice']?.toDouble(),
      buyNowPrice: data['buyNowPrice']?.toDouble(),
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      endsAt: (data['endsAt'] as Timestamp).toDate(),
      status: ListingStatus.values.firstWhere(
        (e) => e.name == data['status'],
        orElse: () => ListingStatus.active,
      ),
      location: data['location'],
      metadata: data['metadata'],
    );
  }
}
