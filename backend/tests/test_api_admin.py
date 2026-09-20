import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch, MagicMock
from types import SimpleNamespace
from fastapi.testclient import TestClient

from main import app
from app.api.dependencies import get_current_user
from app.schemas.admin import (
    BulkImportResponse, ClassResponse, EnrollStudentsResponse,
    AdminStatsResponse, AuditLogResponse, DepartmentResponse,
)
from app.schemas.student import StudentResponse
from app.schemas.teacher import TeacherResponse
from app.schemas.master_data import SubjectResponse, ClassroomResponse, DesignationResponse
from app.schemas.pagination import PaginatedResponse

client = TestClient(app)

def test_admin_route_forbidden_for_teacher(mock_teacher_user):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    response = client.get("/api/v1/admin/stats")
    assert response.status_code == 403
    app.dependency_overrides.clear()

def test_admin_route_forbidden_for_student(mock_student_user):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    response = client.get("/api/v1/admin/stats")
    assert response.status_code == 403
    app.dependency_overrides.clear()

def test_create_student_admin(mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    with patch("app.services.admin_service.AdminService.create_student", new_callable=AsyncMock) as mock_create:
        mock_create.return_value = StudentResponse(
            id="stu-101",
            user_id="usr-101",
            enrollment_number="CS-2024-0099",
            email="freshman.alok@yopmail.com",
            first_name="Alok",
            last_name="Nath",
            phone="+1555123987",
            gender="Male",
            semester=1,
            batch="2024-2028",
        )
        response = client.post("/api/v1/admin/users/student", json={
            "email": "freshman.alok@yopmail.com",
            "first_name": "Alok",
            "last_name": "Nath",
            "enrollment_number": "CS-2024-0099",
            "phone": "+1555123987",
            "gender": "Male",
            "semester": 1,
            "batch": "2024-2028",
        })
        assert response.status_code == 201
        data = response.json()
        assert data["enrollment_number"] == "CS-2024-0099"
        assert data["email"] == "freshman.alok@yopmail.com"
    app.dependency_overrides.clear()

def test_bulk_create_students(mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    with patch("app.services.admin_service.AdminService.bulk_create_students", new_callable=AsyncMock) as mock_bulk:
        mock_bulk.return_value = BulkImportResponse(
            imported_count=2,
            failed_count=0,
            invitations_sent=2,
            errors=[],
        )
        response = client.post("/api/v1/admin/users/students/bulk", json={
            "students": [
                {"email": "student.one@yopmail.com", "first_name": "One", "last_name": "User", "enrollment_number": "CS-001"},
                {"email": "student.two@yopmail.com", "first_name": "Two", "last_name": "User", "enrollment_number": "CS-002"},
            ],
            "send_invite": True,
        })
        assert response.status_code == 200
        data = response.json()
        assert data["imported_count"] == 2
        assert data["failed_count"] == 0
    app.dependency_overrides.clear()

def test_create_class_and_assign_teacher(mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    with patch("app.services.admin_service.AdminService.create_class", new_callable=AsyncMock) as mock_create, \
         patch("app.services.admin_service.AdminService.assign_teacher", new_callable=AsyncMock) as mock_assign:
        
        mock_create.return_value = ClassResponse(
            id="cls-new-99",
            name="Cloud Computing Sec B",
            subject_name="Cloud Computing",
            subject_code="CS702",
            teacherId="tch-profile-202",
            classroom_name="LH 1",
            semester=7,
            batch="2021-2025",
            max_students=75,
            enrolled_count=0,
        )
        resp_create = client.post("/api/v1/admin/classes", json={
            "name": "Cloud Computing Sec B",
            "subject_id": "sub-cc-702",
            "classroom_id": "room-lh-01",
            "teacher_id": "tch-profile-202",
            "semester": 7,
            "batch": "2021-2025",
            "max_students": 75,
        })
        assert resp_create.status_code == 201
        assert resp_create.json()["name"] == "Cloud Computing Sec B"

        mock_assign.return_value = ClassResponse(
            id="cls-new-99",
            name="Cloud Computing Sec B",
            subject_name="Cloud Computing",
            subject_code="CS702",
            teacherId="tch-profile-303",
            semester=7,
            batch="2021-2025",
            max_students=75,
            enrolled_count=0,
        )
        resp_assign = client.put("/api/v1/admin/classes/cls-new-99/assign-teacher", json={
            "teacher_id": "tch-profile-303"
        })
        assert resp_assign.status_code == 200
        assert resp_assign.json()["teacherId"] == "tch-profile-303"
    app.dependency_overrides.clear()

def test_enroll_students_in_class(mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    with patch("app.services.admin_service.AdminService.enroll_students", new_callable=AsyncMock) as mock_enroll:
        mock_enroll.return_value = 15
        response = client.post("/api/v1/admin/classes/cls-ai-601/enroll", json={
            "student_ids": [f"stu-id-{i}" for i in range(15)]
        })
        assert response.status_code == 200
        data = response.json()
        assert data["enrolled_count"] == 15
        assert "Successfully enrolled 15 students" in data["message"]
    app.dependency_overrides.clear()

def test_department_crud(mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    with patch("app.services.admin_service.AdminService.create_department", new_callable=AsyncMock) as mock_create, \
         patch("app.services.admin_service.AdminService.get_all_departments", new_callable=AsyncMock) as mock_get_all, \
         patch("app.services.admin_service.AdminService.delete_department", new_callable=AsyncMock) as mock_del:
        
        mock_create.return_value = DepartmentResponse(
            id="dept-ee-01",
            name="Electrical Engineering",
            code="EE",
            head="Dr. Priya Nair",
            description="Electrical & Electronics",
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc),
        )
        create_res = client.post("/api/v1/admin/departments", json={
            "name": "Electrical Engineering",
            "code": "EE",
            "head": "Dr. Priya Nair",
            "description": "Electrical & Electronics",
        })
        assert create_res.status_code == 200
        assert create_res.json()["code"] == "EE"

        mock_get_all.return_value = [mock_create.return_value]
        list_res = client.get("/api/v1/admin/departments")
        assert list_res.status_code == 200
        assert len(list_res.json()) == 1

        mock_del.return_value = None
        del_res = client.delete("/api/v1/admin/departments/dept-ee-01")
        assert del_res.status_code == 200
        assert del_res.json()["status"] == "success"
    app.dependency_overrides.clear()

def test_get_admin_stats(mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    with patch("app.services.admin_service.AdminService.get_stats", new_callable=AsyncMock) as mock_stats:
        mock_stats.return_value = AdminStatsResponse(
            studentCount=450,
            teacherCount=32,
            classCount=28,
            attendanceCount=380,
            biometricPassRate=88.5,
        )
        response = client.get("/api/v1/admin/stats")
        assert response.status_code == 200
        data = response.json()
        assert data["studentCount"] == 450
        assert data["biometricPassRate"] == 88.5
    app.dependency_overrides.clear()

def test_audit_logs_and_export(mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    with patch("app.services.admin_service.AdminService.get_audit_logs", new_callable=AsyncMock) as mock_logs, \
         patch("app.services.admin_service.AdminService.export_audit_logs_csv", new_callable=AsyncMock) as mock_csv:
        
        mock_logs.return_value = PaginatedResponse.create(
            items=[
                AuditLogResponse(
                    id="aud-1",
                    timestamp=datetime.now(timezone.utc),
                    eventType="USER_CREATED",
                    severity="INFO",
                    actor="admin.smith@yopmail.com",
                    target="student.rahul@yopmail.com",
                    description="Student account provisioned",
                )
            ],
            total_items=1,
            page=1,
            page_size=20,
        )
        response = client.get("/api/v1/admin/audit")
        assert response.status_code == 200
        assert response.json()["total_items"] == 1

        mock_csv.return_value = "id,timestamp,eventType,actor\naud-1,2026-09-20,USER_CREATED,admin.smith@yopmail.com"
        csv_resp = client.get("/api/v1/admin/audit/export")
        assert csv_resp.status_code == 200
        assert "admin.smith@yopmail.com" in csv_resp.text
    app.dependency_overrides.clear()

def test_scan_absentees_anomalies(mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    mock_student = SimpleNamespace(
        id="stu-profile-303",
        firstName="Rahul",
        lastName="Verma",
        enrollmentNumber="CS-2024-0042",
    )
    records = [
        SimpleNamespace(
            studentId="stu-profile-303",
            status="Absent",
            createdAt=datetime(2026, 9, 14, 10, 0, tzinfo=timezone.utc),
            student=mock_student,
        ) for _ in range(6)
    ]
    with patch("app.repositories.attendance_repo.AttendanceRepository.get_all_absences", new_callable=AsyncMock) as mock_abs, \
         patch("app.api.admin.run_absentee_scan", new_callable=AsyncMock) as mock_scan:
        
        mock_abs.return_value = records
        mock_scan.return_value = [{
            "student_id": "stu-profile-303",
            "student_name": "Rahul Verma",
            "enrollment_number": "CS-2024-0042",
            "total_absences": 6,
            "anomaly_score": 0.88,
        }]

        response = client.post("/api/v1/admin/scan-absentees?contamination=0.15")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["student_name"] == "Rahul Verma"
        assert data[0]["anomaly_score"] == 0.88
    app.dependency_overrides.clear()
