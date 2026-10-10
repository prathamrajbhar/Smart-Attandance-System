import asyncio
import sys
import os
import uuid

# Ensure backend root is in sys.path
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from app.db.client import db, connect_db, disconnect_db
from app.schemas.student import StudentCreate
from app.schemas.teacher import TeacherCreate
from app.schemas.super_admin import TenantUpdateRequest
from app.services.admin.student_admin_service import StudentAdminService
from app.services.admin.teacher_admin_service import TeacherAdminService
from app.services.admin.subject_service import SubjectService
from app.services.super_admin_service import SuperAdminService

async def run_tests():
    print("==========================================================")
    print("🧪 RUNNING COMPREHENSIVE INTEGRATION & FUNCTIONAL TESTS")
    print("==========================================================")

    await connect_db()
    from prisma import Json

    test_run_id = uuid.uuid4().hex[:6]
    tenant_slug = f"test-tenant-{test_run_id}"

    try:
        # 1. TEST TENANT CREATION & SUPER ADMIN UPDATE/RENAME
        print("\n[TEST 1] Testing Super Admin Tenant Rename & Management...")
        tenant = await db.tenant.create(
            data={
                "slug": tenant_slug,
                "name": f"Initial School {test_run_id}",
                "type": "SCHOOL",
                "status": "ACTIVE",
                "licenseCount": 500,
                "config": Json({"isFaceRecognitionEnabled": True}),
            }
        )
        print(f"  ✓ Created initial tenant: {tenant.name} ({tenant.slug})")

        updated_name = f"Renamed University {test_run_id}"
        updated_slug = f"renamed-slug-{test_run_id}"
        update_res = await SuperAdminService.update_tenant(
            tenant.id,
            TenantUpdateRequest(
                name=updated_name,
                slug=updated_slug,
                type="COLLEGE",
                license_count=1000,
            )
        )
        assert update_res.name == updated_name, f"Expected {updated_name}, got {update_res.name}"
        assert update_res.slug == updated_slug, f"Expected {updated_slug}, got {update_res.slug}"
        assert update_res.type == "COLLEGE", f"Expected COLLEGE, got {update_res.type}"
        assert update_res.license_count == 1000, f"Expected 1000, got {update_res.license_count}"
        print(f"  ✓ Successfully renamed tenant to: {update_res.name} (slug: {update_res.slug})")

        # 2. TEST DEPARTMENT CREATION & SUBJECT RELATION
        print("\n[TEST 2] Testing Subject creation with Department relation...")
        department = await db.department.create(
            data={
                "name": f"Computer Science {test_run_id}",
                "code": f"CS{test_run_id.upper()}",
                "tenantId": tenant.id,
            }
        )
        print(f"  ✓ Created Department: {department.name}")

        subject = await SubjectService.create_subject(
            name=f"Deep Learning {test_run_id}",
            code=f"DL{test_run_id.upper()}",
            description="Deep Learning neural architectures",
            department_id=department.id,
            tenant_id=tenant.id,
        )
        assert subject.departmentId == department.id, "Subject departmentId mismatch"
        print(f"  ✓ Created Subject '{subject.name}' explicitly linked to Department ID '{subject.departmentId}'")

        # Test Subject Update
        updated_sub = await SubjectService.update_subject(
            subject.id,
            {"name": f"Deep Learning Advanced {test_run_id}"},
            tenant_id=tenant.id,
        )
        assert "Advanced" in updated_sub.name, "Subject update failed"
        print(f"  ✓ Updated Subject name: '{updated_sub.name}'")

        # 3. TEST TEACHER CREATION WITH NAME INITIALS
        print("\n[TEST 3] Testing Teacher with Name Initials (pkp/nmd)...")
        designation = await db.designation.create(
            data={
                "name": "Associate Professor",
                "code": f"ASSOC_PROF_{test_run_id.upper()}",
                "tenantId": tenant.id,
            }
        )

        teacher_email = f"prof_{test_run_id}@university.edu"
        teacher_create = TeacherCreate(
            email=teacher_email,
            employee_id=f"EMP_{test_run_id.upper()}",
            first_name="Priyankaben",
            last_name="Patel",
            name_initials="pkp",
            department_id=department.id,
            designation_id=designation.id,
            send_invite=False,
        )
        teacher_res = await TeacherAdminService.create_teacher(teacher_create, tenant_id=tenant.id)
        assert teacher_res.name_initials == "pkp", f"Expected 'pkp', got {teacher_res.name_initials}"
        assert teacher_res.department_id == department.id, "Teacher departmentId mismatch"
        print(f"  ✓ Created Teacher {teacher_res.first_name} {teacher_res.last_name} with initials '{teacher_res.name_initials}'")

        # 4. TEST STUDENT CREATION WITH BRANCH & GENDER (NO FALLBACK)
        print("\n[TEST 4] Testing Student with Branch & Gender...")
        student_email = f"student_{test_run_id}@university.edu"
        student_enrollment = f"EN{test_run_id.upper()}"
        student_create = StudentCreate(
            email=student_email,
            enrollment_number=student_enrollment,
            first_name="Krish",
            last_name="Patel",
            gender="Male",
            branch="CE",
            semester=5,
            batch="2022-2026",
            department_id=department.id,
            send_invite=False,
        )
        student_res = await StudentAdminService.create_student(student_create, tenant_id=tenant.id)
        assert student_res.branch == "CE", f"Expected 'CE', got {student_res.branch}"
        assert student_res.gender == "Male", f"Expected 'Male', got {student_res.gender}"
        assert student_res.department_id == department.id, "Student departmentId mismatch"
        print(f"  ✓ Created Student {student_res.first_name} {student_res.last_name} (Branch: {student_res.branch}, Gender: {student_res.gender})")

        # Test Student Update
        updated_student = await StudentAdminService.update_student(
            student_res.id,
            {"branch": "IoT-IT", "gender": "Male"},
            tenant_id=tenant.id,
        )
        assert updated_student.branch == "IoT-IT", f"Expected 'IoT-IT', got {updated_student.branch}"
        print(f"  ✓ Updated Student branch to '{updated_student.branch}'")

        # 5. TEST SUPER ADMIN TENANT DELETION
        print("\n[TEST 5] Testing Super Admin Tenant Hard Delete...")
        delete_res = await SuperAdminService.delete_tenant(tenant.id)
        assert delete_res["status"] == "DELETED", f"Expected 'DELETED', got {delete_res}"

        # Verify tenant is gone from DB
        deleted_check = await db.tenant.find_unique(where={"id": tenant.id})
        assert deleted_check is None, "Tenant was not deleted from database"
        print(f"  ✓ Tenant {tenant.id} and child cascades successfully deleted.")

        print("\n==========================================================")
        print("🎉 ALL 5 FUNCTIONAL VERIFICATION TESTS PASSED SUCCESSFULLY!")
        print("==========================================================")

    finally:
        await disconnect_db()

if __name__ == "__main__":
    asyncio.run(run_tests())
