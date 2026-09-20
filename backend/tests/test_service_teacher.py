import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch, MagicMock
from types import SimpleNamespace

from app.services.teacher_service import TeacherService
from app.schemas.teacher import GeofenceUpsert, BulkMarkRequest, BulkAttendanceRecord

@pytest.mark.asyncio
async def test_teacher_service_upsert_geofence(mock_teacher_profile, mock_academic_class):
    service = TeacherService()
    now = datetime.now(timezone.utc)
    mock_geofence = SimpleNamespace(
        id="geo-99",
        academicClassId="cls-ai-601",
        latitude=28.6139,
        longitude=77.2090,
        radiusMeters=45.0,
        createdAt=now,
        updatedAt=now,
    )

    with patch.object(service.teacher_repo, "get_by_user_id", new_callable=AsyncMock) as mock_tch_repo, \
         patch.object(service.class_repo, "get_by_id", new_callable=AsyncMock) as mock_cls_repo, \
         patch.object(service.geofence_repo, "upsert_geofence", new_callable=AsyncMock) as mock_geo_repo:
        
        mock_tch_repo.return_value = mock_teacher_profile
        mock_cls_repo.return_value = mock_academic_class
        mock_geo_repo.return_value = mock_geofence

        upsert_data = GeofenceUpsert(latitude=28.6139, longitude=77.2090, radius_meters=45.0)
        res = await service.upsert_geofence(
            user_id=mock_teacher_profile.userId,
            class_id="cls-ai-601",
            data=upsert_data,
        )
        assert res.id == "geo-99"
        assert res.radius_meters == 45.0

@pytest.mark.asyncio
async def test_teacher_service_manual_override(mock_teacher_profile, mock_academic_class):
    service = TeacherService()
    now = datetime.now(timezone.utc)
    mock_session = SimpleNamespace(
        id="ses-101",
        academicClassId="cls-ai-601",
        academicClass=mock_academic_class,
    )
    mock_attendance = SimpleNamespace(
        id="att-rec-1",
        studentId="stu-profile-303",
        sessionId="ses-101",
        status="Present",
    )

    with patch.object(service.teacher_repo, "get_by_user_id", new_callable=AsyncMock) as mock_tch_repo, \
         patch("app.services.teacher_service.db") as mock_db, \
         patch("app.services.gamification_service.GamificationService.recalculate_student_streak", new_callable=AsyncMock):
        
        mock_tch_repo.return_value = mock_teacher_profile
        mock_db.session.find_unique = AsyncMock(return_value=mock_session)
        mock_db.enrollment.find_unique = AsyncMock(return_value=SimpleNamespace(id="enr-1"))
        mock_db.attendance.find_unique = AsyncMock(return_value=mock_attendance)
        mock_db.attendance.update = AsyncMock(return_value=mock_attendance)

        success = await service.manual_override_attendance(
            user_id=mock_teacher_profile.userId,
            session_id="ses-101",
            student_id="stu-profile-303",
            status_val="Present",
        )
        assert success is True

@pytest.mark.asyncio
async def test_teacher_service_bulk_mark(mock_teacher_profile, mock_academic_class):
    service = TeacherService()
    mock_session = SimpleNamespace(
        id="ses-101",
        academicClassId="cls-ai-601",
        academicClass=mock_academic_class,
    )
    with patch.object(service.teacher_repo, "get_by_user_id", new_callable=AsyncMock) as mock_tch_repo, \
         patch("app.services.teacher_service.db") as mock_db, \
         patch("app.services.gamification_service.GamificationService.recalculate_student_streak", new_callable=AsyncMock):
        
        mock_tch_repo.return_value = mock_teacher_profile
        mock_db.session.find_unique = AsyncMock(return_value=mock_session)
        mock_db.attendance.upsert = AsyncMock(return_value=None)

        req = BulkMarkRequest(records=[
            BulkAttendanceRecord(student_id="stu-1", status="Present"),
            BulkAttendanceRecord(student_id="stu-2", status="Present"),
        ])
        count = await service.bulk_mark_attendance(
            session_id="ses-101",
            user_id=mock_teacher_profile.userId,
            request=req,
        )
        assert count == 2
