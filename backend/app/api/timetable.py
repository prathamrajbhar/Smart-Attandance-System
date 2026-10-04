from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from prisma.models import User, Teacher, Student

from app.api.dependencies import (
    get_current_user,
    get_current_teacher,
    get_current_student,
    get_tenant_context,
)
from app.db.client import db
from app.schemas.timetable import (
    StagedTimetableResponse,
    CommitTimetableRequest,
    TimetableMatrixResponse,
    TeacherTodayScheduleItem,
    StudentTodayScheduleItem,
    SubstitutionCreateRequest,
    SubstitutionResponse,
)
from app.schemas.common import MessageResponse
from app.services.ai_timetable_parser import AITimetableParser
from app.services.timetable_qa_service import TimetableQAService
from app.services.timetable_service import TimetableService

router = APIRouter(prefix="/timetable", tags=["Timetable & Scheduling"])


@router.post("/parse-document", response_model=StagedTimetableResponse, status_code=status.HTTP_200_OK)
async def parse_timetable_document(
    file: UploadFile = File(...),
    department_id: Optional[str] = Form(None),
    cohort_name: Optional[str] = Form(None),
    semester: Optional[int] = Form(None),
    academic_year: Optional[str] = Form(None),
    tenant_id: str = Depends(get_tenant_context),
    current_user: User = Depends(get_current_user),
    ai_parser: AITimetableParser = Depends(),
    qa_service: TimetableQAService = Depends(),
) -> StagedTimetableResponse:
    """Parse timetable PDF, Excel, or Image using Gemini AI, fuzzy-match entities, and run clash QA."""
    if current_user.role not in ["ADMIN", "SUPER_ADMIN", "TENANT_ADMIN", "DEPT_HEAD"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Only administrators and department heads can upload timetables.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    # 1. Store original timetable document safely in S3 / object storage
    doc_url = None
    doc_key = None
    try:
        from app.services.s3_service import S3Service
        s3 = S3Service()
        key, url, _ = await s3.upload_uploadfile(
            upload_file=file,
            folder="timetables",
            tenant_id=tenant_id,
        )
        doc_url = url
        doc_key = key
    except Exception as s3_err:
        from app.core.logging_config import get_logger
        get_logger("app.timetable.api").warning("S3 storage skipped/failed: %s", s3_err)

    # 2. Parse via Gemini AI
    parsed_doc = await ai_parser.parse_document(
        file_bytes=file_bytes,
        filename=file.filename or "timetable.pdf",
        content_type=file.content_type or "application/pdf",
        default_cohort_name=cohort_name,
        default_semester=semester,
        default_academic_year=academic_year,
    )

    # 3. Stage and run QA conflict detection
    staged = await qa_service.stage_and_validate(
        parsed_doc=parsed_doc,
        tenant_id=tenant_id,
        department_id=department_id,
    )
    staged.document_url = doc_url
    staged.document_key = doc_key

    return staged


@router.post("/commit", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def commit_timetable(
    data: CommitTimetableRequest,
    tenant_id: str = Depends(get_tenant_context),
    current_user: User = Depends(get_current_user),
    timetable_service: TimetableService = Depends(),
) -> MessageResponse:
    """Commit verified and reviewed timetable into the database."""
    if current_user.role not in ["ADMIN", "SUPER_ADMIN", "TENANT_ADMIN", "DEPT_HEAD"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Insufficient permissions to commit timetable.",
        )

    cohort_id = await timetable_service.commit_timetable(data, tenant_id=tenant_id)
    return MessageResponse(
        status="success",
        message=f"Timetable published successfully for cohort '{data.cohort_name}' (ID: {cohort_id}).",
    )


@router.get("/cohorts", response_model=List[dict])
async def list_cohorts(
    tenant_id: str = Depends(get_tenant_context),
    current_user: User = Depends(get_current_user),
) -> List[dict]:
    """List all cohorts in the institution with department and student counts."""
    cohorts = await db.academiccohort.find_many(
        where={"tenantId": tenant_id},
        include={"department": True, "students": True},
        order={"name": "asc"},
    )
    return [
        {
            "id": c.id,
            "name": c.name,
            "department_id": c.departmentId,
            "department_name": c.department.name if c.department else "General",
            "semester": c.semester,
            "academic_year": c.academicYear,
            "student_count": len(c.students),
            "is_active": c.isActive,
        }
        for c in cohorts
    ]


@router.get("/cohort/{cohort_id}", response_model=TimetableMatrixResponse)
async def get_cohort_timetable(
    cohort_id: str,
    timetable_service: TimetableService = Depends(),
) -> TimetableMatrixResponse:
    """Get the full weekly 6-day timetable matrix for a cohort."""
    matrix = await timetable_service.get_cohort_matrix(cohort_id)
    if not matrix:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cohort timetable not found.",
        )
    return matrix


@router.get("/teacher/today", response_model=List[TeacherTodayScheduleItem])
async def get_teacher_today_schedule(
    teacher: Teacher = Depends(get_current_teacher),
    timetable_service: TimetableService = Depends(),
) -> List[TeacherTodayScheduleItem]:
    """Get ordered list of teaching slots for today with live/past indicators."""
    return await timetable_service.get_teacher_today_schedule(teacher.id)


@router.get("/student/today", response_model=List[StudentTodayScheduleItem])
async def get_student_today_schedule(
    student: Student = Depends(get_current_student),
    timetable_service: TimetableService = Depends(),
) -> List[StudentTodayScheduleItem]:
    """Get ordered list of periods for the student today with attendance status."""
    return await timetable_service.get_student_today_schedule(student.id)


@router.post("/substitutions", response_model=SubstitutionResponse)
async def create_teacher_substitution(
    data: SubstitutionCreateRequest,
    teacher: Teacher = Depends(get_current_teacher),
    timetable_service: TimetableService = Depends(),
) -> SubstitutionResponse:
    """Faculty or Admin delegates a timetable slot to a substitute teacher."""
    try:
        return await timetable_service.create_substitution(teacher.id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
