from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from prisma.models import User
from main import app
from app.api.dependencies import get_current_user
from app.schemas.search import GlobalSearchResponse, SearchResultItem

client = TestClient(app)


def test_global_search_teacher():
    mock_user = User(
        id="usr-teacher-1",
        email="teacher@university.edu",
        hashedPassword="hashed",
        mustChangePassword=False,
        role="TEACHER",
        isActive=True,
        createdAt="2026-01-01T00:00:00Z",
        updatedAt="2026-01-01T00:00:00Z",
    )
    app.dependency_overrides[get_current_user] = lambda: mock_user

    with patch("app.services.search_service.GlobalSearchService.search", new_callable=AsyncMock) as mock_search:
        mock_search.return_value = GlobalSearchResponse(
            query="ananya",
            total_results=1,
            results=[
                SearchResultItem(
                    id="student-1",
                    title="Ananya Deshmukh",
                    subtitle="PRN2024CSE005 • CS401",
                    category="student",
                    href="/teacher/analytics",
                    badge="Enrolled",
                    icon_type="graduation-cap",
                )
            ]
        )
        response = client.get("/api/v1/search?q=ananya")
        assert response.status_code == 200
        data = response.json()
        assert data["query"] == "ananya"
        assert data["total_results"] == 1
        assert data["results"][0]["title"] == "Ananya Deshmukh"
        assert data["results"][0]["category"] == "student"

    app.dependency_overrides.clear()


def test_global_search_admin():
    mock_user = User(
        id="usr-admin-1",
        email="admin@university.edu",
        hashedPassword="hashed",
        mustChangePassword=False,
        role="ADMIN",
        isActive=True,
        createdAt="2026-01-01T00:00:00Z",
        updatedAt="2026-01-01T00:00:00Z",
    )
    app.dependency_overrides[get_current_user] = lambda: mock_user

    with patch("app.services.search_service.GlobalSearchService.search", new_callable=AsyncMock) as mock_search:
        mock_search.return_value = GlobalSearchResponse(
            query="aarav",
            total_results=1,
            results=[
                SearchResultItem(
                    id="teacher-1",
                    title="Prof. Aarav Sharma",
                    subtitle="EMP-1001 • Computer Science",
                    category="faculty",
                    href="/admin/users/teachers/teacher-1",
                    badge="Faculty",
                    icon_type="users",
                )
            ]
        )
        response = client.get("/api/v1/search?q=aarav")
        assert response.status_code == 200
        data = response.json()
        assert data["query"] == "aarav"
        assert data["results"][0]["title"] == "Prof. Aarav Sharma"
        assert data["results"][0]["category"] == "faculty"

    app.dependency_overrides.clear()
