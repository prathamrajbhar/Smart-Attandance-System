from typing import List, Optional

from prisma.models import Department, AuditLog, Subject, Classroom, Designation

from app.core.logging_config import get_logger
from app.core.security import hash_password
from app.db.client import db
from app.repositories.user_repo import UserRepository
from app.repositories.student_repo import StudentRepository
from app.repositories.teacher_repo import TeacherRepository
from app.repositories.class_repo import ClassRepository
from app.repositories.enrollment_repo import EnrollmentRepository
from app.schemas.student import StudentCreate, StudentResponse
from app.schemas.teacher import TeacherCreate, TeacherResponse
from app.schemas.admin import ClassCreate, ClassResponse

logger = get_logger("app.services.admin")


class AdminService:
    def __init__(self) -> None:
        self.user_repo = UserRepository()
        self.student_repo = StudentRepository()
        self.teacher_repo = TeacherRepository()
        self.class_repo = ClassRepository()
        self.enrollment_repo = EnrollmentRepository()

    @staticmethod
    async def _log_action(event_type: str, severity: str, actor: str, target: str, description: str, ip: Optional[str] = None) -> None:
        await db.auditlog.create(data={
            "eventType": event_type,
            "severity": severity,
            "actor": actor,
            "target": target,
            "description": description,
            "ipAddress": ip,
        })

    # --- Students ---

    async def create_student(self, data: StudentCreate, actor: str = "system", ip: Optional[str] = None) -> StudentResponse:
        from app.core.security import generate_temporary_password

        if data.department_id:
            if not await db.department.find_unique(where={"id": data.department_id}):
                raise ValueError("Department not found.")

        plain_password = data.password
        must_change = False
        if not plain_password:
            plain_password = generate_temporary_password()
            must_change = True

        user = await db.user.create(data={
            "email": data.email,
            "hashedPassword": hash_password(plain_password),
            "role": "STUDENT",
            "mustChangePassword": must_change,
        })
        student = await db.student.create(
            data={k: v for k, v in {
                "userId": user.id, "enrollmentNumber": data.enrollment_number,
                "firstName": data.first_name, "lastName": data.last_name,
                "phone": data.phone, "gender": data.gender, "dateOfBirth": data.date_of_birth,
                "semester": data.semester, "batch": data.batch, "departmentId": data.department_id,
            }.items() if v is not None},
            include={"department": True},
        )
        await self._log_action("CREATE_STUDENT", "INFO", actor, student.id, f"Created student {data.email}", ip)

        if data.send_invite:
            try:
                from app.services.auth_service import AuthService
                from app.services.email_service import email_service
                name = f"{data.first_name or ''} {data.last_name or ''}".strip() or "Student"
                token = await AuthService().create_invitation_token(
                    user_id=user.id, email=user.email, role="STUDENT", name=name
                )
                await email_service.send_invitation_email(
                    to_email=user.email,
                    recipient_name=name,
                    role="STUDENT",
                    invite_token=token,
                    identifier_label="Enrollment Number",
                    identifier_value=data.enrollment_number,
                    temp_password=plain_password if must_change else None,
                )
            except Exception as e:
                logger.warning("Failed to send student invitation email: %s", e)

        return StudentResponse(
            id=student.id, user_id=user.id, enrollment_number=student.enrollmentNumber, email=user.email,
            first_name=student.firstName, last_name=student.lastName, phone=student.phone,
            gender=student.gender, date_of_birth=student.dateOfBirth,
            department_id=student.departmentId,
            department_name=student.department.name if student.department else None,
            semester=student.semester, batch=student.batch,
        )

    async def get_all_students(
        self,
        page: int = 1,
        page_size: int = 10,
        sort_by: Optional[str] = None,
        sort_order: str = "asc",
        q: Optional[str] = None,
        department_id: Optional[str] = None,
    ) -> dict:
        where: dict = {}
        if department_id and department_id != "all":
            where["departmentId"] = department_id

        if q and q.strip():
            query_str = q.strip()
            where["OR"] = [
                {"firstName": {"contains": query_str, "mode": "insensitive"}},
                {"lastName": {"contains": query_str, "mode": "insensitive"}},
                {"enrollmentNumber": {"contains": query_str, "mode": "insensitive"}},
                {"user": {"is": {"email": {"contains": query_str, "mode": "insensitive"}}}},
            ]

        # Whitelist safe order columns
        allowed_sorts = {
            "first_name": "firstName",
            "last_name": "lastName",
            "enrollment_number": "enrollmentNumber",
            "created_at": "createdAt",
            "semester": "semester",
        }
        order_col = allowed_sorts.get(sort_by, "createdAt")
        order_dir = "desc" if sort_order.lower() == "desc" else "asc"
        order = {order_col: order_dir}

        total_items = await db.student.count(where=where)
        skip = (page - 1) * page_size
        students = await db.student.find_many(
            where=where,
            include={"user": True, "department": True},
            skip=skip,
            take=page_size,
            order=order,
        )
        items = [
            StudentResponse(
                id=s.id, user_id=s.userId, enrollment_number=s.enrollmentNumber,
                email=s.user.email if s.user else "", first_name=s.firstName,
                last_name=s.lastName, phone=s.phone, gender=s.gender,
                date_of_birth=s.dateOfBirth, department_id=s.departmentId,
                department_name=s.department.name if s.department else None,
                semester=s.semester, batch=s.batch,
            )
            for s in students
        ]
        total_pages = max(1, (total_items + page_size - 1) // page_size) if total_items > 0 else 1
        return {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        }


    async def update_student(self, id: str, data: dict, actor: str = "system", ip: Optional[str] = None) -> StudentResponse:
        mapping = {
            "enrollment_number": "enrollmentNumber", "first_name": "firstName", "last_name": "lastName",
            "phone": "phone", "gender": "gender", "date_of_birth": "dateOfBirth",
            "semester": "semester", "batch": "batch", "department_id": "departmentId",
        }
        update_data = {mapping[k]: v for k, v in data.items() if k in mapping}
        student = await db.student.update(where={"id": id}, data=update_data, include={"user": True, "department": True})
        await self._log_action("UPDATE_STUDENT", "INFO", actor, id, f"Updated student {student.user.email if student.user else id}", ip)
        return StudentResponse(
            id=student.id, user_id=student.userId, enrollment_number=student.enrollmentNumber,
            email=student.user.email if student.user else "", first_name=student.firstName,
            last_name=student.lastName, phone=student.phone, gender=student.gender,
            date_of_birth=student.dateOfBirth, department_id=student.departmentId,
            department_name=student.department.name if student.department else None,
            semester=student.semester, batch=student.batch,
        )

    # --- Teachers ---

    async def create_teacher(self, data: TeacherCreate, actor: str = "system", ip: Optional[str] = None) -> TeacherResponse:
        from app.core.security import generate_temporary_password

        if not await db.department.find_unique(where={"id": data.department_id}):
            raise ValueError(f"Department with id '{data.department_id}' not found.")
        if not await db.designation.find_unique(where={"id": data.designation_id}):
            raise ValueError(f"Designation with id '{data.designation_id}' not found.")

        plain_password = data.password
        must_change = False
        if not plain_password:
            plain_password = generate_temporary_password()
            must_change = True

        user = await db.user.create(data={
            "email": data.email,
            "hashedPassword": hash_password(plain_password),
            "role": "TEACHER",
            "mustChangePassword": must_change,
        })
        teacher = await db.teacher.create(
            data={k: v for k, v in {
                "userId": user.id, "employeeId": data.employee_id,
                "firstName": data.first_name, "lastName": data.last_name,
                "departmentId": data.department_id, "designationId": data.designation_id,
                "phone": data.phone, "qualification": data.qualification,
                "specialization": data.specialization, "experienceYears": data.experience_years,
                "joiningDate": data.joining_date,
            }.items() if v is not None},
            include={"department": True, "designation": True},
        )
        await self._log_action("CREATE_TEACHER", "INFO", actor, teacher.id, f"Created teacher {data.email}", ip)

        if data.send_invite:
            try:
                from app.services.auth_service import AuthService
                from app.services.email_service import email_service
                name = f"{data.first_name or ''} {data.last_name or ''}".strip() or "Teacher"
                token = await AuthService().create_invitation_token(
                    user_id=user.id, email=user.email, role="TEACHER", name=name
                )
                await email_service.send_invitation_email(
                    to_email=user.email,
                    recipient_name=name,
                    role="TEACHER",
                    invite_token=token,
                    identifier_label="Employee ID",
                    identifier_value=data.employee_id,
                    temp_password=plain_password if must_change else None,
                )
            except Exception as e:
                logger.warning("Failed to send teacher invitation email: %s", e)

        return TeacherResponse(
            id=teacher.id, user_id=user.id, email=user.email, employee_id=teacher.employeeId,
            first_name=teacher.firstName, last_name=teacher.lastName,

            department_id=teacher.departmentId, designation_id=teacher.designationId,
            department=teacher.department.name, designation=teacher.designation.name,
            phone=teacher.phone, qualification=teacher.qualification,
            specialization=teacher.specialization, experience_years=teacher.experienceYears,
            joining_date=teacher.joiningDate,
        )

    async def get_all_teachers(
        self,
        page: int = 1,
        page_size: int = 10,
        sort_by: Optional[str] = None,
        sort_order: str = "asc",
        q: Optional[str] = None,
        department_id: Optional[str] = None,
    ) -> dict:
        where: dict = {}
        if department_id and department_id != "all":
            where["departmentId"] = department_id

        if q and q.strip():
            query_str = q.strip()
            where["OR"] = [
                {"firstName": {"contains": query_str, "mode": "insensitive"}},
                {"lastName": {"contains": query_str, "mode": "insensitive"}},
                {"employeeId": {"contains": query_str, "mode": "insensitive"}},
                {"user": {"is": {"email": {"contains": query_str, "mode": "insensitive"}}}},
            ]

        # Whitelist safe order columns
        allowed_sorts = {
            "first_name": "firstName",
            "last_name": "lastName",
            "employee_id": "employeeId",
            "created_at": "createdAt",
            "experience_years": "experienceYears",
        }
        order_col = allowed_sorts.get(sort_by, "createdAt")
        order_dir = "desc" if sort_order.lower() == "desc" else "asc"
        order = {order_col: order_dir}

        total_items = await db.teacher.count(where=where)
        skip = (page - 1) * page_size
        teachers = await db.teacher.find_many(
            where=where,
            include={"user": True, "department": True, "designation": True},
            skip=skip,
            take=page_size,
            order=order,
        )
        items = [
            TeacherResponse(
                id=t.id, user_id=t.userId, email=t.user.email if t.user else "",
                employee_id=t.employeeId, first_name=t.firstName, last_name=t.lastName,
                department_id=t.departmentId, designation_id=t.designationId,
                department=t.department.name if t.department else "",
                designation=t.designation.name if t.designation else "",
                phone=t.phone, qualification=t.qualification, specialization=t.specialization,
                experience_years=t.experienceYears, joining_date=t.joiningDate,
            )
            for t in teachers
        ]
        total_pages = max(1, (total_items + page_size - 1) // page_size) if total_items > 0 else 1
        return {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        }


    async def update_teacher(self, id: str, data: dict, actor: str = "system", ip: Optional[str] = None) -> TeacherResponse:
        mapping = {
            "employee_id": "employeeId", "first_name": "firstName", "last_name": "lastName",
            "department_id": "departmentId", "designation_id": "designationId", "phone": "phone",
            "qualification": "qualification", "specialization": "specialization",
            "experience_years": "experienceYears", "joining_date": "joiningDate",
        }
        update_data = {mapping[k]: v for k, v in data.items() if k in mapping}
        teacher = await db.teacher.update(where={"id": id}, data=update_data, include={"user": True, "department": True, "designation": True})
        await self._log_action("UPDATE_TEACHER", "INFO", actor, id, f"Updated teacher {teacher.user.email if teacher.user else id}", ip)
        return TeacherResponse(
            id=teacher.id, user_id=teacher.userId, email=teacher.user.email if teacher.user else "",
            employee_id=teacher.employeeId, first_name=teacher.firstName, last_name=teacher.lastName,
            department_id=teacher.departmentId, designation_id=teacher.designationId,
            department=teacher.department.name if teacher.department else "",
            designation=teacher.designation.name if teacher.designation else "",
            phone=teacher.phone, qualification=teacher.qualification,
            specialization=teacher.specialization, experience_years=teacher.experienceYears,
            joining_date=teacher.joiningDate,
        )

    # --- Classes ---

    async def create_class(self, data: ClassCreate, actor: str = "system", ip: Optional[str] = None) -> ClassResponse:
        if not await self.teacher_repo.get_by_id(data.teacher_id):
            raise ValueError("Teacher profile not found.")
        if not await db.subject.find_unique(where={"id": data.subject_id}):
            raise ValueError(f"Subject with id '{data.subject_id}' not found.")
        if data.classroom_id and not await db.classroom.find_unique(where={"id": data.classroom_id}):
            raise ValueError(f"Classroom with id '{data.classroom_id}' not found.")

        cls = await db.academicclass.create(
            data={k: v for k, v in {
                "name": data.name, "teacherId": data.teacher_id, "subjectId": data.subject_id,
                "classroomId": data.classroom_id, "semester": data.semester,
                "batch": data.batch, "maxStudents": data.max_students,
            }.items() if v is not None},
            include={"subject": True, "classroom": True, "enrollments": True},
        )
        await self._log_action("CREATE_CLASS", "INFO", actor, cls.id, f"Created class {data.name}", ip)
        return ClassResponse(
            id=cls.id, name=cls.name, subject_name=cls.subject.name, subject_code=cls.subject.code,
            teacherId=cls.teacherId, classroom_name=cls.classroom.name if cls.classroom else None,
            semester=cls.semester, batch=cls.batch, max_students=cls.maxStudents,
            enrolled_count=len(cls.enrollments) if cls.enrollments else 0,
            enrolled_student_ids=[e.studentId for e in cls.enrollments] if cls.enrollments else [],
        )

    async def get_all_classes(
        self,
        page: int = 1,
        page_size: int = 10,
        sort_by: Optional[str] = None,
        sort_order: str = "asc",
        q: Optional[str] = None,
        subject_id: Optional[str] = None,
    ) -> dict:
        where: dict = {}
        if subject_id and subject_id != "all":
            where["subjectId"] = subject_id

        if q and q.strip():
            query_str = q.strip()
            where["OR"] = [
                {"name": {"contains": query_str, "mode": "insensitive"}},
                {"subject": {"is": {"name": {"contains": query_str, "mode": "insensitive"}}}},
                {"subject": {"is": {"code": {"contains": query_str, "mode": "insensitive"}}}},
            ]

        # Whitelist safe order columns
        allowed_sorts = {
            "name": "name",
            "created_at": "createdAt",
            "semester": "semester",
        }
        order_col = allowed_sorts.get(sort_by, "createdAt")
        order_dir = "desc" if sort_order.lower() == "desc" else "asc"
        order = {order_col: order_dir}

        total_items = await db.academicclass.count(where=where)
        skip = (page - 1) * page_size
        classes = await db.academicclass.find_many(
            where=where,
            include={"subject": True, "classroom": True, "enrollments": True},
            skip=skip,
            take=page_size,
            order=order,
        )
        items = [
            ClassResponse(
                id=c.id, name=c.name, subject_name=c.subject.name if c.subject else "",
                subject_code=c.subject.code if c.subject else "", teacherId=c.teacherId,
                classroom_name=c.classroom.name if c.classroom else None,
                semester=c.semester, batch=c.batch, max_students=c.maxStudents,
                enrolled_count=len(c.enrollments) if c.enrollments else 0,
                enrolled_student_ids=[e.studentId for e in c.enrollments] if c.enrollments else [],
            )
            for c in classes
        ]
        total_pages = max(1, (total_items + page_size - 1) // page_size) if total_items > 0 else 1
        return {
            "items": items,
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        }


    async def update_class(self, class_id: str, data: dict, actor: str = "system", ip: Optional[str] = None) -> ClassResponse:
        mapping = {
            "name": "name",
            "subject_id": "subjectId",
            "classroom_id": "classroomId",
            "teacher_id": "teacherId",
            "semester": "semester",
            "batch": "batch",
            "max_students": "maxStudents",
        }
        update_data = {mapping[k]: v for k, v in data.items() if k in mapping and v is not None}
        cls = await db.academicclass.update(where={"id": class_id}, data=update_data, include={"subject": True, "classroom": True, "enrollments": True})
        await self._log_action("UPDATE_CLASS", "INFO", actor, class_id, f"Updated class {cls.name}", ip)
        return ClassResponse(
            id=cls.id, name=cls.name, subject_name=cls.subject.name if cls.subject else "",
            subject_code=cls.subject.code if cls.subject else "", teacherId=cls.teacherId,
            classroom_name=cls.classroom.name if cls.classroom else None,
            semester=cls.semester, batch=cls.batch, max_students=cls.maxStudents,
            enrolled_count=len(cls.enrollments) if cls.enrollments else 0,
            enrolled_student_ids=[e.studentId for e in cls.enrollments] if cls.enrollments else [],
        )

    async def assign_teacher(self, class_id: str, teacher_id: str, actor: str = "system", ip: Optional[str] = None) -> ClassResponse:
        if not await self.class_repo.get_by_id(class_id):
            raise ValueError("Academic class not found.")
        if not await self.teacher_repo.get_by_id(teacher_id):
            raise ValueError("Teacher profile not found.")
        cls = await db.academicclass.update(where={"id": class_id}, data={"teacherId": teacher_id}, include={"subject": True, "classroom": True, "enrollments": True})
        await self._log_action("ASSIGN_TEACHER", "INFO", actor, class_id, f"Assigned teacher {teacher_id} to class {cls.name}", ip)
        return ClassResponse(
            id=cls.id, name=cls.name, subject_name=cls.subject.name if cls.subject else "",
            subject_code=cls.subject.code if cls.subject else "", teacherId=cls.teacherId,
            classroom_name=cls.classroom.name if cls.classroom else None,
            semester=cls.semester, batch=cls.batch, max_students=cls.maxStudents,
            enrolled_count=len(cls.enrollments) if cls.enrollments else 0,
            enrolled_student_ids=[e.studentId for e in cls.enrollments] if cls.enrollments else [],
        )

    async def enroll_students(self, class_id: str, student_ids: List[str], actor: str = "system", ip: Optional[str] = None) -> int:
        if not await self.class_repo.get_by_id(class_id):
            raise ValueError("Academic class not found.")
        count = 0
        for sid in student_ids:
            if await self.student_repo.get_by_id(sid):
                existing = await db.enrollment.find_first(
                    where={"studentId": sid, "academicClassId": class_id}
                )
                if not existing:
                    await self.enrollment_repo.enroll_student(sid, class_id)
                    count += 1
        await self._log_action("ENROLL_STUDENTS", "INFO", actor, class_id, f"Enrolled {count} student(s) in class", ip)
        return count

    # --- Master Data Helpers ---

    @staticmethod
    async def _validate_delete(entity_name: str, record, ref_field: str, ref_table_name: str):
        if not record:
            raise ValueError(f"{entity_name} not found.")
        ref_count = await getattr(db, ref_table_name).count(where={ref_field: record.id})
        if ref_count > 0:
            raise ValueError(f"Cannot delete {entity_name.lower()} because it is currently assigned.")

    # --- Departments ---

    async def get_all_departments(self) -> List[Department]:
        return await db.department.find_many()

    async def get_department_by_id(self, id: str) -> Optional[Department]:
        return await db.department.find_unique(where={"id": id})

    async def create_department(self, name: str, code: str, head: Optional[str] = None, description: Optional[str] = None) -> Department:
        return await db.department.create(data={"name": name, "code": code, "head": head, "description": description})

    async def update_department(self, id: str, data: dict) -> Department:
        return await db.department.update(where={"id": id}, data=data)

    async def delete_department(self, id: str, actor: str = "system", ip: Optional[str] = None) -> None:
        dept = await db.department.find_unique(where={"id": id})
        await self._validate_delete("Department", dept, "departmentId", "teacher")
        await self._validate_delete("Department", dept, "departmentId", "student")
        await db.department.delete(where={"id": id})
        await self._log_action("DELETE_DEPARTMENT", "WARNING", actor, id, f"Deleted department {dept.name if dept else id}", ip)

    # --- Subjects ---

    async def get_all_subjects(self) -> List[Subject]:
        return await db.subject.find_many()

    async def get_subject_by_id(self, id: str) -> Optional[Subject]:
        return await db.subject.find_unique(where={"id": id})

    async def create_subject(self, name: str, code: str, description: Optional[str] = None) -> Subject:
        return await db.subject.create(data={"name": name, "code": code, "description": description})

    async def update_subject(self, id: str, data: dict) -> Subject:
        return await db.subject.update(where={"id": id}, data=data)

    async def delete_subject(self, id: str, actor: str = "system", ip: Optional[str] = None) -> None:
        sub = await db.subject.find_unique(where={"id": id})
        await self._validate_delete("Subject", sub, "subjectId", "academicclass")
        await db.subject.delete(where={"id": id})
        await self._log_action("DELETE_SUBJECT", "WARNING", actor, id, f"Deleted subject {sub.name if sub else id}", ip)

    # --- Classrooms ---

    async def get_all_classrooms(self) -> List[Classroom]:
        return await db.classroom.find_many()

    async def get_classroom_by_id(self, id: str) -> Optional[Classroom]:
        return await db.classroom.find_unique(where={"id": id})

    async def create_classroom(self, name: str, building: Optional[str] = None, capacity: Optional[int] = None) -> Classroom:
        return await db.classroom.create(data={"name": name, "building": building, "capacity": capacity})

    async def update_classroom(self, id: str, data: dict) -> Classroom:
        return await db.classroom.update(where={"id": id}, data=data)

    async def delete_classroom(self, id: str, actor: str = "system", ip: Optional[str] = None) -> None:
        classroom = await db.classroom.find_unique(where={"id": id})
        await self._validate_delete("Classroom", classroom, "classroomId", "academicclass")
        await db.classroom.delete(where={"id": id})
        await self._log_action("DELETE_CLASSROOM", "WARNING", actor, id, f"Deleted classroom {classroom.name if classroom else id}", ip)

    # --- Designations ---

    async def get_all_designations(self) -> List[Designation]:
        return await db.designation.find_many()

    async def get_designation_by_id(self, id: str) -> Optional[Designation]:
        return await db.designation.find_unique(where={"id": id})

    async def create_designation(self, name: str, code: str, description: Optional[str] = None) -> Designation:
        return await db.designation.create(data={"name": name, "code": code, "description": description})

    async def update_designation(self, id: str, data: dict) -> Designation:
        return await db.designation.update(where={"id": id}, data=data)

    async def delete_designation(self, id: str, actor: str = "system", ip: Optional[str] = None) -> None:
        desig = await db.designation.find_unique(where={"id": id})
        await self._validate_delete("Designation", desig, "designationId", "teacher")
        await db.designation.delete(where={"id": id})
        await self._log_action("DELETE_DESIGNATION", "WARNING", actor, id, f"Deleted designation {desig.name if desig else id}", ip)

    # --- Misc ---

    async def get_audit_logs(
        self,
        page: int = 1,
        page_size: int = 20,
        sort_by: Optional[str] = None,
        sort_order: str = "desc",
        q: Optional[str] = None,
        severity: Optional[str] = None,
    ) -> dict:
        where: dict = {}
        if severity and severity != "all":
            where["severity"] = severity.upper()

        if q and q.strip():
            query_str = q.strip()
            where["OR"] = [
                {"eventType": {"contains": query_str, "mode": "insensitive"}},
                {"actor": {"contains": query_str, "mode": "insensitive"}},
                {"target": {"contains": query_str, "mode": "insensitive"}},
                {"description": {"contains": query_str, "mode": "insensitive"}},
            ]

        allowed_sorts = {
            "timestamp": "timestamp",
            "event_type": "eventType",
            "severity": "severity",
            "actor": "actor",
        }
        order_col = allowed_sorts.get(sort_by, "timestamp")
        order_dir = "asc" if sort_order.lower() == "asc" else "desc"
        order = {order_col: order_dir}

        total_items = await db.auditlog.count(where=where)
        skip = (page - 1) * page_size
        logs = await db.auditlog.find_many(
            where=where,
            skip=skip,
            take=page_size,
            order=order,
        )
        total_pages = max(1, (total_items + page_size - 1) // page_size) if total_items > 0 else 1
        return {
            "items": logs,
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        }


    async def get_stats(self) -> dict:
        return {
            "studentCount": await db.student.count(),
            "teacherCount": await db.teacher.count(),
            "classCount": await db.academicclass.count(),
        }

    async def trigger_password_reset(self, user_id: str, actor: str = "system", ip: Optional[str] = None, frontend_url: Optional[str] = None) -> None:
        user = await db.user.find_unique(where={"id": user_id})
        if not user:
            raise ValueError("User not found.")

        from app.services.auth_service import AuthService
        await AuthService().request_password_reset(user.email, frontend_url=frontend_url)
        await self._log_action("TRIGGER_PASSWORD_RESET", "INFO", actor, user_id, f"Dispatched password reset email for {user.email}", ip)

    async def bulk_create_students(
        self,
        students: list,
        send_invite: bool = True,
        actor: str = "system",
        ip: Optional[str] = None,
    ) -> dict:
        from app.core.security import generate_temporary_password

        imported_count = 0
        failed_count = 0
        invitations_sent = 0
        errors = []

        for idx, item in enumerate(students):
            try:
                existing_user = await db.user.find_unique(where={"email": item.email})
                if existing_user:
                    errors.append(f"Row {idx + 1}: Email '{item.email}' already registered.")
                    failed_count += 1
                    continue

                existing_student = await db.student.find_unique(where={"enrollmentNumber": item.enrollment_number})
                if existing_student:
                    errors.append(f"Row {idx + 1}: Enrollment '{item.enrollment_number}' already exists.")
                    failed_count += 1
                    continue

                plain_password = generate_temporary_password()
                user = await db.user.create(data={
                    "email": item.email,
                    "hashedPassword": hash_password(plain_password),
                    "role": "STUDENT",
                    "mustChangePassword": True,
                })
                await db.student.create(
                    data={k: v for k, v in {
                        "userId": user.id,
                        "enrollmentNumber": item.enrollment_number,
                        "firstName": item.first_name,
                        "lastName": item.last_name,
                        "phone": item.phone,
                        "semester": item.semester,
                        "batch": item.batch,
                        "departmentId": item.department_id,
                    }.items() if v is not None}
                )
                imported_count += 1

                if send_invite:
                    try:
                        from app.services.auth_service import AuthService
                        from app.services.email_service import email_service
                        name = f"{item.first_name or ''} {item.last_name or ''}".strip() or "Student"
                        token = await AuthService().create_invitation_token(
                            user_id=user.id, email=user.email, role="STUDENT", name=name
                        )
                        await email_service.send_invitation_email(
                            to_email=user.email,
                            recipient_name=name,
                            role="STUDENT",
                            invite_token=token,
                            identifier_label="Enrollment Number",
                            identifier_value=item.enrollment_number,
                            temp_password=plain_password,
                        )
                        invitations_sent += 1
                    except Exception as invite_err:
                        logger.warning("Failed to send student invite email to %s: %s", item.email, invite_err)

            except Exception as e:
                errors.append(f"Row {idx + 1} ({item.email}): {str(e)}")
                failed_count += 1

        if imported_count > 0:
            await self._log_action(
                "BULK_IMPORT_STUDENTS",
                "INFO",
                actor,
                "SYSTEM",
                f"Bulk imported {imported_count} students ({failed_count} failed, {invitations_sent} invited)",
                ip,
            )

        return {
            "imported_count": imported_count,
            "failed_count": failed_count,
            "invitations_sent": invitations_sent,
            "errors": errors,
        }

    async def bulk_create_teachers(
        self,
        teachers: list,
        send_invite: bool = True,
        actor: str = "system",
        ip: Optional[str] = None,
    ) -> dict:
        from app.core.security import generate_temporary_password

        imported_count = 0
        failed_count = 0
        invitations_sent = 0
        errors = []

        default_dept_id = None
        default_desig_id = None
        first_dept = await db.department.find_first()
        if first_dept:
            default_dept_id = first_dept.id
        first_desig = await db.designation.find_first()
        if first_desig:
            default_desig_id = first_desig.id

        for idx, item in enumerate(teachers):
            try:
                existing_user = await db.user.find_unique(where={"email": item.email})
                if existing_user:
                    errors.append(f"Row {idx + 1}: Email '{item.email}' already registered.")
                    failed_count += 1
                    continue

                existing_teacher = await db.teacher.find_unique(where={"employeeId": item.employee_id})
                if existing_teacher:
                    errors.append(f"Row {idx + 1}: Employee ID '{item.employee_id}' already exists.")
                    failed_count += 1
                    continue

                dept_id = item.department_id or default_dept_id
                if not dept_id:
                    created_dept = await db.department.create(data={"name": "General Academics", "code": "GEN"})
                    default_dept_id = created_dept.id
                    dept_id = default_dept_id

                desig_id = item.designation_id or default_desig_id
                if not desig_id:
                    created_desig = await db.designation.create(data={"name": "Lecturer", "code": "LEC"})
                    default_desig_id = created_desig.id
                    desig_id = default_desig_id

                plain_password = generate_temporary_password()
                user = await db.user.create(data={
                    "email": item.email,
                    "hashedPassword": hash_password(plain_password),
                    "role": "TEACHER",
                    "mustChangePassword": True,
                })
                await db.teacher.create(
                    data={k: v for k, v in {
                        "userId": user.id,
                        "employeeId": item.employee_id,
                        "firstName": item.first_name,
                        "lastName": item.last_name,
                        "phone": item.phone,
                        "departmentId": dept_id,
                        "designationId": desig_id,
                    }.items() if v is not None}
                )
                imported_count += 1

                if send_invite:
                    try:
                        from app.services.auth_service import AuthService
                        from app.services.email_service import email_service
                        name = f"{item.first_name or ''} {item.last_name or ''}".strip() or "Faculty"
                        token = await AuthService().create_invitation_token(
                            user_id=user.id, email=user.email, role="TEACHER", name=name
                        )
                        await email_service.send_invitation_email(
                            to_email=user.email,
                            recipient_name=name,
                            role="TEACHER",
                            invite_token=token,
                            identifier_label="Employee ID",
                            identifier_value=item.employee_id,
                            temp_password=plain_password,
                        )
                        invitations_sent += 1
                    except Exception as invite_err:
                        logger.warning("Failed to send faculty invite email to %s: %s", item.email, invite_err)

            except Exception as e:
                errors.append(f"Row {idx + 1} ({item.email}): {str(e)}")
                failed_count += 1

        if imported_count > 0:
            await self._log_action(
                "BULK_IMPORT_TEACHERS",
                "INFO",
                actor,
                "SYSTEM",
                f"Bulk imported {imported_count} faculty ({failed_count} failed, {invitations_sent} invited)",
                ip,
            )

        return {
            "imported_count": imported_count,
            "failed_count": failed_count,
            "invitations_sent": invitations_sent,
            "errors": errors,
        }

    async def bulk_create_classes(
        self,
        classes: list,
        actor: str = "system",
        ip: Optional[str] = None,
    ) -> dict:
        imported_count = 0
        failed_count = 0
        errors = []

        for idx, item in enumerate(classes):
            try:
                # Find Subject by code or name
                subject = await db.subject.find_first(
                    where={"OR": [{"code": {"equals": item.subject_code, "mode": "insensitive"}}, {"name": {"equals": item.subject_code, "mode": "insensitive"}}]}
                )
                if not subject:
                    errors.append(f"Row {idx + 1} ({item.name}): Subject '{item.subject_code}' not found.")
                    failed_count += 1
                    continue

                # Find Teacher by email
                teacher = await db.teacher.find_first(
                    where={"user": {"email": {"equals": item.teacher_email, "mode": "insensitive"}}},
                    include={"user": True},
                )
                if not teacher:
                    errors.append(f"Row {idx + 1} ({item.name}): Teacher with email '{item.teacher_email}' not found.")
                    failed_count += 1
                    continue

                # Find Classroom if provided
                classroom_id = None
                if item.classroom_name:
                    classroom = await db.classroom.find_first(
                        where={"OR": [{"name": {"equals": item.classroom_name, "mode": "insensitive"}}, {"roomNumber": {"equals": item.classroom_name, "mode": "insensitive"}}]}
                    )
                    if classroom:
                        classroom_id = classroom.id

                await db.academicclass.create(
                    data={
                        "name": item.name,
                        "subjectId": subject.id,
                        "teacherId": teacher.id,
                        "classroomId": classroom_id,
                        "semester": item.semester,
                        "batch": item.batch,
                        "maxStudents": item.max_students,
                    }
                )
                imported_count += 1
            except Exception as e:
                errors.append(f"Row {idx + 1} ({item.name}): {str(e)}")
                failed_count += 1

        if imported_count > 0:
            await self._log_action(
                "BULK_IMPORT_CLASSES",
                "INFO",
                actor,
                "SYSTEM",
                f"Bulk imported {imported_count} classes ({failed_count} failed)",
                ip,
            )

        return {
            "imported_count": imported_count,
            "failed_count": failed_count,
            "invitations_sent": 0,
            "errors": errors,
        }

    async def export_audit_logs_csv(self) -> str:
        import io
        import csv

        logs = await db.auditlog.find_many(order={"timestamp": "desc"}, take=1000)
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Timestamp", "Event Type", "Severity", "Actor", "Target", "Description", "IP Address"])
        for l in logs:
            writer.writerow([
                l.id,
                l.timestamp.isoformat() if l.timestamp else "",
                l.eventType,
                l.severity,
                l.actor,
                l.target,
                l.description,
                l.ipAddress or "",
            ])
        return output.getvalue()


