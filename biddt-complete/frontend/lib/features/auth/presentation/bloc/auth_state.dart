part of 'auth_bloc.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class OnboardingRequired extends AuthState {}

class Unauthenticated extends AuthState {}

class PhoneCodeSent extends AuthState {
  final String verificationId;
  const PhoneCodeSent(this.verificationId);

  @override
  List<Object> get props => [verificationId];
}

class Authenticated extends AuthState {
  final Map<String, dynamic> userData;
  const Authenticated(this.userData);

  @override
  List<Object> get props => [userData];
}

class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);

  @override
  List<Object> get props => [message];
}
