import '../../core/errors/failures.dart';
import '../../core/utils/result.dart';
import '../entities/user.dart';
import '../repositories/user_repository.dart';

/// Use case: Get current user
class GetCurrentUserUseCase {
  final UserRepository _repository;

  const GetCurrentUserUseCase(this._repository);

  Future<Result<User?>> call() async {
    return await _repository.getCurrentUser();
  }
}

/// Use case: Update user profile
class UpdateUserProfileUseCase {
  final UserRepository _repository;

  const UpdateUserProfileUseCase(this._repository);

  Future<Result<User>> call(User user) async {
    return await _repository.updateUser(user);
  }
}

/// Use case: Update profile picture
class UpdateProfilePictureUseCase {
  final UserRepository _repository;

  const UpdateProfilePictureUseCase(this._repository);

  Future<Result<String>> call({
    required String userId,
    required String imagePath,
  }) async {
    return await _repository.updateProfilePicture(userId, imagePath);
  }
}
