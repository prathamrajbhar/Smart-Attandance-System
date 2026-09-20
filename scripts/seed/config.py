"""Configuration and Safety Guardrails for Local Seeding Simulation.

CRITICAL SAFETY RULE:
Enforces execution strictly against localhost/127.0.0.1. Aborts immediately
if pointed to any remote or production endpoints.
"""

from __future__ import annotations

import os
from urllib.parse import urlparse

from pydantic import BaseModel, Field


def _validate_local_url(target_url: str, name: str) -> str:
    parsed = urlparse(target_url)
    hostname = (parsed.hostname or "").lower()
    allowed = {"localhost", "127.0.0.1", "::1", "0.0.0.0"}
    if hostname not in allowed:
        raise ValueError(
            f"CRITICAL SAFETY VIOLATION: {name} is configured as '{target_url}'. "
            f"Seeding simulation scripts must ONLY run against localhost/127.0.0.1."
        )
    return target_url.rstrip("/")


class SeedingConfig(BaseModel):
    # Endpoints
    backend_base_url: str = Field(default="http://localhost:8000")
    frontend_base_url: str = Field(default="http://localhost:3000")

    # API Paths
    api_prefix: str = Field(default="/api/v1")

    # Credentials
    admin_email: str = Field(default="admin@smartattendance.edu.in")
    admin_password: str = Field(default="Admin@123")
    teacher_default_password: str = Field(default="Teacher@123")
    student_default_password: str = Field(default="Student@123")

    # Simulation settings
    simulation_days: int = Field(default=20)
    students_per_section: int = Field(default=35)
    request_delay_seconds: float = Field(default=0.05)
    headless: bool = Field(default=True)
    skip_yopmail_browser: bool = Field(default=False)

    @property
    def api_url(self) -> str:
        return f"{self.backend_base_url}{self.api_prefix}"

    def enforce_safety(self) -> None:
        _validate_local_url(self.backend_base_url, "BACKEND_BASE_URL")
        _validate_local_url(self.frontend_base_url, "FRONTEND_BASE_URL")


def get_config() -> SeedingConfig:
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@smartattendance.edu.in")
    admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123")

    config = SeedingConfig(
        backend_base_url=backend_url,
        frontend_base_url=frontend_url,
        admin_email=admin_email,
        admin_password=admin_password,
    )
    config.enforce_safety()
    return config
