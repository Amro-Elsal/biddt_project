import 'package:equatable/equatable.dart';

/// Bid entity representing a bid on a listing
class Bid extends Equatable {
  final String id;
  final String listingId;
  final String bidderId;
  final double amount;
  final DateTime placedAt;
  final bool isAutoBid;
  final double? autoBidMax;

  const Bid({
    required this.id,
    required this.listingId,
    required this.bidderId,
    required this.amount,
    required this.placedAt,
    this.isAutoBid = false,
    this.autoBidMax,
  });

  Bid copyWith({
    String? id,
    String? listingId,
    String? bidderId,
    double? amount,
    DateTime? placedAt,
    bool? isAutoBid,
    double? autoBidMax,
  }) {
    return Bid(
      id: id ?? this.id,
      listingId: listingId ?? this.listingId,
      bidderId: bidderId ?? this.bidderId,
      amount: amount ?? this.amount,
      placedAt: placedAt ?? this.placedAt,
      isAutoBid: isAutoBid ?? this.isAutoBid,
      autoBidMax: autoBidMax ?? this.autoBidMax,
    );
  }

  @override
  List<Object?> get props => [
        id,
        listingId,
        bidderId,
        amount,
        placedAt,
        isAutoBid,
        autoBidMax,
      ];
}
