import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'presentation/pages/onboarding/onboarding_screen.dart';
import 'presentation/pages/auth/phone_auth_screen.dart';
import 'presentation/pages/home/home_screen.dart';
import 'presentation/pages/product/product_detail_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Set preferred orientations
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      statusBarBrightness: Brightness.dark,
    ),
  );

  runApp(
    const ProviderScope(
      child: BiddtApp(),
    ),
  );
}

/// Main app widget with theme support
class BiddtApp extends StatelessWidget {
  const BiddtApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Biddt',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const MainNavigationScreen(),
    );
  }
}

/// Temporary navigation screen to demo all screens
class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    OnboardingScreen(),
    PhoneAuthScreen(),
    HomeScreen(),
    ProductDetailScreen(),
  ];

  final List<String> _titles = [
    'Onboarding',
    'Phone Auth',
    'Home',
    'Product Detail',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        destinations: [
          NavigationDestination(
            icon: const Icon(Icons.waving_hand_outlined),
            label: _titles[0],
          ),
          NavigationDestination(
            icon: const Icon(Icons.phone_outlined),
            label: _titles[1],
          ),
          NavigationDestination(
            icon: const Icon(Icons.home_outlined),
            label: _titles[2],
          ),
          NavigationDestination(
            icon: const Icon(Icons.shopping_bag_outlined),
            label: _titles[3],
          ),
        ],
      ),
    );
  }
}
