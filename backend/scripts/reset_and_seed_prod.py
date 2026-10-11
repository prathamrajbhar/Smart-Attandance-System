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
   - 144 Teachers (all @yopmail.com with initials & department/designation links)
   - 462 Students (all @yopmail.com with branch, gender, & department links)
5. Sets up System Configurations.
6. Generates Academic Classes, Geofences, Student Enrollments, and Active/Historical Sessions.
"""

import asyncio
import csv
import os
import sys
import boto3
import bcrypt
from datetime import datetime, timezone, timedelta
from pathlib import Path

backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from dotenv import load_dotenv
from prisma import Prisma

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

# Campus Coordinates: Ganpat University (UVPCE)
CAMPUS_LAT = 23.5293
CAMPUS_LNG = 72.4578
CAMPUS_RADIUS = 100.0


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()


def cleanup_s3():
    print("\n[1/6] Cleaning AWS S3 Storage...")
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
    print("=" * 65)
    print("🚨 PRODUCTION RDS & S3 CLEANUP AND COMPREHENSIVE SEEDING")
    print("=" * 65)

    # Step 1: Clean S3
    cleanup_s3()

    # Step 2: Connect to RDS Postgres via Prisma
    print("\n[2/6] Connecting to AWS RDS PostgreSQL...")
    db = Prisma(datasource={"url": PROD_DB_URL})
    await db.connect()
    print("  ✓ Connected to AWS RDS PostgreSQL database.")

    try:
        # Step 3: Purge all RDS Tables
        print("\n[3/6] Purging all domain tables in RDS PostgreSQL...")
        await db.attendance.delete_many()
        await db.devicechangerequest.delete_many()
        await db.leaverequest.delete_many()
        await db.enrollment.delete_many()
        await db.geofence.delete_many()
        await db.teachersubstitution.delete_many()
        await db.timetableentry.delete_many()
        await db.timeslot.delete_many()
        await db.cohortcourse.delete_many()
        await db.cohortstudent.delete_many()
        await db.cohortbatch.delete_many()
        await db.academiccohort.delete_many()
        await db.session.delete_many()
        await db.academicclass.delete_many()
        await db.campus.delete_many()
        await db.teacher.delete_many()
        await db.student.delete_many()
        await db.notification.delete_many()
        await db.auditlog.delete_many()
        await db.licenserequest.delete_many()
        await db.user.delete_many()
        await db.subject.delete_many()
        await db.classroom.delete_many()
        await db.designation.delete_many()
        await db.department.delete_many()
        await db.systemconfiguration.delete_many()
        await db.tenant.delete_many()
        print("  ✓ All domain tables successfully wiped.")

        # Step 4: Create Super Admin & System Config
        print("\n[4/6] Provisioning Super Admin & System Configurations...")
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

        # Step 5: Seed Tenant & Master Datasets
        print("\n[5/6] Seeding Real World Dataset for Production Tenant (UVPCE)...")
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

        # 5a: Campus
        campus = await db.campus.create(
            data={
                "tenantId": tenant.id,
                "name": "UVPCE Main Campus",
                "code": "UVPCE-MAIN",
                "address": "Ganpat University, Mehsana-Gozaria Highway, Kherva, Gujarat 384017",
                "latitude": CAMPUS_LAT,
                "longitude": CAMPUS_LNG,
            }
        )
        print(f"  ✓ Main Campus created: {campus.name}")

        # 5b: Tenant Admin User
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

        # 5c: Departments
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

        # 5d: Designations
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

        # 5e: Classrooms
        room_csv = DATASET_DIR / "classrooms.csv"
        created_rooms = []
        if room_csv.exists():
            with open(room_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    cr = await db.classroom.create(
                        data={
                            "tenantId": tenant.id,
                            "name": r["name"].strip(),
                            "building": r.get("building", "").strip() or "Main Campus",
                        }
                    )
                    created_rooms.append(cr)
            print(f"  ✓ Created {len(created_rooms)} Classrooms and Labs.")

        # 5f: Subjects
        subj_csv = DATASET_DIR / "subjects.csv"
        created_subjects = []
        subjects_by_dept = {}
        if subj_csv.exists():
            with open(subj_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    dept_key = (r.get("department_id") or r.get("department_code") or "").strip().upper()
                    d_id = dept_map.get(dept_key)
                    sub = await db.subject.create(
                        data={
                            "tenantId": tenant.id,
                            "code": r["code"].strip(),
                            "name": r["name"].strip(),
                            "departmentId": d_id,
                            "description": r.get("description", "").strip() or None,
                        }
                    )
                    created_subjects.append(sub)
                    if dept_key:
                        subjects_by_dept.setdefault(dept_key, []).append(sub)
            print(f"  ✓ Created {len(created_subjects)} Subjects with department relations.")

        # 5g: Teachers
        teachers_csv = DATASET_DIR / "teachers.csv"
        hashed_default = _hash_password(DEFAULT_PASSWORD)
        default_dept_id = list(dept_map.values())[0] if dept_map else None
        default_desig_id = list(desig_map.values())[0] if desig_map else None
        created_teachers = []
        teachers_by_dept = {}

        if teachers_csv.exists():
            with open(teachers_csv, encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for r in reader:
                    email = r["email"].strip().lower()
                    emp_id = r["employee_id"].strip()
                    first_name = r["first_name"].strip()
                    last_name = r.get("last_name", "").strip()
                    initials = r.get("name_initials", "").strip().lower() or None
                    dept_key = (r.get("department_id") or r.get("department_code") or "").strip().upper()
                    ds_key = (r.get("designation_id") or r.get("designation_code") or "").strip().upper()
                    d_id = dept_map.get(dept_key) or default_dept_id
                    ds_id = desig_map.get(ds_key) or default_desig_id

                    user = await db.user.create(
                        data={
                            "email": email,
                            "hashedPassword": hashed_default,
                            "role": "TEACHER",
                            "tenantId": tenant.id,
                            "isActive": True,
                        }
                    )
                    teacher = await db.teacher.create(
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
                    created_teachers.append(teacher)
                    teachers_by_dept.setdefault(dept_key, []).append(teacher)
            print(f"  ✓ Created {len(created_teachers)} Faculty / Teachers with initials & links.")

        # 5h: Students
        students_csv = DATASET_DIR / "students.csv"
        created_students = []
        students_by_branch = {}

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
                    
                    # Compute semester and batch from enrollment prefix
                    prefix = enrollment[:2]
                    sem = 4 if prefix == "23" else (2 if prefix == "24" else 6)
                    batch = f"20{prefix}-20{int(prefix)+4}" if prefix.isdigit() else "2023-2027"
                    
                    dept_key = (r.get("department_id") or r.get("department_code") or "").strip().upper()
                    d_id = dept_map.get(dept_key) or default_dept_id

                    user = await db.user.create(
                        data={
                            "email": email,
                            "hashedPassword": hashed_default,
                            "role": "STUDENT",
                            "tenantId": tenant.id,
                            "isActive": True,
                        }
                    )
                    student = await db.student.create(
                        data={
                            "userId": user.id,
                            "enrollmentNumber": enrollment,
                            "firstName": first_name,
                            "lastName": last_name,
                            "departmentId": d_id,
                            "semester": sem,
                            "batch": batch,
                            "branch": branch,
                            "gender": gender,
                        }
                    )
                    created_students.append(student)
                    if branch:
                        students_by_branch.setdefault(branch, []).append(student)
            print(f"  ✓ Created {len(created_students)} Students with branch, batch & department links.")

        # Step 6: Academic Classes, Geofences, Enrollments & Sessions
        print("\n[6/6] Provisioning Academic Classes, Geofences, Enrollments & Live Sessions...")

        # Branch to department and subject mapping
        branch_configs = [
            {"branch": "CE", "dept": "CSE", "semester": 4, "batch": "2023-2027", "code_filter": ["2CE", "2BS", "2BSC"]},
            {"branch": "CE-AI", "dept": "CSE", "semester": 4, "batch": "2023-2027", "code_filter": ["2CEAI", "2CE", "2BS"]},
            {"branch": "IT", "dept": "IT", "semester": 4, "batch": "2023-2027", "code_filter": ["2IT", "2CE", "2BS"]},
            {"branch": "IoT-CE", "dept": "CSE", "semester": 2, "batch": "2024-2028", "code_filter": ["2CE", "2BSC"]},
            {"branch": "IoT-IT", "dept": "IT", "semester": 2, "batch": "2024-2028", "code_filter": ["2IT", "2BSC"]},
        ]

        total_classes_created = 0
        total_enrollments_created = 0
        total_sessions_created = 0
        total_attendance_created = 0

        now = datetime.now(timezone.utc)
        room_idx = 0

        for config in branch_configs:
            branch_name = config["branch"]
            dept_key = config["dept"]
            branch_students = students_by_branch.get(branch_name, [])
            if not branch_students:
                continue

            available_subjects = subjects_by_dept.get(dept_key, []) or created_subjects
            available_teachers = teachers_by_dept.get(dept_key, []) or created_teachers

            # Pick 4 core subjects for each branch
            selected_subjects = []
            for sub in available_subjects:
                if any(sub.code.startswith(pf) for pf in config["code_filter"]):
                    selected_subjects.append(sub)
                if len(selected_subjects) >= 4:
                    break

            if not selected_subjects:
                selected_subjects = available_subjects[:4]

            for idx, subject in enumerate(selected_subjects):
                teacher = available_teachers[idx % len(available_teachers)]
                classroom = created_rooms[room_idx % len(created_rooms)]
                room_idx += 1

                class_name = f"{branch_name} - Sem {config['semester']} - {subject.code}"

                # 6a: Create AcademicClass
                academic_class = await db.academicclass.create(
                    data={
                        "tenantId": tenant.id,
                        "campusId": campus.id,
                        "name": class_name,
                        "subjectId": subject.id,
                        "teacherId": teacher.id,
                        "classroomId": classroom.id,
                        "semester": config["semester"],
                        "batch": config["batch"],
                    }
                )
                total_classes_created += 1

                # 6b: Create Geofence
                await db.geofence.create(
                    data={
                        "academicClassId": academic_class.id,
                        "latitude": CAMPUS_LAT,
                        "longitude": CAMPUS_LNG,
                        "radiusMeters": CAMPUS_RADIUS,
                    }
                )

                # 6c: Enroll all students in this branch
                for st in branch_students:
                    await db.enrollment.create(
                        data={
                            "studentId": st.id,
                            "academicClassId": academic_class.id,
                        }
                    )
                    total_enrollments_created += 1

                # 6d: Create 1 Active Session
                active_session = await db.session.create(
                    data={
                        "academicClassId": academic_class.id,
                        "startTime": now - timedelta(minutes=15),
                        "endTime": now + timedelta(minutes=45),
                        "isActive": True,
                    }
                )
                total_sessions_created += 1

                # 6e: Create 2 Completed Past Sessions with Attendance
                for past_offset in [1, 2]:
                    past_start = now - timedelta(days=past_offset, hours=2)
                    past_end = past_start + timedelta(hours=1)
                    past_session = await db.session.create(
                        data={
                            "academicClassId": academic_class.id,
                            "startTime": past_start,
                            "endTime": past_end,
                            "isActive": False,
                        }
                    )
                    total_sessions_created += 1

                    # Seed attendance for students (85% Present, 10% Absent, 5% Flagged)
                    for s_idx, st in enumerate(branch_students):
                        if (s_idx + past_offset) % 10 == 0:
                            status_val = "Absent"
                            face_sc, live_sc, bg_sc, final_sc = 0.0, 0.0, 0.0, 0.0
                        elif (s_idx + past_offset) % 15 == 0:
                            status_val = "Flagged"
                            face_sc, live_sc, bg_sc, final_sc = 0.72, 0.65, 0.70, 0.69
                        else:
                            status_val = "Present"
                            face_sc, live_sc, bg_sc, final_sc = 0.95, 0.94, 0.96, 0.95

                        await db.attendance.create(
                            data={
                                "studentId": st.id,
                                "sessionId": past_session.id,
                                "status": status_val,
                                "faceScore": face_sc,
                                "livenessScore": live_sc,
                                "backgroundScore": bg_sc,
                                "finalAiScore": final_sc,
                                "gpsLatitude": CAMPUS_LAT,
                                "gpsLongitude": CAMPUS_LNG,
                                "remarks": f"System automated seed - {status_val}",
                            }
                        )
                        total_attendance_created += 1

        print(f"  ✓ Created {total_classes_created} Academic Classes with Geofences.")
        print(f"  ✓ Created {total_enrollments_created} Student Enrollments.")
        print(f"  ✓ Created {total_sessions_created} Sessions (Active & Historical).")
        print(f"  ✓ Generated {total_attendance_created} Attendance records.")

        print("\n" + "=" * 65)
        print("🎉 PRODUCTION CLEANUP & COMPLETE SEEDING SUCCEEDED")
        print("=" * 65)

    finally:
        if db.is_connected():
            await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())

