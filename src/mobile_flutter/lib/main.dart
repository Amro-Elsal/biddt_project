import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'presentation/pages/onboarding/onboarding_screen.dart';

void main() {
  runApp(const BiddtApp());
}

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
      home: const OnboardingScreen(),
    );
  }
}
