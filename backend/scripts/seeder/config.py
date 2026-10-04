import os
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class SeederConfig:
    base_url: str = os.getenv("API_BASE_URL", "http://localhost:7860/api/v1")
    super_admin_email: str = os.getenv("SUPER_ADMIN_EMAIL", "superadmin@smartattendance.edu.in")
    super_admin_password: str = os.getenv("SUPER_ADMIN_PASSWORD", "SuperAdmin@123")
    default_tenant_admin_email: str = os.getenv("TENANT_ADMIN_EMAIL", "admin@smartattendance.edu.in")
    default_tenant_admin_password: str = os.getenv("TENANT_ADMIN_PASSWORD", "Admin@123")
    default_teacher_password: str = os.getenv("TEACHER_PASSWORD", "Teacher@123")
    default_student_password: str = os.getenv("STUDENT_PASSWORD", "Student@123")
    timeout_seconds: float = 30.0


config = SeederConfig()
