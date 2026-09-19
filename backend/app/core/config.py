from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    PROJECT_NAME: str = "Smart Attendance System API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/smart_attendance"
    JWT_SECRET: str = Field(default="", description="JWT signing secret (must be set via JWT_SECRET env var)")

    @field_validator("JWT_SECRET")
    @classmethod
    def jwt_secret_must_be_set(cls, v: str) -> str:
        if not v:
            raise ValueError(
                "JWT_SECRET environment variable is required. "
                "Set it in your .env file for security."
            )
        return v

    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REDIS_URL: str = "redis://localhost:6379/0"

    # AWS S3 Storage
    AWS_ENDPOINT_URL: str = "http://localhost:4566"
    AWS_DEFAULT_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = "test"
    AWS_SECRET_ACCESS_KEY: str = "test"
    S3_BUCKET_NAME: str = "smartattandancesystem"

    # SMTP Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    EMAILS_FROM_EMAIL: str = "noreply@smartattendance.edu"
    EMAILS_FROM_NAME: str = "Smart Attendance System"
    INVITATION_TOKEN_EXPIRE_HOURS: int = 48
    RESET_TOKEN_EXPIRE_MINUTES: int = 15

    FRONTEND_URL: str = Field(default="http://localhost:3000", description="Frontend URL for CORS")
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = Field(default="DEBUG", description="Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL")


settings = Settings()
