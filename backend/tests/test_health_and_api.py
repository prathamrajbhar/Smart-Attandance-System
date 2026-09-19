from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app
from app.schemas.health import ServiceHealth

client = TestClient(app)


def test_public_health_endpoint():
    with patch("app.api.health.check_database", new_callable=AsyncMock) as mock_db, \
         patch("app.api.health.check_redis", new_callable=AsyncMock) as mock_redis, \
         patch("app.api.health.check_s3") as mock_s3:

        mock_db.return_value = ServiceHealth(status="healthy", latency_ms=1.2, details={"engine": "PostgreSQL"})
        mock_redis.return_value = ServiceHealth(status="healthy", latency_ms=0.5, details={"mode": "Async Redis Client"})
        mock_s3.return_value = ServiceHealth(status="healthy", latency_ms=2.0, details={"bucket": "smart-attendance"})

        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "services" in data
        assert data["services"]["database"]["status"] == "healthy"
        assert data["services"]["redis"]["status"] == "healthy"
        assert data["services"]["storage"]["status"] == "healthy"


def test_invalid_auth_token_rejected():
    response = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid.token.payload"})
    assert response.status_code == 401
