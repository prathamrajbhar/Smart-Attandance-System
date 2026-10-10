from datetime import datetime, timezone, time
from typing import List, Optional, Dict

from app.core.logging_config import get_logger
from app.db.client import db
from app.schemas.timetable import (
    CommitTimetableRequest,
    TimetableMatrixResponse,
    TimetableEntryDetail,
    ParsedTimeSlot,
    TeacherTodayScheduleItem,
    StudentTodayScheduleItem,
    SubstitutionCreateRequest,
    SubstitutionResponse,
)

logger = get_logger("app.timetable.service")


class TimetableService:
    """Core service for managing cohorts, time slots, timetable matrix, and daily schedules."""

    async def commit_timetable(self, req: CommitTimetableRequest, tenant_id: str) -> str:
        """Create or update AcademicCohort, Courses, TimeSlots, and TimetableEntries."""
        # 1. Upsert AcademicCohort
        cohort = await db.academiccohort.find_first(
            where={
                "departmentId": req.department_id,
                "name": req.cohort_name,
                "semester": req.semester,
                "academicYear": req.academic_year,
            }
        )
        if not cohort:
            cohort = await db.academiccohort.create(
                data={
                    "tenantId": tenant_id,
                    "departmentId": req.department_id,
                    "name": req.cohort_name,
                    "semester": req.semester,
                    "academicYear": req.academic_year,
                    "documentUrl": req.document_url,
                    "documentKey": req.document_key,
                    "isActive": True,
                }
            )
        else:
            if req.document_url:
                await db.academiccohort.update(
                    where={"id": cohort.id},
                    data={
                        "documentUrl": req.document_url,
                        "documentKey": req.document_key,
                    },
                )

        # 2. Automatically enroll eligible students in the department & semester
        students = await db.student.find_many(
            where={
                "departmentId": req.department_id,
                "semester": req.semester,
            }
        )
        for s in students:
            existing_cs = await db.cohortstudent.find_first(
                where={"cohortId": cohort.id, "studentId": s.id}
            )
            if not existing_cs:
                try:
                    await db.cohortstudent.create(
                        data={
                            "cohortId": cohort.id,
                            "studentId": s.id,
                            "rollNo": s.enrollmentNumber,
                        }
                    )
                except Exception as e:
                    logger.warning("Could not auto-enroll student %s into cohort: %s", s.id, e)

        # 3. Upsert TimeSlots
        slot_number_to_id: Dict[int, str] = {}
        for ts in req.time_slots:
            existing_slot = await db.timeslot.find_first(
                where={"tenantId": tenant_id, "slotNumber": ts.slot_number}
            )
            if existing_slot:
                updated = await db.timeslot.update(
                    where={"id": existing_slot.id},
                    data={
                        "name": ts.name,
                        "startTime": ts.start_time,
                        "endTime": ts.end_time,
                        "isBreak": ts.is_break,
                    },
                )
                slot_number_to_id[ts.slot_number] = updated.id
            else:
                created = await db.timeslot.create(
                    data={
                        "tenantId": tenant_id,
                        "slotNumber": ts.slot_number,
                        "name": ts.name,
                        "startTime": ts.start_time,
                        "endTime": ts.end_time,
                        "isBreak": ts.is_break,
                    }
                )
                slot_number_to_id[ts.slot_number] = created.id

        # 4. Upsert CohortCourses and TimetableEntries
        # Cache batches by name
        batch_cache: Dict[str, str] = {}

        for entry in req.entries:
            time_slot_id = slot_number_to_id.get(entry.slot_number)
            if not time_slot_id:
                continue

            # Upsert CohortCourse
            cc = await db.cohortcourse.find_first(
                where={"cohortId": cohort.id, "subjectId": entry.subject_id}
            )
            if not cc:
                cc = await db.cohortcourse.create(
                    data={
                        "cohortId": cohort.id,
                        "subjectId": entry.subject_id,
                        "primaryTeacherId": entry.teacher_id,
                    }
                )
            elif cc.primaryTeacherId != entry.teacher_id:
                cc = await db.cohortcourse.update(
                    where={"id": cc.id},
                    data={"primaryTeacherId": entry.teacher_id},
                )

            # Optional Batch
            batch_id: Optional[str] = None
            if entry.batch_name and entry.batch_name.strip():
                b_name = entry.batch_name.strip()
                if b_name not in batch_cache:
                    existing_b = await db.cohortbatch.find_first(
                        where={"cohortId": cohort.id, "name": b_name}
                    )
                    if existing_b:
                        batch_cache[b_name] = existing_b.id
                    else:
                        new_b = await db.cohortbatch.create(
                            data={"cohortId": cohort.id, "name": b_name}
                        )
                        batch_cache[b_name] = new_b.id
                batch_id = batch_cache.get(b_name)

            # Upsert TimetableEntry
            existing_te = await db.timetableentry.find_first(
                where={
                    "cohortCourseId": cc.id,
                    "timeSlotId": time_slot_id,
                    "dayOfWeek": entry.day_of_week,
                    "batchId": batch_id,
                }
            )
            if existing_te:
                await db.timetableentry.update(
                    where={"id": existing_te.id},
                    data={"classroomId": entry.classroom_id},
                )
            else:
                await db.timetableentry.create(
                    data={
                        "cohortCourseId": cc.id,
                        "timeSlotId": time_slot_id,
                        "classroomId": entry.classroom_id,
                        "batchId": batch_id,
                        "dayOfWeek": entry.day_of_week,
                    }
                )

        logger.info("Successfully published timetable for cohort %s (ID: %s)", cohort.name, cohort.id)
        return cohort.id

    async def get_cohort_matrix(self, cohort_id: str) -> Optional[TimetableMatrixResponse]:
        """Fetch weekly 6-day timetable matrix for a cohort."""
        cohort = await db.academiccohort.find_unique(
            where={"id": cohort_id},
            include={"department": True},
        )
        if not cohort:
            return None

        tenant_id = cohort.tenantId
        time_slots_db = await db.timeslot.find_many(
            where={"tenantId": tenant_id},
            order={"slotNumber": "asc"},
        )
        time_slots = [
            ParsedTimeSlot(
                slot_number=ts.slotNumber,
                name=ts.name,
                start_time=ts.startTime,
                end_time=ts.endTime,
                is_break=ts.isBreak,
            )
            for ts in time_slots_db
        ]

        entries_db = await db.timetableentry.find_many(
            where={"cohortCourse": {"is": {"cohortId": cohort_id}}},
            include={
                "cohortCourse": {
                    "include": {"subject": True, "primaryTeacher": True}
                },
                "timeSlot": True,
                "classroom": True,
                "batch": True,
            },
        )

        entries = [
            TimetableEntryDetail(
                id=e.id,
                day_of_week=e.dayOfWeek,
                slot_number=e.timeSlot.slotNumber,
                subject_name=e.cohortCourse.subject.name,
                subject_code=e.cohortCourse.subject.code,
                teacher_name=f"{e.cohortCourse.primaryTeacher.firstName} {e.cohortCourse.primaryTeacher.lastName}".strip(),
                teacher_id=e.cohortCourse.primaryTeacherId,
                classroom_name=e.classroom.name if e.classroom else None,
                batch_name=e.batch.name if e.batch else None,
            )
            for e in entries_db
        ]

        return TimetableMatrixResponse(
            cohort_id=cohort.id,
            cohort_name=cohort.name,
            department_name=cohort.department.name if cohort.department else "General",
            semester=cohort.semester,
            academic_year=cohort.academicYear,
            time_slots=time_slots,
            entries=entries,
        )

    async def get_teacher_today_schedule(self, teacher_id: str) -> List[TeacherTodayScheduleItem]:
        """Get ordered list of teaching slots for today with live/past indicators."""
        now = datetime.now()
        day_of_week = now.isoweekday()  # 1=Mon, 7=Sun
        current_time_str = now.strftime("%H:%M")

        # 1. Fetch direct timetable entries
        entries = await db.timetableentry.find_many(
            where={
                "dayOfWeek": day_of_week,
                "cohortCourse": {"is": {"primaryTeacherId": teacher_id}},
            },
            include={
                "cohortCourse": {
                    "include": {"cohort": True, "subject": True}
                },
                "timeSlot": True,
                "classroom": True,
                "sessions": {"where": {"isActive": True}},
            },
            order={"timeSlot": {"slotNumber": "asc"}},
        )

        # 2. Fetch today's substitutions where this teacher is covering
        today_date = datetime.combine(now.date(), time.min).replace(tzinfo=timezone.utc)
        substitutions = await db.teachersubstitution.find_many(
            where={
                "substituteTeacherId": teacher_id,
                "date": today_date,
                "status": "APPROVED",
            },
            include={
                "timetableEntry": {
                    "include": {
                        "cohortCourse": {"include": {"cohort": True, "subject": True}},
                        "timeSlot": True,
                        "classroom": True,
                        "sessions": {"where": {"isActive": True}},
                    }
                }
            },
        )

        schedule: List[TeacherTodayScheduleItem] = []

        for e in entries:
            is_live = e.timeSlot.startTime <= current_time_str <= e.timeSlot.endTime
            is_past = current_time_str > e.timeSlot.endTime
            active_s = e.sessions[0].id if e.sessions else None

            schedule.append(
                TeacherTodayScheduleItem(
                    entry_id=e.id,
                    slot_number=e.timeSlot.slotNumber,
                    period_name=e.timeSlot.name,
                    start_time=e.timeSlot.startTime,
                    end_time=e.timeSlot.endTime,
                    subject_name=e.cohortCourse.subject.name,
                    subject_code=e.cohortCourse.subject.code,
                    cohort_name=e.cohortCourse.cohort.name,
                    cohort_id=e.cohortCourse.cohort.id,
                    classroom_name=e.classroom.name if e.classroom else "TBA",
                    is_live_now=is_live,
                    is_past=is_past,
                    is_substitute=False,
                    active_session_id=active_s,
                )
            )

        for sub in substitutions:
            te = sub.timetableEntry
            is_live = te.timeSlot.startTime <= current_time_str <= te.timeSlot.endTime
            is_past = current_time_str > te.timeSlot.endTime
            active_s = te.sessions[0].id if te.sessions else None

            schedule.append(
                TeacherTodayScheduleItem(
                    entry_id=te.id,
                    slot_number=te.timeSlot.slotNumber,
                    period_name=f"{te.timeSlot.name} (Substitute)",
                    start_time=te.timeSlot.startTime,
                    end_time=te.timeSlot.endTime,
                    subject_name=te.cohortCourse.subject.name,
                    subject_code=te.cohortCourse.subject.code,
                    cohort_name=te.cohortCourse.cohort.name,
                    cohort_id=te.cohortCourse.cohort.id,
                    classroom_name=te.classroom.name if te.classroom else "TBA",
                    is_live_now=is_live,
                    is_past=is_past,
                    is_substitute=True,
                    active_session_id=active_s,
                )
            )

        schedule.sort(key=lambda x: x.slot_number)
        return schedule

    async def get_student_today_schedule(self, student_id: str) -> List[StudentTodayScheduleItem]:
        """Get ordered list of periods for the student today with attendance status."""
        now = datetime.now()
        day_of_week = now.isoweekday()
        current_time_str = now.strftime("%H:%M")

        # Find student's cohorts
        cohort_memberships = await db.cohortstudent.find_many(
            where={"studentId": student_id},
        )
        if not cohort_memberships:
            return []

        cohort_ids = [cm.cohortId for cm in cohort_memberships]

        entries = await db.timetableentry.find_many(
            where={
                "dayOfWeek": day_of_week,
                "cohortCourse": {"is": {"cohortId": {"in": cohort_ids}}},
            },
            include={
                "cohortCourse": {
                    "include": {"subject": True, "primaryTeacher": True}
                },
                "timeSlot": True,
                "classroom": True,
                "sessions": {
                    "include": {
                        "attendance": {"where": {"studentId": student_id}}
                    }
                },
            },
            order={"timeSlot": {"slotNumber": "asc"}},
        )

        schedule: List[StudentTodayScheduleItem] = []
        for e in entries:
            is_live = e.timeSlot.startTime <= current_time_str <= e.timeSlot.endTime

            # Check attendance status from linked session if exists
            att_status: Optional[str] = None
            active_s_id: Optional[str] = None

            for sess in e.sessions:
                if sess.isActive:
                    active_s_id = sess.id
                if sess.attendance:
                    att_status = sess.attendance[0].status
                    break

            schedule.append(
                StudentTodayScheduleItem(
                    entry_id=e.id,
                    slot_number=e.timeSlot.slotNumber,
                    period_name=e.timeSlot.name,
                    start_time=e.timeSlot.startTime,
                    end_time=e.timeSlot.endTime,
                    subject_name=e.cohortCourse.subject.name,
                    subject_code=e.cohortCourse.subject.code,
                    teacher_name=f"{e.cohortCourse.primaryTeacher.firstName} {e.cohortCourse.primaryTeacher.lastName}".strip(),
                    classroom_name=e.classroom.name if e.classroom else "TBA",
                    is_live_now=is_live,
                    attendance_status=att_status,
                    active_session_id=active_s_id,
                )
            )

        schedule.sort(key=lambda x: x.slot_number)
        return schedule

    async def create_substitution(
        self,
        original_teacher_id: str,
        req: SubstitutionCreateRequest,
    ) -> SubstitutionResponse:
        """Assign substitute faculty for a specific timetable entry and date."""
        te = await db.timetableentry.find_unique(
            where={"id": req.timetable_entry_id},
            include={"cohortCourse": {"include": {"primaryTeacher": True}}},
        )
        if not te:
            raise ValueError("Timetable entry not found.")

        sub_date = datetime.combine(req.date, time.min).replace(tzinfo=timezone.utc)
        sub_teacher = await db.teacher.find_unique(where={"id": req.substitute_teacher_id})
        if not sub_teacher:
            raise ValueError("Substitute teacher not found.")

        sub = await db.teachersubstitution.create(
            data={
                "timetableEntryId": req.timetable_entry_id,
                "originalTeacherId": original_teacher_id,
                "substituteTeacherId": req.substitute_teacher_id,
                "date": sub_date,
                "reason": req.reason,
                "status": "APPROVED",
            }
        )

        return SubstitutionResponse(
            id=sub.id,
            timetable_entry_id=sub.timetableEntryId,
            original_teacher_name=f"{te.cohortCourse.primaryTeacher.firstName} {te.cohortCourse.primaryTeacher.lastName}".strip(),
            substitute_teacher_name=f"{sub_teacher.firstName} {sub_teacher.lastName}".strip(),
            date=req.date,
            reason=sub.reason,
            status=sub.status,
        )
