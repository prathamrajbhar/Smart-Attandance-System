import pytest
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, patch, MagicMock
from types import SimpleNamespace

from app.services.gamification_service import GamificationService

@pytest.mark.asyncio
async def test_recalculate_streak_no_enrollments(mock_student_profile):
    service = GamificationService()
    with patch.object(service.student_repo, "get_by_id", new_callable=AsyncMock) as mock_get, \
         patch("app.db.client.db") as mock_db, \
         patch.object(service.student_repo, "update_streak", new_callable=AsyncMock) as mock_upd, \
         patch.object(service, "_update_redis_score", new_callable=AsyncMock):
        
        mock_get.return_value = mock_student_profile
        mock_db.enrollment.find_many = AsyncMock(return_value=[])
        mock_upd.return_value = True

        res = await service.recalculate_student_streak(mock_student_profile.id)
        assert res["current_streak"] == 0
        assert res["highest_streak"] == mock_student_profile.highestStreak

@pytest.mark.asyncio
async def test_recalculate_streak_consecutive_present(mock_student_profile):
    service = GamificationService()
    now = datetime.now(timezone.utc)
    
    mock_enrollments = [SimpleNamespace(academicClassId="cls-ai-601")]
    mock_sessions = [
        SimpleNamespace(id=f"ses-{i}", academicClassId="cls-ai-601", startTime=now - timedelta(days=i), endTime=now - timedelta(days=i) + timedelta(hours=1), isActive=False)
        for i in range(1, 6)
    ]
    mock_attendance = [
        SimpleNamespace(sessionId=f"ses-{i}", status="Present", createdAt=now - timedelta(days=i))
        for i in range(1, 6)
    ]

    with patch.object(service.student_repo, "get_by_id", new_callable=AsyncMock) as mock_get, \
         patch("app.db.client.db") as mock_db, \
         patch.object(service.student_repo, "update_streak", new_callable=AsyncMock) as mock_upd, \
         patch.object(service, "_update_redis_score", new_callable=AsyncMock):
        
        mock_get.return_value = mock_student_profile
        mock_db.enrollment.find_many = AsyncMock(return_value=mock_enrollments)
        mock_db.session.find_many = AsyncMock(return_value=mock_sessions)
        mock_db.attendance.find_many = AsyncMock(return_value=mock_attendance)
        mock_db.leaverequest.find_many = AsyncMock(return_value=[])
        mock_upd.return_value = True

        res = await service.recalculate_student_streak(mock_student_profile.id)
        assert res["current_streak"] == 5
