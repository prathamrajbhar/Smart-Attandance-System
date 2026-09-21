import 'package:flutter_test/flutter_test.dart';
import 'package:smart_attendance_app/core/attendance_utils.dart';
import 'package:smart_attendance_app/core/attendance_constants.dart';
import 'package:smart_attendance_app/domain/models/user.dart';
import 'package:smart_attendance_app/domain/models/attendance.dart';
import 'package:smart_attendance_app/domain/models/student_stats.dart';
import 'package:smart_attendance_app/domain/models/leave_request.dart';
import 'package:smart_attendance_app/domain/models/smart_pass.dart';

void main() {
  group('Domain Models & Serialization Tests', () {
    test('TokenResponse deserialization', () {
      final json = {
        'access_token': 'jwt_test_token_123',
        'token_type': 'bearer',
        'role': 'STUDENT',
        'must_change_password': true,
      };
      final tokenResp = TokenResponse.fromJson(json);
      expect(tokenResp.accessToken, 'jwt_test_token_123');
      expect(tokenResp.tokenType, 'bearer');
      expect(tokenResp.role, 'STUDENT');
      expect(tokenResp.mustChangePassword, isTrue);
    });

    test('UserProfile & StudentProfile serialization roundtrip', () {
      final userJson = {
        'id': 'usr_001',
        'email': 'cse2025001@smartattendance.edu.in',
        'role': 'STUDENT',
        'is_active': true,
        'student_profile': {
          'id': 'std_001',
          'enrollment_number': 'CSE2025001',
          'first_name': 'Aarav',
          'last_name': 'Sharma',
          'face_registered': true,
        }
      };

      final profile = UserProfile.fromJson(userJson);
      expect(profile.id, 'usr_001');
      expect(profile.email, 'cse2025001@smartattendance.edu.in');
      expect(profile.hasFaceRegistered, isTrue);
      expect(profile.studentProfile?.firstName, 'Aarav');

      final serialized = profile.toJson();
      expect(serialized['id'], 'usr_001');
      expect(serialized['student_profile']['enrollment_number'], 'CSE2025001');
    });

    test('AttendanceHistoryItem deserialization', () {
      final json = {
        'attendance_id': 'att_101',
        'class_id': 'cls_1',
        'class_name': 'CS-401',
        'session_id': 'sess_202',
        'subject': 'Data Structures',
        'status': 'Present',
        'marked_at': '2026-09-19T10:00:00.000Z',
        'face_score': 0.95,
        'liveness_score': 0.98,
        'background_score': 0.92,
        'final_ai_score': 0.96,
      };

      final item = AttendanceHistoryItem.fromJson(json);
      expect(item.attendanceId, 'att_101');
      expect(item.subject, 'Data Structures');
      expect(item.status, 'Present');
      expect(item.livenessScore, 0.98);
      expect(item.faceScore, 0.95);
    });

    test('StudentStats parsing', () {
      final statsJson = {
        'current_streak': 5,
        'highest_streak': 12,
        'total_classes': 40,
        'present_count': 34,
        'absent_count': 4,
        'flagged_count': 2,
        'excused_count': 0,
        'attendance_percentage': 85.0,
      };

      final stats = StudentStats.fromJson(statsJson);
      expect(stats.attendancePercentage, 85.0);
      expect(stats.totalClasses, 40);
      expect(stats.currentStreak, 5);
      expect(stats.highestStreak, 12);
    });

    test('LeaveRequest model validation', () {
      final leaveJson = {
        'id': 'leave_1',
        'student_id': 'std_1',
        'student_name': 'Aarav Sharma',
        'enrollment_number': 'CSE2025001',
        'reason': 'Medical emergency',
        'start_date': '2026-09-20T00:00:00Z',
        'end_date': '2026-09-22T00:00:00Z',
        'status': 'PENDING',
        'created_at': '2026-09-19T08:00:00.000Z',
        'updated_at': '2026-09-19T08:00:00.000Z',
      };

      final leave = LeaveRequest.fromJson(leaveJson);
      expect(leave.id, 'leave_1');
      expect(leave.studentName, 'Aarav Sharma');
      expect(leave.enrollmentNumber, 'CSE2025001');
      expect(leave.reason, 'Medical emergency');
      expect(leave.status, 'PENDING');
    });

    test('SmartPass model validation', () {
      final passJson = {
        'qr_token': 'PASS-2026-XYZ',
        'expires_at': '2026-09-19T18:00:00.000Z',
        'student_name': 'Aarav Sharma',
        'enrollment_number': 'CSE2025001',
      };

      final pass = SmartPass.fromJson(passJson);
      expect(pass.qrToken, 'PASS-2026-XYZ');
      expect(pass.studentName, 'Aarav Sharma');
    });

    test('SmartPassScanResult model validation', () {
      final scanJson = {
        'status': 'success',
        'session_id': 'sess_999',
        'class_name': 'CS-401',
        'subject': 'Data Structures',
        'attendance_status': 'Present',
        'student_name': 'Aarav Sharma',
        'enrollment_number': 'CSE2025001',
        'marked_at': '2026-09-21T10:00:00.000Z',
        'message': 'Attendance marked Present for CS-401 (Data Structures).',
      };

      final result = SmartPassScanResult.fromJson(scanJson);
      expect(result.status, 'success');
      expect(result.sessionId, 'sess_999');
      expect(result.attendanceStatus, 'Present');
      expect(result.className, 'CS-401');
    });
  });


  group('Attendance Utility & Math Logic Tests', () {
    test('calculateStreak counts consecutive present entries', () {
      final items = <AttendanceHistoryItem>[
        AttendanceHistoryItem(
          attendanceId: '1',
          classId: 'c1',
          className: 'Class 1',
          sessionId: 's1',
          subject: 'Math',
          status: kStatusPresent,
          markedAt: DateTime.parse('2026-09-19T10:00:00Z'),
        ),
        AttendanceHistoryItem(
          attendanceId: '2',
          classId: 'c1',
          className: 'Class 1',
          sessionId: 's2',
          subject: 'Math',
          status: kStatusApproved,
          markedAt: DateTime.parse('2026-09-18T10:00:00Z'),
        ),
        AttendanceHistoryItem(
          attendanceId: '3',
          classId: 'c1',
          className: 'Class 1',
          sessionId: 's3',
          subject: 'Math',
          status: kStatusAbsent,
          markedAt: DateTime.parse('2026-09-17T10:00:00Z'),
        ),
      ];

      final streak = calculateStreak(items);
      expect(streak, 2);
    });

    test('computeAttendanceNeeds calculates missed and required classes correctly', () {
      final needs = computeAttendanceNeeds(present: 16, total: 20, target: 75.0);
      expect(needs.canMiss, greaterThanOrEqualTo(1));
      expect(needs.needToAttend, 0);

      final deficit = computeAttendanceNeeds(present: 12, total: 20, target: 75.0);
      expect(deficit.canMiss, 0);
      expect(deficit.needToAttend, greaterThan(0));
    });

    test('isPresentOrApproved status checks', () {
      expect(isPresentOrApproved(kStatusPresent), isTrue);
      expect(isPresentOrApproved(kStatusApproved), isTrue);
      expect(isPresentOrApproved(kStatusAbsent), isFalse);
      expect(isPresentOrApproved(kStatusFlagged), isFalse);
    });
  });
}
