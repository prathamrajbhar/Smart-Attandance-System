import pytest
from datetime import timedelta
from fastapi import HTTPException
from types import SimpleNamespace

from app.core.security import (
    hash_password, verify_password, create_access_token, decode_access_token,
    generate_temporary_password,
)
from app.utils.geofencing import GPSCoordinate, calculate_haversine_distance, is_within_geofence
from app.api.dependencies import RoleChecker

def test_password_hashing_and_verification():
    raw_pass = "ComplexP@ssw0rd!2026"
    hashed = hash_password(raw_pass)
    assert hashed != raw_pass
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPass123", hashed) is False

def test_generate_temporary_password():
    temp_pwd = generate_temporary_password(length=14)
    assert len(temp_pwd) == 14
    assert any(c.isupper() for c in temp_pwd)
    assert any(c.isdigit() for c in temp_pwd)

def test_jwt_token_roundtrip():
    payload_data = {"student_id": "stu-101", "role": "STUDENT"}
    token = create_access_token(
        subject="usr-stu-101",
        role="STUDENT",
        expires_delta=timedelta(minutes=15),
        extra_data=payload_data,
    )
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "usr-stu-101"
    assert decoded["role"] == "STUDENT"
    assert decoded["student_id"] == "stu-101"

def test_haversine_distance_calculations():
    coord_a = GPSCoordinate(latitude=28.6139, longitude=77.2090)
    coord_b = GPSCoordinate(latitude=28.6139, longitude=77.2090)
    coord_far = GPSCoordinate(latitude=29.6139, longitude=77.2090)

    # Same point distance should be 0
    d_zero = calculate_haversine_distance(coord_a, coord_b)
    assert round(d_zero, 2) == 0.0

    # Inside geofence test: distance < radius
    assert is_within_geofence(coord_a, coord_b, base_radius=50.0, student_accuracy=10.0) is True

    # Far point (e.g., 1 degree off is ~111km)
    assert is_within_geofence(coord_far, coord_a, base_radius=100.0, student_accuracy=10.0) is False

def test_role_checker():
    admin_checker = RoleChecker(allowed_roles=["ADMIN"])
    admin_user = SimpleNamespace(role="ADMIN", email="admin.smith@yopmail.com")
    teacher_user = SimpleNamespace(role="TEACHER", email="prof.sharma@yopmail.com")

    # Allowed role passes through
    assert admin_checker(admin_user) == admin_user

    # Disallowed role raises HTTP 403
    with pytest.raises(HTTPException) as exc_info:
        admin_checker(teacher_user)
    assert exc_info.value.status_code == 403
