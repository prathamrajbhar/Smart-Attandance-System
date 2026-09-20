"""Database Cleaner for Local Test Environment.

Provides clean slate wiping for the local PostgreSQL database and Redis
cache before seeding simulated institutional and user cohorts.
"""

from __future__ import annotations

import os
import sys

import bcrypt
from dotenv import load_dotenv
from rich.console import Console

# Ensure backend directory is in path and environment is loaded
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../backend"))
load_dotenv(os.path.join(BACKEND_DIR, ".env"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.db.client import db
from app.db.redis import connect_redis, disconnect_redis

from scripts.seed.config import SeedingConfig

console = Console()


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")


async def clean_database(config: SeedingConfig) -> None:
    """Wipes all domain records and resets base system config & root admin."""
    config.enforce_safety()
    console.print("[bold red]🚨 Cleaning local database and Redis cache...[/bold red]")

    try:
        await db.connect()

        # Delete dependent tables in order
        await db.attendance.delete_many()
        await db.devicechangerequest.delete_many()
        await db.leaverequest.delete_many()
        await db.enrollment.delete_many()
        await db.geofence.delete_many()
        await db.session.delete_many()
        await db.academicclass.delete_many()
        await db.teacher.delete_many()
        await db.student.delete_many()
        await db.notification.delete_many()
        await db.auditlog.delete_many()
        await db.user.delete_many()
        await db.subject.delete_many()
        await db.classroom.delete_many()
        await db.designation.delete_many()
        await db.department.delete_many()
        await db.systemconfiguration.delete_many()

        console.print("  [green]✓[/green] Wiped all domain tables.")

        # Flush Redis cache
        try:
            redis_client = await connect_redis()
            if redis_client:
                await redis_client.flushdb()
                console.print("  [green]✓[/green] Flushed Redis cache.")
                await disconnect_redis()
        except (OSError, RuntimeError, ConnectionError) as redis_err:
            console.print(f"  [yellow]⚠[/yellow] Redis flush skipped: {redis_err}")

        # Re-initialize system configuration
        await db.systemconfiguration.create(
            data={
                "isFaceRecognitionEnabled": True,
                "isGpsVerificationEnabled": True,
                "isAiBackgroundValidationEnabled": True,
            }
        )
        console.print("  [green]✓[/green] Re-initialized base SystemConfiguration.")

        # Re-initialize root admin
        await db.user.create(
            data={
                "email": config.admin_email,
                "hashedPassword": _hash_password(config.admin_password),
                "role": "ADMIN",
                "isActive": True,
                "mustChangePassword": False,
            }
        )
        console.print(f"  [green]✓[/green] Created root admin: [cyan]{config.admin_email}[/cyan]")

    finally:
        if db.is_connected():
            await db.disconnect()
