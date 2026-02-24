import 'package:equatable/equatable.dart';

/// Listing entity representing an item for sale/auction
class Listing extends Equatable {
  final String id;
  final String sellerId;
  final String title;
  final String description;
  final List<String> images;
  final String category;
  final String condition;
  final double startingPrice;
  final double? currentPrice;
  final double? buyNowPrice;
  final DateTime createdAt;
  final DateTime endsAt;
  final ListingStatus status;
  final String? location;
  final Map<String, dynamic>? metadata;

  const Listing({
    required this.id,
    required this.sellerId,
    required this.title,
    required this.description,
    required this.images,
    required this.category,
    required this.condition,
    required this.startingPrice,
    this.currentPrice,
    this.buyNowPrice,
    required this.createdAt,
    required this.endsAt,
    this.status = ListingStatus.active,
    this.location,
    this.metadata,
  });

  bool get isActive => status == ListingStatus.active;
  bool get isEnded => status == ListingStatus.ended || DateTime.now().isAfter(endsAt);
  bool get hasBids => currentPrice != null && currentPrice! > startingPrice;

  Duration get timeRemaining => endsAt.difference(DateTime.now());

  Listing copyWith({
    String? id,
    String? sellerId,
    String? title,
    String? description,
    List<String>? images,
    String? category,
    String? condition,
    double? startingPrice,
    double? currentPrice,
    double? buyNowPrice,
    DateTime? createdAt,
    DateTime? endsAt,
    ListingStatus? status,
    String? location,
    Map<String, dynamic>? metadata,
  }) {
    return Listing(
      id: id ?? this.id,
      sellerId: sellerId ?? this.sellerId,
      title: title ?? this.title,
      description: description ?? this.description,
      images: images ?? this.images,
      category: category ?? this.category,
      condition: condition ?? this.condition,
      startingPrice: startingPrice ?? this.startingPrice,
      currentPrice: currentPrice ?? this.currentPrice,
      buyNowPrice: buyNowPrice ?? this.buyNowPrice,
      createdAt: createdAt ?? this.createdAt,
      endsAt: endsAt ?? this.endsAt,
      status: status ?? this.status,
      location: location ?? this.location,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  List<Object?> get props => [
        id,
        sellerId,
        title,
        description,
        images,
        category,
        condition,
        startingPrice,
        currentPrice,
        buyNowPrice,
        createdAt,
        endsAt,
        status,
        location,
        metadata,
      ];
}

enum ListingStatus {
  active,
  ended,
  cancelled,
  sold,
}
