import 'package:flutter/material.dart';
import 'package:smart_attendance_app/app/theme.dart';

class StreakCounter extends StatelessWidget {
  final int currentStreak;
  final int highestStreak;
  final bool isCompact;

  const StreakCounter({
    super.key,
    required this.currentStreak,
    required this.highestStreak,
    this.isCompact = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isCompact) {
      return _buildCompactView();
    }
    return _buildFullView();
  }

  Widget _buildCompactView() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: SasColors.accentEmerald.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: SasColors.accentEmerald.withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('🔥', style: TextStyle(fontSize: 18)),
          const SizedBox(width: 6),
          Text(
            '$currentStreak',
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: SasColors.accentEmerald,
            ),
          ),
          const SizedBox(width: 4),
          const Text(
            'day streak',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: SasColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFullView() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: SasColors.bgSecondary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: SasColors.accentEmerald.withValues(alpha: 0.25),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x080F172A),
            blurRadius: 16,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: SasColors.accentEmerald.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: SasColors.accentEmerald.withValues(alpha: 0.2),
                  ),
                ),
                child: const Text('🔥', style: TextStyle(fontSize: 30)),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Attendance Streak',
                      style: TextStyle(
                        fontSize: 13,
                        color: SasColors.textMuted,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          '$currentStreak',
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            color: SasColors.accentEmerald,
                            height: 1,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          currentStreak == 1 ? 'day' : 'days',
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: SasColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (highestStreak > 0) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: SasColors.bgSurface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: SasColors.glassBorder),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.emoji_events_rounded,
                      size: 16, color: SasColors.warning),
                  const SizedBox(width: 8),
                  Text(
                    'Best: $highestStreak ${highestStreak == 1 ? 'day' : 'days'}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: SasColors.textSecondary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
          if (currentStreak == 0) ...[
            const SizedBox(height: 12),
            const Text(
              'Start your streak by attending classes!',
              style: TextStyle(
                fontSize: 12,
                color: SasColors.textMuted,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
