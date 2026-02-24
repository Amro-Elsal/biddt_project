// lib/core/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/app_colors.dart';
import '../constants/app_typography.dart';

class AppTheme {
  AppTheme._();
  
  // Border Radius
  static const double radiusXs = 4;
  static const double radiusSm = 8;
  static const double radiusMd = 12;
  static const double radiusLg = 16;
  static const double radiusXl = 24;
  static const double radius2xl = 32;
  static const double radiusFull = 9999;
  
  // Spacing
  static const double spaceXs = 4;
  static const double spaceSm = 8;
  static const double spaceMd = 16;
  static const double spaceLg = 24;
  static const double spaceXl = 32;
  static const double space2xl = 48;
  static const double space3xl = 64;
  
  // Elevation
  static const double elevationNone = 0;
  static const double elevationXs = 1;
  static const double elevationSm = 2;
  static const double elevationMd = 4;
  static const double elevationLg = 8;
  static const double elevationXl = 16;
  
  // Animation Durations
  static const Duration durationFast = Duration(milliseconds: 150);
  static const Duration durationNormal = Duration(milliseconds: 300);
  static const Duration durationSlow = Duration(milliseconds: 500);
  static const Duration durationSlower = Duration(milliseconds: 700);
  
  // Animation Curves
  static const Curve curveEaseOut = Curves.easeOutCubic;
  static const Curve curveEaseIn = Curves.easeInCubic;
  static const Curve curveEaseInOut = Curves.easeInOutCubic;
  static const Curve curveBounce = Curves.elasticOut;
  static const Curve curveSpring = Curves.fastOutSlowIn;
  
  // Light Theme
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        onPrimary: Colors.white,
        primaryContainer: AppColors.primaryLight,
        onPrimaryContainer: Colors.white,
        secondary: AppColors.secondary,
        onSecondary: Colors.white,
        surface: AppColors.surfaceLight,
        onSurface: AppColors.textPrimaryLight,
        surfaceVariant: AppColors.surfaceVariantLight,
        onSurfaceVariant: AppColors.textSecondaryLight,
        background: AppColors.backgroundLight,
        onBackground: AppColors.textPrimaryLight,
        error: AppColors.error,
        onError: Colors.white,
        outline: AppColors.surfaceVariantLight,
      ),
      scaffoldBackgroundColor: AppColors.backgroundLight,
      textTheme: _buildTextTheme(Brightness.light),
      appBarTheme: _buildAppBarTheme(Brightness.light),
      cardTheme: _buildCardTheme(Brightness.light),
      buttonTheme: _buildButtonTheme(Brightness.light),
      elevatedButtonTheme: _buildElevatedButtonTheme(Brightness.light),
      outlinedButtonTheme: _buildOutlinedButtonTheme(Brightness.light),
      textButtonTheme: _buildTextButtonTheme(Brightness.light),
      inputDecorationTheme: _buildInputDecorationTheme(Brightness.light),
      bottomNavigationBarTheme: _buildBottomNavTheme(Brightness.light),
      chipTheme: _buildChipTheme(Brightness.light),
      dividerTheme: _buildDividerTheme(Brightness.light),
      snackBarTheme: _buildSnackBarTheme(Brightness.light),
      dialogTheme: _buildDialogTheme(Brightness.light),
      bottomSheetTheme: _buildBottomSheetTheme(Brightness.light),
      pageTransitionsTheme: _buildPageTransitionsTheme(),
    );
  }
  
  // Dark Theme
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        onPrimary: Colors.white,
        primaryContainer: AppColors.primaryDark,
        onPrimaryContainer: Colors.white,
        secondary: AppColors.secondary,
        onSecondary: Colors.white,
        surface: AppColors.surfaceDark,
        onSurface: AppColors.textPrimaryDark,
        surfaceVariant: AppColors.surfaceVariantDark,
        onSurfaceVariant: AppColors.textSecondaryDark,
        background: AppColors.backgroundDark,
        onBackground: AppColors.textPrimaryDark,
        error: AppColors.error,
        onError: Colors.white,
        outline: AppColors.surfaceVariantDark,
      ),
      scaffoldBackgroundColor: AppColors.backgroundDark,
      textTheme: _buildTextTheme(Brightness.dark),
      appBarTheme: _buildAppBarTheme(Brightness.dark),
      cardTheme: _buildCardTheme(Brightness.dark),
      buttonTheme: _buildButtonTheme(Brightness.dark),
      elevatedButtonTheme: _buildElevatedButtonTheme(Brightness.dark),
      outlinedButtonTheme: _buildOutlinedButtonTheme(Brightness.dark),
      textButtonTheme: _buildTextButtonTheme(Brightness.dark),
      inputDecorationTheme: _buildInputDecorationTheme(Brightness.dark),
      bottomNavigationBarTheme: _buildBottomNavTheme(Brightness.dark),
      chipTheme: _buildChipTheme(Brightness.dark),
      dividerTheme: _buildDividerTheme(Brightness.dark),
      snackBarTheme: _buildSnackBarTheme(Brightness.dark),
      dialogTheme: _buildDialogTheme(Brightness.dark),
      bottomSheetTheme: _buildBottomSheetTheme(Brightness.dark),
      pageTransitionsTheme: _buildPageTransitionsTheme(),
    );
  }
  
  // Text Theme
  static TextTheme _buildTextTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final color = isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight;
    final secondaryColor = isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight;
    
    return TextTheme(
      displayLarge: AppTypography.displayLarge.copyWith(color: color),
      displayMedium: AppTypography.displayMedium.copyWith(color: color),
      displaySmall: AppTypography.displaySmall.copyWith(color: color),
      headlineLarge: AppTypography.headlineLarge.copyWith(color: color),
      headlineMedium: AppTypography.headlineMedium.copyWith(color: color),
      headlineSmall: AppTypography.headlineSmall.copyWith(color: color),
      titleLarge: AppTypography.titleLarge.copyWith(color: color),
      titleMedium: AppTypography.titleMedium.copyWith(color: color),
      titleSmall: AppTypography.titleSmall.copyWith(color: color),
      bodyLarge: AppTypography.bodyLarge.copyWith(color: color),
      bodyMedium: AppTypography.bodyMedium.copyWith(color: color),
      bodySmall: AppTypography.bodySmall.copyWith(color: secondaryColor),
      labelLarge: AppTypography.labelLarge.copyWith(color: color),
      labelMedium: AppTypography.labelMedium.copyWith(color: secondaryColor),
      labelSmall: AppTypography.labelSmall.copyWith(color: secondaryColor),
    );
  }
  
  // App Bar Theme
  static AppBarTheme _buildAppBarTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return AppBarTheme(
      elevation: 0,
      centerTitle: true,
      backgroundColor: isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      foregroundColor: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      systemOverlayStyle: isDark 
        ? SystemUiOverlayStyle.light 
        : SystemUiOverlayStyle.dark,
      titleTextStyle: AppTypography.headlineSmall.copyWith(
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      ),
    );
  }
  
  // Card Theme
  static CardTheme _buildCardTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return CardTheme(
      elevation: elevationSm,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusLg),
      ),
      color: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
    );
  }
  
  // Button Themes
  static ButtonThemeData _buildButtonTheme(Brightness brightness) {
    return const ButtonThemeData(
      height: 48,
      minWidth: 120,
      padding: EdgeInsets.symmetric(horizontal: spaceMd),
    );
  }
  
  static ElevatedButtonThemeData _buildElevatedButtonTheme(Brightness brightness) {
    return ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        elevation: elevationSm,
        padding: const EdgeInsets.symmetric(horizontal: spaceLg, vertical: spaceMd),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusMd),
        ),
        textStyle: AppTypography.button,
      ),
    );
  }
  
  static OutlinedButtonThemeData _buildOutlinedButtonTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: spaceLg, vertical: spaceMd),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusMd),
        ),
        side: BorderSide(
          color: isDark ? AppColors.surfaceVariantDark : AppColors.surfaceVariantLight,
        ),
        textStyle: AppTypography.button,
      ),
    );
  }
  
  static TextButtonThemeData _buildTextButtonTheme(Brightness brightness) {
    return TextButtonThemeData(
      style: TextButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: spaceMd, vertical: spaceSm),
        textStyle: AppTypography.labelLarge,
      ),
    );
  }
  
  // Input Decoration Theme
  static InputDecorationTheme _buildInputDecorationTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final borderColor = isDark ? AppColors.surfaceVariantDark : AppColors.surfaceVariantLight;
    
    return InputDecorationTheme(
      filled: true,
      fillColor: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
      contentPadding: const EdgeInsets.symmetric(horizontal: spaceMd, vertical: spaceMd),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide(color: borderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide(color: borderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: const BorderSide(color: AppColors.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: const BorderSide(color: AppColors.error),
      ),
      labelStyle: AppTypography.bodyMedium,
      hintStyle: AppTypography.bodyMedium.copyWith(
        color: isDark ? AppColors.textTertiaryDark : AppColors.textTertiaryLight,
      ),
    );
  }
  
  // Bottom Navigation Theme
  static BottomNavigationBarThemeData _buildBottomNavTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return BottomNavigationBarThemeData(
      backgroundColor: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: isDark ? AppColors.textTertiaryDark : AppColors.textTertiaryLight,
      type: BottomNavigationBarType.fixed,
      elevation: elevationLg,
      showSelectedLabels: true,
      showUnselectedLabels: true,
    );
  }
  
  // Chip Theme
  static ChipThemeData _buildChipTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return ChipThemeData(
      backgroundColor: isDark ? AppColors.surfaceVariantDark : AppColors.surfaceVariantLight,
      selectedColor: AppColors.primary,
      labelStyle: AppTypography.labelMedium,
      padding: const EdgeInsets.symmetric(horizontal: spaceSm, vertical: spaceXs),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusFull),
      ),
    );
  }
  
  // Divider Theme
  static DividerThemeData _buildDividerTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return DividerThemeData(
      color: isDark ? AppColors.surfaceVariantDark : AppColors.surfaceVariantLight,
      thickness: 1,
      space: spaceMd,
    );
  }
  
  // SnackBar Theme
  static SnackBarThemeData _buildSnackBarTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return SnackBarThemeData(
      backgroundColor: isDark ? AppColors.surfaceVariantDark : AppColors.textPrimaryLight,
      contentTextStyle: AppTypography.bodyMedium.copyWith(
        color: isDark ? AppColors.textPrimaryDark : Colors.white,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusMd),
      ),
      behavior: SnackBarBehavior.floating,
    );
  }
  
  // Dialog Theme
  static DialogTheme _buildDialogTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return DialogTheme(
      backgroundColor: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusLg),
      ),
      titleTextStyle: AppTypography.headlineSmall,
      contentTextStyle: AppTypography.bodyMedium,
    );
  }
  
  // Bottom Sheet Theme
  static BottomSheetThemeData _buildBottomSheetTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return BottomSheetThemeData(
      backgroundColor: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(radiusLg)),
      ),
    );
  }
  
  // Page Transitions
  static PageTransitionsTheme _buildPageTransitionsTheme() {
    return const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: CupertinoPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      },
    );
  }
}
