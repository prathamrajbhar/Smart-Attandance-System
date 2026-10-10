import asyncio
import csv
import os
import sys
from pathlib import Path

# Ensure backend root is in sys.path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from prisma import Prisma, Json
from app.core.security import hash_password, generate_temporary_password

TEMP_DIR = Path(__file__).resolve().parent.parent.parent / "temp"

async def import_all(target_slug: str = "default-institution"):
    print("[*] Connecting to database...")
    db = Prisma()
    await db.connect()

    try:
        # Find or create target tenant
        tenant = await db.tenant.find_unique(where={"slug": target_slug})
        if not tenant:
            tenants = await db.tenant.find_many(take=1)
            if tenants:
                tenant = tenants[0]
            else:
                tenant = await db.tenant.create(
                    data={
                        "slug": target_slug,
                        "name": "Ganpat University (UVPCE)",
                        "type": "COLLEGE",
                        "status": "ACTIVE",
                        "licenseCount": 5000,
                        "config": Json({
                            "isFaceRecognitionEnabled": True,
                            "isGpsVerificationEnabled": True,
                            "isAiBackgroundValidationEnabled": True,
                        }),
                    }
                )
        print(f"[+] Importing into Tenant: {tenant.name} (ID: {tenant.id}, Slug: {tenant.slug})")

        # 1. Import Classrooms & Labs
        classroom_csv = TEMP_DIR / "classroom.csv"
        lab_csv = TEMP_DIR / "lab.csv"
        created_rooms = 0

        if classroom_csv.exists():
            with open(classroom_csv, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    room_id = (row.get("classroom_id") or "").strip()
                    if room_id:
                        exists = await db.classroom.find_first(where={"name": room_id, "tenantId": tenant.id})
                        if not exists:
                            await db.classroom.create(
                                data={
                                    "name": room_id,
                                    "building": "Main Academic Block",
                                    "tenantId": tenant.id,
                                }
                            )
                            created_rooms += 1

        if lab_csv.exists():
            with open(lab_csv, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    lab_id = (row.get("lab_id") or "").strip()
                    if lab_id:
                        exists = await db.classroom.find_first(where={"name": lab_id, "tenantId": tenant.id})
                        if not exists:
                            await db.classroom.create(
                                data={
                                    "name": lab_id,
                                    "building": "Engineering Lab Complex",
                                    "tenantId": tenant.id,
                                }
                            )
                            created_rooms += 1

        print(f"[+] Provisioned {created_rooms} Classrooms & Labs.")

        # 2. Extract and create unique Departments from faculty.csv & subject.csv
        faculty_csv = TEMP_DIR / "faculty.csv"
        subject_csv = TEMP_DIR / "subject.csv"
        departments_map = {}

        # Default fallback designations
        default_desig = await db.designation.find_first(where={"tenantId": tenant.id, "code": "FACULTY"})
        if not default_desig:
            default_desig = await db.designation.create(
                data={
                    "name": "Faculty Member",
                    "code": "FACULTY",
                    "description": "Teaching Faculty",
                    "tenantId": tenant.id,
                }
            )

        if faculty_csv.exists():
            with open(faculty_csv, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    dept_name = (row.get("department") or "").strip()
                    if dept_name and dept_name not in departments_map:
                        code = "".join(w[0] for w in dept_name.split() if w.isalnum()).upper()[:10] or "DEPT"
                        dept = await db.department.find_first(where={"name": dept_name, "tenantId": tenant.id})
                        if not dept:
                            dept = await db.department.create(
                                data={
                                    "name": dept_name,
                                    "code": code,
                                    "tenantId": tenant.id,
                                }
                            )
                        departments_map[dept_name] = dept.id

        print(f"[+] Loaded/Created {len(departments_map)} Academic Departments.")

        # 3. Import Faculty / Teachers
        created_teachers = 0
        if faculty_csv.exists():
            with open(faculty_csv, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader, start=1):
                    email = (row.get("email") or "").strip().lower()
                    name = (row.get("name") or "").strip()
                    dept_name = (row.get("department") or "").strip()
                    name_initials = (row.get("name_initials") or "").strip()
                    emp_id = f"EMP{idx:04d}"

                    if not email or not name:
                        continue

                    parts = name.split(None, 1)
                    first_name = parts[0]
                    last_name = parts[1] if len(parts) > 1 else "Faculty"
                    dept_id = departments_map.get(dept_name) or list(departments_map.values())[0]

                    user = await db.user.find_unique(where={"email": email})
                    if not user:
                        plain_pwd = generate_temporary_password()
                        user = await db.user.create(
                            data={
                                "email": email,
                                "hashedPassword": hash_password(plain_pwd),
                                "role": "TEACHER",
                                "mustChangePassword": True,
                                "tenantId": tenant.id,
                            }
                        )

                    teacher = await db.teacher.find_unique(where={"userId": user.id})
                    if not teacher:
                        await db.teacher.create(
                            data={
                                "userId": user.id,
                                "employeeId": emp_id,
                                "firstName": first_name,
                                "lastName": last_name,
                                "nameInitials": name_initials or None,
                                "departmentId": dept_id,
                                "designationId": default_desig.id,
                            }
                        )
                        created_teachers += 1

        print(f"[+] Created {created_teachers} Faculty / Teacher accounts.")

        # 4. Import Subjects
        created_subjects = 0
        if subject_csv.exists():
            with open(subject_csv, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    sub_name = (row.get("subject_name") or "").strip()
                    sub_code = (row.get("subject_code") or "").strip().upper()
                    branch = (row.get("branch") or "").strip()

                    if not sub_name or not sub_code:
                        continue

                    # Associate to matching department if available
                    dept_id = None
                    for d_name, d_id in departments_map.items():
                        if d_name.lower() in branch.lower():
                            dept_id = d_id
                            break

                    exists = await db.subject.find_first(where={"code": sub_code, "tenantId": tenant.id})
                    if not exists:
                        await db.subject.create(
                            data={
                                "name": sub_name,
                                "code": sub_code,
                                "departmentId": dept_id,
                                "tenantId": tenant.id,
                            }
                        )
                        created_subjects += 1

        print(f"[+] Created {created_subjects} Subjects.")

        # 5. Import Students
        students_csv = TEMP_DIR / "students.csv"
        created_students = 0

        # Create a default Computer Engineering department if not present
        default_student_dept_id = list(departments_map.values())[0] if departments_map else None
        if not default_student_dept_id:
            dept = await db.department.create(
                data={
                    "name": "Computer Engineering",
                    "code": "CE",
                    "tenantId": tenant.id,
                }
            )
            default_student_dept_id = dept.id

        if students_csv.exists():
            with open(students_csv, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    enrollment = (row.get("Enrollment No.") or "").strip()
                    full_name = (row.get("Name of Student") or "").strip()
                    branch = (row.get("Branch") or "").strip()
                    gender = (row.get("Gender") or "").strip().capitalize()

                    if not enrollment or not full_name:
                        continue

                    email = f"{enrollment.lower()}@ganpatuniversity.ac.in"
                    parts = full_name.split(None, 1)
                    first_name = parts[0]
                    last_name = parts[1] if len(parts) > 1 else "Student"

                    # Map department
                    dept_id = default_student_dept_id
                    for d_name, d_val in departments_map.items():
                        if branch.lower() in d_name.lower():
                            dept_id = d_val
                            break

                    user = await db.user.find_unique(where={"email": email})
                    if not user:
                        plain_pwd = generate_temporary_password()
                        user = await db.user.create(
                            data={
                                "email": email,
                                "hashedPassword": hash_password(plain_pwd),
                                "role": "STUDENT",
                                "mustChangePassword": True,
                                "tenantId": tenant.id,
                            }
                        )

                    student = await db.student.find_unique(where={"enrollmentNumber": enrollment})
                    if not student:
                        await db.student.create(
                            data={
                                "userId": user.id,
                                "enrollmentNumber": enrollment,
                                "firstName": first_name,
                                "lastName": last_name,
                                "gender": gender or None,
                                "branch": branch or None,
                                "departmentId": dept_id,
                                "semester": 1,
                            }
                        )
                        created_students += 1

        print(f"[+] Created {created_students} Students.")
        print("[✓] Real-World Dataset successfully imported into database!")

    finally:
        await db.disconnect()

if __name__ == "__main__":
    slug = sys.argv[1] if len(sys.argv) > 1 else "default-institution"
    asyncio.run(import_all(slug))
