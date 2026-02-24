import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/user.dart';

/// Repository interface for user-related operations
abstract class UserRepository {
  /// Get current authenticated user
  Future<Result<User?>> getCurrentUser();

  /// Get user by ID
  Future<Result<User>> getUserById(String userId);

  /// Update user profile
  Future<Result<User>> updateUser(User user);

  /// Update user profile picture
  Future<Result<String>> updateProfilePicture(String userId, String imagePath);

  /// Get user statistics
  Future<Result<Map<String, dynamic>>> getUserStats(String userId);

  /// Stream of current user changes
  Stream<User?> get currentUserStream;
}
