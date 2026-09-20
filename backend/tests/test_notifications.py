from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient

from main import app
from app.api.dependencies import get_current_user

client = TestClient(app)

class MockUser:
    def __init__(self, user_id="user_123", role="TEACHER", email="teacher@test.com"):
        self.id = user_id
        self.role = role
        self.email = email
        self.fullName = "Test Teacher"
        self.status = "ACTIVE"
        self.createdAt = datetime.now(timezone.utc)
        self.updatedAt = datetime.now(timezone.utc)

class MockAdminUser:
    def __init__(self, user_id="admin_123", role="ADMIN", email="admin@test.com"):
        self.id = user_id
        self.role = role
        self.email = email
        self.fullName = "Test Admin"
        self.status = "ACTIVE"
        self.createdAt = datetime.now(timezone.utc)
        self.updatedAt = datetime.now(timezone.utc)


def test_get_notifications_empty():
    mock_teacher = MockUser()
    app.dependency_overrides[get_current_user] = lambda: mock_teacher

    with patch("app.api.notifications.get_user_notifications", new_callable=AsyncMock) as mock_get:
        from app.schemas.notification import NotificationListResponse
        mock_get.return_value = NotificationListResponse(items=[], total_count=0, unread_count=0)
        response = client.get("/api/v1/notifications")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total_count"] == 0
        assert data["unread_count"] == 0

    app.dependency_overrides.clear()


def test_get_notifications_with_items():
    mock_teacher = MockUser()
    app.dependency_overrides[get_current_user] = lambda: mock_teacher

    from app.schemas.notification import NotificationListResponse, NotificationResponse
    mock_item = NotificationResponse(
        id="notif_1",
        user_id="user_123",
        role=None,
        title="Flagged Attendance",
        message="Score: 0.45",
        type="warning",
        category="attendance",
        link="/teacher/review/rec_1",
        is_read=False,
        created_at=datetime.now(timezone.utc),
    )

    with patch("app.api.notifications.get_user_notifications", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = NotificationListResponse(items=[mock_item], total_count=1, unread_count=1)
        response = client.get("/api/v1/notifications?category=attendance")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["title"] == "Flagged Attendance"
        assert data["items"][0]["category"] == "attendance"
        assert data["unread_count"] == 1

    app.dependency_overrides.clear()


def test_mark_notification_read():
    mock_teacher = MockUser()
    app.dependency_overrides[get_current_user] = lambda: mock_teacher

    with patch("app.api.notifications.mark_notification_read", new_callable=AsyncMock) as mock_mark:
        mock_mark.return_value = True
        response = client.patch("/api/v1/notifications/notif_1/read")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["message"] == "Notification marked as read"

    app.dependency_overrides.clear()


def test_mark_all_read():
    mock_teacher = MockUser()
    app.dependency_overrides[get_current_user] = lambda: mock_teacher

    with patch("app.api.notifications.mark_all_notifications_read", new_callable=AsyncMock) as mock_mark_all:
        mock_mark_all.return_value = 5
        response = client.patch("/api/v1/notifications/mark-all-read")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "5 notifications" in data["message"]

    app.dependency_overrides.clear()


def test_admin_broadcast_forbidden_for_teacher():
    mock_teacher = MockUser()
    app.dependency_overrides[get_current_user] = lambda: mock_teacher

    response = client.post("/api/v1/notifications/broadcast", json={
        "title": "Campus Closed",
        "message": "Heavy rain tomorrow",
        "target_role": "ALL",
        "type": "info"
    })
    assert response.status_code == 403

    app.dependency_overrides.clear()


def test_admin_broadcast_success():
    mock_admin = MockAdminUser()
    app.dependency_overrides[get_current_user] = lambda: mock_admin

    with patch("app.api.notifications.broadcast_announcement", new_callable=AsyncMock) as mock_bcast:
        mock_bcast.return_value = 10
        response = client.post("/api/v1/notifications/broadcast", json={
            "title": "Campus Closed",
            "message": "Heavy rain tomorrow",
            "target_role": "ALL",
            "type": "info"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"

    app.dependency_overrides.clear()

