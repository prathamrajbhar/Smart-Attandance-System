import base64
from datetime import datetime, timezone
import pytest
from unittest.mock import AsyncMock, patch, MagicMock


from app.services.attendance.attendance_queue_service import AttendanceQueueService
from app.services.attendance.models import AttendanceSubmission
from app.services.biometric_consent_service import BiometricConsentService
from app.services.sso_service import SSOService
from app.services.scim_service import SCIMService
from app.services.s3_service import S3Service


@pytest.mark.asyncio
async def test_async_attendance_queue():
    mock_redis = AsyncMock()
    mock_redis.get = AsyncMock(return_value=None)
    mock_redis.setex = AsyncMock(return_value=True)

    async def _get_r():
        return mock_redis

    mock_attendance = AsyncMock()
    mock_record = MagicMock()
    mock_record.id = "att-123"
    mock_record.studentId = "stu-123"
    mock_record.sessionId = "sess-123"
    mock_record.status = "Present"
    mock_record.faceScore = 0.95
    mock_record.livenessScore = 0.98
    mock_record.backgroundScore = 0.88
    mock_record.finalAiScore = 0.94
    mock_record.gpsLatitude = 12.9716
    mock_record.gpsLongitude = 77.5946
    mock_record.createdAt = "2026-10-03T23:00:00Z"
    mock_attendance.mark_attendance.return_value = mock_record

    with patch("app.services.attendance.attendance_queue_service.get_redis", side_effect=_get_r):
        service = AttendanceQueueService(attendance_service=mock_attendance)
        sub = AttendanceSubmission(
            student_id="stu-123",
            session_id="sess-123",
            latitude=12.9716,
            longitude=77.5946,
            accuracy=5.0,
        )
        job_id = await service.enqueue_submission(sub)
        assert job_id is not None
        assert len(job_id) > 10
        assert mock_redis.setex.called


@pytest.mark.asyncio
async def test_biometric_consent_service():
    mock_redis = AsyncMock()
    mock_redis.get = AsyncMock(return_value='{"student_id": "stu-1", "consented": true, "consented_at": "2026-10-03T00:00:00Z"}')
    mock_redis.setex = AsyncMock(return_value=True)

    async def _get_r():
        return mock_redis

    with patch("app.services.biometric_consent_service.get_redis", side_effect=_get_r):
        service = BiometricConsentService()
        record = await service.record_consent("stu-1", policy_version="2026.1-BIPA")
        assert record["consented"] is True
        assert record["policy_version"] == "2026.1-BIPA"

        has_it = await service.has_consent("stu-1")
        assert has_it is True

        status = await service.get_consent_status("stu-1")
        assert status["has_consent"] is True


@pytest.mark.asyncio
async def test_biometric_photo_purging_gdpr():
    mock_s3 = MagicMock()
    mock_s3.delete_file = MagicMock(return_value=True)

    rec1 = MagicMock()
    rec1.id = "att-1"
    rec1.remarks = "Flagged [photo:attendance/photo1.jpg]"
    rec1.studentNote = None

    rec2 = MagicMock()
    rec2.id = "att-2"
    rec2.remarks = "Present"
    rec2.studentNote = "Check https://bucket.s3.amazonaws.com/tenants/t1/attendance/photo2.png"

    rec3 = MagicMock()
    rec3.id = "att-3"
    rec3.remarks = "Already [photo_purged_for_data_minimization]"
    rec3.studentNote = None

    with patch("app.services.biometric_consent_service.db") as mock_db:
        mock_db.attendance.find_many = AsyncMock(return_value=[rec1, rec2, rec3])
        mock_db.attendance.update = AsyncMock(return_value=None)

        service = BiometricConsentService(s3_service=mock_s3)
        res = await service.purge_attendance_photos(retention_days=30)

        assert res["status"] == "completed"
        assert res["purged_count"] == 2
        assert res["s3_deleted_count"] >= 2
        assert mock_s3.delete_file.call_count >= 2
        assert mock_db.attendance.update.call_count == 2


@pytest.mark.asyncio
async def test_quota_enforcement():

    from app.services.admin.student_admin_service import StudentAdminService
    from app.schemas.student import StudentCreate

    mock_db = AsyncMock()
    mock_tenant = MagicMock()
    mock_tenant.maxAllowedStudents = 10
    mock_db.tenant.find_unique = AsyncMock(return_value=mock_tenant)
    mock_db.user.count = AsyncMock(return_value=10)  # Quota is full

    student_data = StudentCreate(
        email="newstudent@university.edu",
        enrollment_number="ENR9999",
        first_name="Jane",
        last_name="Doe",
    )

    with pytest.raises(ValueError) as exc_info:
        await StudentAdminService.create_student(student_data, tenant_id="t-1", db_client=mock_db)

    assert "quota exceeded" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_s3_tenant_partitioning():
    service = S3Service()
    service.upload_bytes = MagicMock(return_value="https://s3.local/tenants/t-abc/attendance/test.jpg")

    mock_file = AsyncMock()
    mock_file.read.return_value = b"fake-image"
    mock_file.filename = "photo.jpg"
    mock_file.content_type = "image/jpeg"

    key, url, _ = await service.upload_uploadfile(mock_file, "attendance", tenant_id="t-abc")
    assert key.startswith("tenants/t-abc/attendance/")
    assert key.endswith(".jpg")


@pytest.mark.asyncio
async def test_scim_service_provider_config():
    config = SCIMService.get_service_provider_config()
    assert "ServiceProviderConfig" in config["schemas"][0]
    assert config["filter"]["supported"] is True
    assert config["changePassword"]["supported"] is True


@pytest.mark.asyncio
async def test_scim_lifecycle_crud():
    mock_user = MagicMock()
    mock_user.id = "u-scim-99"
    mock_user.email = "saml.sync@univ.edu"
    mock_user.role = "TEACHER"
    mock_user.isActive = True
    mock_user.createdAt = datetime.now(timezone.utc)

    with patch("app.services.scim_service.db") as mock_db:
        mock_db.user.find_unique = AsyncMock(side_effect=[None, mock_user, mock_user])
        mock_db.user.create = AsyncMock(return_value=mock_user)
        mock_db.user.delete = AsyncMock(return_value=None)
        mock_db.user.count = AsyncMock(return_value=1)
        mock_db.user.find_many = AsyncMock(return_value=[mock_user])

        # 1. Create SCIM user
        payload = {
            "userName": "saml.sync@univ.edu",
            "roles": [{"value": "Teacher"}],
            "active": True,
        }
        created = await SCIMService.create_user(payload, tenant_id="tenant-x")
        assert created["userName"] == "saml.sync@univ.edu"
        assert created["roles"][0]["value"] == "TEACHER"

        # 2. Get SCIM user
        fetched = await SCIMService.get_user_by_id("u-scim-99")
        assert fetched is not None
        assert fetched["id"] == "u-scim-99"

        # 3. List SCIM users
        listed = await SCIMService.list_users(tenant_id="tenant-x")
        assert listed["totalResults"] == 1
        assert len(listed["Resources"]) == 1

        # 4. Delete SCIM user
        deleted = await SCIMService.delete_user("u-scim-99")
        assert deleted is True


@pytest.mark.asyncio
async def test_sso_saml_processing():
    sample_xml = """<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
        <saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
            <saml:Subject>
                <saml:NameID>sso.student@university.edu</saml:NameID>
            </saml:Subject>
        </saml:Assertion>
    </samlp:Response>"""
    b64 = base64.b64encode(sample_xml.encode("utf-8")).decode("utf-8")

    mock_user = MagicMock()
    mock_user.id = "u-sso-1"
    mock_user.email = "sso.student@university.edu"
    mock_user.role = "STUDENT"
    mock_user.tenantId = "t-1"

    mock_db = MagicMock()
    mock_db.user.find_unique = AsyncMock(return_value=mock_user)

    with patch("app.services.sso_service.db", mock_db), \
         patch("app.services.sso_service.create_access_token", return_value="jwt-token-123"):
        res = await SSOService.process_saml_assertion(b64, tenant_id="t-1")
        assert res["access_token"] == "jwt-token-123"
        assert res["email"] == "sso.student@university.edu"


@pytest.mark.asyncio
async def test_sso_xxe_injection_blocked():
    xxe_xml = """<?xml version="1.0"?>
    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
    <samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
        <saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
            <saml:Subject>
                <saml:NameID>&xxe;</saml:NameID>
            </saml:Subject>
        </saml:Assertion>
    </samlp:Response>"""
    b64 = base64.b64encode(xxe_xml.encode("utf-8")).decode("utf-8")

    with pytest.raises(ValueError) as exc_info:
        await SSOService.process_saml_assertion(b64, tenant_id="t-1")
    assert "entity declarations are prohibited" in str(exc_info.value).lower()


