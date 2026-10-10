#!/usr/bin/env python3
"""
API-Driven Database Seeder.
Uses HTTP REST API exclusively to provision:
- Tenant & Admin (via Super Admin endpoints)
- Departments, Designations, Classrooms, Subjects (via Admin bulk endpoints)
- Teachers & Students with @yopmail.com emails (via Admin bulk endpoints)
- Academic Classes & Sessions (via Admin & Teacher endpoints)
"""

import asyncio
import csv
import sys
import httpx
from pathlib import Path

BASE_URL = "http://localhost:8000/api/v1"
DATASET_DIR = Path(__file__).resolve().parent.parent.parent / "asset" / "dataset"

SUPERADMIN_EMAIL = "superadmin@yopmail.com"
SUPERADMIN_FALLBACK = "superadmin@smartattendance.edu.in"
SUPERADMIN_PASS = "SuperAdmin@123"

TENANT_ADMIN_EMAIL = "admin_uvpce@yopmail.com"
TENANT_ADMIN_PASS = "Password123!"
TENANT_SLUG = "uvpce"
TENANT_NAME = "Ganpat University (UVPCE)"

DEFAULT_PASSWORD = "Password123!"


async def main():
    print("=" * 60)
    print("🚀 Starting API-Driven Seeding Workflow (Yopmail Always)")
    print("=" * 60)

    async with httpx.AsyncClient(base_url=BASE_URL, timeout=120.0) as client:
        # Step 1: Login as Super Admin
        print("\n[1/7] Authenticating as Super Admin...")
        res = await client.post("/auth/login", json={
            "email": SUPERADMIN_EMAIL,
            "password": SUPERADMIN_PASS
        })
        if res.status_code != 200:
            res = await client.post("/auth/login", json={
                "email": SUPERADMIN_FALLBACK,
                "password": SUPERADMIN_PASS
            })
        if res.status_code != 200:
            print(f"❌ Super Admin login failed: {res.status_code} {res.text}")
            sys.exit(1)

        super_token = res.json()["access_token"]
        super_headers = {"Authorization": f"Bearer {super_token}"}
        print("✓ Super Admin authenticated successfully.")

        # Step 2: Provision or Get Tenant
        print("\n[2/7] Checking/Provisioning Tenant via Super Admin API...")
        tenants_res = await client.get("/super-admin/tenants", headers=super_headers, params={"q": TENANT_SLUG})
        tenant_id = None
        if tenants_res.status_code == 200:
            tenants = tenants_res.json().get("items", [])
            for t in tenants:
                if t.get("slug") == TENANT_SLUG:
                    tenant_id = t["id"]
                    print(f"✓ Found existing Tenant: {t['name']} (ID: {tenant_id})")
                    break

        if not tenant_id:
            prov_res = await client.post("/super-admin/tenants", headers=super_headers, json={
                "name": TENANT_NAME,
                "slug": TENANT_SLUG,
                "type": "COLLEGE",
                "license_count": 5000,
                "admin_email": TENANT_ADMIN_EMAIL,
                "admin_name": "UVPCE Administrator",
                "admin_password": TENANT_ADMIN_PASS
            })
            if prov_res.status_code not in [200, 201]:
                print(f"❌ Tenant provisioning failed: {prov_res.status_code} {prov_res.text}")
                sys.exit(1)
            tenant_data = prov_res.json()
            tenant_id = tenant_data["id"]
            print(f"✓ Provisioned new Tenant: {tenant_data['name']} (ID: {tenant_id}) with Admin: {TENANT_ADMIN_EMAIL}")
        else:
            # Ensure Admin exists
            admin_login_check = await client.post("/auth/login", json={
                "email": TENANT_ADMIN_EMAIL,
                "password": TENANT_ADMIN_PASS
            })
            if admin_login_check.status_code != 200:
                print("Adding Tenant Admin user...")
                await client.post(f"/super-admin/tenants/{tenant_id}/admins", headers=super_headers, json={
                    "email": TENANT_ADMIN_EMAIL,
                    "name": "UVPCE Administrator",
                    "password": TENANT_ADMIN_PASS,
                    "role": "ADMIN"
                })

        # Step 3: Login as Tenant Admin
        print("\n[3/7] Authenticating as Tenant Admin...")
        admin_auth_res = await client.post("/auth/login", json={
            "email": TENANT_ADMIN_EMAIL,
            "password": TENANT_ADMIN_PASS
        })
        if admin_auth_res.status_code != 200:
            print(f"❌ Tenant Admin login failed: {admin_auth_res.status_code} {admin_auth_res.text}")
            sys.exit(1)

        admin_token = admin_auth_res.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print("✓ Tenant Admin authenticated successfully.")

        # Step 4: Ingest Departments, Designations, Classrooms, Subjects
        print("\n[4/7] Ingesting Master Data via Admin Bulk APIs...")

        # 4a: Departments
        dept_csv = DATASET_DIR / "departments.csv"
        if dept_csv.exists():
            with open(dept_csv, mode="r", encoding="utf-8") as f:
                depts = list(csv.DictReader(f))
                dept_res = await client.post("/admin/departments/bulk", headers=admin_headers, json={"departments": depts})
                print(f"  ✓ Ingested Departments: {dept_res.json().get('imported_count', 0)} added (status: {dept_res.status_code})")

        # 4b: Designations
        desig_csv = DATASET_DIR / "designations.csv"
        if desig_csv.exists():
            with open(desig_csv, mode="r", encoding="utf-8") as f:
                desigs = list(csv.DictReader(f))
                desig_res = await client.post("/admin/designations/bulk", headers=admin_headers, json={"designations": desigs})
                print(f"  ✓ Ingested Designations: {desig_res.json().get('imported_count', 0)} added (status: {desig_res.status_code})")

        # 4c: Classrooms
        cr_csv = DATASET_DIR / "classrooms.csv"
        if cr_csv.exists():
            with open(cr_csv, mode="r", encoding="utf-8") as f:
                classrooms = [{"name": r["name"], "building": r["building"]} for r in csv.DictReader(f)]
                cr_res = await client.post("/admin/classrooms/bulk", headers=admin_headers, json={"classrooms": classrooms})
                print(f"  ✓ Ingested Classrooms & Labs: {cr_res.json().get('imported_count', 0)} added (status: {cr_res.status_code})")

        # 4d: Subjects
        sub_csv = DATASET_DIR / "subjects.csv"
        if sub_csv.exists():
            with open(sub_csv, mode="r", encoding="utf-8") as f:
                subjects = list(csv.DictReader(f))
                total_sub_imported = 0
                for i in range(0, len(subjects), 50):
                    batch = subjects[i:i+50]
                    sub_res = await client.post("/admin/subjects/bulk", headers=admin_headers, json={"subjects": batch})
                    total_sub_imported += sub_res.json().get("imported_count", 0)
                print(f"  ✓ Ingested Subjects: {total_sub_imported} added across batches")

        # Step 5: Ingest Faculty & Students (Yopmail format)
        print("\n[5/7] Ingesting Faculty and Students via Admin Bulk APIs...")

        # 5a: Faculty
        teachers_csv = DATASET_DIR / "teachers.csv"
        if teachers_csv.exists():
            with open(teachers_csv, mode="r", encoding="utf-8") as f:
                teachers = list(csv.DictReader(f))
                for t in teachers:
                    t["password"] = DEFAULT_PASSWORD

                total_teachers_imported = 0
                for i in range(0, len(teachers), 25):
                    batch = teachers[i:i+25]
                    t_res = await client.post("/admin/users/teachers/bulk", headers=admin_headers, json={
                        "teachers": batch,
                        "send_invite": False
                    })
                    count = t_res.json().get("imported_count", 0)
                    total_teachers_imported += count
                    print(f"    Batch {i//25 + 1}/{(len(teachers)-1)//25 + 1}: +{count} faculty")
                print(f"  ✓ Total Faculty Ingested: {total_teachers_imported}")

        # 5b: Students
        students_csv = DATASET_DIR / "students.csv"
        if students_csv.exists():
            with open(students_csv, mode="r", encoding="utf-8") as f:
                students = list(csv.DictReader(f))
                for s in students:
                    s["password"] = DEFAULT_PASSWORD

                total_students_imported = 0
                for i in range(0, len(students), 25):
                    batch = students[i:i+25]
                    s_res = await client.post("/admin/users/students/bulk", headers=admin_headers, json={
                        "students": batch,
                        "send_invite": False
                    })
                    count = s_res.json().get("imported_count", 0)
                    total_students_imported += count
                    print(f"    Batch {i//25 + 1}/{(len(students)-1)//25 + 1}: +{count} students")
                print(f"  ✓ Total Students Ingested: {total_students_imported}")

        # Step 6: Create Sample Academic Classes
        print("\n[6/7] Creating Academic Classes via Bulk API...")
        sample_classes = [
            {
                "name": "B.Tech CE - Mathematics I (Sem 1)",
                "subject_code": "2BSC1101",
                "teacher_email": "vijay.patel@yopmail.com",
                "classroom_name": "Room 001",
                "semester": 1,
                "batch": "2023-2027",
            },
            {
                "name": "B.Tech CE - Basics of Electronics (Sem 1)",
                "subject_code": "2ESC1102",
                "teacher_email": "anand.mankodia@yopmail.com",
                "classroom_name": "Room 002",
                "semester": 1,
                "batch": "2023-2027",
            },
            {
                "name": "B.Tech CE - Discrete Mathematics (Sem 3)",
                "subject_code": "2BS3102",
                "teacher_email": "amrut.patel@yopmail.com",
                "classroom_name": "Room 003",
                "semester": 3,
                "batch": "2022-2026",
            },
            {
                "name": "B.Tech IT - Electronics Lab (Sem 1)",
                "subject_code": "2ESC1102",
                "teacher_email": "vijay.patel@yopmail.com",
                "classroom_name": "Lab 001-A",
                "semester": 1,
                "batch": "2023-2027",
            },
        ]
        class_res = await client.post("/admin/classes/bulk", headers=admin_headers, json={"classes": sample_classes})
        print(f"  ✓ Provisioned Classes: {class_res.json().get('imported_count', 0)} added (status: {class_res.status_code})")

        # Step 7: Verify Teacher & Student Auth
        print("\n[7/7] Testing Teacher & Student API Logins...")

        teacher_auth = await client.post("/auth/login", json={
            "email": "vijay.patel@yopmail.com",
            "password": DEFAULT_PASSWORD
        })
        if teacher_auth.status_code == 200:
            print(f"  ✓ Teacher login successful: vijay.patel@yopmail.com (Role: {teacher_auth.json().get('role')})")
        else:
            print(f"  ⚠ Teacher login note: {teacher_auth.status_code} {teacher_auth.text}")

        student_auth = await client.post("/auth/login", json={
            "email": "22012011135@yopmail.com",
            "password": DEFAULT_PASSWORD
        })
        if student_auth.status_code == 200:
            print(f"  ✓ Student login successful: 22012011135@yopmail.com (Role: {student_auth.json().get('role')})")
        else:
            print(f"  ⚠ Student login note: {student_auth.status_code} {student_auth.text}")

    print("\n" + "=" * 60)
    print("🎉 API-Driven Seeding Complete and Verified!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
