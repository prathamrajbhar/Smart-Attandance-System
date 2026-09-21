import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/data/local/permission_service.dart';
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

class _SmartPassScreenState extends ConsumerState<SmartPassScreen> with WidgetsBindingObserver {
  PermissionStatusResult? _permissionStatus;
  bool _checkingPermission = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _checkPermissions();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _checkPermissions();
    }
  }

  Future<void> _checkPermissions() async {
    setState(() => _checkingPermission = true);
    final status = await ref.read(permissionServiceProvider).checkAttendancePermissions();
    if (mounted) {
      setState(() {
        _permissionStatus = status;
        _checkingPermission = false;
      });
    }
  }

  Future<void> _requestPermissions() async {
    final status = await ref.read(permissionServiceProvider).requestLocationPermission();
    if (mounted) {
      setState(() => _permissionStatus = status);
    }
  }

  @override
  Widget build(BuildContext context) {
    final passState = ref.watch(smartPassProvider);
    final hasPermission = _permissionStatus?.hasLocationAccess ?? true;
    final isLocationServiceOn = _permissionStatus?.isLocationServiceEnabled ?? true;

    return Scaffold(
      appBar: const GlassAppBar(title: 'Smart Pass Scanner', showBack: true),
      body: AnimatedBackground(
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              if (passState.scanResult != null)
                _buildSuccessCard(passState.scanResult!)
              else if (!hasPermission || !isLocationServiceOn)
                _buildPermissionCard()
              else ...[
                _buildScannerViewfinder(passState.isLoading),
                const SizedBox(height: 16),
                if (passState.errorMessage != null)
                  _buildErrorBanner(passState.errorMessage!),
              ],
              const SizedBox(height: 16),
              const SmartPassGuidelinesCard(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPermissionCard() {
    final isPermanent = _permissionStatus?.isPermanentlyDenied ?? false;
    final isGpsOff = !(_permissionStatus?.isLocationServiceEnabled ?? true);

    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: SasColors.warning.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isGpsOff ? Icons.location_disabled_rounded : Icons.location_searching_rounded,
              size: 44,
              color: SasColors.warning,
            ),
          ),
          const SizedBox(height: 14),
          Text(
            isGpsOff ? 'Device GPS Is Turned Off' : 'Location Permission Required',
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: SasColors.textPrimary),
          ),
          const SizedBox(height: 6),
          Text(
            isGpsOff
                ? 'Please turn on GPS/Location services on your device to verify class attendance.'
                : isPermanent
                    ? 'Location access is permanently disabled. Please tap below to open App Settings and grant permission.'
                    : 'Classroom verification requires physical location proximity using GPS.',
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 12, color: SasColors.textMuted),
          ),
          const SizedBox(height: 18),
          GlassButton(
            label: isPermanent
                ? 'Open App Settings'
                : isGpsOff
                    ? 'Turn On GPS'
                    : 'Grant Permission',
            icon: Icons.check_circle_outline_rounded,
            isLoading: _checkingPermission,
            onPressed: _checkingPermission ? null : _requestPermissions,
          ),
        ],
      ),
    );
  }

  Widget _buildScannerViewfinder(bool isLoading) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            height: 220,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: SasColors.accentEmerald.withValues(alpha: 0.4),
                width: 1.5,
              ),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.qr_code_scanner_rounded,
                      size: 72,
                      color: SasColors.accentEmerald.withValues(alpha: 0.9),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Ready to Scan',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: SasColors.textPrimary,
                      ),
                    ),
                  ],
                ),
                if (isLoading)
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Center(
                      child: CircularProgressIndicator(color: SasColors.accentEmerald),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Point camera at the Teacher\'s Live Class QR code',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: SasColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'GPS coordinates and registered device UUID are verified automatically in real time.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 11, color: SasColors.textMuted),
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
