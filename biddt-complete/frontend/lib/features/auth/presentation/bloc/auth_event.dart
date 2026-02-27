part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object> get props => [];
}

class AppStarted extends AuthEvent {}

class SignInWithPhone extends AuthEvent {
  final String phoneNumber;
  const SignInWithPhone(this.phoneNumber);

  @override
  List<Object> get props => [phoneNumber];
}

class VerifyPhoneCode extends AuthEvent {
  final String verificationId;
  final String code;
  const VerifyPhoneCode(this.verificationId, this.code);

  @override
  List<Object> get props => [verificationId, code];
}

class SignInWithGoogle extends AuthEvent {}

class SignInWithApple extends AuthEvent {}

class SignOut extends AuthEvent {}

class CompleteOnboarding extends AuthEvent {}
