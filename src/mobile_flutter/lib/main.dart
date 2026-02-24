import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'presentation/pages/onboarding/onboarding_screen.dart';
import 'presentation/pages/auth/phone_auth_screen.dart';
import 'presentation/pages/home/home_screen.dart';
import 'presentation/pages/product/product_detail_screen.dart';
import 'presentation/pages/profile/profile_screen.dart';
import 'presentation/pages/listing/create_listing_screen.dart';
import 'presentation/pages/chat/chat_screen.dart';
import 'presentation/pages/wallet/wallet_screen.dart';
import 'presentation/pages/bidding/winning_reveal_screen.dart';
import 'presentation/pages/seller/seller_dashboard_screen.dart';

// Theme mode provider
final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Set preferred orientations
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(
    const ProviderScope(
      child: BiddtApp(),
    ),
  );
}

/// Main app widget with theme support
class BiddtApp extends ConsumerWidget {
  const BiddtApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    // Update system UI based on theme
    final isDark = themeMode == ThemeMode.dark ||
        (themeMode == ThemeMode.system &&
            MediaQuery.platformBrightnessOf(context) == Brightness.dark);

    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
        statusBarBrightness: isDark ? Brightness.dark : Brightness.light,
        systemNavigationBarColor: isDark ? const Color(0xFF0A0E27) : Colors.white,
        systemNavigationBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
      ),
    );

    return MaterialApp(
      title: 'Biddt',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      home: const MainNavigationScreen(),
    );
  }
}

/// Navigation screen to demo all screens
class MainNavigationScreen extends ConsumerStatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  ConsumerState<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends ConsumerState<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    OnboardingScreen(),
    PhoneAuthScreen(),
    HomeScreen(),
    ProductDetailScreen(),
    ProfileScreen(),
    CreateListingScreen(),
    ChatScreen(),
    WalletScreen(),
    WinningRevealScreen(),
    SellerDashboardScreen(),
  ];

  final List<String> _titles = [
    'Onboarding',
    'Phone Auth',
    'Home',
    'Product Detail',
    'Profile',
    'Create Listing',
    'Chat',
    'Wallet',
    'Winning Reveal',
    'Seller Dashboard',
  ];

  void _toggleTheme() {
    final currentMode = ref.read(themeModeProvider);
    ThemeMode newMode;
    switch (currentMode) {
      case ThemeMode.light:
        newMode = ThemeMode.dark;
        break;
      case ThemeMode.dark:
        newMode = ThemeMode.system;
        break;
      case ThemeMode.system:
        newMode = ThemeMode.light;
        break;
    }
    ref.read(themeModeProvider.notifier).state = newMode;
  }

  String _getThemeLabel(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return '☀️ Light';
      case ThemeMode.dark:
        return '🌙 Dark';
      case ThemeMode.system:
        return '📱 System';
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeMode = ref.watch(themeModeProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_currentIndex]),
        backgroundColor: isDark ? const Color(0xFF0A0E27) : const Color(0xFFF8F8F5),
        foregroundColor: isDark ? Colors.white : const Color(0xFF181710),
        elevation: 0,
        actions: [
          TextButton.icon(
            onPressed: _toggleTheme,
            icon: Icon(
              themeMode == ThemeMode.dark ? Icons.dark_mode : Icons.light_mode,
              color: isDark ? Colors.white : const Color(0xFF181710),
            ),
            label: Text(
              _getThemeLabel(themeMode),
              style: TextStyle(
                color: isDark ? Colors.white : const Color(0xFF181710),
              ),
            ),
          ),
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              child: Row(
                children: List.generate(
                  _titles.length,
                  (index) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: ChoiceChip(
                      label: Text(_titles[index]),
                      selected: _currentIndex == index,
                      onSelected: (_) => setState(() => _currentIndex = index),
                      selectedColor: AppColors.gold,
                      backgroundColor: isDark
                          ? const Color(0xFF334155)
                          : const Color(0xFFF8F8F5),
                      labelStyle: TextStyle(
                        color: _currentIndex == index
                            ? const Color(0xFF181710)
                            : isDark
                                ? Colors.white
                                : const Color(0xFF64748B),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
        ),
      ),
    ),
    );
  }
}
