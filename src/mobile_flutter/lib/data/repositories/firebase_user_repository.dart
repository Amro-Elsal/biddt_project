import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import '../../../core/errors/failures.dart';
import '../../../core/utils/result.dart';
import '../../../domain/entities/user.dart';
import '../../../domain/repositories/user_repository.dart';

/// Firebase implementation of UserRepository
class FirebaseUserRepository implements UserRepository {
  final FirebaseFirestore _firestore;
  final firebase_auth.FirebaseAuth _auth;

  FirebaseUserRepository({
    FirebaseFirestore? firestore,
    firebase_auth.FirebaseAuth? auth,
  })  : _firestore = firestore ?? FirebaseFirestore.instance,
        _auth = auth ?? firebase_auth.FirebaseAuth.instance;

  @override
  Future<Result<User?>> getCurrentUser() async {
    try {
      final firebaseUser = _auth.currentUser;
      if (firebaseUser == null) {
        return const Success(null);
      }

      final doc = await _firestore
          .collection('users')
          .doc(firebaseUser.uid)
          .get();

      if (!doc.exists) {
        return const Success(null);
      }

      return Success(_mapDocumentToUser(doc));
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get current user: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<User>> getUserById(String userId) async {
    try {
      final doc = await _firestore.collection('users').doc(userId).get();

      if (!doc.exists) {
        return FailureResult(
          UserNotFoundFailure(),
        );
      }

      return Success(_mapDocumentToUser(doc));
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get user: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<User>> updateUser(User user) async {
    try {
      await _firestore.collection('users').doc(user.id).update({
        'displayName': user.displayName,
        'email': user.email,
        'photoUrl': user.photoUrl,
        'location': user.location,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      return Success(user);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to update user: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<String>> updateProfilePicture(
    String userId,
    String imagePath,
  ) async {
    try {
      // TODO: Upload image to Firebase Storage and get URL
      const photoUrl = 'https://example.com/photo.jpg';

      await _firestore.collection('users').doc(userId).update({
        'photoUrl': photoUrl,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      return const Success(photoUrl);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to update profile picture: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Future<Result<Map<String, dynamic>>> getUserStats(String userId) async {
    try {
      final doc = await _firestore.collection('userStats').doc(userId).get();

      if (!doc.exists) {
        return const Success({});
      }

      return Success(doc.data() ?? {});
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to get user stats: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  @override
  Stream<User?> get currentUserStream {
    return _auth.authStateChanges().asyncMap((firebaseUser) async {
      if (firebaseUser == null) return null;

      final doc = await _firestore
          .collection('users')
          .doc(firebaseUser.uid)
          .get();

      if (!doc.exists) return null;

      return _mapDocumentToUser(doc);
    });
  }

  User _mapDocumentToUser(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data()!;
    return User(
      id: doc.id,
      phoneNumber: data['phoneNumber'] ?? '',
      displayName: data['displayName'],
      email: data['email'],
      photoUrl: data['photoUrl'],
      location: data['location'],
      trustScore: (data['trustScore'] ?? 0.0).toDouble(),
      isVerified: data['isVerified'] ?? false,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      lastActiveAt: (data['lastActiveAt'] as Timestamp?)?.toDate(),
      stats: data['stats'] ?? {},
    );
  }
}
