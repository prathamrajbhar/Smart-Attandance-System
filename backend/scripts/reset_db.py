"""
Production Database Reset & Wipe Script
=======================================
Wipes all data, student/teacher records, classes, attendances, and logs.
Seeds NO mock data.
Initializes only:
  1. Default System Configuration
  2. Root Administrator Account (admin@smartattendance.edu.in / Admin@123)

Usage:
  cd backend
  python scripts/reset_db.py
"""

from __future__ import annotations
import asyncio
import os
import sys
import bcrypt

# Ensure parent directory is in path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.client import db


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()


async def reset_production_database():
    print("=" * 60)
    print("🚨 WIPING & RESETTING PRODUCTION DATABASE (NO MOCK DATA)")
    print("=" * 60)

    try:
        await db.connect()
        print("Connected to PostgreSQL database.\n")

        print("1. Purging all database tables...")
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
        print("  ✓ All domain tables successfully wiped.")

        # Purge Redis cache
        try:
            from app.db.redis import connect_redis, disconnect_redis
            redis = await connect_redis()
            if redis:
                await redis.flushdb()
                print("  ✓ Redis cache flushed.")
                await disconnect_redis()
        except Exception as err:
            print(f"  [Warning] Redis flush skipped: {err}")

        # Initialize Base Production System Configuration
        print("\n2. Initializing production system configuration...")
        await db.systemconfiguration.create(data={
            "isFaceRecognitionEnabled": True,
            "isGpsVerificationEnabled": True,
            "isAiBackgroundValidationEnabled": True,
        })
        print("  ✓ Base verification configuration initialized.")

        # Initialize Root Admin User
        print("\n3. Provisioning root administrator account...")
        admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@smartattendance.edu.in")
        admin_pass = os.getenv("DEFAULT_ADMIN_PASSWORD", "Admin@123")
        admin_user = await db.user.create(data={
            "email": admin_email,
            "hashedPassword": _hash_password(admin_pass),
            "role": "ADMIN",
            "isActive": True,
            "mustChangePassword": False,
        })
        print(f"  ✓ Root Admin created: {admin_user.email} (ID: {admin_user.id})")

        print("\n" + "=" * 60)
        print("✅ DATABASE RESET COMPLETED SUCCESSFULLY")
        print("   Database is completely clean with 0 mock data.")
        print(f"   Login with Admin Credentials: {admin_email} / {admin_pass}")
        print("=" * 60)

    except Exception as exc:
        print(f"\n❌ ERROR resetting database: {exc}")
        raise exc
    finally:
        if db.is_connected():
            await db.disconnect()


if __name__ == "__main__":
    asyncio.run(reset_production_database())
