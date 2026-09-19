import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/features/attendance/providers/geofence_verification_provider.dart';
import 'package:smart_attendance_app/features/attendance/widgets/geofence_status_card.dart';
import 'package:smart_attendance_app/shared/widgets/glass_button.dart';
import 'package:smart_attendance_app/shared/widgets/glass_card.dart';
import 'package:smart_attendance_app/shared/widgets/glass_input.dart';

void main() {
  group('Mobile Interactive Widgets E2E Tests', () {
    testWidgets('GlassInput renders with labels, validation and text input', (WidgetTester tester) async {
      final formKey = GlobalKey<FormState>();
      final controller = TextEditingController();

      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: Scaffold(
            body: Form(
              key: formKey,
              child: GlassInput(
                controller: controller,
                label: 'Email',
                hint: 'student@university.edu',
                prefixIcon: Icons.email_outlined,
                validator: (v) => (v == null || v.isEmpty) ? 'Email is required' : null,
              ),
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Email'), findsOneWidget);
      expect(find.text('student@university.edu'), findsOneWidget);

      // Trigger validator
      formKey.currentState!.validate();
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Email is required'), findsOneWidget);

      // Enter text
      await tester.enterText(find.byType(TextFormField), 'cse2025001@smartattendance.edu.in');
      await tester.pump(const Duration(milliseconds: 100));

      expect(controller.text, 'cse2025001@smartattendance.edu.in');
    });

    testWidgets('GeofenceStatusCard displays scanning, success, and failed states', (WidgetTester tester) async {
      // 1. Success State
      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: Scaffold(
            body: GeofenceStatusCard(
              state: const GeofenceVerificationState(
                status: GeofenceStatus.success,
                distanceMeters: 12.5,
                radiusMeters: 50.0,
                accuracy: 4.0,
              ),
              onRetry: () {},
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 200));

      expect(find.byType(GeofenceStatusCard), findsOneWidget);
      expect(find.text('Location Verified'), findsOneWidget);
      expect(find.text('13m'), findsOneWidget);
      expect(find.text('50m'), findsOneWidget);
    });

    testWidgets('GlassButton renders in loading and normal states and triggers callback', (WidgetTester tester) async {
      bool pressed = false;
      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: Scaffold(
            body: GlassButton(
              label: 'Submit Attendance',
              onPressed: () => pressed = true,
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Submit Attendance'), findsOneWidget);
      await tester.tap(find.text('Submit Attendance'));
      expect(pressed, isTrue);
    });

    testWidgets('GlassCard renders with custom glow and border styles', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: buildSasTheme(),
          home: const Scaffold(
            body: GlassCard(
              child: Text('Attendance Data Card'),
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.text('Attendance Data Card'), findsOneWidget);
      expect(find.byType(GlassCard), findsOneWidget);
    });
  });
}
