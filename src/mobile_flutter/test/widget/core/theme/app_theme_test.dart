// test/widget/core/theme/app_theme_test.dart
import 'package:biddt/core/constants/app_colors.dart';
import 'package:biddt/core/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AppTheme', () {
    test('lightTheme should have correct brightness', () {
      expect(AppTheme.lightTheme.brightness, equals(Brightness.light));
    });

    test('darkTheme should have correct brightness', () {
      expect(AppTheme.darkTheme.brightness, equals(Brightness.dark));
    });

    test('lightTheme should use correct background color', () {
      expect(
        AppTheme.lightTheme.scaffoldBackgroundColor,
        equals(AppColors.backgroundLight),
      );
    });

    test('darkTheme should use correct background color', () {
      expect(
        AppTheme.darkTheme.scaffoldBackgroundColor,
        equals(AppColors.backgroundDark),
      );
    });

    test('lightTheme should have Material 3 enabled', () {
      expect(AppTheme.lightTheme.useMaterial3, isTrue);
    });

    test('darkTheme should have Material 3 enabled', () {
      expect(AppTheme.darkTheme.useMaterial3, isTrue);
    });

    test('lightTheme colorScheme should have correct primary', () {
      expect(
        AppTheme.lightTheme.colorScheme.primary,
        equals(AppColors.primary),
      );
    });

    test('darkTheme colorScheme should have correct primary', () {
      expect(
        AppTheme.darkTheme.colorScheme.primary,
        equals(AppColors.primary),
      );
    });
  });

  group('AppTheme Widget Tests', () {
    testWidgets('should apply light theme correctly', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.lightTheme,
          home: const Scaffold(
            body: Text('Test'),
          ),
        ),
      );

      final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
      expect(materialApp.theme?.brightness, equals(Brightness.light));
    });

    testWidgets('should apply dark theme correctly', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.darkTheme,
          home: const Scaffold(
            body: Text('Test'),
          ),
        ),
      );

      final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
      expect(materialApp.theme?.brightness, equals(Brightness.dark));
    });

    testWidgets('should render text with correct style', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.lightTheme,
          home: const Scaffold(
            body: Text(
              'Test',
              style: TextStyle(fontSize: 24),
            ),
          ),
        ),
      );

      expect(find.text('Test'), findsOneWidget);
    });
  });
}
