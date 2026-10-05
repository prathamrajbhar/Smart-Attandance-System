import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch, MagicMock
from types import SimpleNamespace
from fastapi.testclient import TestClient
from main import app
from app.core.security import create_access_token, hash_password

@pytest.fixture
def super_admin_token():
    return create_access_token(subject="usr-super-admin-01", role="SUPER_ADMIN")

@pytest.fixture
def teacher_token():
    return create_access_token(
        subject="usr-teacher-01",
        role="TEACHER",
        extra_data={"tid": "tenant-suspended-01", "tenant_id": "tenant-suspended-01"},
    )

@pytest.fixture
def active_teacher_token():
    return create_access_token(
        subject="usr-teacher-02",
        role="TEACHER",
        extra_data={"tid": "tenant-active-01", "tenant_id": "tenant-active-01"},
    )

@pytest.mark.asyncio
async def test_login_blocked_when_tenant_suspended():
    """Layer 1 QA: User cannot log in when their institution is suspended."""
    mock_user = SimpleNamespace(
        id="usr-teacher-01",
        email="prof.sharma@apex.edu",
        hashedPassword=hash_password("Secret123!"),
        role="TEACHER",
        isActive=True,
        tenantId="tenant-suspended-01",
        mustChangePassword=False,
    )
    mock_tenant = SimpleNamespace(
        id="tenant-suspended-01",
        slug="apex-tech",
        name="Apex Institute of Technology",
        type="COLLEGE",
        status="SUSPENDED",
    )

    with patch("app.services.auth_service.UserRepository.get_by_email", new_callable=AsyncMock) as mock_get_user, \
         patch("app.services.auth_service.db") as mock_db:
        mock_get_user.return_value = mock_user
        mock_db.tenant.find_unique = AsyncMock(return_value=mock_tenant)

        client = TestClient(app)
        res = client.post(
            "/api/v1/auth/login",
            json={"email": "prof.sharma@apex.edu", "password": "Secret123!"},
        )
        assert res.status_code == 403
        assert "currently suspended" in res.json()["detail"]
        assert "Apex Institute of Technology" in res.json()["detail"]

@pytest.mark.asyncio
async def test_login_allowed_when_tenant_active():
    """Layer 1 QA: User logs in successfully when their institution is active."""
    mock_user = SimpleNamespace(
        id="usr-teacher-02",
        email="prof.patel@oxford.edu",
        hashedPassword=hash_password("Secret123!"),
        role="TEACHER",
        isActive=True,
        tenantId="tenant-active-01",
        mustChangePassword=False,
    )
    mock_tenant = SimpleNamespace(
        id="tenant-active-01",
        slug="oxford-inst",
        name="Oxford Institute",
        type="COLLEGE",
        status="ACTIVE",
    )

    with patch("app.services.auth_service.UserRepository.get_by_email", new_callable=AsyncMock) as mock_get_user, \
         patch("app.services.auth_service.db") as mock_db:
        mock_get_user.return_value = mock_user
        mock_db.tenant.find_unique = AsyncMock(return_value=mock_tenant)

        client = TestClient(app)
        res = client.post(
            "/api/v1/auth/login",
            json={"email": "prof.patel@oxford.edu", "password": "Secret123!"},
        )
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["tenant_slug"] == "oxford-inst"
        assert data["tenant_name"] == "Oxford Institute"

@pytest.mark.asyncio
async def test_api_blocked_by_middleware_when_tenant_suspended(teacher_token):
    """Layer 2 QA: Middleware blocks downstream API calls for suspended tenant context."""
    mock_tenant = SimpleNamespace(
        id="tenant-suspended-01",
        slug="apex-tech",
        name="Apex Institute of Technology",
        type="COLLEGE",
        status="SUSPENDED",
        domain=None,
    )

    with patch("app.db.redis.get_redis") as mock_get_redis, \
         patch("app.db.client.db") as mock_db:
        mock_redis = MagicMock()
        mock_redis.get = AsyncMock(return_value=None)
        mock_get_redis.return_value = mock_redis
        mock_db.tenant.find_first = AsyncMock(return_value=mock_tenant)

        client = TestClient(app)
        res = client.get(
            "/api/v1/admin/departments",
            headers={
                "Authorization": f"Bearer {teacher_token}",
                "X-Tenant-ID": "tenant-suspended-01",
            },
        )
        assert res.status_code == 403
        assert "Tenant account is currently suspended" in res.json()["detail"]

@pytest.mark.asyncio
async def test_api_allowed_by_middleware_when_tenant_active(active_teacher_token):
    """Layer 2 QA: Middleware allows downstream API calls for active tenant context."""
    mock_tenant = SimpleNamespace(
        id="tenant-active-01",
        slug="oxford-inst",
        name="Oxford Institute",
        type="COLLEGE",
        status="ACTIVE",
        domain=None,
    )
    mock_user = SimpleNamespace(id="usr-teacher-02", email="prof.patel@oxford.edu", role="ADMIN", isActive=True)

    with patch("app.db.redis.get_redis") as mock_get_redis, \
         patch("app.db.client.db") as mock_db, \
         patch("app.api.dependencies.UserRepository.get_by_id", new_callable=AsyncMock) as mock_user_get, \
         patch("app.services.admin_service.DepartmentService.get_all_departments", new_callable=AsyncMock) as mock_dept_get:
        mock_redis = MagicMock()
        mock_redis.get = AsyncMock(return_value=None)
        mock_redis.setex = AsyncMock(return_value=True)
        mock_get_redis.return_value = mock_redis
        mock_db.tenant.find_first = AsyncMock(return_value=mock_tenant)
        mock_user_get.return_value = mock_user
        mock_dept_get.return_value = []

        client = TestClient(app)
        res = client.get(
            "/api/v1/admin/departments",
            headers={
                "Authorization": f"Bearer {active_teacher_token}",
                "X-Tenant-ID": "tenant-active-01",
            },
        )
        assert res.status_code == 200

@pytest.mark.asyncio
async def test_custom_domain_suspension_interception(teacher_token):
    """Layer 3 QA: Custom domain routing immediately blocks when tenant is suspended."""
    mock_tenant = SimpleNamespace(
        id="tenant-suspended-01",
        slug="apex-tech",
        name="Apex Institute of Technology",
        type="COLLEGE",
        status="SUSPENDED",
        domain="attendance.apex.edu",
    )

    with patch("app.db.redis.get_redis") as mock_get_redis, \
         patch("app.db.client.db") as mock_db:
        mock_redis = MagicMock()
        mock_redis.get = AsyncMock(return_value=None)
        mock_get_redis.return_value = mock_redis
        mock_db.tenant.find_first = AsyncMock(return_value=mock_tenant)

        client = TestClient(app)
        res = client.get(
            "/api/v1/admin/departments",
            headers={
                "Authorization": f"Bearer {teacher_token}",
                "Host": "attendance.apex.edu",
            },
        )
        assert res.status_code == 403
        assert "Tenant account is currently suspended" in res.json()["detail"]

@pytest.mark.asyncio
async def test_super_admin_suspend_and_reactivate_lifecycle(super_admin_token):
    """Layer 4 QA: Super-Admin can suspend and reactivate tenant, with cache eviction & audit tracking."""
    now = datetime.now(timezone.utc)
    tenant_active = SimpleNamespace(
        id="tenant-01", slug="demo-school", name="Demo School",
        type="SCHOOL", status="ACTIVE", domain="portal.demo.edu", licenseCount=500,
        createdAt=now, updatedAt=now, config={},
    )
    tenant_suspended = SimpleNamespace(
        id="tenant-01", slug="demo-school", name="Demo School",
        type="SCHOOL", status="SUSPENDED", domain="portal.demo.edu", licenseCount=500,
        createdAt=now, updatedAt=now, config={},
    )

    app.dependency_overrides = {}
    from app.api.dependencies import get_current_user
    mock_super = SimpleNamespace(id="usr-super-01", email="super@admin.io", role="SUPER_ADMIN", isActive=True)
    app.dependency_overrides[get_current_user] = lambda: mock_super

    with patch("app.services.super_admin_service.db") as mock_db, \
         patch("app.db.redis.get_redis") as mock_get_redis:
        mock_redis = MagicMock()
        mock_redis.delete = AsyncMock(return_value=1)
        mock_redis.setex = AsyncMock(return_value=True)
        mock_get_redis.return_value = mock_redis

        # Step 1: Suspend Tenant
        mock_db.tenant.find_unique = AsyncMock(return_value=tenant_active)
        mock_db.tenant.update = AsyncMock(return_value=tenant_suspended)
        mock_db.user.find_many = AsyncMock(return_value=[])
        mock_db.student.count = AsyncMock(return_value=150)
        mock_db.teacher.count = AsyncMock(return_value=10)
        mock_db.academicclass.count = AsyncMock(return_value=5)
        mock_db.department.count = AsyncMock(return_value=2)
        mock_db.subject.count = AsyncMock(return_value=6)
        mock_db.session.count = AsyncMock(return_value=0)
        mock_db.attendance.count = AsyncMock(return_value=500)

        client = TestClient(app)
        res_suspend = client.put(
            "/api/v1/super-admin/tenants/tenant-01",
            json={"status": "SUSPENDED"},
            headers={"Authorization": f"Bearer {super_admin_token}"},
        )
        assert res_suspend.status_code == 200
        mock_redis.delete.assert_any_call("tenant:resolved:demo-school")
        mock_redis.delete.assert_any_call("tenant:resolved:portal.demo.edu")

        # Step 2: Reactivate Tenant
        mock_db.tenant.find_unique = AsyncMock(return_value=tenant_suspended)
        mock_db.tenant.update = AsyncMock(return_value=tenant_active)
        res_activate = client.put(
            "/api/v1/super-admin/tenants/tenant-01",
            json={"status": "ACTIVE"},
            headers={"Authorization": f"Bearer {super_admin_token}"},
        )
        assert res_activate.status_code == 200
