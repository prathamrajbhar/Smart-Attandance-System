from datetime import timedelta
import time
from app.core.security import create_access_token, decode_access_token, verify_password, hash_password


def test_password_hashing_and_verification():
    password = "SuperSecretPassword123!"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation_and_decoding():
    user_id = "test-user-uuid-1234"
    role = "STUDENT"
    token = create_access_token(
        subject=user_id,
        role=role,
        expires_delta=timedelta(minutes=15),
    )
    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("sub") == user_id
    assert payload.get("role") == role


def test_smart_pass_token_payload():
    student_id = "student-uuid-5678"
    enrollment_number = "EN2024009"
    token = create_access_token(
        subject="user-uuid-000",
        role="STUDENT",
        expires_delta=timedelta(seconds=30),
        extra_data={"student_id": student_id, "enrollment_number": enrollment_number, "type": "smart_pass"},
    )
    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("type") == "smart_pass"
    assert payload.get("student_id") == student_id
    assert payload.get("enrollment_number") == enrollment_number


def test_expired_token_handling():
    token = create_access_token(
        subject="expired-user",
        role="STUDENT",
        expires_delta=timedelta(seconds=-10),  # expired 10s ago
    )
    payload = decode_access_token(token)
    assert payload is None
