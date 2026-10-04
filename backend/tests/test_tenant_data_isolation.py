import pytest
from unittest.mock import AsyncMock, patch
from types import SimpleNamespace
from fastapi.testclient import TestClient

from main import app
from app.api.dependencies import get_current_user

client = TestClient(app)


def test_tenant_context_dependency_blocks_user_without_tenant():
    """Users without tenantId must be rejected with 403 Forbidden."""
    user_without_tenant = SimpleNamespace(
        id="usr-no-tenant",
        email="orphan@example.com",
        role="ADMIN",
        isActive=True,
        tenantId=None,
    )
    app.dependency_overrides[get_current_user] = lambda: user_without_tenant
    try:
        response = client.get("/api/v1/admin/stats")
        assert response.status_code == 403
        assert "no tenant association" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.clear()


def test_students_list_strictly_scoped_to_tenant():
    """Verify that get_all_students receives the exact tenant_id of the logged-in admin."""
    admin_tenant_a = SimpleNamespace(
        id="adm-a",
        email="admin@inst-a.edu",
        role="TENANT_ADMIN",
        isActive=True,
        tenantId="tenant-alpha-id",
    )
    app.dependency_overrides[get_current_user] = lambda: admin_tenant_a
    with patch("app.services.admin_service.AdminService.get_all_students", new_callable=AsyncMock) as mock_get_students:
        mock_get_students.return_value = {
            "items": [],
            "page": 1,
            "page_size": 10,
            "total_items": 0,
            "total_pages": 1,
            "has_next": False,
            "has_prev": False,
        }
        response = client.get("/api/v1/admin/users/students")
        assert response.status_code == 200
        mock_get_students.assert_called_once()
        call_kwargs = mock_get_students.call_args.kwargs
        assert call_kwargs.get("tenant_id") == "tenant-alpha-id"
    app.dependency_overrides.clear()


def test_teachers_list_strictly_scoped_to_tenant():
    """Verify that get_all_teachers receives the exact tenant_id of the logged-in admin."""
    admin_tenant_b = SimpleNamespace(
        id="adm-b",
        email="admin@inst-b.edu",
        role="TENANT_ADMIN",
        isActive=True,
        tenantId="tenant-bravo-id",
    )
    app.dependency_overrides[get_current_user] = lambda: admin_tenant_b
    with patch("app.services.admin_service.AdminService.get_all_teachers", new_callable=AsyncMock) as mock_get_teachers:
        mock_get_teachers.return_value = {
            "items": [],
            "page": 1,
            "page_size": 10,
            "total_items": 0,
            "total_pages": 1,
            "has_next": False,
            "has_prev": False,
        }
        response = client.get("/api/v1/admin/users/teachers")
        assert response.status_code == 200
        mock_get_teachers.assert_called_once()
        call_kwargs = mock_get_teachers.call_args.kwargs
        assert call_kwargs.get("tenant_id") == "tenant-bravo-id"
    app.dependency_overrides.clear()


def test_classes_list_strictly_scoped_to_tenant():
    """Verify that get_all_classes receives the tenant_id."""
    admin_user = SimpleNamespace(
        id="adm-a",
        email="admin@inst-a.edu",
        role="TENANT_ADMIN",
        isActive=True,
        tenantId="tenant-alpha-id",
    )
    app.dependency_overrides[get_current_user] = lambda: admin_user
    with patch("app.services.admin_service.AdminService.get_all_classes", new_callable=AsyncMock) as mock_get_classes:
        mock_get_classes.return_value = {
            "items": [],
            "page": 1,
            "page_size": 10,
            "total_items": 0,
            "total_pages": 1,
            "has_next": False,
            "has_prev": False,
        }
        response = client.get("/api/v1/admin/classes")
        assert response.status_code == 200
        mock_get_classes.assert_called_once()
        call_kwargs = mock_get_classes.call_args.kwargs
        assert call_kwargs.get("tenant_id") == "tenant-alpha-id"
    app.dependency_overrides.clear()


def test_departments_list_strictly_scoped_to_tenant():
    """Verify that get_all_departments receives the tenant_id."""
    admin_user = SimpleNamespace(
        id="adm-a",
        email="admin@inst-a.edu",
        role="TENANT_ADMIN",
        isActive=True,
        tenantId="tenant-alpha-id",
    )
    app.dependency_overrides[get_current_user] = lambda: admin_user
    with patch("app.services.admin_service.AdminService.get_all_departments", new_callable=AsyncMock) as mock_get_depts:
        mock_get_depts.return_value = []
        response = client.get("/api/v1/admin/departments")
        assert response.status_code == 200
        mock_get_depts.assert_called_once_with(tenant_id="tenant-alpha-id")
    app.dependency_overrides.clear()


def test_system_config_scoped_to_tenant():
    """Verify that system config read and write pass the active tenant_id."""
    admin_user = SimpleNamespace(
        id="adm-a",
        email="admin@inst-a.edu",
        role="TENANT_ADMIN",
        isActive=True,
        tenantId="tenant-custom-id",
    )
    app.dependency_overrides[get_current_user] = lambda: admin_user
    with patch("app.services.system_config_service.SystemConfigService.get_config", new_callable=AsyncMock) as mock_get_cfg:
        mock_get_cfg.return_value = SimpleNamespace(
            id="cfg-1",
            tenantId="tenant-custom-id",
            isFaceRecognitionEnabled=True,
            isGpsVerificationEnabled=True,
            isAiBackgroundValidationEnabled=True,
            updatedAt=None,
        )
        response = client.get("/api/v1/admin/config")
        assert response.status_code == 200
        mock_get_cfg.assert_called_once_with(tenant_id="tenant-custom-id")
    app.dependency_overrides.clear()


def test_cross_tenant_single_student_lookup_blocked():
    """Verify that an admin from Tenant A cannot view a student belonging to Tenant B."""
    admin_tenant_a = SimpleNamespace(
        id="adm-a",
        email="admin@inst-a.edu",
        role="TENANT_ADMIN",
        isActive=True,
        tenantId="tenant-alpha-id",
    )
    app.dependency_overrides[get_current_user] = lambda: admin_tenant_a
    with patch("app.api.admin.db") as mock_db:
        # Mock returns None because the student does not belong to tenant-alpha-id
        mock_db.student.find_first = AsyncMock(return_value=None)
        response = client.get("/api/v1/admin/users/students/stu-belongs-to-b")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        mock_db.student.find_first.assert_called_once_with(
            where={"id": "stu-belongs-to-b", "user": {"is": {"tenantId": "tenant-alpha-id"}}},
            include={"user": True, "department": True},
        )
    app.dependency_overrides.clear()


def test_cross_tenant_single_teacher_lookup_blocked():
    """Verify that an admin from Tenant A cannot view a teacher belonging to Tenant B."""
    admin_tenant_a = SimpleNamespace(
        id="adm-a",
        email="admin@inst-a.edu",
        role="TENANT_ADMIN",
        isActive=True,
        tenantId="tenant-alpha-id",
    )
    app.dependency_overrides[get_current_user] = lambda: admin_tenant_a
    with patch("app.api.admin.db") as mock_db:
        mock_db.teacher.find_first = AsyncMock(return_value=None)
        response = client.get("/api/v1/admin/users/teachers/tch-belongs-to-b")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
        mock_db.teacher.find_first.assert_called_once_with(
            where={"id": "tch-belongs-to-b", "user": {"is": {"tenantId": "tenant-alpha-id"}}},
            include={"user": True, "department": True, "designation": True},
        )
    app.dependency_overrides.clear()


def test_cross_tenant_department_deletion_blocked():
    """Verify that an admin from Tenant A cannot delete a department belonging to Tenant B."""
    admin_tenant_a = SimpleNamespace(
        id="adm-a",
        email="admin@inst-a.edu",
        role="TENANT_ADMIN",
        isActive=True,
        tenantId="tenant-alpha-id",
    )
    app.dependency_overrides[get_current_user] = lambda: admin_tenant_a
    with patch("app.api.admin.db") as mock_db:
        mock_db.is_connected.return_value = True
        mock_db.department.find_first = AsyncMock(return_value=None)  # Not found in tenant-alpha
        response = client.delete("/api/v1/admin/departments/dept-of-b")
        assert response.status_code == 404
        assert "Department not found" in response.json()["detail"]
    app.dependency_overrides.clear()
