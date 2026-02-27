import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:equatable/equatable.dart';

part 'auth_event.dart';
part 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  AuthBloc() : super(AuthInitial()) {
    on<AppStarted>(_onAppStarted);
    on<SignInWithPhone>(_onSignInWithPhone);
    on<VerifyPhoneCode>(_onVerifyPhoneCode);
    on<SignInWithGoogle>(_onSignInWithGoogle);
    on<SignOut>(_onSignOut);
    on<CompleteOnboarding>(_onCompleteOnboarding);
  }

  void _onAppStarted(AppStarted event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    
    await Future.delayed(const Duration(seconds: 2)); // Splash delay
    
    final user = _auth.currentUser;
    if (user != null) {
      final userDoc = await _firestore.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        emit(Authenticated(userDoc.data()!));
      } else {
        emit(Unauthenticated());
      }
    } else {
      emit(OnboardingRequired());
    }
  }

  void _onSignInWithPhone(SignInWithPhone event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    
    try {
      await _auth.verifyPhoneNumber(
        phoneNumber: event.phoneNumber,
        verificationCompleted: (PhoneAuthCredential credential) async {
          await _auth.signInWithCredential(credential);
        },
        verificationFailed: (FirebaseAuthException e) {
          emit(AuthError(e.message ?? 'Verification failed'));
        },
        codeSent: (String verificationId, int? resendToken) {
          emit(PhoneCodeSent(verificationId));
        },
        codeAutoRetrievalTimeout: (String verificationId) {},
      );
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  void _onVerifyPhoneCode(VerifyPhoneCode event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    
    try {
      final credential = PhoneAuthProvider.credential(
        verificationId: event.verificationId,
        smsCode: event.code,
      );
      
      final userCredential = await _auth.signInWithCredential(credential);
      
      if (userCredential.user != null) {
        // Check if user exists in Firestore
        final userDoc = await _firestore.collection('users').doc(userCredential.user!.uid).get();
        
        if (!userDoc.exists) {
          // Create new user
          await _firestore.collection('users').doc(userCredential.user!.uid).set({
            'id': userCredential.user!.uid,
            'username': 'user_${userCredential.user!.uid.substring(0, 8)}',
            'displayName': 'New User',
            'email': userCredential.user!.email ?? '',
            'phoneNumber': userCredential.user!.phoneNumber ?? '',
            'avatar': '',
            'trustScore': 50,
            'badges': ['new_seller'],
            'verificationStatus': 'pending',
            'buyingPower': {
              'total': 0,
              'locked': 0,
              'available': 0,
            },
            'stats': {
              'transactions': 0,
              'responseRate': 100,
              'responseTime': '< 1 hour',
              'joinedAt': DateTime.now().toIso8601String(),
            },
          });
        }
        
        final newUserDoc = await _firestore.collection('users').doc(userCredential.user!.uid).get();
        emit(Authenticated(newUserDoc.data()!));
      }
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  void _onSignInWithGoogle(SignInWithGoogle event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    // Implement Google Sign In
    emit(AuthError('Google Sign In not implemented in demo'));
  }

  void _onSignOut(SignOut event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    await _auth.signOut();
    emit(Unauthenticated());
  }

  void _onCompleteOnboarding(CompleteOnboarding event, Emitter<AuthState> emit) {
    emit(Unauthenticated());
  }
}
