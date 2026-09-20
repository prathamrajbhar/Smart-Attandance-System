import 'package:flutter/material.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/core/attendance_constants.dart';
import 'package:smart_attendance_app/core/extensions.dart';
import 'package:smart_attendance_app/data/local/notification_service.dart';
import 'package:smart_attendance_app/shared/widgets/glass_card.dart';

class NotificationTile extends StatelessWidget {
  final LocalNotification notification;
  final bool isPush;

  const NotificationTile({
    super.key,
    required this.notification,
    required this.isPush,
  });

  ({IconData icon, Color color}) _getSeverity(String severity) {
    switch (severity) {
      case kSeveritySuccess:
        return (icon: Icons.check_circle_outline_rounded, color: SasColors.accentEmerald);
      case kSeverityWarning:
        return (icon: Icons.warning_amber_rounded, color: SasColors.warning);
      case kSeverityDanger:
        return (icon: Icons.error_outline_rounded, color: SasColors.danger);
      case kSeverityInfo:
      default:
        return (icon: Icons.info_outline_rounded, color: SasColors.info);
    }
  }

  @override
  Widget build(BuildContext context) {
    final sev = _getSeverity(notification.severity);

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: GlassCard(
        padding: const EdgeInsets.all(12),
        borderColor: !notification.isRead ? SasColors.accentEmerald.withValues(alpha: 0.3) : null,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!notification.isRead)
              Container(
                width: 3,
                height: 36,
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: SasColors.accentEmerald,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: sev.color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(sev.icon, size: 18, color: sev.color),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          notification.title,
                          style: TextStyle(
                            fontWeight: notification.isRead ? FontWeight.w600 : FontWeight.w700,
                            fontSize: 13,
                            color: SasColors.textPrimary,
                          ),
                        ),
                      ),
                      if (isPush)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                          decoration: BoxDecoration(
                            color: SasColors.warning.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('PUSH', style: TextStyle(color: SasColors.warning, fontSize: 9, fontWeight: FontWeight.w700)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(notification.body, style: const TextStyle(color: SasColors.textSecondary, fontSize: 12)),
                  const SizedBox(height: 4),
                  Text(notification.timestamp.formattedDateTime, style: const TextStyle(color: SasColors.textMuted, fontSize: 10)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
