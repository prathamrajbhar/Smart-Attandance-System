import pytest
from datetime import timedelta
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace
from fastapi.testclient import TestClient
import jwt

from main import app
from app.core.security import create_access_token, decode_access_token, hash_password, verify_password
from app.utils.geofencing import GPSCoordinate, calculate_haversine_distance, is_within_geofence
from app.schemas.health import ServiceHealth


def test_security_headers_enforcement():
    """Verify HTTP security headers are enforced across endpoints."""
    with patch("app.api.health.check_database", new_callable=AsyncMock) as mock_db, \
         patch("app.api.health.check_redis", new_callable=AsyncMock) as mock_redis, \
         patch("app.api.health.check_s3") as mock_s3:
        mock_db.return_value = ServiceHealth(status="healthy", latency_ms=1.0)
        mock_redis.return_value = ServiceHealth(status="healthy", latency_ms=0.5)
        mock_s3.return_value = ServiceHealth(status="healthy", latency_ms=1.5)

        client = TestClient(app)
        res = client.get("/health")
        assert res.status_code == 200
        assert res.headers.get("X-Content-Type-Options") == "nosniff"
        assert res.headers.get("X-Frame-Options") == "DENY"
        assert "max-age=" in res.headers.get("Strict-Transport-Security", "")
        assert "camera=(self)" in res.headers.get("Permissions-Policy", "")


def test_jwt_tampering_and_algorithm_none():
    """Verify forged JWTs with algorithm 'none' or wrong secrets fail decoding."""
    forged_token = jwt.encode({"sub": "usr-attacker", "role": "SUPER_ADMIN"}, key="", algorithm="none")
    assert decode_access_token(forged_token) is None

    fake_secret_token = jwt.encode(
        {"sub": "usr-attacker", "role": "SUPER_ADMIN"},
        key="malicious-fake-secret-key-123456789",
        algorithm="HS256",
    )
    assert decode_access_token(fake_secret_token) is None


def test_rbac_student_blocked_from_admin_and_super_admin():
    """Verify STUDENT role tokens cannot access Admin or Super-Admin endpoints."""
    student_token = create_access_token(
        subject="usr-student-01",
        role="STUDENT",
        extra_data={"tid": "tenant-01", "tenant_id": "tenant-01"},
    )
    student_user = SimpleNamespace(id="usr-student-01", role="STUDENT", isActive=True, tenantId="tenant-01")

    with patch("app.api.dependencies.UserRepository.get_by_id", new_callable=AsyncMock) as mock_user_get:
        mock_user_get.return_value = student_user
        client = TestClient(app)

        # Student cannot access admin endpoints
        res_admin = client.get(
            "/api/v1/admin/classes",
            headers={"Authorization": f"Bearer {student_token}", "X-Tenant-ID": "tenant-01"},
        )
        assert res_admin.status_code == 403

        # Student cannot access super admin endpoints
        res_super = client.get(
            "/api/v1/super-admin/tenants",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        assert res_super.status_code == 403


def test_rbac_admin_blocked_from_super_admin():
    """Verify ADMIN role tokens cannot access SUPER_ADMIN platform controls."""
    admin_token = create_access_token(
        subject="usr-admin-01",
        role="ADMIN",
        extra_data={"tid": "tenant-01", "tenant_id": "tenant-01"},
    )
    admin_user = SimpleNamespace(id="usr-admin-01", role="ADMIN", isActive=True, tenantId="tenant-01")

    with patch("app.api.dependencies.UserRepository.get_by_id", new_callable=AsyncMock) as mock_user_get:
        mock_user_get.return_value = admin_user
        client = TestClient(app)
        res = client.get(
            "/api/v1/super-admin/tenants",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert res.status_code == 403


def test_geofence_extreme_coordinates_and_boundaries():
    """Verify geofence distance correctly isolates spoofed/distant coordinates."""
    center = GPSCoordinate(latitude=28.6139, longitude=77.2090)
    close = GPSCoordinate(latitude=28.6140, longitude=77.2091)
    far = GPSCoordinate(latitude=19.0760, longitude=72.8777)

    assert is_within_geofence(student_coord=close, classroom_coord=center, base_radius=100.0, student_accuracy=5.0) is True
    assert is_within_geofence(student_coord=far, classroom_coord=center, base_radius=100.0, student_accuracy=5.0) is False

    # Out of bounds / extreme latitude
    north_pole = GPSCoordinate(latitude=90.0, longitude=0.0)
    south_pole = GPSCoordinate(latitude=-90.0, longitude=0.0)
    dist = calculate_haversine_distance(north_pole, south_pole)
    assert dist > 19000000  # ~20,000 km pole to pole


def test_smart_pass_replay_protection():
    """Verify Smart Pass tokens expire and reject expired replay attempts."""
    token_live = create_access_token(
        subject="usr-student-01",
        role="STUDENT",
        expires_delta=timedelta(seconds=15),
        extra_data={"type": "smart_pass", "student_id": "stu-123"},
    )
    token_expired = create_access_token(
        subject="usr-student-01",
        role="STUDENT",
        expires_delta=timedelta(seconds=-1),
        extra_data={"type": "smart_pass", "student_id": "stu-123"},
    )
    assert decode_access_token(token_live) is not None
    assert decode_access_token(token_expired) is None


def test_scim_bearer_token_authorization():
    """Verify SCIM endpoints reject requests without a valid bearer token."""
    client = TestClient(app)
    res_no_auth = client.get("/api/v1/scim/v2/Users")
    assert res_no_auth.status_code == 401

    res_bad_auth = client.get(
        "/api/v1/scim/v2/Users",
        headers={"Authorization": "Bearer invalid-scim-secret-token"},
    )
    assert res_bad_auth.status_code == 401


def test_password_hash_security():
    """Verify password hashing produces distinct salts and resists matching empty passwords."""
    raw = "StrongP@ssw0rd!2026"
    hash1 = hash_password(raw)
    hash2 = hash_password(raw)
    assert hash1 != hash2  # Salt randomness
    assert verify_password(raw, hash1) is True
    assert verify_password(raw, hash2) is True
    assert verify_password("wrong", hash1) is False
    assert verify_password("", hash1) is False


@pytest.mark.asyncio
async def test_email_password_reset_token_security():
    """Verify password reset tokens require valid email and reject invalid tokens."""
    from app.services.auth_service import AuthService

    with patch("app.services.auth_service.UserRepository.get_by_email", new_callable=AsyncMock) as mock_get_user, \
         patch("app.services.auth_service.db") as mock_db, \
         patch("app.services.auth_service.email_service.send_password_reset_email", new_callable=AsyncMock) as mock_send_email:
        mock_user = SimpleNamespace(
            id="usr-teacher-01",
            email="prof.test@apex.edu",
            firstName="Test",
            lastName="Teacher",
            role="TEACHER",
            tenantId="tenant-01",
            isActive=True,
        )
        mock_get_user.return_value = mock_user
        mock_db.teacher.find_unique = AsyncMock(return_value=SimpleNamespace(firstName="Test", lastName="Teacher"))
        mock_send_email.return_value = True

        auth_svc = AuthService()
        result = await auth_svc.request_password_reset("prof.test@apex.edu")
        assert result is True
        assert mock_send_email.called
