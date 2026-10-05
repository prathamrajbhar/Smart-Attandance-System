import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace
from fastapi.testclient import TestClient
from main import app
from app.api.dependencies import get_current_user
from app.core.security import create_access_token

@pytest.fixture
def super_admin_token():
    return create_access_token(subject="usr-super-admin-01", role="SUPER_ADMIN")

@pytest.fixture
def student_token():
    return create_access_token(subject="usr-stu-01", role="STUDENT")

@pytest.mark.asyncio
async def test_super_admin_stats(super_admin_token):
    mock_user = SimpleNamespace(id="usr-super-admin-01", email="super@platform.io", role="SUPER_ADMIN", isActive=True)
    app.dependency_overrides[get_current_user] = lambda: mock_user
    with patch("app.services.super_admin_service.db") as mock_db:
        mock_db.tenant.count = AsyncMock(return_value=5)
        mock_db.student.count = AsyncMock(return_value=500)
        mock_db.teacher.count = AsyncMock(return_value=40)
        mock_db.session.count = AsyncMock(return_value=12)
        mock_db.attendance.count = AsyncMock(return_value=1200)

        client = TestClient(app)
        res = client.get("/api/v1/super-admin/stats", headers={"Authorization": f"Bearer {super_admin_token}"})
        assert res.status_code == 200
        data = res.json()
        assert data["total_tenants"] == 5
        assert data["total_students"] == 500

@pytest.mark.asyncio
async def test_super_admin_provision_tenant(super_admin_token):
    mock_user = SimpleNamespace(id="usr-super-admin-01", email="super@platform.io", role="SUPER_ADMIN", isActive=True)
    now = datetime.now(timezone.utc)
    mock_tenant = SimpleNamespace(
        id="tnt-greenwood-01", slug="greenwood-high", name="Greenwood High School",
        type="SCHOOL", status="ACTIVE", domain=None, licenseCount=800,
        createdAt=now, updatedAt=now, config={},
    )
    mock_admin_user = SimpleNamespace(id="usr-greenwood-adm", email="admin@greenwood.edu", role="TENANT_ADMIN")

    app.dependency_overrides[get_current_user] = lambda: mock_user
    with patch("app.services.super_admin_service.db") as mock_db, \
         patch("app.services.auth_service.AuthService.create_invitation_token", new_callable=AsyncMock) as mock_invite, \
         patch("app.services.email_service.email_service.send_invitation_email", new_callable=AsyncMock) as mock_email:
        mock_db.tenant.find_unique = AsyncMock(return_value=None)
        mock_db.user.find_unique = AsyncMock(return_value=None)
        mock_db.tenant.create = AsyncMock(return_value=mock_tenant)
        mock_db.user.create = AsyncMock(return_value=mock_admin_user)
        mock_db.systemconfiguration.create = AsyncMock(return_value=None)
        mock_db.auditlog.create = AsyncMock(return_value=None)
        mock_invite.return_value = "mock-invite-token"

        payload = {
            "name": "Greenwood High School",
            "slug": "greenwood-high",
            "type": "SCHOOL",
            "license_count": 800,
            "admin_email": "admin@greenwood.edu",
            "admin_name": "Principal Skinner",
        }

        client = TestClient(app)
        res = client.post("/api/v1/super-admin/tenants", json=payload, headers={"Authorization": f"Bearer {super_admin_token}"})
        assert res.status_code == 201
        data = res.json()
        assert data["slug"] == "greenwood-high"
        assert data["type"] == "SCHOOL"

@pytest.mark.asyncio
async def test_super_admin_provision_tenant_multiple_admins(super_admin_token):
    mock_user = SimpleNamespace(id="usr-super-admin-01", email="super@platform.io", role="SUPER_ADMIN", isActive=True)
    now = datetime.now(timezone.utc)
    mock_tenant = SimpleNamespace(
        id="tnt-tech-01", slug="tech-inst", name="Tech Institute",
        type="COLLEGE", status="ACTIVE", domain=None, licenseCount=1000,
        createdAt=now, updatedAt=now, config={},
    )
    admin_counter = 0
    def mock_create_user(data):
        nonlocal admin_counter
        admin_counter += 1
        return SimpleNamespace(id=f"usr-adm-{admin_counter}", email=data["email"], role=data["role"])

    app.dependency_overrides[get_current_user] = lambda: mock_user
    with patch("app.services.super_admin_service.db") as mock_db, \
         patch("app.services.auth_service.AuthService.create_invitation_token", new_callable=AsyncMock) as mock_invite, \
         patch("app.services.email_service.email_service.send_invitation_email", new_callable=AsyncMock) as mock_email:
        mock_db.tenant.find_unique = AsyncMock(return_value=None)
        mock_db.user.find_unique = AsyncMock(return_value=None)
        mock_db.tenant.create = AsyncMock(return_value=mock_tenant)
        mock_db.user.create = AsyncMock(side_effect=mock_create_user)
        mock_db.systemconfiguration.create = AsyncMock(return_value=None)
        mock_db.auditlog.create = AsyncMock(return_value=None)
        mock_invite.return_value = "mock-invite-token"

        payload = {
            "name": "Tech Institute",
            "slug": "tech-inst",
            "type": "COLLEGE",
            "license_count": 1000,
            "admins": [
                {"name": "Admin One", "email": "admin1@tech.edu", "role": "TENANT_ADMIN"},
                {"name": "Staff Admin Two", "email": "staff@tech.edu", "role": "ADMIN"},
            ],
        }

        client = TestClient(app)
        res = client.post("/api/v1/super-admin/tenants", json=payload, headers={"Authorization": f"Bearer {super_admin_token}"})
        assert res.status_code == 201
        data = res.json()
        assert len(data["admin_users"]) == 2
        assert mock_email.call_count == 2

@pytest.mark.asyncio
async def test_super_admin_unauthorized_student(student_token):
    mock_user = SimpleNamespace(id="usr-stu-01", email="student@yopmail.com", role="STUDENT", isActive=True)
    app.dependency_overrides[get_current_user] = lambda: mock_user
    client = TestClient(app)
    res = client.get("/api/v1/super-admin/stats", headers={"Authorization": f"Bearer {student_token}"})
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_super_admin_unauthorized_standard_admin():
    admin_token = create_access_token(subject="usr-adm-01", role="ADMIN")
    mock_user = SimpleNamespace(id="usr-adm-01", email="admin@demo.edu", role="ADMIN", isActive=True)
    app.dependency_overrides[get_current_user] = lambda: mock_user
    client = TestClient(app)
    res = client.get("/api/v1/super-admin/stats", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 403
    assert "Insufficient permissions" in res.json()["detail"]


@pytest.mark.asyncio
async def test_super_admin_trigger_password_reset_via_email(super_admin_token):
    mock_user = SimpleNamespace(id="usr-super-admin-01", email="super@platform.io", role="SUPER_ADMIN", isActive=True)
    target_user = SimpleNamespace(id="usr-target-01", email="teacher.patel@school.edu", role="TEACHER", tenantId="tnt-01")
    app.dependency_overrides[get_current_user] = lambda: mock_user

    with patch("app.services.super_admin_service.db") as mock_db, \
         patch("app.services.auth_service.AuthService.request_password_reset", new_callable=AsyncMock) as mock_reset_email:
        mock_db.user.find_unique = AsyncMock(return_value=target_user)
        mock_db.auditlog.create = AsyncMock(return_value=None)
        mock_reset_email.return_value = True

        client = TestClient(app)
        res = client.post("/api/v1/super-admin/users/usr-target-01/reset-password", headers={"Authorization": f"Bearer {super_admin_token}"})
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "password_reset_email_dispatched"
        mock_reset_email.assert_called_once_with("teacher.patel@school.edu", frontend_url="http://localhost:3000")


@pytest.mark.asyncio
async def test_super_admin_create_global_broadcast(super_admin_token):
    mock_user = SimpleNamespace(id="usr-super-admin-01", email="super@platform.io", role="SUPER_ADMIN", isActive=True)
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_recipients = [
        SimpleNamespace(id="u1", role="TEACHER"),
        SimpleNamespace(id="u2", role="STUDENT"),
    ]

    with patch("app.services.super_admin_service.db") as mock_db, \
         patch("app.api.ws.manager.broadcast", new_callable=AsyncMock) as mock_ws_broadcast:
        mock_db.user.find_many = AsyncMock(return_value=mock_recipients)
        mock_db.notification.create = AsyncMock(return_value=None)
        mock_db.auditlog.create = AsyncMock(return_value=None)

        payload = {
            "title": "Scheduled Maintenance Window",
            "message": "Platform update scheduled for Sunday 2 AM UTC.",
            "target_role": "ALL",
            "type": "warning",
            "category": "maintenance",
        }

        client = TestClient(app)
        res = client.post("/api/v1/super-admin/broadcast", json=payload, headers={"Authorization": f"Bearer {super_admin_token}"})
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "success"
        assert data["delivered_count"] == 2
        assert data["title"] == "Scheduled Maintenance Window"
        assert mock_db.notification.create.call_count == 2
        assert mock_ws_broadcast.call_count == 1


@pytest.mark.asyncio
async def test_super_admin_get_broadcast_history(super_admin_token):
    mock_user = SimpleNamespace(id="usr-super-admin-01", email="super@platform.io", role="SUPER_ADMIN", isActive=True)
    app.dependency_overrides[get_current_user] = lambda: mock_user
    now = datetime.now(timezone.utc)
    mock_logs = [
        SimpleNamespace(
            id="log-bcast-1",
            timestamp=now,
            eventType="GLOBAL_BROADCAST",
            severity="WARNING",
            actor="super@platform.io",
            target="Role:ALL, Tenant:ALL",
            description="Broadcasted 'Scheduled Maintenance Window': Platform update scheduled...",
            metadata={"title": "Scheduled Maintenance Window", "delivered_count": 42},
        )
    ]

    with patch("app.services.super_admin_service.db") as mock_db:
        mock_db.auditlog.count = AsyncMock(return_value=1)
        mock_db.auditlog.find_many = AsyncMock(return_value=mock_logs)

        client = TestClient(app)
        res = client.get("/api/v1/super-admin/broadcasts", headers={"Authorization": f"Bearer {super_admin_token}"})
        assert res.status_code == 200
        data = res.json()
        assert data["total_items"] == 1
        assert len(data["items"]) == 1
        assert data["items"][0]["title"] == "Scheduled Maintenance Window"
        assert data["items"][0]["delivered_count"] == 42


# ---------------------------------------------------------------------------
# License Request Lifecycle
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_license_request_create_and_reject():
    from app.services.super_admin_service import SuperAdminService

    now = datetime.now(timezone.utc)
    mock_tenant = SimpleNamespace(id="tnt-lic-01", name="License Test College", slug="lic-test", licenseCount=100)
    mock_requester = SimpleNamespace(id="usr-req-01", email="admin@lic.edu", role="TENANT_ADMIN", tenantId="tnt-lic-01")
    created_request = SimpleNamespace(
        id="req-001", tenantId="tnt-lic-01", requestedById="usr-req-01",
        requestedCount=50, status="PENDING", createdAt=now,
    )

    with patch("app.services.super_admin_service.db") as mock_db:
        mock_db.tenant.find_unique = AsyncMock(return_value=mock_tenant)
        mock_db.user.find_unique = AsyncMock(return_value=mock_requester)
        mock_db.licenserequest.create = AsyncMock(return_value=created_request)
        mock_db.auditlog.create = AsyncMock(return_value=None)

        result = await SuperAdminService.create_license_request(
            tenant_id="tnt-lic-01", requested_by_user_id="usr-req-01", requested_count=50
        )
        assert result["requested_count"] == 50
        assert result["status"] == "PENDING"
        assert mock_db.licenserequest.create.call_count == 1

    # Reject the request
    mock_request_full = SimpleNamespace(
        id="req-001", tenantId="tnt-lic-01", requestedById="usr-req-01",
        requestedCount=50, status="PENDING",
        tenant=mock_tenant,
    )
    mock_processor = SimpleNamespace(id="usr-super-01", email="super@platform.io", role="SUPER_ADMIN")
    updated_request = SimpleNamespace(
        id="req-001", tenantId="tnt-lic-01", requestedById="usr-req-01",
        requestedCount=50, status="REJECTED", processedById="usr-super-01",
        processedAt=now, createdAt=now, updatedAt=now,
    )

    with patch("app.services.super_admin_service.db") as mock_db:
        mock_db.licenserequest.find_unique = AsyncMock(return_value=mock_request_full)
        mock_db.user.find_unique = AsyncMock(return_value=mock_processor)
        mock_db.licenserequest.update = AsyncMock(return_value=updated_request)
        mock_db.auditlog.create = AsyncMock(return_value=None)

        result = await SuperAdminService.process_license_request(
            request_id="req-001", super_admin_user_id="usr-super-01", approve=False
        )
        assert result["status"] == "REJECTED"
        # Tenant license count should NOT change on reject
        assert mock_db.tenant.update.call_count == 0


@pytest.mark.asyncio
async def test_license_request_approve_increases_count():
    from app.services.super_admin_service import SuperAdminService

    now = datetime.now(timezone.utc)
    mock_tenant = SimpleNamespace(id="tnt-lic-02", name="License Test College", slug="lic-test-2", licenseCount=100)
    mock_request_full = SimpleNamespace(
        id="req-002", tenantId="tnt-lic-02", requestedById="usr-req-02",
        requestedCount=40, status="PENDING", tenant=mock_tenant,
    )
    mock_processor = SimpleNamespace(id="usr-super-01", email="super@platform.io", role="SUPER_ADMIN")
    updated_request = SimpleNamespace(
        id="req-002", tenantId="tnt-lic-02", requestedById="usr-req-02",
        requestedCount=40, status="APPROVED", processedById="usr-super-01",
        processedAt=now, createdAt=now, updatedAt=now,
    )

    with patch("app.services.super_admin_service.db") as mock_db:
        mock_db.licenserequest.find_unique = AsyncMock(return_value=mock_request_full)
        mock_db.user.find_unique = AsyncMock(return_value=mock_processor)
        mock_db.tenant.update = AsyncMock(return_value=None)
        mock_db.licenserequest.update = AsyncMock(return_value=updated_request)
        mock_db.auditlog.create = AsyncMock(return_value=None)

        result = await SuperAdminService.process_license_request(
            request_id="req-002", super_admin_user_id="usr-super-01", approve=True
        )
        assert result["status"] == "APPROVED"
        # Verify tenant license count increased by requested amount
        tenant_update_call = mock_db.tenant.update.call_args
        assert tenant_update_call.kwargs["data"]["licenseCount"] == 140


@pytest.mark.asyncio
async def test_license_request_rejects_non_admin_requester():
    from app.services.super_admin_service import SuperAdminService

    mock_tenant = SimpleNamespace(id="tnt-lic-03", name="T", slug="t", licenseCount=100)
    mock_student = SimpleNamespace(id="usr-stu-01", email="s@x.edu", role="STUDENT", tenantId="tnt-lic-03")

    with patch("app.services.super_admin_service.db") as mock_db:
        mock_db.tenant.find_unique = AsyncMock(return_value=mock_tenant)
        mock_db.user.find_unique = AsyncMock(return_value=mock_student)

        with pytest.raises(ValueError) as exc_info:
            await SuperAdminService.create_license_request(
                tenant_id="tnt-lic-03", requested_by_user_id="usr-stu-01", requested_count=10
            )
        assert "Only tenant administrators" in str(exc_info.value)


@pytest.mark.asyncio
async def test_update_tenant_rejects_license_below_usage():
    from app.services.super_admin_service import SuperAdminService
    from app.schemas.super_admin import TenantUpdateRequest

    with patch("app.services.super_admin_service.db") as mock_db:
        mock_db.tenant.find_unique = AsyncMock(return_value=SimpleNamespace(id="tnt-x", licenseCount=100))
        # Current usage (students + teachers) is 120, which exceeds the requested 50
        mock_db.user.count = AsyncMock(return_value=120)

        with pytest.raises(ValueError) as exc_info:
            await SuperAdminService.update_tenant(
                "tnt-x", TenantUpdateRequest(license_count=50)
            )
        assert "cannot be less than current usage" in str(exc_info.value)



