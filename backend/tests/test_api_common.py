import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient

from main import app
from app.api.dependencies import get_current_user
from app.schemas.notification import NotificationListResponse, NotificationResponse
from app.schemas.health import ServiceHealth

client = TestClient(app)

def test_health_endpoints():
    with patch("app.api.health.check_database", new_callable=AsyncMock) as mock_db, \
         patch("app.api.health.check_redis", new_callable=AsyncMock) as mock_redis, \
         patch("app.api.health.check_s3") as mock_s3:
        
        healthy_service = ServiceHealth(status="healthy", latency_ms=1.2)
        mock_db.return_value = healthy_service
        mock_redis.return_value = healthy_service
        mock_s3.return_value = healthy_service

        res_root = client.get("/health")
        assert res_root.status_code == 200
        assert res_root.json()["status"] == "healthy"
        assert res_root.json()["services"]["database"]["status"] == "healthy"

        res_v1 = client.get("/api/v1/health")
        assert res_v1.status_code == 200
        assert res_v1.json()["status"] == "healthy"

def test_ingest_log_event():
    response = client.post("/api/v1/logs", json={
        "level": "INFO",
        "source": "frontend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "message": "User initiated geofence boundary calculation",
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_notifications_crud(mock_teacher_user):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    now = datetime.now(timezone.utc)

    mock_notif = NotificationResponse(
        id="notif-101",
        user_id=mock_teacher_user.id,
        role="TEACHER",
        title="Leave Application Submitted",
        message="Rahul Verma submitted a leave application for approval.",
        type="info",
        category="leave",
        link="/teacher/leaves",
        is_read=False,
        created_at=now,
    )

    with patch("app.api.notifications.get_user_notifications", new_callable=AsyncMock) as mock_get, \
         patch("app.api.notifications.mark_notification_read", new_callable=AsyncMock) as mock_read, \
         patch("app.api.notifications.mark_all_notifications_read", new_callable=AsyncMock) as mock_all:
        
        mock_get.return_value = NotificationListResponse(items=[mock_notif], total_count=1, unread_count=1)
        res_list = client.get("/api/v1/notifications?category=leave")
        assert res_list.status_code == 200
        assert res_list.json()["total_count"] == 1
        assert res_list.json()["items"][0]["category"] == "leave"

        mock_read.return_value = True
        res_mark = client.patch("/api/v1/notifications/notif-101/read")
        assert res_mark.status_code == 200
        assert res_mark.json()["status"] == "success"

        mock_all.return_value = 3
        res_all = client.patch("/api/v1/notifications/mark-all-read")
        assert res_all.status_code == 200
        assert "3 notifications" in res_all.json()["message"]
    app.dependency_overrides.clear()
