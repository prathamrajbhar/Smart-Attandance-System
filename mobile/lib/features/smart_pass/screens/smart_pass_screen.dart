import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/domain/models/smart_pass.dart';
import 'package:smart_attendance_app/features/smart_pass/providers/smart_pass_provider.dart';
import 'package:smart_attendance_app/features/smart_pass/widgets/smart_pass_guidelines_card.dart';
import 'package:smart_attendance_app/shared/widgets/animated_background.dart';
import 'package:smart_attendance_app/shared/widgets/glass_app_bar.dart';
import 'package:smart_attendance_app/shared/widgets/glass_button.dart';
import 'package:smart_attendance_app/shared/widgets/glass_card.dart';

class SmartPassScreen extends ConsumerStatefulWidget {
  const SmartPassScreen({super.key});

  @override
  ConsumerState<SmartPassScreen> createState() => _SmartPassScreenState();
}

class _SmartPassScreenState extends ConsumerState<SmartPassScreen> {
  Timer? _countdownTimer;
  int _secondsRemaining = 30;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(smartPassProvider.notifier).generatePass();
      ref.read(smartPassProvider.notifier).startAutoRefresh();
    });
    _startCountdown();
  }

  void _startCountdown() {
    _countdownTimer?.cancel();
    _secondsRemaining = 30;
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) {
        setState(() {
          _secondsRemaining = (_secondsRemaining - 1).clamp(0, 30);
          if (_secondsRemaining == 0) _secondsRemaining = 30;
        });
      }
    });
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    ref.read(smartPassProvider.notifier).stopAutoRefresh();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final passState = ref.watch(smartPassProvider);

    return Scaffold(
      appBar: const GlassAppBar(title: 'Smart Pass', showBack: true),
      body: AnimatedBackground(
        child: SafeArea(
          child: passState.isLoading && passState.pass == null
              ? const Center(child: CircularProgressIndicator(color: SasColors.accentEmerald))
              : passState.errorMessage != null
                  ? _buildError(passState.errorMessage!)
                  : passState.pass != null
                      ? _buildContent(passState.pass!)
                      : const SizedBox.shrink(),
        ),
      ),
    );
  }

  Widget _buildError(String error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: GlassCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, size: 40, color: SasColors.danger),
              const SizedBox(height: 10),
              Text(error, textAlign: TextAlign.center, style: const TextStyle(color: SasColors.textSecondary, fontSize: 13)),
              const SizedBox(height: 14),
              GlassButton(
                label: 'Regenerate Pass',
                icon: Icons.refresh_rounded,
                onPressed: () => ref.read(smartPassProvider.notifier).generatePass(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent(SmartPass pass) {
    final isExpiringSoon = _secondsRemaining <= 8;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        GlassCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: SasColors.glassBorder),
                ),
                child: QrImageView(
                  data: pass.qrToken,
                  version: QrVersions.auto,
                  size: 190,
                  backgroundColor: Colors.white,
                  eyeStyle: const QrEyeStyle(eyeShape: QrEyeShape.square, color: SasColors.textPrimary),
                  dataModuleStyle: const QrDataModuleStyle(dataModuleShape: QrDataModuleShape.square, color: SasColors.textPrimary),
                ),
              ),
              const SizedBox(height: 14),
              Text(pass.studentName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: SasColors.textPrimary)),
              const SizedBox(height: 2),
              Text(pass.enrollmentNumber, style: const TextStyle(fontSize: 12, color: SasColors.textMuted, fontWeight: FontWeight.w500)),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: (isExpiringSoon ? SasColors.danger : SasColors.accentEmerald).withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: (isExpiringSoon ? SasColors.danger : SasColors.accentEmerald).withValues(alpha: 0.2)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.timer_outlined, size: 14, color: isExpiringSoon ? SasColors.danger : SasColors.accentEmerald),
                    const SizedBox(width: 6),
                    Text(
                      'Refreshes in $_secondsRemaining s',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isExpiringSoon ? SasColors.danger : SasColors.accentEmerald,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        const SmartPassGuidelinesCard(),
      ],
    );
  }
}
