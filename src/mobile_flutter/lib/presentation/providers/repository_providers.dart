import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/repositories/firebase_bid_repository.dart';
import '../../../data/repositories/firebase_chat_repository.dart';
import '../../../data/repositories/firebase_listing_repository.dart';
import '../../../data/repositories/firebase_user_repository.dart';
import '../../../data/repositories/firebase_wallet_repository.dart';
import '../../../domain/repositories/bid_repository.dart';
import '../../../domain/repositories/chat_repository.dart';
import '../../../domain/repositories/listing_repository.dart';
import '../../../domain/repositories/user_repository.dart';
import '../../../domain/repositories/wallet_repository.dart';

// Repository Providers
final userRepositoryProvider = Provider<UserRepository>((ref) {
  return FirebaseUserRepository();
});

final listingRepositoryProvider = Provider<ListingRepository>((ref) {
  return FirebaseListingRepository();
});

final bidRepositoryProvider = Provider<BidRepository>((ref) {
  return FirebaseBidRepository();
});

final walletRepositoryProvider = Provider<WalletRepository>((ref) {
  return FirebaseWalletRepository();
});

final chatRepositoryProvider = Provider<ChatRepository>((ref) {
  return FirebaseChatRepository();
});
