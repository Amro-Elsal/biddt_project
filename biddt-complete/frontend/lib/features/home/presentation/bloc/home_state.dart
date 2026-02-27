part of 'home_bloc.dart';

abstract class HomeState extends Equatable {
  const HomeState();

  @override
  List<Object> get props => [];
}

class HomeInitial extends HomeState {}

class HomeLoading extends HomeState {}

class HomeLoaded extends HomeState {
  final List<QueryDocumentSnapshot> liveAuctions;
  final List<QueryDocumentSnapshot> trendingListings;
  final List<QueryDocumentSnapshot>? filteredListings;
  final String selectedCategory;
  final bool isRefreshing;

  const HomeLoaded({
    required this.liveAuctions,
    required this.trendingListings,
    this.filteredListings,
    required this.selectedCategory,
    this.isRefreshing = false,
  });

  HomeLoaded copyWith({
    List<QueryDocumentSnapshot>? liveAuctions,
    List<QueryDocumentSnapshot>? trendingListings,
    List<QueryDocumentSnapshot>? filteredListings,
    String? selectedCategory,
    bool? isRefreshing,
  }) {
    return HomeLoaded(
      liveAuctions: liveAuctions ?? this.liveAuctions,
      trendingListings: trendingListings ?? this.trendingListings,
      filteredListings: filteredListings ?? this.filteredListings,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      isRefreshing: isRefreshing ?? this.isRefreshing,
    );
  }

  @override
  List<Object> get props => [
        liveAuctions,
        trendingListings,
        filteredListings ?? [],
        selectedCategory,
        isRefreshing,
      ];
}

class HomeError extends HomeState {
  final String message;
  const HomeError(this.message);

  @override
  List<Object> get props => [message];
}
