import 'package:flutter/material.dart';
import 'package:smart_attendance_app/app/theme.dart';

class HomeWelcomeCard extends StatelessWidget {
  final dynamic user;
  final int pendingCount;
  const HomeWelcomeCard({super.key, required this.user, required this.pendingCount});

  String _getInitials() {
    if (user?.studentProfile?.firstName != null &&
        user?.studentProfile?.lastName != null) {
      final String first = user.studentProfile.firstName;
      final String last = user.studentProfile.lastName;
      if (first.isNotEmpty && last.isNotEmpty) {
        return '${first[0]}${last[0]}'.toUpperCase();
      }
    }
    final String? email = user?.email;
    if (email != null && email.isNotEmpty) {
      return email[0].toUpperCase();
    }
    return 'S';
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour >= 4 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  @override
  Widget build(BuildContext context) {
    final name = (user?.studentProfile?.firstName != null &&
            user?.studentProfile?.lastName != null)
        ? '${user?.studentProfile?.firstName} ${user?.studentProfile?.lastName}'
        : user?.email ?? 'Student';
    final enrollmentNumber = user?.studentProfile?.enrollmentNumber ?? '';

    return Row(
      children: [
        Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: SasColors.accentEmerald.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: SasColors.accentEmerald.withValues(alpha: 0.25),
              width: 1.0,
            ),
          ),
          child: Center(
            child: Text(
              _getInitials(),
              style: const TextStyle(
                color: SasColors.accentEmerald,
                fontSize: 16,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _getGreeting(),
                style: const TextStyle(
                  color: SasColors.textMuted,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 1),
              Text(
                name,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: SasColors.textPrimary,
                  letterSpacing: -0.2,
                ),
              ),
              if (enrollmentNumber.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(
                  enrollmentNumber,
                  style: const TextStyle(
                    color: SasColors.textMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: pendingCount > 0
                ? SasColors.warning.withValues(alpha: 0.08)
                : SasColors.success.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(
              color: pendingCount > 0
                  ? SasColors.warning.withValues(alpha: 0.25)
                  : SasColors.success.withValues(alpha: 0.25),
              width: 1,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                pendingCount > 0
                    ? Icons.sync_problem_rounded
                    : Icons.cloud_done_rounded,
                color: pendingCount > 0 ? SasColors.warning : SasColors.success,
                size: 13,
              ),
              const SizedBox(width: 4),
              Text(
                pendingCount > 0 ? '$pendingCount pending' : 'Synced',
                style: TextStyle(
                  color: pendingCount > 0 ? SasColors.warning : SasColors.success,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
