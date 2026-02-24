import 'package:equatable/equatable.dart';

/// User entity representing a Biddt user
class User extends Equatable {
  final String id;
  final String phoneNumber;
  final String? displayName;
  final String? email;
  final String? photoUrl;
  final String? location;
  final double trustScore;
  final bool isVerified;
  final DateTime createdAt;
  final DateTime? lastActiveAt;
  final Map<String, dynamic> stats;

  const User({
    required this.id,
    required this.phoneNumber,
    this.displayName,
    this.email,
    this.photoUrl,
    this.location,
    this.trustScore = 0.0,
    this.isVerified = false,
    required this.createdAt,
    this.lastActiveAt,
    this.stats = const {},
  });

  User copyWith({
    String? id,
    String? phoneNumber,
    String? displayName,
    String? email,
    String? photoUrl,
    String? location,
    double? trustScore,
    bool? isVerified,
    DateTime? createdAt,
    DateTime? lastActiveAt,
    Map<String, dynamic>? stats,
  }) {
    return User(
      id: id ?? this.id,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      displayName: displayName ?? this.displayName,
      email: email ?? this.email,
      photoUrl: photoUrl ?? this.photoUrl,
      location: location ?? this.location,
      trustScore: trustScore ?? this.trustScore,
      isVerified: isVerified ?? this.isVerified,
      createdAt: createdAt ?? this.createdAt,
      lastActiveAt: lastActiveAt ?? this.lastActiveAt,
      stats: stats ?? this.stats,
    );
  }

  @override
  List<Object?> get props => [
        id,
        phoneNumber,
        displayName,
        email,
        photoUrl,
        location,
        trustScore,
        isVerified,
        createdAt,
        lastActiveAt,
        stats,
      ];
}
