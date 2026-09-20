import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/shared/widgets/glass_app_bar.dart';
import 'package:smart_attendance_app/shared/widgets/glass_bottom_nav.dart';
import 'package:smart_attendance_app/shared/widgets/glass_button.dart';
import 'package:smart_attendance_app/shared/widgets/glass_card.dart';
import 'package:smart_attendance_app/shared/widgets/glass_input.dart';
import 'package:smart_attendance_app/shared/widgets/stat_tile.dart';
import 'package:smart_attendance_app/shared/widgets/status_chip.dart';
import 'package:smart_attendance_app/shared/widgets/streak_counter.dart';

void main() {
  group('Mobile Light Theme & Visual Inspection Suite', () {
    testWidgets('ThemeData is configured for light brightness with accessible tokens', (tester) async {
      final theme = buildSasTheme();
      expect(theme.brightness, equals(Brightness.light));
      expect(theme.scaffoldBackgroundColor, equals(const Color(0xFFF8FAFC)));
      expect(theme.colorScheme.primary, equals(const Color(0xFF059669)));
      expect(theme.colorScheme.onSurface, equals(const Color(0xFF0F172A)));
      expect(theme.cardTheme.color, equals(const Color(0xFFFFFFFF)));
    });

    testWidgets('Light GlassCard renders with elevated shadow and crisp borders', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: const Scaffold(
            body: Center(
              child: GlassCard(
                child: Text('Card Content', style: TextStyle(color: SasColors.textPrimary)),
              ),
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Card Content'), findsOneWidget);
      final container = tester.widget<Container>(
        find.descendant(of: find.byType(GlassCard), matching: find.byType(Container)).first,
      );
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, equals(SasColors.glassBg));
      expect(decoration.boxShadow, isNotEmpty);
    });

    testWidgets('Light GlassButton variants render with high contrast and micro-states', (tester) async {
      bool pressed = false;
      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: Scaffold(
            body: Column(
              children: [
                GlassButton(
                  label: 'Primary Emerald CTA',
                  variant: GlassButtonVariant.primary,
                  onPressed: () => pressed = true,
                ),
                const GlassButton(
                  label: 'Secondary Outlined',
                  variant: GlassButtonVariant.secondary,
                ),
                const GlassButton(
                  label: 'Danger Action',
                  variant: GlassButtonVariant.danger,
                ),
                const GlassButton(
                  label: 'Loading Button',
                  isLoading: true,
                ),
              ],
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Primary Emerald CTA'), findsOneWidget);
      expect(find.text('Secondary Outlined'), findsOneWidget);
      expect(find.text('Danger Action'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);

      await tester.tap(find.text('Primary Emerald CTA'));
      expect(pressed, isTrue);
    });

    testWidgets('Light GlassInput renders high contrast typography and emerald focus', (tester) async {
      final controller = TextEditingController();
      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: Scaffold(
            body: GlassInput(
              controller: controller,
              label: 'University Email',
              hint: 'student@smartattendance.edu.in',
              prefixIcon: Icons.email_outlined,
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('University Email'), findsOneWidget);
      expect(find.text('student@smartattendance.edu.in'), findsOneWidget);

      await tester.enterText(find.byType(TextFormField), 'pratham@smartattendance.edu.in');
      await tester.pump(const Duration(milliseconds: 100));
      expect(controller.text, equals('pratham@smartattendance.edu.in'));
    });

    testWidgets('StatTile & StatusChip render crisp light colors and typography', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: const Scaffold(
            body: Column(
              children: [
                StatTile(
                  label: 'Attendance Rate',
                  value: '94%',
                  color: SasColors.success,
                  variant: StatTileVariant.compact,
                ),
                StatusChip(
                  label: 'PRESENT',
                  color: SasColors.success,
                  isSelected: true,
                ),
                StreakCounter(
                  currentStreak: 12,
                  highestStreak: 25,
                ),
              ],
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Attendance Rate'), findsOneWidget);
      expect(find.text('94%'), findsOneWidget);
      expect(find.text('PRESENT'), findsOneWidget);
      expect(find.text('12'), findsOneWidget);
      expect(find.text('Best: 25 days'), findsOneWidget);
    });

    testWidgets('GlassAppBar and GlassBottomNav render with light frosted blur', (tester) async {
      int selectedIndex = 0;
      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: Scaffold(
            appBar: const GlassAppBar(title: 'Dashboard'),
            bottomNavigationBar: GlassBottomNav(
              currentIndex: selectedIndex,
              onTap: (index) => selectedIndex = index,
            ),
            body: const Center(child: Text('Dashboard View')),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Dashboard'), findsOneWidget);
      expect(find.text('Dashboard View'), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('History'), findsOneWidget);
      expect(find.text('Analytics'), findsOneWidget);
      expect(find.text('More'), findsOneWidget);
    });
  });
}
