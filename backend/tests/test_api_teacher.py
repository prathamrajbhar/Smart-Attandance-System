import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace
from fastapi.testclient import TestClient

from main import app
from app.api.dependencies import get_current_user, get_current_teacher
from app.schemas.teacher import (
    SessionResponse, GeofenceResponse, AcademicClassWithGeofenceResponse,
    SessionAttendanceResponse, ClassStatsResponse, SessionWithClassResponse,
    AbsentStudentItem, DeviceChangeResponse, SmartPassVerifyResponse, TeacherSmartPassResponse,
)
from app.schemas.leave import LeaveRequestResponse
from app.schemas.attendance import FlaggedAttendanceResponse

client = TestClient(app)

def test_teacher_route_forbidden_for_student(mock_student_user):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    response = client.get("/api/v1/teacher/my-classes")
    assert response.status_code == 403
    app.dependency_overrides.clear()

def test_start_and_stop_session(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.session_service.SessionService.start_session", new_callable=AsyncMock) as mock_start, \
         patch("app.services.session_service.SessionService.stop_session", new_callable=AsyncMock) as mock_stop:
        
        now = datetime.now(timezone.utc)
        mock_start.return_value = SessionResponse(
            id="ses-101",
            academic_class_id="cls-ai-601",
            start_time=now,
            end_time=now,
            is_active=True,
        )
        start_res = client.post("/api/v1/teacher/sessions/start", json={
            "academic_class_id": "cls-ai-601",
            "duration_minutes": 15,
        })
        assert start_res.status_code == 200
        data = start_res.json()
        assert data["id"] == "ses-101"
        assert data.get("isActive", data.get("is_active")) is True

        mock_stop.return_value = True
        stop_res = client.post("/api/v1/teacher/sessions/ses-101/stop")
        assert stop_res.status_code == 200
        assert stop_res.json()["message"] == "Session closed successfully."
    app.dependency_overrides.clear()

def test_upsert_geofence(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.teacher_service.TeacherService.upsert_geofence", new_callable=AsyncMock) as mock_geo:
        now = datetime.now(timezone.utc)
        mock_geo.return_value = GeofenceResponse(
            id="geo-101",
            academic_class_id="cls-ai-601",
            latitude=28.6139,
            longitude=77.2090,
            radius_meters=50.0,
            created_at=now,
            updated_at=now,
        )
        response = client.post("/api/v1/teacher/classes/cls-ai-601/geofence", json={
            "latitude": 28.6139,
            "longitude": 77.2090,
            "radius_meters": 50.0,
        })
        assert response.status_code == 200
        data = response.json()
        assert data["latitude"] == 28.6139
        assert data.get("radiusMeters", data.get("radius_meters")) == 50.0
    app.dependency_overrides.clear()

def test_review_flagged_attendance(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.attendance_service.AttendanceService.review_attendance", new_callable=AsyncMock) as mock_rev:
        mock_rev.return_value = True
        response = client.put("/api/v1/teacher/attendance/att-rec-99/review", json={
            "status": "Approved",
            "remarks": "Manual verification by teacher - lighting artifact confirmed valid",
        })
        assert response.status_code == 200
        assert "Approved" in response.json()["message"]
    app.dependency_overrides.clear()

def test_manual_override_attendance(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.teacher_service.TeacherService.manual_override_attendance", new_callable=AsyncMock) as mock_mo:
        mock_mo.return_value = True
        response = client.post("/api/v1/teacher/sessions/ses-101/override", json={
            "student_id": "stu-profile-303",
            "status": "Present",
        })
        assert response.status_code == 200
        assert "Attendance overridden to Present" in response.json()["message"]
    app.dependency_overrides.clear()

def test_bulk_mark_attendance(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.teacher_service.TeacherService.bulk_mark_attendance", new_callable=AsyncMock) as mock_bm:
        mock_bm.return_value = 2
        response = client.post("/api/v1/teacher/sessions/ses-101/mark-bulk", json={
            "records": [
                {"student_id": "stu-1", "status": "Present"},
                {"student_id": "stu-2", "status": "Present"},
            ]
        })
        assert response.status_code == 200
        assert response.json()["count"] == 2
    app.dependency_overrides.clear()

def test_approve_leave_request(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.leave_service.LeaveService.approve_leave", new_callable=AsyncMock) as mock_app:
        mock_app.return_value = True
        response = client.put("/api/v1/teacher/leaves/leave-req-12/approve", json={
            "status": "APPROVED",
            "approver_note": "Medical certificate verified with campus clinic",
        })
        assert response.status_code == 200
        assert "approved successfully" in response.json()["message"]
    app.dependency_overrides.clear()

def test_approve_device_change(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.device_change_service.DeviceChangeService.approve_request", new_callable=AsyncMock) as mock_dc:
        mock_dc.return_value = True
        response = client.put("/api/v1/teacher/device-changes/dev-req-34/approve", json={
            "status": "APPROVED"
        })
        assert response.status_code == 200
        assert "approved successfully" in response.json()["message"]
    app.dependency_overrides.clear()

def test_verify_smart_pass(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.teacher_service.TeacherService.verify_smart_pass", new_callable=AsyncMock) as mock_sp:
        mock_sp.return_value = SmartPassVerifyResponse(
            status="success",
            student_id="stu-profile-303",
            student_name="Rahul Verma",
            enrollment_number="CS-2024-0042",
            attendance_status="Present",
            session_id="ses-101",
            message="Smart Pass verified successfully",
        )
        response = client.post("/api/v1/teacher/smart-pass/verify", json={
            "session_id": "ses-101",
            "qr_token": "valid-smart-pass-qr-token-30s",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["student_name"] == "Rahul Verma"
        assert data["enrollment_number"] == "CS-2024-0042"
    app.dependency_overrides.clear()

def test_get_session_smart_pass(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.teacher_service.TeacherService.generate_session_smart_pass", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = TeacherSmartPassResponse(
            qr_token="jwt-teacher-session-token",
            session_id="ses-101",
            class_name="CS-101",
            subject="Algorithms",
            expires_at=datetime.now(timezone.utc).isoformat(),
            refresh_interval_seconds=5,
        )
        response = client.get("/api/v1/teacher/sessions/ses-101/smart-pass")
        assert response.status_code == 200
        data = response.json()
        assert data["qr_token"] == "jwt-teacher-session-token"
        assert data["session_id"] == "ses-101"
        assert data["refresh_interval_seconds"] == 5
    app.dependency_overrides.clear()


def test_get_student_class_attendance_history(mock_teacher_user, mock_teacher_profile):
    from app.schemas.teacher import StudentClassHistoryResponse, StudentClassSessionLog
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.teacher_service.TeacherService.get_student_class_attendance_history", new_callable=AsyncMock) as mock_hist:
        mock_hist.return_value = StudentClassHistoryResponse(
            student_id="std-101",
            student_name="Aarav Sharma",
            enrollment_number="ENR-2024-001",
            email="aarav@university.edu",
            class_id="cls-101",
            class_name="CS301-A",
            subject="Operating Systems",
            total_sessions=10,
            attended_sessions=8,
            attendance_percentage=80.0,
            at_risk=False,
            sessions=[
                StudentClassSessionLog(
                    session_id="ses-1",
                    session_name="Session 1 (2026-09-01)",
                    session_date="2026-09-01",
                    start_time=datetime.now(timezone.utc),
                    end_time=datetime.now(timezone.utc),
                    status="Present",
                    final_ai_score=0.95,
                    marked_at=datetime.now(timezone.utc),
                    remarks="Verified via Face Match",
                    student_note=None,
                )
            ]
        )
        response = client.get("/api/v1/teacher/classes/cls-101/students/std-101/history")
        assert response.status_code == 200
        data = response.json()
        assert data["student_name"] == "Aarav Sharma"
        assert data["attendance_percentage"] == 80.0
        assert len(data["sessions"]) == 1
        assert data["sessions"][0]["status"] == "Present"
    app.dependency_overrides.clear()


def test_get_class_attendance_matrix(mock_teacher_user, mock_teacher_profile):
    from app.schemas.teacher import AttendanceMatrixResponse, AttendanceMatrixSessionItem, AttendanceMatrixStudentItem
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    app.dependency_overrides[get_current_teacher] = lambda: mock_teacher_profile

    with patch("app.services.teacher_service.TeacherService.get_class_attendance_matrix", new_callable=AsyncMock) as mock_mat:
        mock_mat.return_value = AttendanceMatrixResponse(
            class_id="cls-101",
            class_name="CS301-A",
            subject="Operating Systems",
            sessions=[
                AttendanceMatrixSessionItem(session_id="ses-1", session_name="S1", session_date="01 Sep")
            ],
            students=[
                AttendanceMatrixStudentItem(
                    student_id="std-101",
                    enrollment_number="ENR-001",
                    full_name="Aarav Sharma",
                    attendance_percentage=100.0,
                    statuses={"ses-1": "Present"},
                )
            ]
        )
        response = client.get("/api/v1/teacher/classes/cls-101/matrix")
        assert response.status_code == 200
        data = response.json()
        assert data["class_name"] == "CS301-A"
        assert len(data["sessions"]) == 1
        assert len(data["students"]) == 1
        assert data["students"][0]["statuses"]["ses-1"] == "Present"
    app.dependency_overrides.clear()
