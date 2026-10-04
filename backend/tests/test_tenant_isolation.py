import pytest
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace
from fastapi.testclient import TestClient
from main import app
from app.core.security import create_access_token
from app.schemas.health import ServiceHealth

@pytest.mark.asyncio
async def test_tenant_middleware_exempt_health():
    with patch("app.api.health.check_database", new_callable=AsyncMock) as mock_db, \
         patch("app.api.health.check_redis", new_callable=AsyncMock) as mock_redis, \
         patch("app.api.health.check_s3") as mock_s3:
        mock_db.return_value = ServiceHealth(status="healthy", latency_ms=1.0)
        mock_redis.return_value = ServiceHealth(status="healthy", latency_ms=0.5)
        mock_s3.return_value = ServiceHealth(status="healthy", latency_ms=1.5)

        client = TestClient(app)
        res = client.get("/health")
        assert res.status_code == 200

@pytest.mark.asyncio
async def test_tenant_middleware_missing_tenant_header():
    client = TestClient(app)
    # Protected endpoint requires tenant context
    res = client.get("/api/v1/admin/setup/departments", headers={"X-Strict-Tenant-Check": "true"})
    assert res.status_code == 400
    assert "Tenant context missing" in res.json()["detail"]

@pytest.mark.asyncio
async def test_tenant_middleware_valid_header(mock_redis):
    # Prime mock redis cache with resolved tenant
    await mock_redis.set("tenant:resolved:default-institution", "00000000-0000-0000-0000-000000000001")

    admin_token = create_access_token(subject="usr-adm-01", role="ADMIN")
    mock_user = SimpleNamespace(id="usr-adm-01", email="admin@demo.edu", role="ADMIN", isActive=True)

    with patch("app.api.dependencies.UserRepository.get_by_id", new_callable=AsyncMock) as mock_user_get, \
         patch("app.services.admin_service.DepartmentService.get_all_departments", new_callable=AsyncMock) as mock_dept_get:
        mock_user_get.return_value = mock_user
        mock_dept_get.return_value = []

        client = TestClient(app)
        res = client.get(
            "/api/v1/admin/departments",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "X-Tenant-ID": "default-institution",
            },
        )
        assert res.status_code == 200

@pytest.mark.asyncio
async def test_tenant_middleware_custom_domain_resolution(mock_redis):
    # Prime mock redis cache with custom domain
    await mock_redis.set("tenant:resolved:attendance.stanford.edu", "stanford-tenant-id")

    admin_token = create_access_token(subject="usr-adm-01", role="ADMIN")
    mock_user = SimpleNamespace(id="usr-adm-01", email="admin@stanford.edu", role="ADMIN", isActive=True)

    with patch("app.api.dependencies.UserRepository.get_by_id", new_callable=AsyncMock) as mock_user_get, \
         patch("app.services.admin_service.DepartmentService.get_all_departments", new_callable=AsyncMock) as mock_dept_get:
        mock_user_get.return_value = mock_user
        mock_dept_get.return_value = []

        client = TestClient(app)
        # Request incoming via custom domain Host header
        res = client.get(
            "/api/v1/admin/departments",
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Host": "attendance.stanford.edu",
            },
        )
        assert res.status_code == 200


@pytest.mark.asyncio
async def test_tenant_spoofing_mismatch_rejected_403():
    # User token has claims binding them strictly to tenant-alpha
    token_with_tid = create_access_token(
        subject="usr-adm-01",
        role="ADMIN",
        extra_data={"tid": "tenant-alpha"},
    )
    client = TestClient(app)
    # Attacker tries to access tenant-bravo by tampering with X-Tenant-ID header
    res = client.get(
        "/api/v1/admin/departments",
        headers={
            "Authorization": f"Bearer {token_with_tid}",
            "X-Tenant-ID": "tenant-bravo",
        },
    )
    assert res.status_code == 403
    assert "Cross-tenant context manipulation detected" in res.json()["detail"]


@pytest.mark.asyncio
async def test_security_headers_present():
    with patch("app.api.health.check_database", new_callable=AsyncMock) as mock_db, \
         patch("app.api.health.check_redis", new_callable=AsyncMock) as mock_redis, \
         patch("app.api.health.check_s3") as mock_s3:
        mock_db.return_value = ServiceHealth(status="healthy", latency_ms=1.0)
        mock_redis.return_value = ServiceHealth(status="healthy", latency_ms=0.5)
        mock_s3.return_value = ServiceHealth(status="healthy", latency_ms=1.5)

        client = TestClient(app)
        res = client.get("/health")
        assert res.status_code == 200
        assert res.headers["Strict-Transport-Security"] == "max-age=63072000; includeSubDomains; preload"
        assert res.headers["X-Content-Type-Options"] == "nosniff"
        assert res.headers["X-Frame-Options"] == "DENY"
        assert res.headers["X-XSS-Protection"] == "0"
        assert res.headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
        assert "camera=(self)" in res.headers["Permissions-Policy"]
        assert "frame-ancestors 'none'" in res.headers["Content-Security-Policy"]



def test_sentry_debug_disabled_in_production():
    with patch("main.settings.ENVIRONMENT", "production"):
        client = TestClient(app)
        res = client.get("/sentry-debug")
        assert res.status_code == 404

