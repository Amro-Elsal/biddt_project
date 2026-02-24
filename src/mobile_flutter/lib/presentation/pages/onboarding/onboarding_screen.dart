import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';

/// Onboarding Screen - First screen users see
/// Design from Stitch: onboarding_light_mode
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _currentPage = 0;
  final PageController _pageController = PageController();

  final List<OnboardingPage> _pages = const [
    OnboardingPage(
      title: 'Discover Local',
      highlight: 'Treasures',
      description:
          'Bid safely on premium items in your neighborhood. Verified sellers, secure payments, and hidden gems just around the corner.',
      imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ8WrIny9vl3cWOrd8pejzLgsaK5JpGaRUSG3k14v7FCiTlokdVCaE2H64e1WoGB4H0fsjg5s69eOlNSTPkoOpsmvE8ZonTuAAIfIFfVfzT0qgdRuQhETK0it2nimMY3hB5afNEqXsj2BpT6I-TNnnQNqCFA5VYmEC3GgAcR03vWNEc2yGbT2cLff8f6ARSmO1RFZ47cwh0uYHKF2TkaSMua-8KeGTr35ITZTrdFPetmkD6NSlFhRIRgQcruxlcamavRuaI8c-Yw',
    ),
    OnboardingPage(
      title: 'Win with',
      highlight: 'Confidence',
      description:
          'Real-time bidding, instant notifications, and a transparent auction system. Never miss out on the items you love.',
      imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ8WrIny9vl3cWOrd8pejzLgsaK5JpGaRUSG3k14v7FCiTlokdVCaE2H64e1WoGB4H0fsjg5s69eOlNSTPkoOpsmvE8ZonTuAAIfIFfVfzT0qgdRuQhETK0it2nimMY3hB5afNEqXsj2BpT6I-TNnnQNqCFA5VYmEC3GgAcR03vWNEc2yGbT2cLff8f6ARSmO1RFZ47cwh0uYHKF2TkaSMua-8KeGTr35ITZTrdFPetmkD6NSlFhRIRgQcruxlcamavRuaI8c-Yw',
    ),
    OnboardingPage(
      title: 'Exchange',
      highlight: 'Safely',
      description:
          'Meet at verified safe zones, scan QR codes to confirm, and complete transactions with peace of mind.',
      imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ8WrIny9vl3cWOrd8pejzLgsaK5JpGaRUSG3k14v7FCiTlokdVCaE2H64e1WoGB4H0fsjg5s69eOlNSTPkoOpsmvE8ZonTuAAIfIFfVfzT0qgdRuQhETK0it2nimMY3hB5afNEqXsj2BpT6I-TNnnQNqCFA5VYmEC3GgAcR03vWNEc2yGbT2cLff8f6ARSmO1RFZ47cwh0uYHKF2TkaSMua-8KeGTr35ITZTrdFPetmkD6NSlFhRIRgQcruxlcamavRuaI8c-Yw',
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onNext() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: AppTheme.durationNormal,
        curve: AppTheme.curveEaseOut,
      );
    } else {
      // Navigate to phone auth
      // context.go('/phone-auth');
    }
  }

  void _onSkip() {
    // Navigate to phone auth
    // context.go('/phone-auth');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor =
        isDark ? AppColors.backgroundDark : const Color(0xFFF8F8F5);
    final textColor = isDark ? AppColors.textPrimaryDark : const Color(0xFF181710);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.centerRight,
              child: Padding(
                padding: const EdgeInsets.only(top: 12, right: 16),
                child: TextButton.icon(
                  onPressed: _onSkip,
                  icon: Text(
                    'Skip',
                    style: TextStyle(
                      color: isDark
                          ? AppColors.textSecondaryDark
                          : const Color(0xFF64748B),
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  label: Icon(
                    Icons.arrow_forward,
                    size: 16,
                    color: isDark
                        ? AppColors.textSecondaryDark
                        : const Color(0xFF64748B),
                  ),
                ),
              ),
            ),

            // Page content
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) => setState(() => _currentPage = index),
                itemCount: _pages.length,
                itemBuilder: (context, index) => _buildPage(_pages[index], isDark),
              ),
            ),

            // Bottom section
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
              child: Column(
                children: [
                  // Pagination dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      _pages.length,
                      (index) => AnimatedContainer(
                        duration: AppTheme.durationFast,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        width: _currentPage == index ? 32 : 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: _currentPage == index
                              ? AppColors.gold
                              : isDark
                                  ? AppColors.surfaceVariantDark
                                  : const Color(0xFFE7E5DA),
                          borderRadius: BorderRadius.circular(5),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Next button
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _onNext,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.gold,
                        foregroundColor: const Color(0xFF181710),
                        elevation: 4,
                        shadowColor: AppColors.gold.withOpacity(0.3),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        _currentPage == _pages.length - 1
                            ? 'Get Started'
                            : 'Next',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  )
                      .animate()
                      .scale(
                        duration: AppTheme.durationNormal,
                        curve: AppTheme.curveBounce,
                      ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPage(OnboardingPage page, bool isDark) {
    final textColor = isDark ? AppColors.textPrimaryDark : const Color(0xFF181710);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Illustration with glow effect
          Container(
            width: double.infinity,
            height: 320,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  AppColors.gold.withOpacity(0.2),
                  Colors.transparent,
                ],
                radius: 0.8,
              ),
            ),
            child: Center(
              child: Container(
                width: 280,
                height: 280,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  image: DecorationImage(
                    image: NetworkImage(page.imageUrl),
                    fit: BoxFit.contain,
                  ),
                ),
              )
                  .animate()
                  .fadeIn(duration: AppTheme.durationSlow)
                  .slideY(begin: 0.2, end: 0),
            ),
          ),

          const SizedBox(height: 48),

          // Title
          RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w800,
                color: textColor,
                height: 1.2,
              ),
              children: [
                TextSpan(text: '${page.title} '),
                TextSpan(
                  text: page.highlight,
                  style: const TextStyle(
                    color: AppColors.gold,
                  ),
                ),
              ],
            ),
          )
              .animate()
              .fadeIn(delay: 200.ms)
              .slideY(begin: 0.2, end: 0),

          const SizedBox(height: 16),

          // Description
          Text(
            page.description,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: isDark
                  ? AppColors.textSecondaryDark
                  : const Color(0xFF64748B),
              height: 1.5,
            ),
          )
              .animate()
              .fadeIn(delay: 300.ms)
              .slideY(begin: 0.2, end: 0),
        ],
      ),
    );
  }
}

class OnboardingPage {
  final String title;
  final String highlight;
  final String description;
  final String imageUrl;

  const OnboardingPage({
    required this.title,
    required this.highlight,
    required this.description,
    required this.imageUrl,
  });
}
