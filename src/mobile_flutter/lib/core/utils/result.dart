// lib/core/utils/result.dart
import '../errors/failures.dart';

/// A type that represents either a success value of type [T] or a failure of type [Failure]
sealed class Result<T> {
  const Result();

  /// Returns true if this is a success
  bool get isSuccess => this is Success<T>;

  /// Returns true if this is a failure
  bool get isFailure => this is FailureResult;

  /// Returns the success value or null
  T? get value => isSuccess ? (this as Success<T>).value : null;

  /// Returns the failure or null
  Failure? get failure => isFailure ? (this as FailureResult<T>).failure : null;

  /// Maps the success value to a new type
  Result<R> map<R>(R Function(T) transform) {
    if (this is Success<T>) {
      return Success(transform((this as Success<T>).value));
    }
    return FailureResult<R>((this as FailureResult<T>).failure);
  }

  /// Flat maps the success value to a new result
  Result<R> flatMap<R>(Result<R> Function(T) transform) {
    if (this is Success<T>) {
      return transform((this as Success<T>).value);
    }
    return FailureResult<R>((this as FailureResult<T>).failure);
  }

  /// Returns the success value or throws the failure
  T getOrThrow() {
    if (this is Success<T>) {
      return (this as Success<T>).value;
    }
    throw (this as FailureResult).failure;
  }

  /// Returns the success value or a default
  T getOrElse(T defaultValue) {
    if (this is Success<T>) {
      return (this as Success<T>).value;
    }
    return defaultValue;
  }

  /// Returns the success value or computes a default
  T getOrCompute(T Function(Failure) compute) {
    if (this is Success<T>) {
      return (this as Success<T>).value;
    }
    return compute((this as FailureResult).failure);
  }

  /// Executes a side effect on success
  Result<T> onSuccess(void Function(T) action) {
    if (this is Success<T>) {
      action((this as Success<T>).value);
    }
    return this;
  }

  /// Executes a side effect on failure
  Result<T> onFailure(void Function(Failure) action) {
    if (this is FailureResult<T>) {
      action((this as FailureResult<T>).failure);
    }
    return this;
  }

  /// Fold the result into a single value
  R fold<R>(R Function(T) onSuccess, R Function(Failure) onFailure) {
    if (this is Success<T>) {
      return onSuccess((this as Success<T>).value);
    }
    return onFailure((this as FailureResult<T>).failure);
  }
}

/// Represents a successful result with a value of type [T]
class Success<T> extends Result<T> {
  final T value;

  const Success(this.value);

  @override
  String toString() => 'Success($value)';
}

/// Represents a failed result with a [Failure]
class FailureResult<T> extends Result<T> {
  final Failure failure;

  const FailureResult(this.failure);

  @override
  String toString() => 'Failure($failure)';
}

/// Extension methods for async operations
extension ResultAsyncExtensions<T> on Future<Result<T>> {
  /// Maps the success value to a new type asynchronously
  Future<Result<R>> mapAsync<R>(Future<R> Function(T) transform) async {
    final result = await this;
    if (result is Success<T>) {
      try {
        final mapped = await transform(result.value);
        return Success(mapped);
      } on Failure catch (e) {
        return FailureResult<R>(e);
      } on Exception catch (e, stackTrace) {
        return FailureResult<R>(UnknownFailure(
          message: e.toString(),
          stackTrace: stackTrace,
        ));
      }
    }
    return FailureResult<R>(result.failure!);
  }

  /// Flat maps the success value to a new result asynchronously
  Future<Result<R>> flatMapAsync<R>(Future<Result<R>> Function(T) transform) async {
    final result = await this;
    if (result is Success<T>) {
      return transform(result.value);
    }
    return FailureResult<R>(result.failure!);
  }

  /// Recovers from a failure with a new value
  Future<Result<T>> recover(T Function(Failure) recovery) async {
    final result = await this;
    if (result is FailureResult<T>) {
      return Success(recovery(result.failure));
    }
    return result;
  }

  /// Recovers from a failure with a new result
  Future<Result<T>> recoverWith(Future<Result<T>> Function(Failure) recovery) async {
    final result = await this;
    if (result is FailureResult<T>) {
      return recovery(result.failure);
    }
    return result;
  }
}

/// Helper function to run a computation and wrap it in a Result
Result<T> runCatching<T>(T Function() block) {
  try {
    return Success(block());
  } on Failure catch (e) {
    return FailureResult<T>(e);
  } on Exception catch (e, stackTrace) {
    return FailureResult<T>(UnknownFailure(
      message: e.toString(),
      stackTrace: stackTrace,
    ));
  }
}

/// Helper function to run an async computation and wrap it in a Result
Future<Result<T>> runCatchingAsync<T>(Future<T> Function() block) async {
  try {
    final value = await block();
    return Success(value);
  } on Failure catch (e) {
    return FailureResult<T>(e);
  } on Exception catch (e, stackTrace) {
    return FailureResult<T>(UnknownFailure(
      message: e.toString(),
      stackTrace: stackTrace,
    ));
  }
}
