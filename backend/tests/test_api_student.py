import io
import pytest
from datetime import datetime, timezone, date
from unittest.mock import AsyncMock, patch, MagicMock
from types import SimpleNamespace
from fastapi.testclient import TestClient

from main import app
from app.api.dependencies import get_current_user, get_current_student
from app.schemas.attendance import AttendanceMarkResponse
from app.schemas.student import (
    StudentAttendanceHistoryResponse, StudentClassResponse,
    SmartPassResponse, StudentSmartPassScanResponse, StudentStatsResponse, LeaderboardResponse, LeaderboardEntry,
)
from app.schemas.leave import LeaveRequestResponse, LeaveRequestListResponse

client = TestClient(app)

def test_student_route_forbidden_for_teacher(mock_teacher_user):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    response = client.get("/api/v1/student/my-attendance")
    assert response.status_code == 403
    app.dependency_overrides.clear()

def test_mark_attendance_success(mock_student_user, mock_student_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    app.dependency_overrides[get_current_student] = lambda: mock_student_profile

    with patch("app.services.attendance_service.AttendanceService.mark_attendance", new_callable=AsyncMock) as mock_mark:
        now = datetime.now(timezone.utc)
        mock_mark.return_value = {
            "id": "att-101",
            "studentId": mock_student_profile.id,
            "sessionId": "ses-101",
            "status": "Present",
            "faceScore": 0.95,
            "livenessScore": 0.98,
            "backgroundScore": 0.92,
            "finalAiScore": 0.95,
            "gpsLatitude": 28.6139,
            "gpsLongitude": 77.2090,
            "createdAt": now,
        }
        response = client.post(
            "/api/v1/student/attendance/mark",
            data={
                "session_id": "ses-101",
                "latitude": 28.6139,
                "longitude": 77.2090,
                "accuracy": 12.5,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "Present"
        assert data["final_ai_score"] == 0.95
    app.dependency_overrides.clear()

def test_analyze_and_confirm_attendance(mock_student_user, mock_student_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    app.dependency_overrides[get_current_student] = lambda: mock_student_profile

    with patch("app.services.attendance_service.AttendanceService.analyze_attendance", new_callable=AsyncMock) as mock_analyze, \
         patch("app.services.attendance_service.AttendanceService.confirm_attendance", new_callable=AsyncMock) as mock_confirm:
        
        mock_analyze.return_value = {
            "face_score": 0.92,
            "liveness_score": 0.89,
            "background_score": 0.94,
            "final_ai_score": 0.91,
            "predicted_status": "Present",
            "review_token": "valid-5min-review-token-xyz",
        }
        res_analyze = client.post(
            "/api/v1/student/attendance/analyze",
            data={
                "session_id": "ses-101",
                "latitude": 28.6139,
                "longitude": 77.2090,
                "accuracy": 10.0,
            }
        )
        assert res_analyze.status_code == 200
        assert res_analyze.json()["review_token"] == "valid-5min-review-token-xyz"

        now = datetime.now(timezone.utc)
        mock_confirm.return_value = {
            "id": "att-conf-101",
            "studentId": mock_student_profile.id,
            "sessionId": "ses-101",
            "status": "Present",
            "faceScore": 0.92,
            "livenessScore": 0.89,
            "backgroundScore": 0.94,
            "finalAiScore": 0.91,
            "gpsLatitude": 28.6139,
            "gpsLongitude": 77.2090,
            "createdAt": now,
        }
        res_confirm = client.post(
            "/api/v1/student/attendance/confirm",
            data={"review_token": "valid-5min-review-token-xyz"}
        )
        assert res_confirm.status_code == 200
        assert res_confirm.json()["status"] == "Present"
    app.dependency_overrides.clear()

def test_register_face_success(mock_student_user, mock_student_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    app.dependency_overrides[get_current_student] = lambda: mock_student_profile

    with patch("app.api.student._save_uploaded_image", new_callable=AsyncMock) as mock_upload, \
         patch("app.services.attendance_service.AttendanceService.register_face", new_callable=AsyncMock) as mock_reg, \
         patch("app.services.s3_service.s3_service.delete_file") as mock_del:
        
        mock_upload.return_value = ("https://s3.local/mock-face.jpg", b"fake-jpeg-bytes")
        mock_reg.return_value = True

        fake_file = io.BytesIO(b"\xff\xd8\xff\xe0" + b"\x00" * 100)
        response = client.post(
            "/api/v1/student/register-face",
            files={"image": ("face.jpg", fake_file, "image/jpeg")}
        )
        assert response.status_code == 200
        assert "registered successfully" in response.json()["message"]
    app.dependency_overrides.clear()

def test_get_smart_pass(mock_student_user, mock_student_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    app.dependency_overrides[get_current_student] = lambda: mock_student_profile

    response = client.get("/api/v1/student/smart-pass")
    assert response.status_code == 200
    data = response.json()
    assert "qr_token" in data
    assert data["student_name"] == "Rahul Verma"
    assert data["enrollment_number"] == "CS-2024-0042"
    app.dependency_overrides.clear()

def test_create_leave_request(mock_student_user, mock_student_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    app.dependency_overrides[get_current_student] = lambda: mock_student_profile

    with patch("app.repositories.leave_repo.LeaveRepository.create", new_callable=AsyncMock) as mock_create_leave, \
         patch("app.api.student.db") as mock_db, \
         patch("app.services.notification_service.notify_teacher_leave_submitted", new_callable=AsyncMock):
        
        now = datetime.now(timezone.utc)
        mock_create_leave.return_value = SimpleNamespace(
            id="leave-req-99",
            studentId=mock_student_profile.id,
            startDate=now,
            endDate=now,
            reason="Attending ACM Collegiate Programming Contest regional finals.",
            documentUrl=None,
            status="PENDING",
            approvedBy=None,
            approverNote=None,
            createdAt=now,
            updatedAt=now,
            student=mock_student_profile,
        )
        mock_db.enrollment.find_many = AsyncMock(return_value=[])

        response = client.post(
            "/api/v1/student/leaves",
            data={
                "start_date": "2026-10-01",
                "end_date": "2026-10-03",
                "reason": "Attending ACM Collegiate Programming Contest regional finals.",
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["id"] == "leave-req-99"
        assert data["status"] == "PENDING"
    app.dependency_overrides.clear()

def test_student_gamification_stats_and_leaderboard(mock_student_user, mock_student_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    app.dependency_overrides[get_current_student] = lambda: mock_student_profile

    with patch("app.services.gamification_service.GamificationService.get_student_stats", new_callable=AsyncMock) as mock_stats, \
         patch("app.services.gamification_service.GamificationService.get_leaderboard", new_callable=AsyncMock) as mock_board:
        
        mock_stats.return_value = StudentStatsResponse(
            current_streak=7,
            highest_streak=14,
            total_classes=45,
            present_count=42,
            absent_count=3,
            flagged_count=0,
            excused_count=0,
            attendance_percentage=93.3,
        )
        res_stats = client.get("/api/v1/student/stats")
        assert res_stats.status_code == 200
        assert res_stats.json()["current_streak"] == 7

        mock_board.return_value = LeaderboardResponse(
            leaderboard=[
                LeaderboardEntry(student_id="stu-1", name="Pooja Hegde", points=450, current_streak=21),
                LeaderboardEntry(student_id="stu-2", name="Aman Gupta", points=380, current_streak=14),
                LeaderboardEntry(student_id="stu-3", name="Rahul Verma", points=320, current_streak=7),
            ],
            user_rank=3,
            user_points=320,
        )
        res_board = client.get("/api/v1/student/leaderboard")
        assert res_board.status_code == 200
        assert res_board.json()["user_rank"] == 3
        assert len(res_board.json()["leaderboard"]) == 3
    app.dependency_overrides.clear()


def test_scan_smart_pass(mock_student_user, mock_student_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    app.dependency_overrides[get_current_student] = lambda: mock_student_profile

    with patch("app.services.student_service.StudentService.verify_teacher_smart_pass_and_mark", new_callable=AsyncMock) as mock_scan:
        mock_scan.return_value = StudentSmartPassScanResponse(
            status="success",
            session_id="ses-101",
            class_name="CS-101",
            subject="Algorithms",
            attendance_status="Present",
            student_name="Rahul Verma",
            enrollment_number="CS-2024-0042",
            marked_at=datetime.now(timezone.utc).isoformat(),
            message="Attendance marked Present for CS-101 (Algorithms).",
        )
        response = client.post("/api/v1/student/smart-pass/scan", json={
            "qr_token": "valid-teacher-qr-token",
            "latitude": 19.0760,
            "longitude": 72.8777,
            "accuracy": 5.0,
            "device_uuid": "mock-device-uuid-123",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["attendance_status"] == "Present"
        assert data["class_name"] == "CS-101"
    app.dependency_overrides.clear()

