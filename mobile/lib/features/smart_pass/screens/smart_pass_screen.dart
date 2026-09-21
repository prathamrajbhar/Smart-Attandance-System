import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/domain/models/smart_pass.dart';
import 'package:smart_attendance_app/features/smart_pass/providers/smart_pass_provider.dart';
import 'package:smart_attendance_app/features/smart_pass/widgets/smart_pass_guidelines_card.dart';
import 'package:smart_attendance_app/shared/widgets/animated_background.dart';
import 'package:smart_attendance_app/shared/widgets/glass_app_bar.dart';
import 'package:smart_attendance_app/shared/widgets/glass_button.dart';
import 'package:smart_attendance_app/shared/widgets/glass_card.dart';
import 'package:smart_attendance_app/shared/widgets/glass_input.dart';

class SmartPassScreen extends ConsumerStatefulWidget {
  const SmartPassScreen({super.key});

  @override
  ConsumerState<SmartPassScreen> createState() => _SmartPassScreenState();
}

class _SmartPassScreenState extends ConsumerState<SmartPassScreen> {
  final TextEditingController _tokenController = TextEditingController();

  @override
  void dispose() {
    _tokenController.dispose();
    super.dispose();
  }

  void _onVerifyPressed() {
    final token = _tokenController.text.trim();
    if (token.isEmpty) return;
    FocusScope.of(context).unfocus();
    ref.read(smartPassProvider.notifier).scanAndVerifyPass(token);
  }

  @override
  Widget build(BuildContext context) {
    final passState = ref.watch(smartPassProvider);

    return Scaffold(
      appBar: const GlassAppBar(title: 'Smart Pass Scanner', showBack: true),
      body: AnimatedBackground(
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              if (passState.scanResult != null)
                _buildSuccessCard(passState.scanResult!)
              else ...[
                _buildScannerViewfinder(passState.isLoading),
                const SizedBox(height: 16),
                if (passState.errorMessage != null)
                  _buildErrorBanner(passState.errorMessage!),
                _buildManualInputSection(passState.isLoading),
              ],
              const SizedBox(height: 16),
              const SmartPassGuidelinesCard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScannerViewfinder(bool isLoading) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Container(
            height: 180,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: SasColors.accentEmerald.withValues(alpha: 0.3)),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                const Icon(Icons.qr_code_scanner_rounded, size: 64, color: SasColors.accentEmerald),
                if (isLoading)
                  const CircularProgressIndicator(color: SasColors.accentEmerald),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Point camera at Teacher\'s Smart Pass QR code',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: SasColors.textPrimary),
          ),
          const SizedBox(height: 4),
          const Text(
            'Automatic GPS and Device Verification will execute instantly',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 11, color: SasColors.textMuted),
          ),
        ],
      ),
    );
  }

  Widget _buildManualInputSection(bool isLoading) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Manual Token Verification',
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: SasColors.textPrimary),
          ),
          const SizedBox(height: 10),
          GlassInput(
            controller: _tokenController,
            hint: 'Paste session QR security token...',
            prefixIcon: Icons.key_rounded,
          ),
          const SizedBox(height: 12),
          GlassButton(
            label: 'Verify & Mark Attendance',
            icon: Icons.check_circle_outline_rounded,
            isLoading: isLoading,
            onPressed: isLoading ? null : _onVerifyPressed,
          ),
        ],
      ),
    );
  }

  Widget _buildErrorBanner(String error) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: SasColors.danger.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: SasColors.danger.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            const Icon(Icons.error_outline_rounded, size: 18, color: SasColors.danger),
            const SizedBox(width: 8),
            Expanded(
              child: Text(error, style: const TextStyle(fontSize: 12, color: SasColors.danger, fontWeight: FontWeight.w500)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuccessCard(SmartPassScanResult result) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: SasColors.accentEmerald.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle_rounded, size: 48, color: SasColors.accentEmerald),
          ),
          const SizedBox(height: 14),
          Text(
            result.message,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: SasColors.textPrimary),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: SasColors.bgSurface,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                _infoRow('Class', result.className),
                _infoRow('Subject', result.subject),
                _infoRow('Student', result.studentName),
                _infoRow('Status', result.attendanceStatus, isHighlight: true),
              ],
            ),
          ),
          const SizedBox(height: 16),
          GlassButton(
            label: 'Scan Another Code',
            icon: Icons.qr_code_scanner_rounded,
            onPressed: () {
              _tokenController.clear();
              ref.read(smartPassProvider.notifier).resetScan();
            },
          ),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value, {bool isHighlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: SasColors.textMuted)),
          Text(
            value,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isHighlight ? FontWeight.w800 : FontWeight.w600,
              color: isHighlight ? SasColors.accentEmerald : SasColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
