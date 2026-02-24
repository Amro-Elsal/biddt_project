import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';

/// Service for Firebase Authentication operations
class AuthService {
  final FirebaseAuth _auth;
  final FirebaseFirestore _firestore;

  AuthService({
    FirebaseAuth? auth,
    FirebaseFirestore? firestore,
  })  : _auth = auth ?? FirebaseAuth.instance,
        _firestore = firestore ?? FirebaseFirestore.instance;

  /// Get current user
  User? get currentUser => _auth.currentUser;

  /// Auth state stream
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  /// Send OTP to phone number
  Future<Result<String>> sendOTP({
    required String phoneNumber,
    required void Function(String verificationId) onCodeSent,
    required void Function(String error) onError,
  }) async {
    try {
      await _auth.verifyPhoneNumber(
        phoneNumber: phoneNumber,
        verificationCompleted: (PhoneAuthCredential credential) async {
          // Auto-verification on Android
          await _auth.signInWithCredential(credential);
        },
        verificationFailed: (FirebaseAuthException e) {
          onError(e.message ?? 'Verification failed');
        },
        codeSent: (String verificationId, int? resendToken) {
          onCodeSent(verificationId);
        },
        codeAutoRetrievalTimeout: (String verificationId) {
          // Timeout
        },
        timeout: const Duration(seconds: 60),
      );

      return const Success('OTP sent successfully');
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to send OTP: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  /// Verify OTP and sign in
  Future<Result<User>> verifyOTP({
    required String verificationId,
    required String smsCode,
  }) async {
    try {
      final credential = PhoneAuthProvider.credential(
        verificationId: verificationId,
        smsCode: smsCode,
      );

      final userCredential = await _auth.signInWithCredential(credential);
      final user = userCredential.user;

      if (user == null) {
        return FailureResult(
          AuthFailure(message: 'Failed to sign in'),
        );
      }

      // Create user document if new user
      await _createUserDocumentIfNeeded(user);

      return Success(user);
    } on FirebaseAuthException catch (e) {
      return FailureResult(
        InvalidOtpFailure(message: e.message ?? 'Invalid code'),
      );
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to verify OTP: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  /// Sign out
  Future<Result<void>> signOut() async {
    try {
      await _auth.signOut();
      return const Success(null);
    } catch (e, stackTrace) {
      return FailureResult(
        UnknownFailure(
          message: 'Failed to sign out: $e',
          stackTrace: stackTrace,
        ),
      );
    }
  }

  /// Create user document in Firestore if it doesn't exist
  Future<void> _createUserDocumentIfNeeded(User user) async {
    final userDoc = _firestore.collection('users').doc(user.uid);
    final docSnapshot = await userDoc.get();

    if (!docSnapshot.exists) {
      await userDoc.set({
        'phoneNumber': user.phoneNumber,
        'displayName': null,
        'email': null,
        'photoUrl': null,
        'location': null,
        'trustScore': 0.0,
        'isVerified': false,
        'createdAt': FieldValue.serverTimestamp(),
        'stats': {
          'sold': 0,
          'bought': 0,
          'activeListings': 0,
        },
      });

      // Create wallet document
      await _firestore.collection('wallets').doc(user.uid).set({
        'balance': 0.0,
        'heldBalance': 0.0,
        'userId': user.uid,
        'createdAt': FieldValue.serverTimestamp(),
      });
    }
  }
}
