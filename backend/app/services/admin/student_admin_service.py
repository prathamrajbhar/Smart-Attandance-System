from typing import Optional
from app.core.logging_config import get_logger
from app.core.security import hash_password, generate_temporary_password
from app.db.client import db
from app.schemas.student import StudentCreate, StudentResponse

logger = get_logger("app.services.admin.student")

def _check_db_connected(database) -> bool:
    is_conn = getattr(database, "is_connected", None)
    if is_conn is None:
        return True
    try:
        res = is_conn()
        if hasattr(res, "__await__"):
            res.close()
            return True
        return bool(res)
    except Exception:
        return True


class StudentAdminService:
    @staticmethod
    async def create_student(data: StudentCreate, tenant_id: Optional[str] = None, db_client=None) -> StudentResponse:
        database = db_client or db
        if data.department_id:
            if tenant_id and _check_db_connected(database):
                dept_where = {"id": data.department_id, "tenantId": tenant_id}
                if not await database.department.find_first(where=dept_where):
                    raise ValueError("Department not found.")
            else:
                if not await database.department.find_unique(where={"id": data.department_id}):
                    raise ValueError("Department not found.")

        if tenant_id and _check_db_connected(database):
            tenant = await database.tenant.find_unique(where={"id": tenant_id})
            if tenant:
                current_count = await database.user.count(where={"tenantId": tenant_id, "role": {"in": ["STUDENT", "TEACHER"]}})
                if current_count >= tenant.licenseCount:
                    raise ValueError(
                        f"License seat quota exceeded ({current_count}/{tenant.licenseCount}). "
                        "Request additional licenses from your super administrator."
                    )

        plain_password = data.password
        must_change = False
        if not plain_password:
            plain_password = generate_temporary_password()
            must_change = True

        user_data = {
            "email": data.email,
            "hashedPassword": hash_password(plain_password),
            "role": "STUDENT",
            "mustChangePassword": must_change,
        }
        if tenant_id:
            user_data["tenantId"] = tenant_id

        user = await database.user.create(data=user_data)
        student_data = {k: v for k, v in {
            "userId": user.id, "enrollmentNumber": data.enrollment_number,
            "firstName": data.first_name, "lastName": data.last_name,
            "phone": data.phone, "gender": data.gender, "branch": data.branch, "dateOfBirth": data.date_of_birth,
            "semester": data.semester, "batch": data.batch, "departmentId": data.department_id,
        }.items() if v is not None}

        student = await database.student.create(data=student_data, include={"department": True})

        if data.send_invite:
            try:
                from app.services.auth_service import AuthService
                from app.services.email_service import email_service
                name = f"{data.first_name or ''} {data.last_name or ''}".strip() or "Student"
                token = await AuthService().create_invitation_token(user_id=user.id, email=user.email, role="STUDENT", name=name)
                await email_service.send_invitation_email(
                    to_email=user.email, recipient_name=name, role="STUDENT", invite_token=token,
                    identifier_label="Enrollment Number", identifier_value=data.enrollment_number,
                    temp_password=plain_password if must_change else None,
                )
            except Exception as e:
                logger.warning("Failed to send student invitation email: %s", e)

        return StudentResponse(
            id=student.id, user_id=user.id, enrollment_number=student.enrollmentNumber, email=user.email,
            first_name=student.firstName, last_name=student.lastName, phone=student.phone,
            gender=student.gender, branch=student.branch, date_of_birth=student.dateOfBirth, department_id=student.departmentId,
            department_name=student.department.name if student.department else None,
            semester=student.semester, batch=student.batch,
        )

    @staticmethod
    async def get_all_students(
        page: int = 1, page_size: int = 10, sort_by: Optional[str] = None, sort_order: str = "asc",
        q: Optional[str] = None, department_id: Optional[str] = None, semester: Optional[int] = None,
        batch: Optional[str] = None, tenant_id: Optional[str] = None,
    ) -> dict:
        where: dict = {}
        if tenant_id:
            where["user"] = {"is": {"tenantId": tenant_id}}
        if department_id and department_id != "all":
            where["departmentId"] = department_id
        if semester is not None and semester > 0:
            where["semester"] = semester
        if batch and batch.strip() and batch != "all":
            where["batch"] = batch.strip()

        if q and q.strip():
            query_str = q.strip()
            where["OR"] = [
                {"firstName": {"contains": query_str, "mode": "insensitive"}},
                {"lastName": {"contains": query_str, "mode": "insensitive"}},
                {"enrollmentNumber": {"contains": query_str, "mode": "insensitive"}},
                {"branch": {"contains": query_str, "mode": "insensitive"}},
                {"user": {"is": {"email": {"contains": query_str, "mode": "insensitive"}}}},
            ]

        allowed_sorts = {
            "first_name": "firstName", "last_name": "lastName",
            "enrollment_number": "enrollmentNumber", "created_at": "createdAt", "semester": "semester",
        }
        order_col = allowed_sorts.get(sort_by, "createdAt")
        order_dir = "desc" if sort_order.lower() == "desc" else "asc"

        total_items = await db.student.count(where=where)
        skip = (page - 1) * page_size
        students = await db.student.find_many(
            where=where, include={"user": True, "department": True},
            skip=skip, take=page_size, order={order_col: order_dir},
        )
        items = [
            StudentResponse(
                id=s.id, user_id=s.userId, enrollment_number=s.enrollmentNumber,
                email=s.user.email if s.user else "", first_name=s.firstName,
                last_name=s.lastName, phone=s.phone, gender=s.gender, branch=s.branch,
                date_of_birth=s.dateOfBirth, department_id=s.departmentId,
                department_name=s.department.name if s.department else None,
                semester=s.semester, batch=s.batch,
            ) for s in students
        ]
        total_pages = max(1, (total_items + page_size - 1) // page_size) if total_items > 0 else 1
        return {
            "items": items, "page": page, "page_size": page_size,
            "total_items": total_items, "total_pages": total_pages,
            "has_next": page < total_pages, "has_prev": page > 1,
        }

    @staticmethod
    async def update_student(id: str, data: dict, tenant_id: Optional[str] = None) -> StudentResponse:
        if tenant_id and db.is_connected():
            existing = await db.student.find_first(
                where={"id": id, "user": {"is": {"tenantId": tenant_id}}}
            )
            if not existing:
                raise ValueError("Student not found.")

        if "department_id" in data and data["department_id"]:
            dept_where = {"id": data["department_id"]}
            if tenant_id:
                dept_where["tenantId"] = tenant_id
            if db.is_connected() and not await db.department.find_first(where=dept_where):
                raise ValueError("Department not found.")

        mapping = {
            "enrollment_number": "enrollmentNumber", "first_name": "firstName", "last_name": "lastName",
            "phone": "phone", "gender": "gender", "branch": "branch", "date_of_birth": "dateOfBirth",
            "semester": "semester", "batch": "batch", "department_id": "departmentId",
        }
        update_data = {mapping[k]: v for k, v in data.items() if k in mapping}
        student = await db.student.update(where={"id": id}, data=update_data, include={"user": True, "department": True})
        return StudentResponse(
            id=student.id, user_id=student.userId, enrollment_number=student.enrollmentNumber,
            email=student.user.email if student.user else "", first_name=student.firstName,
            last_name=student.lastName, phone=student.phone, gender=student.gender, branch=student.branch,
            date_of_birth=student.dateOfBirth, department_id=student.departmentId,
            department_name=student.department.name if student.department else None,
            semester=student.semester, batch=student.batch,
        )
