import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient

from main import app
from app.api.dependencies import get_current_user
from app.schemas.auth import Token
from app.schemas.system_config import SystemConfigResponse
from app.core.security import create_access_token

client = TestClient(app)

def test_login_success():
    with patch("app.services.auth_service.AuthService.authenticate", new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = Token(
            access_token="mock-jwt-access-token",
            token_type="bearer",
            role="ADMIN",
            must_change_password=False,
            user_id="usr-adm-101",
        )
        response = client.post("/api/v1/auth/login", json={
            "email": "admin.smith@yopmail.com",
            "password": "SecurePassword123!",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] == "mock-jwt-access-token"
        assert data["role"] == "ADMIN"
        assert data["must_change_password"] is False

def test_login_invalid_credentials():
    with patch("app.services.auth_service.AuthService.authenticate", new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = None
        response = client.post("/api/v1/auth/login", json={
            "email": "intruder@yopmail.com",
            "password": "WrongPassword!",
        })
        assert response.status_code == 401
        assert response.json()["detail"] == "Incorrect email or password"

def test_get_me_student_profile(mock_student_user, mock_student_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    with patch("app.api.auth.db") as mock_db, \
         patch("app.repositories.student_repo.StudentRepository.get_face_embedding", new_callable=AsyncMock) as mock_emb:
        mock_db.student.find_unique = AsyncMock(return_value=mock_student_profile)
        mock_emb.return_value = [0.1] * 128

        response = client.get("/api/v1/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "student.rahul@yopmail.com"
        assert data["role"] == "STUDENT"
        assert data["student_profile"]["enrollment_number"] == "CS-2024-0042"
        assert data["student_profile"]["face_registered"] is True
    app.dependency_overrides.clear()

def test_get_me_teacher_profile(mock_teacher_user, mock_teacher_profile):
    app.dependency_overrides[get_current_user] = lambda: mock_teacher_user
    with patch("app.api.auth.db") as mock_db:
        mock_db.teacher.find_unique = AsyncMock(return_value=mock_teacher_profile)

        response = client.get("/api/v1/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "prof.sharma@yopmail.com"
        assert data["role"] == "TEACHER"
        assert data["teacher_profile"]["employee_id"] == "EMP-CS-2024"
    app.dependency_overrides.clear()

def test_change_password_success(mock_student_user):
    app.dependency_overrides[get_current_user] = lambda: mock_student_user
    with patch("app.services.auth_service.AuthService.change_password", new_callable=AsyncMock) as mock_cp:
        mock_cp.return_value = None
        response = client.post("/api/v1/auth/change-password", json={
            "current_password": "OldPassword123!",
            "new_password": "NewSecurePassword456!",
        })
        assert response.status_code == 200
        assert response.json()["status"] == "success"
    app.dependency_overrides.clear()

def test_logout_revokes_token(mock_redis):
    valid_token = create_access_token(subject="usr-adm-101", role="ADMIN")
    response = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {valid_token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Successfully logged out."
    assert mock_redis.setex.called

def test_forgot_password():
    with patch("app.services.auth_service.AuthService.request_password_reset", new_callable=AsyncMock) as mock_reset:
        mock_reset.return_value = None
        response = client.post("/api/v1/auth/forgot-password", json={
            "email": "student.rahul@yopmail.com"
        })
        assert response.status_code == 200
        assert response.json()["status"] == "success"

def test_reset_password_success():
    with patch("app.services.auth_service.AuthService.reset_password", new_callable=AsyncMock) as mock_reset:
        mock_reset.return_value = None
        response = client.post("/api/v1/auth/reset-password", json={
            "token": "valid-reset-token-123",
            "new_password": "BrandNewPassword789!"
        })
        assert response.status_code == 200
        assert response.json()["status"] == "success"

def test_verify_token_valid():
    with patch("app.services.auth_service.AuthService.verify_invitation_token", new_callable=AsyncMock) as mock_verify:
        mock_verify.return_value = {
            "email": "new.teacher@yopmail.com",
            "role": "TEACHER",
            "name": "Ananya Roy"
        }
        response = client.get("/api/v1/auth/verify-token?token=valid-invite-jwt&token_type=invite")
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] is True
        assert data["email"] == "new.teacher@yopmail.com"

def test_verify_token_expired():
    with patch("app.services.auth_service.AuthService.verify_invitation_token", new_callable=AsyncMock) as mock_verify:
        mock_verify.return_value = None
        response = client.get("/api/v1/auth/verify-token?token=expired-jwt&token_type=invite")
        assert response.status_code == 200
        assert response.json()["valid"] is False

def test_complete_onboarding():
    with patch("app.services.auth_service.AuthService.complete_onboarding", new_callable=AsyncMock) as mock_onboard:
        mock_onboard.return_value = None
        response = client.post("/api/v1/auth/complete-onboarding", json={
            "token": "valid-onboarding-token",
            "password": "PasswordOnboarding123!"
        })
        assert response.status_code == 200
        assert response.json()["status"] == "success"

def test_get_public_system_config():
    with patch("app.services.system_config_service.SystemConfigService.get_config", new_callable=AsyncMock) as mock_cfg:
        mock_cfg.return_value = SystemConfigResponse(
            isFaceRecognitionEnabled=True,
            isGpsVerificationEnabled=True,
            isAiBackgroundValidationEnabled=False,
        )
        response = client.get("/api/v1/auth/config")
        assert response.status_code == 200
        data = response.json()
        assert data.get("isFaceRecognitionEnabled", data.get("is_face_recognition_enabled")) is True
        assert data.get("isAiBackgroundValidationEnabled", data.get("is_ai_background_validation_enabled")) is False
