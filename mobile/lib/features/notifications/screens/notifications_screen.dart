import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/core/attendance_constants.dart';
import 'package:smart_attendance_app/data/local/notification_service.dart';
import 'package:smart_attendance_app/features/notifications/widgets/notification_tile.dart';
import 'package:smart_attendance_app/shared/widgets/animated_background.dart';
import 'package:smart_attendance_app/shared/widgets/glass_app_bar.dart';
import 'package:smart_attendance_app/shared/widgets/glass_card.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notifications = ref.watch(notificationsProvider);
    final isLoading = ref.watch(notificationsLoadingProvider);
    final pushList = notifications.where((n) => n.source == kAttendanceTypePush).toList();
    final localList = notifications.where((n) => n.source == kAttendanceTypeLocal).toList();
    final unread = notifications.where((n) => !n.isRead).length;

    return Scaffold(
      appBar: GlassAppBar(
        title: 'Notifications',
        actions: [
          if (notifications.isNotEmpty) ...[
            IconButton(
              icon: const Icon(Icons.done_all_rounded, color: SasColors.textMuted, size: 20),
              onPressed: () => ref.read(notificationsProvider.notifier).markAllRead(),
              tooltip: 'Mark All Read',
            ),
            IconButton(
              icon: const Icon(Icons.clear_all_rounded, color: SasColors.textMuted, size: 20),
              onPressed: () => ref.read(notificationsProvider.notifier).clear(),
              tooltip: 'Clear All',
            ),
            if (unread > 0)
              Container(
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: SasColors.accentEmerald.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: SasColors.accentEmerald.withValues(alpha: 0.3)),
                ),
                child: Text('$unread', style: const TextStyle(color: SasColors.accentEmerald, fontSize: 11, fontWeight: FontWeight.w700)),
              ),
          ],
        ],
      ),
      body: AnimatedBackground(
        child: SafeArea(
          child: RefreshIndicator(
            color: SasColors.accentEmerald,
            backgroundColor: SasColors.bgSecondary,
            onRefresh: () => ref.read(notificationsProvider.notifier).load(),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (isLoading)
                  const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator(color: SasColors.accentEmerald)))
                else if (notifications.isEmpty)
                  _buildEmpty()
                else ...[
                  if (pushList.isNotEmpty) ...[
                    _buildSectionHeader(Icons.campaign_rounded, 'System & Push Alerts', SasColors.warning),
                    const SizedBox(height: 6),
                    ...pushList.map((n) => NotificationTile(notification: n, isPush: true)),
                    const SizedBox(height: 14),
                  ],
                  if (localList.isNotEmpty) ...[
                    _buildSectionHeader(Icons.cloud_sync_rounded, 'Sync & Attendance Events', SasColors.textMuted),
                    const SizedBox(height: 6),
                    ...localList.map((n) => NotificationTile(notification: n, isPush: false)),
                  ],
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(IconData icon, String title, Color color) {
    return Row(
      children: [
        Icon(icon, size: 15, color: color),
        const SizedBox(width: 6),
        Text(title, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w700)),
      ],
    );
  }

  Widget _buildEmpty() {
    return const GlassCard(
      padding: EdgeInsets.all(32),
      child: Column(
        children: [
          Icon(Icons.notifications_none_rounded, size: 44, color: SasColors.textMuted),
          SizedBox(height: 10),
          Text('No notifications yet', style: TextStyle(color: SasColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w700)),
          SizedBox(height: 4),
          Text('Attendance sync updates and classroom alerts will appear here.',
              textAlign: TextAlign.center, style: TextStyle(color: SasColors.textMuted, fontSize: 12)),
        ],
      ),
    );
  }
}
