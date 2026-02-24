// test/unit/core/utils/result_test.dart
import 'package:biddt/core/errors/failures.dart';
import 'package:biddt/core/utils/result.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Result', () {
    group('Success', () {
      test('should hold a value', () {
        const result = Success<int>(42);
        expect(result.value, equals(42));
        expect(result.isSuccess, isTrue);
        expect(result.isFailure, isFalse);
      });

      test('should map to a new type', () {
        const result = Success<int>(42);
        final mapped = result.map((v) => v.toString());
        expect(mapped.value, equals('42'));
      });

      test('should flatMap to a new result', () {
        const result = Success<int>(42);
        final mapped = result.flatMap((v) => Success(v * 2));
        expect(mapped.value, equals(84));
      });

      test('should return value on getOrThrow', () {
        const result = Success<int>(42);
        expect(result.getOrThrow(), equals(42));
      });

      test('should return value on getOrElse', () {
        const result = Success<int>(42);
        expect(result.getOrElse(0), equals(42));
      });

      test('should execute onSuccess callback', () {
        const result = Success<int>(42);
        int? captured;
        result.onSuccess((v) => captured = v);
        expect(captured, equals(42));
      });

      test('should not execute onFailure callback', () {
        const result = Success<int>(42);
        Failure? captured;
        result.onFailure((f) => captured = f);
        expect(captured, isNull);
      });

      test('should fold to success value', () {
        const result = Success<int>(42);
        final folded = result.fold(
          (v) => 'success: $v',
          (f) => 'failure: ${f.message}',
        );
        expect(folded, equals('success: 42'));
      });
    });

    group('FailureResult', () {
      test('should hold a failure', () {
        const failure = UnknownFailure(message: 'Test error');
        const result = FailureResult(failure);
        expect(result.failure, equals(failure));
        expect(result.isSuccess, isFalse);
        expect(result.isFailure, isTrue);
      });

      test('should throw on getOrThrow', () {
        const failure = UnknownFailure(message: 'Test error');
        const result = FailureResult(failure);
        expect(result.getOrThrow, throwsA(isA<UnknownFailure>()));
      });

      test('should return default on getOrElse', () {
        const failure = UnknownFailure(message: 'Test error');
        const result = FailureResult(failure);
        expect(result.getOrElse(0), equals(0));
      });

      test('should execute onFailure callback', () {
        const failure = UnknownFailure(message: 'Test error');
        const result = FailureResult(failure);
        Failure? captured;
        result.onFailure((f) => captured = f);
        expect(captured, equals(failure));
      });

      test('should not execute onSuccess callback', () {
        const failure = UnknownFailure(message: 'Test error');
        const result = FailureResult(failure);
        int? captured;
        result.onSuccess((v) => captured = v);
        expect(captured, isNull);
      });

      test('should fold to failure value', () {
        const failure = UnknownFailure(message: 'Test error');
        const result = FailureResult(failure);
        final folded = result.fold(
          (v) => 'success: $v',
          (f) => 'failure: ${f.message}',
        );
        expect(folded, equals('failure: Test error'));
      });
    });

    group('runCatching', () {
      test('should return Success when no exception', () {
        final result = runCatching(() => 42);
        expect(result.isSuccess, isTrue);
        expect(result.value, equals(42));
      });

      test('should return FailureResult when exception thrown', () {
        final result = runCatching(() => throw Exception('Test error'));
        expect(result.isFailure, isTrue);
        expect(result.failure, isA<UnknownFailure>());
      });

      test('should return FailureResult when Failure thrown', () {
        final result = runCatching(() => throw const UnknownFailure(message: 'Known error'));
        expect(result.isFailure, isTrue);
        expect(result.failure, isA<UnknownFailure>());
      });
    });

    group('runCatchingAsync', () {
      test('should return Success when no exception', () async {
        final result = await runCatchingAsync(() async => 42);
        expect(result.isSuccess, isTrue);
        expect(result.value, equals(42));
      });

      test('should return FailureResult when exception thrown', () async {
        final result = await runCatchingAsync(() async => throw Exception('Test error'));
        expect(result.isFailure, isTrue);
        expect(result.failure, isA<UnknownFailure>());
      });
    });
  });
}
