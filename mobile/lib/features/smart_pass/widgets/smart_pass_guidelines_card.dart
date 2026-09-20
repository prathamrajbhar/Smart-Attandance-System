import 'package:flutter/material.dart';
import 'package:smart_attendance_app/app/theme.dart';
import 'package:smart_attendance_app/shared/widgets/glass_card.dart';

class SmartPassGuidelinesCard extends StatelessWidget {
  const SmartPassGuidelinesCard({super.key});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: SasColors.info.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Icon(
                  Icons.shield_outlined,
                  size: 16,
                  color: SasColors.info,
                ),
              ),
              const SizedBox(width: 8),
              const Text(
                'Verification Protocol',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: SasColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _item('Present dynamic QR code at campus access checkpoints.'),
          _item('QR code automatically regenerates every 30 seconds.'),
          _item('Static screenshots are invalid and will be rejected.'),
          _item('Valid only when presented within this official app.'),
        ],
      ),
    );
  }

  Widget _item(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.check_circle_rounded,
            size: 14,
            color: SasColors.accentEmerald,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 12,
                color: SasColors.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
