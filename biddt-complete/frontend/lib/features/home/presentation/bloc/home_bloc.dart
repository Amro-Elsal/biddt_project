import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:equatable/equatable.dart';

part 'home_event.dart';
part 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  HomeBloc() : super(HomeInitial()) {
    on<LoadHomeData>(_onLoadHomeData);
    on<RefreshHomeData>(_onRefreshHomeData);
    on<SelectCategory>(_onSelectCategory);
  }

  void _onLoadHomeData(LoadHomeData event, Emitter<HomeState> emit) async {
    emit(HomeLoading());
    
    try {
      // Get live auctions
      final liveAuctions = await _firestore
          .collection('listings')
          .where('status', isEqualTo: 'active')
          .where('endTime', isGreaterThan: Timestamp.now())
          .orderBy('endTime')
          .limit(10)
          .get();

      // Get trending listings
      final trendingListings = await _firestore
          .collection('listings')
          .where('status', isEqualTo: 'active')
          .orderBy('bidCount', descending: true)
          .limit(10)
          .get();

      emit(HomeLoaded(
        liveAuctions: liveAuctions.docs,
        trendingListings: trendingListings.docs,
        selectedCategory: 'All',
      ));
    } catch (e) {
      emit(HomeError(e.toString()));
    }
  }

  void _onRefreshHomeData(RefreshHomeData event, Emitter<HomeState> emit) async {
    final currentState = state;
    if (currentState is HomeLoaded) {
      emit(currentState.copyWith(isRefreshing: true));
    }
    
    add(LoadHomeData());
  }

  void _onSelectCategory(SelectCategory event, Emitter<HomeState> emit) async {
    final currentState = state;
    if (currentState is HomeLoaded) {
      emit(currentState.copyWith(selectedCategory: event.category));
      
      // Filter listings by category
      try {
        Query query = _firestore
            .collection('listings')
            .where('status', isEqualTo: 'active');
        
        if (event.category != 'All') {
          query = query.where('category', isEqualTo: event.category);
        }
        
        final filteredListings = await query.limit(20).get();
        
        emit(currentState.copyWith(
          selectedCategory: event.category,
          filteredListings: filteredListings.docs,
        ));
      } catch (e) {
        emit(HomeError(e.toString()));
      }
    }
  }
}
