import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../features/auth/presentation/pages/splash_screen.dart';
import '../features/auth/presentation/pages/onboarding_screen.dart';
import '../features/auth/presentation/pages/auth_options_screen.dart';
import '../features/auth/presentation/pages/phone_input_screen.dart';
import '../features/auth/presentation/pages/phone_verify_screen.dart';
import '../features/auth/presentation/pages/identity_verify_screen.dart';
import '../features/home/presentation/pages/home_screen.dart';
import '../features/home/presentation/pages/search_screen.dart';
import '../features/home/presentation/pages/notifications_screen.dart';
import '../features/product/presentation/pages/product_detail_screen.dart';
import '../features/product/presentation/pages/place_bid_screen.dart';
import '../features/product/presentation/pages/winning_reveal_screen.dart';
import '../features/wallet/presentation/pages/wallet_screen.dart';
import '../features/wallet/presentation/pages/add_funds_screen.dart';
import '../features/wallet/presentation/pages/transaction_history_screen.dart';
import '../features/selling/presentation/pages/seller_dashboard_screen.dart';
import '../features/selling/presentation/pages/create_listing_screen.dart';
import '../features/selling/presentation/pages/my_listings_screen.dart';
import '../features/profile/presentation/pages/profile_screen.dart';
import '../features/profile/presentation/pages/edit_profile_screen.dart';
import '../features/messaging/presentation/pages/chat_list_screen.dart';
import '../features/messaging/presentation/pages/chat_detail_screen.dart';
import '../features/exchange/presentation/pages/safe_exchange_screen.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static GoRouter get router {
    return GoRouter(
      navigatorKey: _rootNavigatorKey,
      initialLocation: '/',
      redirect: (context, state) {
        final user = FirebaseAuth.instance.currentUser;
        final isAuthRoute = state.matchedLocation == '/' ||
            state.matchedLocation == '/onboarding' ||
            state.matchedLocation == '/auth' ||
            state.matchedLocation == '/phone' ||
            state.matchedLocation == '/verify';

        if (user == null && !isAuthRoute) {
          return '/';
        }
        if (user != null && isAuthRoute) {
          return '/home';
        }
        return null;
      },
      routes: [
        // Splash & Onboarding
        GoRoute(
          path: '/',
          builder: (context, state) => const SplashScreen(),
        ),
        GoRoute(
          path: '/onboarding',
          builder: (context, state) => const OnboardingScreen(),
        ),
        GoRoute(
          path: '/auth',
          builder: (context, state) => const AuthOptionsScreen(),
        ),
        GoRoute(
          path: '/phone',
          builder: (context, state) => const PhoneInputScreen(),
        ),
        GoRoute(
          path: '/verify',
          builder: (context, state) => const PhoneVerifyScreen(),
        ),
        GoRoute(
          path: '/identity',
          builder: (context, state) => const IdentityVerifyScreen(),
        ),

        // Main App Shell
        ShellRoute(
          navigatorKey: _shellNavigatorKey,
          builder: (context, state, child) {
            return ScaffoldWithBottomNav(child: child);
          },
          routes: [
            GoRoute(
              path: '/home',
              builder: (context, state) => const HomeScreen(),
            ),
            GoRoute(
              path: '/search',
              builder: (context, state) => const SearchScreen(),
            ),
            GoRoute(
              path: '/messages',
              builder: (context, state) => const ChatListScreen(),
            ),
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfileScreen(),
            ),
          ],
        ),

        // Product Routes
        GoRoute(
          path: '/product/:id',
          builder: (context, state) => ProductDetailScreen(
            listingId: state.pathParameters['id']!,
          ),
        ),
        GoRoute(
          path: '/product/:id/bid',
          builder: (context, state) => PlaceBidScreen(
            listingId: state.pathParameters['id']!,
          ),
        ),
        GoRoute(
          path: '/win',
          builder: (context, state) => const WinningRevealScreen(),
        ),

        // Wallet Routes
        GoRoute(
          path: '/wallet',
          builder: (context, state) => const WalletScreen(),
        ),
        GoRoute(
          path: '/wallet/add',
          builder: (context, state) => const AddFundsScreen(),
        ),
        GoRoute(
          path: '/wallet/transactions',
          builder: (context, state) => const TransactionHistoryScreen(),
        ),

        // Selling Routes
        GoRoute(
          path: '/seller/dashboard',
          builder: (context, state) => const SellerDashboardScreen(),
        ),
        GoRoute(
          path: '/seller/create',
          builder: (context, state) => const CreateListingScreen(),
        ),
        GoRoute(
          path: '/seller/listings',
          builder: (context, state) => const MyListingsScreen(),
        ),

        // Profile Routes
        GoRoute(
          path: '/profile/edit',
          builder: (context, state) => const EditProfileScreen(),
        ),

        // Messaging Routes
        GoRoute(
          path: '/chat/:id',
          builder: (context, state) => ChatDetailScreen(
            conversationId: state.pathParameters['id']!,
          ),
        ),

        // Notifications
        GoRoute(
          path: '/notifications',
          builder: (context, state) => const NotificationsScreen(),
        ),

        // Safe Exchange
        GoRoute(
          path: '/exchange/:id',
          builder: (context, state) => SafeExchangeScreen(
            exchangeId: state.pathParameters['id']!,
          ),
        ),
      ],
    );
  }
}

class ScaffoldWithBottomNav extends StatefulWidget {
  final Widget child;
  const ScaffoldWithBottomNav({super.key, required this.child});

  @override
  State<ScaffoldWithBottomNav> createState() => _ScaffoldWithBottomNavState();
}

class _ScaffoldWithBottomNavState extends State<ScaffoldWithBottomNav> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    
    if (location.startsWith('/home')) _currentIndex = 0;
    else if (location.startsWith('/search')) _currentIndex = 1;
    else if (location.startsWith('/messages')) _currentIndex = 3;
    else if (location.startsWith('/profile')) _currentIndex = 4;

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF0A0A0F).withOpacity(0.95),
          border: Border(
            top: BorderSide(
              color: Colors.white.withOpacity(0.05),
            ),
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(Icons.home_rounded, 'Home', 0, '/home'),
                _buildNavItem(Icons.search_rounded, 'Search', 1, '/search'),
                _buildSellFab(),
                _buildNavItem(Icons.chat_bubble_outline_rounded, 'Inbox', 3, '/messages'),
                _buildNavItem(Icons.person_outline_rounded, 'Profile', 4, '/profile'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index, String route) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () {
        context.go(route);
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: isSelected ? const Color(0xFFFFD700) : const Color(0xFF6B7280),
            size: 24,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: isSelected ? const Color(0xFFFFD700) : const Color(0xFF6B7280),
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSellFab() {
    return GestureDetector(
      onTap: () {
        context.push('/seller/create');
      },
      child: Container(
        width: 56,
        height: 56,
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: const Color(0xFFFFD700),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFFFD700).withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        transform: Matrix4.rotationZ(0.785398), // 45 degrees
        child: const Center(
          child: Icon(
            Icons.add,
            color: Color(0xFF1A1A2E),
            size: 28,
          ),
        ),
      ),
    );
  }
}
