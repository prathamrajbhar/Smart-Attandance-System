#!/usr/bin/env python3
"""
Production Database & Storage Reset and Seeder
==============================================
1. Wipes all objects from AWS S3 bucket 'smart-attndance-system'.
2. Purges all RDS PostgreSQL database tables.
3. Provisions Super Admin: superadmin@yopmail.com / SuperAdmin@123
4. Seeds clean tenant 'uvpce' with master datasets:
   - 13 Departments
   - 6 Designations
   - 104 Classrooms / Labs
   - 261 Subjects
   - 144 Teachers (with initials & department/designation links)
   - 462 Students (with branch, gender, & department links)
5. Sets up System Configurations.
"""

import asyncio
import csv
import os
import sys
import boto3
import bcrypt
from pathlib import Path

# Ensure backend root is in sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from dotenv import load_dotenv
from prisma import Prisma

# Load environment variables
load_dotenv(backend_root / ".env.prod")
load_dotenv(backend_root / ".env")

PROD_DB_URL = os.getenv("DATABASE_URL", "")
DATASET_DIR = backend_root.parent / "asset" / "dataset"

SUPERADMIN_EMAIL = os.getenv("SUPERADMIN_EMAIL", "superadmin@yopmail.com")
SUPERADMIN_PASS = os.getenv("SUPERADMIN_PASSWORD", "SuperAdmin@123")

TENANT_ADMIN_EMAIL = os.getenv("TENANT_ADMIN_EMAIL", "admin_uvpce@yopmail.com")
TENANT_ADMIN_PASS = os.getenv("TENANT_ADMIN_PASSWORD", "Password123!")
TENANT_SLUG = "uvpce"
TENANT_NAME = "Ganpat University (UVPCE)"

DEFAULT_PASSWORD = "Password123!"

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME", os.getenv("S3_BUCKET_NAME", "smart-attndance-system"))


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()


def cleanup_s3():
    print("\n[1/5] Cleaning AWS S3 Storage...")
    s3 = boto3.client(
        "s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )
    
    response = s3.list_objects_v2(Bucket=S3_BUCKET_NAME)
    objects = response.get("Contents", [])
    if not objects:
        print(f"  ✓ S3 Bucket [{S3_BUCKET_NAME}] is already empty.")
        return

    delete_keys = [{"Key": obj["Key"]} for obj in objects]
    s3.delete_objects(Bucket=S3_BUCKET_NAME, Delete={"Objects": delete_keys})
    print(f"  ✓ Purged {len(delete_keys)} objects from S3 Bucket [{S3_BUCKET_NAME}].")


async def main():
    print("=" * 60)
    print("🚨 PRODUCTION RDS & S3 CLEANUP AND SEEDING")
    print("=" * 60)

    # Step 1: Clean S3
    cleanup_s3()

    # Step 2: Connect to RDS Postgres via Prisma
    print("\n[2/5] Connecting to AWS RDS PostgreSQL...")
    db = Prisma(datasource={"url": PROD_DB_URL})
    await db.connect()
    print("  ✓ Connected to AWS RDS PostgreSQL database.")

    try:
        # Step 3: Purge all RDS Tables
        print("\n[3/5] Purging all domain tables in RDS PostgreSQL...")
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
        await db.tenant.delete_many()
        print("  ✓ All domain tables successfully wiped.")

        # Step 4: Create Super Admin & System Config
        print("\n[4/5] Provisioning Super Admin & System Configurations...")
        superadmin = await db.user.create(
            data={
                "email": SUPERADMIN_EMAIL,
                "hashedPassword": _hash_password(SUPERADMIN_PASS),
                "role": "SUPER_ADMIN",
                "isActive": True,
                "mustChangePassword": False,
            }
        )
        print(f"  ✓ Super Admin created: {superadmin.email}")

        await db.systemconfiguration.create(
            data={
                "isFaceRecognitionEnabled": True,
                "isGpsVerificationEnabled": True,
                "isAiBackgroundValidationEnabled": True,
            }
        )
        print("  ✓ System Configuration created.")

        # Step 5: Seed Tenant & Real Master Datasets
        print("\n[5/5] Seeding Real World Dataset for Production Tenant (UVPCE)...")
        tenant = await db.tenant.create(
            data={
                "slug": TENANT_SLUG,
                "name": TENANT_NAME,
                "type": "COLLEGE",
                "status": "ACTIVE",
                "licenseCount": 2000,
            }
        )
        print(f"  ✓ Tenant provisioned: {tenant.name} (ID: {tenant.id})")

        # 5a: Tenant Admin User
        admin_user = await db.user.create(
            data={
                "email": TENANT_ADMIN_EMAIL,
                "hashedPassword": _hash_password(TENANT_ADMIN_PASS),
                "role": "TENANT_ADMIN",
                "tenantId": tenant.id,
                "isActive": True,
                "mustChangePassword": False,
            }
        )
        print(f"  ✓ Tenant Admin created: {admin_user.email}")

        # 5b: Departments
        dept_csv = DATASET_DIR / "departments.csv"
        dept_map = {}
        if dept_csv.exists():
            with open(dept_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    d = await db.department.create(
                        data={
                            "tenantId": tenant.id,
                            "code": r["code"].strip(),
                            "name": r["name"].strip(),
                            "head": r.get("head", "").strip() or None,
                            "description": r.get("description", "").strip() or None,
                        }
                    )
                    dept_map[d.code.upper()] = d.id
            print(f"  ✓ Created {len(dept_map)} Departments.")

        # 5c: Designations
        desig_csv = DATASET_DIR / "designations.csv"
        desig_map = {}
        if desig_csv.exists():
            with open(desig_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    ds = await db.designation.create(
                        data={
                            "tenantId": tenant.id,
                            "code": r["code"].strip(),
                            "name": r["name"].strip(),
                            "description": r.get("description", "").strip() or None,
                        }
                    )
                    desig_map[ds.code.upper()] = ds.id
            print(f"  ✓ Created {len(desig_map)} Designations.")

        # 5d: Classrooms
        room_csv = DATASET_DIR / "classrooms.csv"
        total_rooms = 0
        if room_csv.exists():
            with open(room_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    await db.classroom.create(
                        data={
                            "tenantId": tenant.id,
                            "name": r["name"].strip(),
                            "building": r.get("building", "").strip() or "Main Campus",
                        }
                    )
                    total_rooms += 1
            print(f"  ✓ Created {total_rooms} Classrooms and Labs.")

        # 5e: Subjects
        subj_csv = DATASET_DIR / "subjects.csv"
        total_subjects = 0
        if subj_csv.exists():
            with open(subj_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    d_code = (r.get("department_code") or "").strip().upper()
                    d_id = dept_map.get(d_code)
                    await db.subject.create(
                        data={
                            "tenantId": tenant.id,
                            "code": r["code"].strip(),
                            "name": r["name"].strip(),
                            "departmentId": d_id,
                            "description": r.get("description", "").strip() or None,
                        }
                    )
                    total_subjects += 1
            print(f"  ✓ Created {total_subjects} Subjects with department relations.")

        # 5f: Teachers
        teachers_csv = DATASET_DIR / "teachers.csv"
        total_teachers = 0
        hashed_default = _hash_password(DEFAULT_PASSWORD)
        default_dept_id = list(dept_map.values())[0] if dept_map else None
        default_desig_id = list(desig_map.values())[0] if desig_map else None

        if teachers_csv.exists():
            with open(teachers_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    email = r["email"].strip().lower()
                    emp_id = r["employee_id"].strip()
                    first_name = r["first_name"].strip()
                    last_name = r.get("last_name", "").strip()
                    initials = r.get("name_initials", "").strip().lower() or None
                    d_code = (r.get("department_code") or "").strip().upper()
                    ds_code = (r.get("designation_code") or "").strip().upper()
                    d_id = dept_map.get(d_code) or default_dept_id
                    ds_id = desig_map.get(ds_code) or default_desig_id

                    user = await db.user.create(
                        data={
                            "email": email,
                            "hashedPassword": hashed_default,
                            "role": "TEACHER",
                            "tenantId": tenant.id,
                            "isActive": True,
                        }
                    )
                    await db.teacher.create(
                        data={
                            "userId": user.id,
                            "employeeId": emp_id,
                            "firstName": first_name,
                            "lastName": last_name,
                            "nameInitials": initials,
                            "departmentId": d_id,
                            "designationId": ds_id,
                        }
                    )
                    total_teachers += 1
            print(f"  ✓ Created {total_teachers} Faculty / Teachers with initials & links.")

        # 5g: Students
        students_csv = DATASET_DIR / "students.csv"
        total_students = 0
        if students_csv.exists():
            with open(students_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    email = r["email"].strip().lower()
                    enrollment = r["enrollment_number"].strip()
                    first_name = r["first_name"].strip()
                    last_name = r.get("last_name", "").strip()
                    branch = r.get("branch", "").strip() or None
                    gender = r.get("gender", "").strip() or None
                    sem = int(r["semester"]) if r.get("semester") and r["semester"].isdigit() else None
                    d_code = (r.get("department_code") or "").strip().upper()
                    d_id = dept_map.get(d_code) or default_dept_id

                    user = await db.user.create(
                        data={
                            "email": email,
                            "hashedPassword": hashed_default,
                            "role": "STUDENT",
                            "tenantId": tenant.id,
                            "isActive": True,
                        }
                    )
                    await db.student.create(
                        data={
                            "userId": user.id,
                            "enrollmentNumber": enrollment,
                            "firstName": first_name,
                            "lastName": last_name,
                            "departmentId": d_id,
                            "semester": sem,
                            "branch": branch,
                            "gender": gender,
                        }
                    )
                    total_students += 1
            print(f"  ✓ Created {total_students} Students with branch, gender & department links.")

        print("\n" + "=" * 60)
        print("🎉 PRODUCTION CLEANUP & SEEDING COMPLETED SUCCESSFULLY")
        print("=" * 60)

    finally:
        if db.is_connected():
            await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
