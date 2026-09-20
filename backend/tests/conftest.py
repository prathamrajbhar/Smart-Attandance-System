import os
import sys

# Ensure backend root is in sys.path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock
from types import SimpleNamespace

# Ensure environment is marked as test
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = "postgresql://mock:mock@localhost:5432/mock_test_db"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"
os.environ["JWT_SECRET"] = "test-secret-key-that-is-at-least-32-chars-long"

class AwaitableMock(MagicMock):
    def __await__(self):
        async def _coro():
            return self
        return _coro().__await__()

@pytest.fixture
def mock_redis():
    """Mock async Redis client for in-memory caching and token denylist."""
    store = {}
    r = AwaitableMock()
    r.get = AsyncMock(side_effect=lambda k: store.get(k))
    r.set = AsyncMock(side_effect=lambda k, v, **kwargs: store.__setitem__(k, v))
    r.setex = AsyncMock(side_effect=lambda k, time, v: store.__setitem__(k, v))
    r.delete = AsyncMock(side_effect=lambda k: store.pop(k, None))
    r.incr = AsyncMock(side_effect=lambda k: store.update({k: store.get(k, 0) + 1}) or store[k])
    r.expire = AsyncMock(return_value=True)
    return r

@pytest.fixture(autouse=True)
def setup_test_redis(mock_redis):
    """Automatically configure mock Redis client for all tests."""
    import app.db.redis as app_redis
    app_redis.redis_client = mock_redis
    yield mock_redis
    app_redis.redis_client = None

@pytest.fixture
def mock_admin_user():
    return SimpleNamespace(
        id="usr-adm-101",
        email="admin.smith@yopmail.com",
        role="ADMIN",
        isActive=True,
        mustChangePassword=False,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

@pytest.fixture
def mock_teacher_user():
    return SimpleNamespace(
        id="usr-tch-202",
        email="prof.sharma@yopmail.com",
        role="TEACHER",
        isActive=True,
        mustChangePassword=False,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

@pytest.fixture
def mock_teacher_profile(mock_teacher_user):
    dept = SimpleNamespace(id="dept-cs-01", name="Computer Science", code="CS")
    desig = SimpleNamespace(id="desig-prof-01", name="Associate Professor", code="ASSOC_PROF")
    return SimpleNamespace(
        id="tch-profile-202",
        userId=mock_teacher_user.id,
        firstName="Rajesh",
        lastName="Sharma",
        employeeId="EMP-CS-2024",
        phone="+1555019283",
        qualification="Ph.D Computer Science",
        specialization="Distributed AI & Systems",
        experienceYears=12,
        joiningDate=datetime(2018, 7, 15, tzinfo=timezone.utc),
        departmentId=dept.id,
        designationId=desig.id,
        department=dept,
        designation=desig,
        user=mock_teacher_user,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

@pytest.fixture
def mock_student_user():
    return SimpleNamespace(
        id="usr-stu-303",
        email="student.rahul@yopmail.com",
        role="STUDENT",
        isActive=True,
        mustChangePassword=False,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

@pytest.fixture
def mock_student_profile(mock_student_user):
    dept = SimpleNamespace(id="dept-cs-01", name="Computer Science", code="CS")
    return SimpleNamespace(
        id="stu-profile-303",
        userId=mock_student_user.id,
        enrollmentNumber="CS-2024-0042",
        firstName="Rahul",
        lastName="Verma",
        phone="+1555987654",
        gender="Male",
        dateOfBirth=datetime(2003, 5, 21, tzinfo=timezone.utc),
        semester=6,
        batch="2022-2026",
        departmentId=dept.id,
        department=dept,
        deviceUuid="dev-uuid-iphone-15-pro",
        fcmToken="fcm-mock-token-303",
        faceEmbedding=[0.12, 0.45, -0.22, 0.89] * 32,
        currentStreak=7,
        highestStreak=14,
        user=mock_student_user,
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )

@pytest.fixture
def mock_academic_class(mock_teacher_profile):
    subject = SimpleNamespace(id="sub-ai-101", name="Artificial Intelligence", code="CS601")
    classroom = SimpleNamespace(id="room-lh-02", name="Lecture Hall 2", building="Tech Block A", capacity=80)
    return SimpleNamespace(
        id="cls-ai-601",
        name="AI & Pattern Recognition - Sec A",
        subjectId=subject.id,
        classroomId=classroom.id,
        teacherId=mock_teacher_profile.id,
        semester=6,
        batch="2022-2026",
        maxStudents=60,
        subject=subject,
        classroom=classroom,
        teacher=mock_teacher_profile,
        enrollments=[],
        createdAt=datetime.now(timezone.utc),
        updatedAt=datetime.now(timezone.utc),
    )
