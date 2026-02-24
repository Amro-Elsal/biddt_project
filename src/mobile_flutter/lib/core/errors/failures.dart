// lib/core/errors/failures.dart
import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  final String? code;
  final StackTrace? stackTrace;

  const Failure({
    required this.message,
    this.code,
    this.stackTrace,
  });

  @override
  List<Object?> get props => [message, code, stackTrace];
}

// Server/Network Failures
class ServerFailure extends Failure {
  const ServerFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

class NetworkFailure extends Failure {
  const NetworkFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

class TimeoutFailure extends Failure {
  const TimeoutFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

// Cache/Storage Failures
class CacheFailure extends Failure {
  const CacheFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

class StorageFailure extends Failure {
  const StorageFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

// Auth Failures
class AuthFailure extends Failure {
  const AuthFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

class InvalidCredentialsFailure extends AuthFailure {
  const InvalidCredentialsFailure({
    super.message = 'Invalid email or password',
    super.code,
    super.stackTrace,
  });
}

class UserNotFoundFailure extends AuthFailure {
  const UserNotFoundFailure({
    super.message = 'User not found',
    super.code,
    super.stackTrace,
  });
}

class EmailAlreadyInUseFailure extends AuthFailure {
  const EmailAlreadyInUseFailure({
    super.message = 'Email already in use',
    super.code,
    super.stackTrace,
  });
}

class WeakPasswordFailure extends AuthFailure {
  const WeakPasswordFailure({
    super.message = 'Password is too weak',
    super.code,
    super.stackTrace,
  });
}

class InvalidOtpFailure extends AuthFailure {
  const InvalidOtpFailure({
    super.message = 'Invalid verification code',
    super.code,
    super.stackTrace,
  });
}

class OtpExpiredFailure extends AuthFailure {
  const OtpExpiredFailure({
    super.message = 'Verification code expired',
    super.code,
    super.stackTrace,
  });
}

class TooManyRequestsFailure extends AuthFailure {
  const TooManyRequestsFailure({
    super.message = 'Too many attempts. Please try again later.',
    super.code,
    super.stackTrace,
  });
}

// Validation Failures
class ValidationFailure extends Failure {
  final Map<String, String>? fieldErrors;
  
  const ValidationFailure({
    required super.message,
    this.fieldErrors,
    super.code,
    super.stackTrace,
  });

  @override
  List<Object?> get props => [message, fieldErrors, code, stackTrace];
}

// Permission Failures
class PermissionFailure extends Failure {
  const PermissionFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

class LocationPermissionFailure extends PermissionFailure {
  const LocationPermissionFailure({
    super.message = 'Location permission denied',
    super.code,
    super.stackTrace,
  });
}

class CameraPermissionFailure extends PermissionFailure {
  const CameraPermissionFailure({
    super.message = 'Camera permission denied',
    super.code,
    super.stackTrace,
  });
}

class NotificationPermissionFailure extends PermissionFailure {
  const NotificationPermissionFailure({
    super.message = 'Notification permission denied',
    super.code,
    super.stackTrace,
  });
}

// Payment Failures
class PaymentFailure extends Failure {
  const PaymentFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

class InsufficientFundsFailure extends PaymentFailure {
  const InsufficientFundsFailure({
    super.message = 'Insufficient funds',
    super.code,
    super.stackTrace,
  });
}

class PaymentMethodFailure extends PaymentFailure {
  const PaymentMethodFailure({
    super.message = 'Invalid payment method',
    super.code,
    super.stackTrace,
  });
}

// Feature-Specific Failures
class BidFailure extends Failure {
  const BidFailure({
    required super.message,
    super.code,
    super.stackTrace,
  });
}

class OutbidFailure extends BidFailure {
  const OutbidFailure({
    super.message = 'You have been outbid',
    super.code,
    super.stackTrace,
  });
}

class AuctionEndedFailure extends BidFailure {
  const AuctionEndedFailure({
    super.message = 'Auction has ended',
    super.code,
    super.stackTrace,
  });
}

class ListingNotFoundFailure extends Failure {
  const ListingNotFoundFailure({
    super.message = 'Listing not found',
    super.code,
    super.stackTrace,
  });
}

// Generic Failures
class UnknownFailure extends Failure {
  const UnknownFailure({
    super.message = 'An unexpected error occurred',
    super.code,
    super.stackTrace,
  });
}

class NotImplementedFailure extends Failure {
  const NotImplementedFailure({
    super.message = 'This feature is not yet implemented',
    super.code,
    super.stackTrace,
  });
}

// Extension to convert exceptions to failures
extension ExceptionToFailure on Exception {
  Failure toFailure({String? code, StackTrace? stackTrace}) {
    final message = toString();
    
    // Network errors
    if (message.contains('SocketException') || 
        message.contains('Connection refused')) {
      return NetworkFailure(
        message: 'No internet connection. Please check your network.',
        code: code ?? 'NETWORK_ERROR',
        stackTrace: stackTrace,
      );
    }
    
    if (message.contains('TimeoutException')) {
      return TimeoutFailure(
        message: 'Request timed out. Please try again.',
        code: code ?? 'TIMEOUT',
        stackTrace: stackTrace,
      );
    }
    
    // Auth errors
    if (message.contains('invalid-credential') ||
        message.contains('wrong-password')) {
      return InvalidCredentialsFailure(
        code: code ?? 'INVALID_CREDENTIALS',
        stackTrace: stackTrace,
      );
    }
    
    if (message.contains('user-not-found')) {
      return UserNotFoundFailure(
        code: code ?? 'USER_NOT_FOUND',
        stackTrace: stackTrace,
      );
    }
    
    if (message.contains('email-already-in-use')) {
      return EmailAlreadyInUseFailure(
        code: code ?? 'EMAIL_IN_USE',
        stackTrace: stackTrace,
      );
    }
    
    if (message.contains('weak-password')) {
      return WeakPasswordFailure(
        code: code ?? 'WEAK_PASSWORD',
        stackTrace: stackTrace,
      );
    }
    
    if (message.contains('too-many-requests')) {
      return TooManyRequestsFailure(
        code: code ?? 'TOO_MANY_REQUESTS',
        stackTrace: stackTrace,
      );
    }
    
    // Default
    return UnknownFailure(
      message: message,
      code: code ?? 'UNKNOWN',
      stackTrace: stackTrace,
    );
  }
}
