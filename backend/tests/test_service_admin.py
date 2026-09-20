import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch, MagicMock
from types import SimpleNamespace

from app.services.admin_service import AdminService
from app.schemas.student import StudentCreate
from app.schemas.teacher import TeacherCreate
from app.schemas.admin import ClassCreate

@pytest.mark.asyncio
async def test_admin_service_create_student():
    service = AdminService()
    now = datetime.now(timezone.utc)
    mock_user = SimpleNamespace(id="usr-stu-new", email="freshman.alok@yopmail.com", role="STUDENT")
    mock_student = SimpleNamespace(
        id="stu-new-101",
        userId=mock_user.id,
        enrollmentNumber="CS-2024-0099",
        firstName="Alok",
        lastName="Nath",
        phone="+1555123987",
        gender="Male",
        dateOfBirth=None,
        semester=1,
        batch="2024-2028",
        departmentId=None,
        department=None,
        user=mock_user,
        createdAt=now,
        updatedAt=now,
    )

    with patch("app.services.admin_service.db") as mock_db:
        mock_db.user.create = AsyncMock(return_value=mock_user)
        mock_db.student.create = AsyncMock(return_value=mock_student)
        mock_db.auditlog.create = AsyncMock(return_value=None)

        student_data = StudentCreate(
            email="freshman.alok@yopmail.com",
            first_name="Alok",
            last_name="Nath",
            enrollment_number="CS-2024-0099",
            phone="+1555123987",
            gender="Male",
            semester=1,
            batch="2024-2028",
            send_invite=False,
        )
        res = await service.create_student(student_data, actor="admin.smith@yopmail.com", ip="127.0.0.1")
        assert res.id == "stu-new-101"
        assert res.enrollment_number == "CS-2024-0099"
        assert mock_db.auditlog.create.called

@pytest.mark.asyncio
async def test_admin_service_create_teacher():
    service = AdminService()
    now = datetime.now(timezone.utc)
    mock_dept = SimpleNamespace(id="dept-cs-01", name="Computer Science", code="CS")
    mock_desig = SimpleNamespace(id="desig-prof-01", name="Associate Professor", code="ASSOC_PROF")
    mock_user = SimpleNamespace(id="usr-tch-new", email="prof.patel@yopmail.com", role="TEACHER")
    mock_teacher = SimpleNamespace(
        id="tch-new-202",
        userId=mock_user.id,
        employeeId="EMP-CS-999",
        firstName="Pooja",
        lastName="Patel",
        departmentId="dept-cs-01",
        designationId="desig-prof-01",
        phone="+1555432109",
        qualification="M.Tech",
        specialization="Network Security",
        experienceYears=8,
        joiningDate=None,
        department=mock_dept,
        designation=mock_desig,
        user=mock_user,
        createdAt=now,
        updatedAt=now,
    )

    with patch("app.services.admin_service.db") as mock_db:
        mock_db.department.find_unique = AsyncMock(return_value=mock_dept)
        mock_db.designation.find_unique = AsyncMock(return_value=mock_desig)
        mock_db.user.create = AsyncMock(return_value=mock_user)
        mock_db.teacher.create = AsyncMock(return_value=mock_teacher)
        mock_db.auditlog.create = AsyncMock(return_value=None)

        teacher_data = TeacherCreate(
            email="prof.patel@yopmail.com",
            first_name="Pooja",
            last_name="Patel",
            employee_id="EMP-CS-999",
            department_id="dept-cs-01",
            designation_id="desig-prof-01",
            phone="+1555432109",
            qualification="M.Tech",
            specialization="Network Security",
            experience_years=8,
            send_invite=False,
        )
        res = await service.create_teacher(teacher_data, actor="admin.smith@yopmail.com", ip="127.0.0.1")
        assert res.id == "tch-new-202"
        assert res.employee_id == "EMP-CS-999"
        assert res.department == "Computer Science"

@pytest.mark.asyncio
async def test_admin_service_enroll_students():
    service = AdminService()
    with patch("app.services.admin_service.db") as mock_db, \
         patch.object(service.class_repo, "get_by_id", new_callable=AsyncMock) as mock_cls_get, \
         patch.object(service.student_repo, "get_by_id", new_callable=AsyncMock) as mock_stu_get, \
         patch.object(service.enrollment_repo, "enroll_student", new_callable=AsyncMock) as mock_enr_create:
        
        mock_cls_get.return_value = SimpleNamespace(id="cls-ai-601", name="AI Sec A")
        mock_stu_get.side_effect = lambda sid: SimpleNamespace(id=sid)
        mock_db.enrollment.find_first = AsyncMock(return_value=None)
        mock_db.auditlog.create = AsyncMock(return_value=None)
        mock_enr_create.return_value = SimpleNamespace(id="enr-1")

        count = await service.enroll_students("cls-ai-601", ["stu-1", "stu-2"], actor="admin.smith@yopmail.com")
        assert count == 2
