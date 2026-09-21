import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/core/attendance_utils.dart';
import 'package:smart_attendance_app/core/extensions.dart';
import 'package:smart_attendance_app/data/local/pending_count_provider.dart';
import 'package:smart_attendance_app/features/auth/providers/auth_provider.dart';
import 'package:smart_attendance_app/features/history/providers/history_provider.dart';
import 'package:smart_attendance_app/features/home/providers/session_provider.dart';
import 'package:smart_attendance_app/features/home/widgets/class_session_card.dart';
import 'package:smart_attendance_app/features/home/widgets/home_attendance_overview.dart';
import 'package:smart_attendance_app/features/home/widgets/home_empty_classes.dart';
import 'package:smart_attendance_app/features/home/widgets/home_warning_banner.dart';
import 'package:smart_attendance_app/features/home/widgets/home_welcome_card.dart';
import 'package:smart_attendance_app/shared/widgets/animated_background.dart';
import 'package:smart_attendance_app/shared/widgets/info_banner.dart';
import 'package:smart_attendance_app/shared/widgets/shimmer_placeholder.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    Future.microtask(() {
      if (mounted) {
        ref.read(sessionProvider.notifier).startPolling();
        ref.read(historyProvider.notifier).fetch();
      }
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    ref.read(sessionProvider.notifier).stopPolling();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.inactive ||
        state == AppLifecycleState.paused) {
      ref.read(sessionProvider.notifier).stopPolling();
    } else if (state == AppLifecycleState.resumed) {
      ref.read(sessionProvider.notifier).startPolling();
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final sessionState = ref.watch(sessionProvider);
    final pendingCount = ref.watch(pendingCountProvider);
    final historyState = ref.watch(historyProvider);
    final rawPct = historyState.data?.overallAttendancePercentage ?? 0;
    final overallPct =
        (rawPct.isNaN || rawPct.isInfinite) ? 0.0 : rawPct.toDouble();

    return AnimatedBackground(
      child: SafeArea(
        child: RefreshIndicator(
          color: SasColors.accentEmerald,
          backgroundColor: SasColors.bgSecondary,
          onRefresh: () async {
            await ref.read(sessionProvider.notifier).fetchSessions();
            await ref.read(historyProvider.notifier).fetch();
          },
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              HomeWelcomeCard(user: user, pendingCount: pendingCount),
              const SizedBox(height: 12),
              InkWell(
                onTap: () => context.push('/smart-pass'),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        SasColors.accentEmerald.withValues(alpha: 0.15),
                        SasColors.accentTeal.withValues(alpha: 0.08),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: SasColors.accentEmerald.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: SasColors.accentEmerald.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(
                          Icons.qr_code_scanner_rounded,
                          color: SasColors.accentEmerald,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Scan Teacher Smart Pass',
                              style: TextStyle(
                                color: SasColors.textPrimary,
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Instant check-in via live QR code',
                              style: TextStyle(
                                color: SasColors.textMuted,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        Icons.arrow_forward_ios_rounded,
                        color: SasColors.accentEmerald,
                        size: 14,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),
              if (overallPct > 0 && overallPct < 75) ...[
                HomeWarningBanner(
                  percentage: overallPct,
                  onTap: () => context.go('/analytics'),
                ),
                const SizedBox(height: 10),
              ],
              if (historyState.data != null) ...[
                HomeAttendanceOverview(
                  overallPct: overallPct,
                  history: historyState.data!.history,
                  highestStreak:
                      calculateHighestStreak(historyState.data!.history),
                  onTapAnalytics: () => context.go('/analytics'),
                ),
                const SizedBox(height: 16),
              ],
              Row(
                children: [
                  const Icon(
                    Icons.schedule_rounded,
                    color: SasColors.textMuted,
                    size: 16,
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    "Today's Schedule",
                    style: TextStyle(
                      color: SasColors.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(width: 6),
                  if (sessionState.sessions.isNotEmpty)
                    Container(
                      padding:
                          const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: SasColors.accentEmerald.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '${sessionState.sessions.length}',
                        style: const TextStyle(
                          color: SasColors.accentEmerald,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  const Spacer(),
                  Text(
                    DateTime.now().shortDate,
                    style: const TextStyle(
                      color: SasColors.textMuted,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              if (sessionState.errorMessage != null &&
                  sessionState.sessions.isEmpty)
                InfoBanner(
                  message: sessionState.errorMessage!,
                  severity: BannerSeverity.danger,
                  customIcon: Icons.wifi_off_rounded,
                  actionLabel: 'Retry',
                  onAction: () =>
                      ref.read(sessionProvider.notifier).fetchSessions(),
                )
              else if (sessionState.isLoading && sessionState.sessions.isEmpty)
                const ShimmerPlaceholder()
              else if (sessionState.sessions.isEmpty)
                const HomeEmptyClasses()
              else
                ...sessionState.sessions.map(
                  (session) => ClassSessionCard(
                    session: session,
                    isMarked: sessionState.markedSessionIds
                        .contains(session.sessionId),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
