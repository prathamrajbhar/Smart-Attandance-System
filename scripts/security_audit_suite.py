#!/usr/bin/env python3
"""
Enterprise Security Audit & Penetration Verification Suite
Executes 10 automated security vectors against authentication, tenant isolation,
cryptographic bounds, and HTTP transport layers.
"""
import sys
import os
import time
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch, MagicMock
import jwt

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app
from app.core.security import create_access_token, decode_access_token, hash_password, verify_password
from app.utils.geofencing import GPSCoordinate, is_within_geofence
from app.schemas.health import ServiceHealth

GREEN = "\033[92m"
RED = "\033[91m"
BLUE = "\033[94m"
BOLD = "\033[1m"
RESET = "\033[0m"


def run_vector(name: str, test_func) -> bool:
    t0 = time.perf_counter()
    try:
        test_func()
        elapsed = (time.perf_counter() - t0) * 1000
        print(f"  {GREEN}✔ PASS{RESET} [{elapsed:5.1f}ms] {name}")
        return True
    except Exception as exc:
        elapsed = (time.perf_counter() - t0) * 1000
        print(f"  {RED}✘ FAIL{RESET} [{elapsed:5.1f}ms] {name}: {exc}")
        return False


def vector_1_security_headers():
    with patch("app.api.health.check_database", new_callable=AsyncMock) as m_db, \
         patch("app.api.health.check_redis", new_callable=AsyncMock) as m_rd, \
         patch("app.api.health.check_s3") as m_s3:
        m_db.return_value = ServiceHealth(status="healthy", latency_ms=1.0)
        m_rd.return_value = ServiceHealth(status="healthy", latency_ms=0.5)
        m_s3.return_value = ServiceHealth(status="healthy", latency_ms=1.5)
        client = TestClient(app)
        res = client.get("/health")
        assert res.status_code == 200
        assert res.headers.get("X-Content-Type-Options") == "nosniff"
        assert res.headers.get("X-Frame-Options") == "DENY"
        assert "Strict-Transport-Security" in res.headers


def vector_2_jwt_tampering():
    forged = jwt.encode({"sub": "usr-attacker", "role": "SUPER_ADMIN"}, key="", algorithm="none")
    assert decode_access_token(forged) is None
    fake = jwt.encode({"sub": "usr-attacker", "role": "SUPER_ADMIN"}, key="32-bytes-long-super-secret-key-1234", algorithm="HS256")
    assert decode_access_token(fake) is None


def vector_3_rbac_student_privilege_escalation():
    token = create_access_token(subject="usr-stu", role="STUDENT", extra_data={"tid": "tenant-01", "tenant_id": "tenant-01"})
    student = SimpleNamespace(id="usr-stu", role="STUDENT", isActive=True, tenantId="tenant-01")
    mock_tenant = SimpleNamespace(id="tenant-01", slug="demo", name="Demo", type="COLLEGE", status="ACTIVE")
    with patch("app.api.dependencies.UserRepository.get_by_id", new_callable=AsyncMock) as m_user, \
         patch("app.db.client.db") as m_db:
        m_user.return_value = student
        m_db.tenant.find_first = AsyncMock(return_value=mock_tenant)
        client = TestClient(app)
        res = client.get("/api/v1/admin/classes", headers={"Authorization": f"Bearer {token}", "X-Tenant-ID": "tenant-01"})
        assert res.status_code == 403


def vector_4_rbac_admin_to_super_admin():
    token = create_access_token(subject="usr-adm", role="ADMIN", extra_data={"tid": "tenant-01", "tenant_id": "tenant-01"})
    admin_user = SimpleNamespace(id="usr-adm", role="ADMIN", isActive=True, tenantId="tenant-01")
    with patch("app.api.dependencies.UserRepository.get_by_id", new_callable=AsyncMock) as m_user:
        m_user.return_value = admin_user
        client = TestClient(app)
        res = client.get("/api/v1/super-admin/tenants", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 403


def vector_5_geofence_boundary_isolation():
    center = GPSCoordinate(latitude=28.6139, longitude=77.2090)
    close = GPSCoordinate(latitude=28.6140, longitude=77.2091)
    far = GPSCoordinate(latitude=19.0760, longitude=72.8777)
    assert is_within_geofence(close, center, base_radius=100.0, student_accuracy=5.0) is True
    assert is_within_geofence(far, center, base_radius=100.0, student_accuracy=5.0) is False


def vector_6_smart_pass_token_replay():
    t_live = create_access_token("u1", "STUDENT", expires_delta=timedelta(seconds=15), extra_data={"type": "smart_pass"})
    t_exp = create_access_token("u1", "STUDENT", expires_delta=timedelta(seconds=-1), extra_data={"type": "smart_pass"})
    assert decode_access_token(t_live) is not None
    assert decode_access_token(t_exp) is None


def vector_7_scim_bearer_protection():
    mock_tenant = SimpleNamespace(id="tenant-01", slug="demo", name="Demo", type="COLLEGE", status="ACTIVE")
    with patch("app.db.client.db") as m_db:
        m_db.tenant.find_first = AsyncMock(return_value=mock_tenant)
        client = TestClient(app)
        assert client.get("/api/v1/scim/v2/Users").status_code == 401
        assert client.get("/api/v1/scim/v2/Users", headers={"Authorization": "Bearer bad"}).status_code == 401


def vector_8_password_entropy_and_salting():
    pw = "P@ssw0rdSecure!2026"
    h1 = hash_password(pw)
    h2 = hash_password(pw)
    assert h1 != h2
    assert verify_password(pw, h1) is True
    assert verify_password(pw, h2) is True
    assert verify_password("wrong", h1) is False


def vector_9_tenant_header_spoofing_defense():
    token_tenant_a = create_access_token(subject="u1", role="TEACHER", extra_data={"tid": "tenant-a", "tenant_id": "tenant-a"})
    client = TestClient(app)
    res = client.get("/api/v1/admin/classes", headers={"Authorization": f"Bearer {token_tenant_a}", "X-Tenant-ID": "tenant-b"})
    assert res.status_code == 403


def vector_10_suspended_tenant_lockout():
    mock_tenant = SimpleNamespace(id="t-susp", slug="susp-inst", name="Suspended Inst", type="COLLEGE", status="SUSPENDED")
    token = create_access_token(subject="u-susp", role="TEACHER", extra_data={"tid": "t-susp", "tenant_id": "t-susp"})
    with patch("app.db.redis.get_redis") as m_redis, patch("app.db.client.db") as m_db:
        mock_r = MagicMock()
        mock_r.get = AsyncMock(return_value=None)
        m_redis.return_value = mock_r
        m_db.tenant.find_first = AsyncMock(return_value=mock_tenant)
        client = TestClient(app)
        res = client.get("/api/v1/admin/departments", headers={"Authorization": f"Bearer {token}", "X-Tenant-ID": "t-susp"})
        assert res.status_code == 403


def main():
    print(f"\n{BOLD}{BLUE}======================================================{RESET}")
    print(f"{BOLD}{BLUE}  SMART ATTENDANCE SYSTEM - SECURITY AUDIT SUITE    {RESET}")
    print(f"{BOLD}{BLUE}======================================================{RESET}\n")

    vectors = [
        ("Vector 01: HTTP Security Headers & Transport Hardening", vector_1_security_headers),
        ("Vector 02: Cryptographic JWT & Alg 'none' Tampering Defense", vector_2_jwt_tampering),
        ("Vector 03: RBAC Student Privilege Escalation Prevention", vector_3_rbac_student_privilege_escalation),
        ("Vector 04: RBAC Admin to Super-Admin Platform Boundary", vector_4_rbac_admin_to_super_admin),
        ("Vector 05: Geofencing Boundary & Coordinate Isolation", vector_5_geofence_boundary_isolation),
        ("Vector 06: Smart Pass Rotating Token Replay Defense", vector_6_smart_pass_token_replay),
        ("Vector 07: SCIM 2.0 Enterprise Bearer Token Security", vector_7_scim_bearer_protection),
        ("Vector 08: Password Hashing Entropy & Salt Randomness", vector_8_password_entropy_and_salting),
        ("Vector 09: Tenant Header Injection & Context Spoofing Defense", vector_9_tenant_header_spoofing_defense),
        ("Vector 10: Suspended Tenant Real-Time Access Lockout", vector_10_suspended_tenant_lockout),
    ]

    passed = 0
    start_total = time.perf_counter()
    for title, func in vectors:
        if run_vector(title, func):
            passed += 1

    total_time = (time.perf_counter() - start_total) * 1000
    score = (passed / len(vectors)) * 100

    print(f"\n{BOLD}------------------------------------------------------{RESET}")
    print(f"Results: {passed}/{len(vectors)} Vectors Passed ({score:.1f}% Security Rating)")
    print(f"Total Audit Execution Time: {total_time:.1f}ms")
    print(f"{BOLD}------------------------------------------------------{RESET}\n")

    if passed != len(vectors):
        sys.exit(1)


if __name__ == "__main__":
    main()
