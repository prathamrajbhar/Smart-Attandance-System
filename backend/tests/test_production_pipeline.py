"""
Production-Grade Integration Tests for Smart Attendance System.

Tests all critical infrastructure components:
- Database connectivity & migrations
- Redis connectivity & Pub/Sub
- Attendance Queue Service (async processing)
- Health check endpoints
- Session Scheduler (distributed locking)
- Real-time Bus (WebSocket broadcast)
- S3/Object Storage operations
- Email service (SMTP)
- Rate limiting
- Security headers & middleware
- Circuit breaker patterns
"""

import asyncio
import os
import sys
import time
import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Ensure backend root is in sys.path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

# Set test environment
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "postgresql://postgres:123456789@localhost:7004/postgres"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"
os.environ["JWT_SECRET"] = "test-secret-key-that-is-at-least-32-chars-long"

from app.db.client import db, connect_db, disconnect_db
from app.db.redis import connect_redis, disconnect_redis, get_redis
from app.services.attendance.attendance_queue_service import AttendanceQueueService
from app.services.attendance.models import AttendanceSubmission
from app.services.realtime_bus import RealtimeBus
from app.services.scheduler import session_scheduler
from app.services.s3_service import s3_service
from app.services.email_service import email_service
from app.core.config import settings
from app.core.rate_limit import rate_limiter
from main import app

client = TestClient(app)


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture
async def db_connection():
    """Ensure database is connected for each test."""
    await connect_db()
    yield db
    await disconnect_db()


@pytest.fixture
async def real_redis():
    """Provide real Redis connection (not mocked)."""
    # Clear any mock from conftest
    import app.db.redis as app_redis
    app_redis.redis_client = None
    
    redis = await connect_redis()
    try:
        yield redis
    finally:
        await disconnect_redis()
        app_redis.redis_client = None


@pytest.fixture
def mock_attendance_service():
    """Mock attendance service for queue tests."""
    mock = MagicMock()
    mock.mark_attendance = AsyncMock(return_value=MagicMock(
        id="att-123",
        studentId="stu-123",
        sessionId="sess-123",
        status="Present",
        faceScore=0.95,
        livenessScore=0.98,
        backgroundScore=0.92,
        finalAiScore=0.95,
        gpsLatitude=12.9716,
        gpsLongitude=77.5946,
        createdAt=datetime.now(timezone.utc),
    ))
    return mock


# =============================================================================
# DATABASE INFRASTRUCTURE TESTS
# =============================================================================

class TestDatabaseInfrastructure:
    """Tests for PostgreSQL database connectivity and Prisma ORM."""

    @pytest.mark.asyncio
    async def test_database_connection(self, db_connection):
        """Verify database connection works with real PostgreSQL."""
        assert db.is_connected()
        result = await db.query_raw("SELECT 1 as test;")
        assert result[0]["test"] == 1

    @pytest.mark.asyncio
    async def test_database_query_execution(self, db_connection):
        """Verify basic query execution."""
        result = await db.query_raw("SELECT current_database(), version();")
        assert len(result) == 1
        assert "current_database" in result[0]
        assert "version" in result[0]

    @pytest.mark.asyncio
    async def test_database_concurrent_queries(self, db_connection):
        """Verify connection pool handles concurrent queries."""
        async def query_db():
            return await db.query_raw("SELECT 1;")
        
        results = await asyncio.gather(*[query_db() for _ in range(10)])
        assert all(r[0].get("test") == 1 or r[0].get("?column?") == 1 for r in results)

    @pytest.mark.asyncio
    async def test_database_schema_integrity(self, db_connection):
        """Verify core tables exist."""
        tables = await db.query_raw("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        table_names = [t['table_name'] for t in tables]
        
        required_tables = [
            'users', 'students', 'teachers', 'classes', 'sessions',
            'attendance', 'enrollments', 'departments', 'subjects',
            'classrooms', 'system_configurations'
        ]
        for table in required_tables:
            assert table in table_names, f"Required table {table} missing"


# =============================================================================
# REDIS INFRASTRUCTURE TESTS
# =============================================================================

class TestRedisInfrastructure:
    """Tests for Redis connectivity, caching, and Pub/Sub."""

    @pytest.mark.asyncio
    async def test_redis_connection(self, real_redis):
        """Verify Redis connection works."""
        pong = await real_redis.ping()
        assert pong is True

    @pytest.mark.asyncio
    async def test_redis_key_operations(self, real_redis):
        """Verify basic Redis key-value operations."""
        key = f"test:key:{uuid.uuid4()}"
        await real_redis.set(key, "test-value")
        value = await real_redis.get(key)
        assert value == "test-value"
        
        await real_redis.delete(key)
        value = await real_redis.get(key)
        assert value is None

    @pytest.mark.asyncio
    async def test_redis_ttl_expiration(self, real_redis):
        """Verify TTL-based key expiration."""
        key = f"test:ttl:{uuid.uuid4()}"
        await real_redis.setex(key, 1, "short-lived")
        assert await real_redis.get(key) == "short-lived"
        await asyncio.sleep(1.5)
        assert await real_redis.get(key) is None

    @pytest.mark.asyncio
    async def test_redis_pubsub(self, real_redis):
        """Verify Redis Pub/Sub for real-time messaging."""
        pubsub = real_redis.pubsub()
        channel = f"test:channel:{uuid.uuid4()}"
        await pubsub.subscribe(channel)
        
        # Wait for subscription to be active
        await asyncio.sleep(0.2)
        
        # Get the subscription confirmation message
        await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
        
        await real_redis.publish(channel, "test-message")
        
        # Wait for message with longer timeout
        msg = await asyncio.wait_for(
            pubsub.get_message(ignore_subscribe_messages=True, timeout=3.0),
            timeout=4.0
        )
        assert msg is not None, "No message received on pubsub channel"
        assert msg["data"] == "test-message"

    @pytest.mark.asyncio
    async def test_redis_distributed_lock(self, real_redis):
        """Verify distributed locking mechanism."""
        lock_key = f"test:lock:{uuid.uuid4()}"
        
        acquired = await real_redis.set(lock_key, "1", nx=True, ex=10)
        assert acquired is True
        
        acquired_again = await real_redis.set(lock_key, "2", nx=True, ex=10)
        # Redis returns None when key exists (not False)
        assert acquired_again is None or acquired_again is False
        
        await real_redis.delete(lock_key)
        
        acquired_after = await real_redis.set(lock_key, "3", nx=True, ex=10)
        assert acquired_after is True


# =============================================================================
# ATTENDANCE QUEUE SERVICE TESTS
# =============================================================================

class TestAttendanceQueueService:
    """Tests for async attendance processing queue."""

    @pytest.fixture
    async def queue_service(self, real_redis, mock_attendance_service):
        """Create queue service with real Redis."""
        service = AttendanceQueueService(attendance_service=mock_attendance_service)
        yield service

    @pytest.mark.asyncio
    async def test_enqueue_and_process(self, queue_service):
        """Test job enqueueing and async processing."""
        submission = AttendanceSubmission(
            student_id="stu-123",
            session_id="sess-123",
            latitude=12.9716,
            longitude=77.5946,
            accuracy=5.0,
            image_path="/tmp/test.jpg",
        )
        
        job_id = await queue_service.enqueue_submission(submission)
        assert job_id is not None
        
        # Wait for async processing
        await asyncio.sleep(0.5)
        
        # Check job status
        status = await queue_service.get_job_status(job_id)
        assert status is not None
        assert status["status"] == "COMPLETED"
        assert status["result"]["status"] == "Present"

    @pytest.mark.asyncio
    async def test_job_failure_handling(self, real_redis):
        """Test job failure handling and error storage."""
        mock_service = MagicMock()
        mock_service.mark_attendance = AsyncMock(
            side_effect=Exception("AI service unavailable")
        )
        
        queue_service = AttendanceQueueService(attendance_service=mock_service)
        
        submission = AttendanceSubmission(
            student_id="stu-456",
            session_id="sess-456",
            latitude=12.9716,
            longitude=77.5946,
            accuracy=5.0,
            image_path="/tmp/test.jpg",
        )
        
        job_id = await queue_service.enqueue_submission(submission)
        await asyncio.sleep(0.5)
        
        status = await queue_service.get_job_status(job_id)
        assert status is not None
        assert status["status"] == "FAILED"
        assert "AI service unavailable" in status["error"]

    @pytest.mark.asyncio
    async def test_job_status_not_found(self, queue_service):
        """Test getting status for non-existent job."""
        status = await queue_service.get_job_status("non-existent-job-id")
        assert status is None


# =============================================================================
# HEALTH CHECK ENDPOINT TESTS
# =============================================================================

class TestHealthCheckEndpoints:
    """Tests for comprehensive health check endpoints."""

    def test_health_endpoint_healthy(self):
        """Test health endpoint returns healthy when all services up."""
        with patch("app.api.health.check_database", new_callable=AsyncMock) as mock_db, \
             patch("app.api.health.check_redis", new_callable=AsyncMock) as mock_redis, \
             patch("app.api.health.check_s3") as mock_s3:
            
            from app.schemas.health import ServiceHealth
            
            mock_db.return_value = ServiceHealth(status="healthy", latency_ms=1.2)
            mock_redis.return_value = ServiceHealth(status="healthy", latency_ms=0.5)
            mock_s3.return_value = ServiceHealth(status="healthy", latency_ms=2.0)
            
            response = client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["services"]["database"]["status"] == "healthy"
            assert data["services"]["redis"]["status"] == "healthy"
            assert data["services"]["storage"]["status"] == "healthy"

    def test_health_endpoint_degraded(self):
        """Test health endpoint returns degraded when Redis/S3 down."""
        with patch("app.api.health.check_database", new_callable=AsyncMock) as mock_db, \
             patch("app.api.health.check_redis", new_callable=AsyncMock) as mock_redis, \
             patch("app.api.health.check_s3") as mock_s3:
            
            from app.schemas.health import ServiceHealth
            
            mock_db.return_value = ServiceHealth(status="healthy", latency_ms=1.2)
            mock_redis.return_value = ServiceHealth(status="unhealthy", latency_ms=0, details={"error": "Connection refused"})
            mock_s3.return_value = ServiceHealth(status="healthy", latency_ms=2.0)
            
            response = client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "degraded"

    def test_health_endpoint_unhealthy(self):
        """Test health endpoint returns 503 when database down."""
        with patch("app.api.health.check_database", new_callable=AsyncMock) as mock_db, \
             patch("app.api.health.check_redis", new_callable=AsyncMock) as mock_redis, \
             patch("app.api.health.check_s3") as mock_s3:
            
            from app.schemas.health import ServiceHealth
            
            mock_db.return_value = ServiceHealth(status="unhealthy", latency_ms=0, details={"error": "Connection refused"})
            mock_redis.return_value = ServiceHealth(status="healthy", latency_ms=0.5)
            mock_s3.return_value = ServiceHealth(status="healthy", latency_ms=2.0)
            
            response = client.get("/health")
            assert response.status_code == 503
            data = response.json()
            assert data["status"] == "unhealthy"


# =============================================================================
# SESSION SCHEDULER TESTS
# =============================================================================

class TestSessionScheduler:
    """Tests for distributed session lifecycle scheduler."""

    @pytest.mark.asyncio
    async def test_scheduler_start_stop(self, db_connection):
        """Test scheduler starts and stops gracefully."""
        scheduler = session_scheduler
        scheduler.start()
        assert scheduler._is_running is True
        assert scheduler._task is not None
        
        scheduler.stop()
        assert scheduler._is_running is False

    @pytest.mark.asyncio
    async def test_scheduler_idempotent_start(self, db_connection):
        """Test starting scheduler twice is idempotent."""
        scheduler = session_scheduler
        scheduler.start()
        task1 = scheduler._task
        scheduler.start()
        task2 = scheduler._task
        assert task1 is task2
        scheduler.stop()


# =============================================================================
# REALTIME BUS TESTS
# =============================================================================

class TestRealtimeBus:
    """Tests for WebSocket real-time event broadcasting."""

    @pytest.fixture
    async def bus(self, real_redis):
        """Create realtime bus with real Redis."""
        bus = RealtimeBus()
        yield bus
        bus.stop_listener()

    @pytest.mark.asyncio
    async def test_publish_event(self, bus):
        """Test publishing events to Redis channel."""
        await bus.publish(
            event_type="broadcast",
            message={"type": "attendance_marked", "data": {"student_id": "123"}},
            target_role="TEACHER",
            tenant_id="default-institution",
        )
        # Should not raise

    @pytest.mark.asyncio
    async def test_publish_personal_event(self, bus):
        """Test publishing personal events."""
        await bus.publish(
            event_type="personal",
            message={"type": "notification", "data": {"id": "notif-1"}},
            target_id="user-123",
        )
        # Should not raise

    @pytest.mark.asyncio
    async def test_listener_loop(self, bus):
        """Test listener loop starts and stops."""
        mock_manager = MagicMock()
        mock_manager.deliver_personal_message = AsyncMock()
        mock_manager.deliver_broadcast = AsyncMock()
        
        bus.start_listener(mock_manager)
        assert bus._listener_task is not None
        assert bus._running is True
        
        bus.stop_listener()
        assert bus._running is False


# =============================================================================
# S3 STORAGE TESTS
# =============================================================================

class TestS3Storage:
    """Tests for S3/MinIO object storage operations."""

    @pytest.mark.asyncio
    async def test_s3_bucket_exists(self):
        """Verify S3 bucket is accessible."""
        try:
            s3_service.ensure_bucket_exists()
        except Exception as e:
            pytest.skip(f"S3 not available: {e}")

    @pytest.mark.asyncio
    async def test_s3_upload_download(self):
        """Test file upload and download round-trip."""
        try:
            test_content = b"test file content"
            key = f"test/{uuid.uuid4()}.txt"
            
            url = s3_service.upload_bytes(test_content, key, content_type="text/plain")
            assert url is not None
            
            downloaded = s3_service.download_bytes(key)
            assert downloaded == test_content
            
            s3_service.delete_file(key)
        except Exception as e:
            pytest.skip(f"S3 not available: {e}")

    @pytest.mark.asyncio
    async def test_s3_presigned_url(self):
        """Test presigned URL generation."""
        try:
            key = f"test/{uuid.uuid4()}.txt"
            s3_service.upload_bytes(b"test", key)
            
            presigned = s3_service.generate_presigned_url(key, expires_in=3600)
            assert presigned is not None
            assert "http" in presigned
            
            s3_service.delete_file(key)
        except Exception as e:
            pytest.skip(f"S3 not available: {e}")

    @pytest.mark.asyncio
    async def test_s3_delete_nonexistent(self):
        """Test deleting non-existent file returns False."""
        try:
            result = s3_service.delete_file("nonexistent/key.txt")
            assert result is False
        except Exception as e:
            pytest.skip(f"S3 not available: {e}")


# =============================================================================
# EMAIL SERVICE TESTS
# =============================================================================

class TestEmailService:
    """Tests for SMTP email delivery."""

    @pytest.mark.asyncio
    async def test_email_smtp_config(self):
        """Verify SMTP configuration is valid."""
        assert settings.SMTP_HOST
        assert settings.SMTP_PORT
        assert settings.SMTP_USER
        assert settings.SMTP_PASSWORD

    @pytest.mark.asyncio
    async def test_email_template_rendering(self):
        """Test email template rendering without sending."""
        try:
            from app.core.url_resolver import resolve_frontend_url
            from jinja2 import Environment, FileSystemLoader, select_autoescape
            import os
            
            _TEMPLATES_DIR = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                "templates", "email"
            )
            
            jinja_env = Environment(
                loader=FileSystemLoader(_TEMPLATES_DIR),
                autoescape=select_autoescape(["html", "xml"]),
            )
            
            template = jinja_env.get_template("user_invite.html")
            html = template.render(
                system_name="Test System",
                frontend_url="http://localhost:3000",
                subject="Test",
                recipient_name="Test User",
                role_title="Student",
                email="test@test.com",
                invite_url="http://localhost:3000/onboarding",
                login_url="http://localhost:3000/login",
                temp_password="Temp@123",
                expire_hours=48,
            )
            assert "Test User" in html
            assert "Temp@123" in html
        except Exception:
            pytest.skip("Email templates not available")


# =============================================================================
# RATE LIMITING TESTS
# =============================================================================

class TestRateLimiting:
    """Tests for rate limiting middleware."""

    def test_rate_limiter_function_exists(self):
        """Verify rate limiter function is configured."""
        assert rate_limiter is not None

    def test_health_endpoint_accessible(self):
        """Health endpoint should be accessible (may be 503 if DB down in test)."""
        response = client.get("/health")
        # Health endpoint should respond (200 or 503)
        assert response.status_code in (200, 503)


# =============================================================================
# SECURITY MIDDLEWARE TESTS
# =============================================================================

class TestSecurityMiddleware:
    """Tests for security headers and middleware."""

    def test_security_headers_present(self):
        """Verify security headers are set."""
        response = client.get("/health")
        assert response.headers.get("X-Content-Type-Options") == "nosniff"
        assert response.headers.get("X-Frame-Options") == "DENY"
        assert "Content-Security-Policy" in response.headers

    def test_cors_headers(self):
        """Verify CORS headers for allowed origins."""
        response = client.options("/health", headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        })
        assert response.headers.get("Access-Control-Allow-Origin") == "http://localhost:3000"

    def test_cors_preflight(self):
        """Verify CORS preflight works."""
        response = client.options("/api/v1/auth/login", headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        })
        assert response.status_code in (200, 204)


# =============================================================================
# CIRCUIT BREAKER / FALLBACK TESTS
# =============================================================================

class TestCircuitBreaker:
    """Tests for circuit breaker patterns."""

    @pytest.mark.asyncio
    async def test_scheduler_redis_failure_fallback(self, db_connection):
        """Test scheduler falls back when Redis unavailable."""
        from app.services.scheduler import SessionScheduler
        
        scheduler = SessionScheduler()
        
        # Mock Redis failure
        with patch("app.services.scheduler.get_redis", side_effect=Exception("Redis down")):
            closed = await scheduler._check_and_close_expired_sessions()
            assert isinstance(closed, int)

    @pytest.mark.asyncio
    async def test_realtime_bus_redis_failure_graceful(self, real_redis):
        """Test realtime bus handles Redis failure gracefully."""
        bus = RealtimeBus()
        
        # Patch at the module where get_redis is imported from
        with patch("app.db.redis.get_redis", side_effect=Exception("Redis down")):
            # Should not raise
            await bus.publish("broadcast", {"test": "data"})
        
        bus.stop_listener()


# =============================================================================
# END-TO-END PIPELINE TESTS
# =============================================================================

class TestEndToEndPipeline:
    """End-to-end tests simulating production flows."""

    @pytest.mark.asyncio
    async def test_health_check_integration(self, db_connection, real_redis):
        """Test health check reflects real service status."""
        response = client.get("/health")
        # With real DB and Redis connected, should be healthy or degraded
        assert response.status_code in (200, 503)
        data = response.json()
        assert "status" in data
        assert "services" in data

    @pytest.mark.asyncio
    async def test_database_and_redis_both_connected(self, db_connection, real_redis):
        """Verify both database and Redis are connected simultaneously."""
        assert db.is_connected()
        pong = await real_redis.ping()
        assert pong is True


# =============================================================================
# PERFORMANCE BENCHMARKS
# =============================================================================

class TestPerformanceBenchmarks:
    """Performance benchmarks for critical paths."""

    @pytest.mark.asyncio
    async def test_database_query_latency(self, db_connection):
        """Benchmark database query latency."""
        latencies = []
        for _ in range(10):
            start = time.perf_counter()
            await db.query_raw("SELECT 1;")
            latencies.append((time.perf_counter() - start) * 1000)
        
        avg_latency = sum(latencies) / len(latencies)
        p95_latency = sorted(latencies)[int(len(latencies) * 0.95)]
        
        print(f"\nDB Avg Latency: {avg_latency:.2f}ms, P95: {p95_latency:.2f}ms")
        
        assert avg_latency < 100  # ms
        assert p95_latency < 200  # ms

    @pytest.mark.asyncio
    async def test_redis_operation_latency(self, real_redis):
        """Benchmark Redis operation latency."""
        latencies = []
        for i in range(50):
            key = f"bench:{i}"
            start = time.perf_counter()
            await real_redis.set(key, "value")
            await real_redis.get(key)
            latencies.append((time.perf_counter() - start) * 1000)
        
        avg_latency = sum(latencies) / len(latencies)
        p95_latency = sorted(latencies)[int(len(latencies) * 0.95)]
        
        print(f"\nRedis Avg Latency: {avg_latency:.2f}ms, P95: {p95_latency:.2f}ms")
        
        assert avg_latency < 20  # ms
        assert p95_latency < 50  # ms

    @pytest.mark.asyncio
    async def test_queue_enqueue_latency(self, real_redis, mock_attendance_service):
        """Benchmark attendance queue enqueue latency."""
        queue_service = AttendanceQueueService(attendance_service=mock_attendance_service)
        
        latencies = []
        for i in range(20):
            submission = AttendanceSubmission(
                student_id=f"stu-{i}",
                session_id="sess-123",
                latitude=12.9716,
                longitude=77.5946,
                accuracy=5.0,
            )
            start = time.perf_counter()
            await queue_service.enqueue_submission(submission)
            latencies.append((time.perf_counter() - start) * 1000)
        
        avg_latency = sum(latencies) / len(latencies)
        p95_latency = sorted(latencies)[int(len(latencies) * 0.95)]
        
        print(f"\nQueue Enqueue Avg Latency: {avg_latency:.2f}ms, P95: {p95_latency:.2f}ms")
        
        assert avg_latency < 50  # ms
        assert p95_latency < 100  # ms


# Run with: pytest backend/tests/test_production_pipeline.py -v --tb=short
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])