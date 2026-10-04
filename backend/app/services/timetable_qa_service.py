import difflib
from typing import List, Dict, Any, Optional, Tuple

from app.db.client import db
from app.schemas.timetable import (
    ParsedTimetableDocument,
    StagedTimetableResponse,
    StagedCell,
    EntityMatch,
    ClashReport,
)

DAYS_MAP = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
}


class TimetableQAService:
    """Automated QA, fuzzy entity resolution, and constraint-satisfaction clash detection."""

    def _similarity(self, a: str, b: str) -> float:
        if not a or not b:
            return 0.0
        return difflib.SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()

    def _fuzzy_match(
        self,
        raw_text: str,
        items: List[Dict[str, str]],
        name_key: str = "name",
        secondary_key: Optional[str] = None,
    ) -> EntityMatch:
        if not raw_text or not raw_text.strip():
            return EntityMatch(raw_text="", is_ambiguous=True)

        clean_raw = raw_text.lower().strip()
        candidates = []

        best_id: Optional[str] = None
        best_name: Optional[str] = None
        best_score = 0.0

        for it in items:
            it_id = it.get("id", "")
            it_name = it.get(name_key, "")
            it_sec = it.get(secondary_key, "") if secondary_key else ""

            # Check exact match or code inclusion
            score1 = self._similarity(clean_raw, it_name)
            score2 = self._similarity(clean_raw, it_sec) if it_sec else 0.0
            
            # Bonus if abbreviation matches initials or code is directly inside raw text
            if it_sec and (it_sec.lower() in clean_raw or clean_raw in it_sec.lower()):
                score2 = max(score2, 0.95)
            if it_name.lower() in clean_raw or clean_raw in it_name.lower():
                score1 = max(score1, 0.90)

            score = max(score1, score2)

            if score > 0.35:
                candidates.append({
                    "id": it_id,
                    "label": f"{it_name} ({it_sec})" if it_sec else it_name,
                    "score": round(score, 2),
                })

            if score > best_score:
                best_score = score
                best_id = it_id
                best_name = it_name

        candidates.sort(key=lambda c: c["score"], reverse=True)
        is_ambiguous = best_score < 0.70

        return EntityMatch(
            raw_text=raw_text,
            matched_id=best_id if not is_ambiguous else (candidates[0]["id"] if candidates else None),
            matched_name=best_name if not is_ambiguous else (candidates[0]["label"] if candidates else None),
            confidence=round(best_score, 2),
            is_ambiguous=is_ambiguous,
            candidates=[{"id": c["id"], "label": c["label"]} for c in candidates[:5]],
        )

    async def stage_and_validate(
        self,
        parsed_doc: ParsedTimetableDocument,
        tenant_id: Optional[str],
        department_id: Optional[str] = None,
    ) -> StagedTimetableResponse:
        """Run fuzzy entity matching and clash detection across database and file cells."""
        # 1. Fetch master data for tenant
        where_teacher = {"user": {"tenantId": tenant_id}} if tenant_id else {}
        where_tenant = {"tenantId": tenant_id} if tenant_id else {}

        teachers_db = await db.teacher.find_many(
            where=where_teacher,
            include={"user": True, "department": True},
        )
        subjects_db = await db.subject.find_many(where=where_tenant)
        classrooms_db = await db.classroom.find_many(where=where_tenant)
        dept_db = await db.department.find_first(where={"id": department_id}) if department_id else None

        teachers_lookup = [
            {
                "id": t.id,
                "name": f"{t.firstName} {t.lastName}".strip(),
                "email": t.user.email if t.user else "",
                "code": t.employeeId or "",
            }
            for t in teachers_db
        ]
        subjects_lookup = [
            {"id": s.id, "name": s.name, "code": s.code}
            for s in subjects_db
        ]
        classrooms_lookup = [
            {"id": c.id, "name": c.name, "code": c.building or ""}
            for c in classrooms_db
        ]

        # 2. Entity matching per cell
        staged_cells: List[StagedCell] = []
        total_confidence = 0.0

        for cell in parsed_doc.cells:
            t_match = self._fuzzy_match(cell.teacher_raw, teachers_lookup, name_key="name", secondary_key="code")
            s_match = self._fuzzy_match(cell.subject_raw, subjects_lookup, name_key="name", secondary_key="code")
            c_match = self._fuzzy_match(cell.classroom_raw, classrooms_lookup, name_key="name", secondary_key="code")

            cell_conf = (t_match.confidence + s_match.confidence + c_match.confidence) / 3.0
            total_confidence += cell_conf

            staged_cells.append(
                StagedCell(
                    day_of_week=cell.day_of_week,
                    slot_number=cell.slot_number,
                    subject_raw=cell.subject_raw,
                    teacher_raw=cell.teacher_raw,
                    classroom_raw=cell.classroom_raw,
                    batch_raw=cell.batch_raw,
                    subject_match=s_match,
                    teacher_match=t_match,
                    classroom_match=c_match,
                )
            )

        avg_confidence = round(total_confidence / len(parsed_doc.cells), 2) if parsed_doc.cells else 1.0

        # 3. Clash Detection (Constraint Satisfaction)
        clashes: List[ClashReport] = []
        time_slot_map = {s.slot_number: f"{s.start_time}-{s.end_time}" for s in parsed_doc.time_slots}

        # In-document conflicts
        seen_room_slots: Dict[Tuple[int, int, str], StagedCell] = {}
        seen_teacher_slots: Dict[Tuple[int, int, str], StagedCell] = {}
        seen_cohort_slots: Dict[Tuple[int, int, Optional[str]], StagedCell] = {}

        for sc in staged_cells:
            day = sc.day_of_week
            slot = sc.slot_number
            time_str = time_slot_map.get(slot, f"Period {slot}")
            day_name = DAYS_MAP.get(day, f"Day {day}")

            # Check Room Clash
            room_id = sc.classroom_match.matched_id
            if room_id:
                key = (day, slot, room_id)
                if key in seen_room_slots:
                    prev = seen_room_slots[key]
                    sc.has_clash = True
                    msg = (
                        f"Room Double-Booking: '{sc.classroom_match.matched_name}' is assigned to both "
                        f"'{prev.subject_match.matched_name or prev.subject_raw}' and "
                        f"'{sc.subject_match.matched_name or sc.subject_raw}' on {day_name} at {time_str}."
                    )
                    sc.clash_message = msg
                    clashes.append(
                        ClashReport(
                            clash_type="ROOM_CLASH",
                            day_of_week=day,
                            day_name=day_name,
                            slot_number=slot,
                            time_str=time_str,
                            message=msg,
                            conflicting_entity_id=room_id,
                        )
                    )
                else:
                    seen_room_slots[key] = sc

            # Check Teacher Clash
            teacher_id = sc.teacher_match.matched_id
            if teacher_id:
                t_key = (day, slot, teacher_id)
                if t_key in seen_teacher_slots:
                    prev = seen_teacher_slots[t_key]
                    sc.has_clash = True
                    msg = (
                        f"Faculty Overlap: Prof. '{sc.teacher_match.matched_name}' is scheduled for two lectures "
                        f"simultaneously on {day_name} at {time_str}."
                    )
                    sc.clash_message = msg
                    clashes.append(
                        ClashReport(
                            clash_type="TEACHER_CLASH",
                            day_of_week=day,
                            day_name=day_name,
                            slot_number=slot,
                            time_str=time_str,
                            message=msg,
                            conflicting_entity_id=teacher_id,
                        )
                    )
                else:
                    seen_teacher_slots[t_key] = sc

            # Check Cohort Clash (non-batch simultaneous lectures)
            if not sc.batch_raw:
                c_key = (day, slot, None)
                if c_key in seen_cohort_slots:
                    prev = seen_cohort_slots[c_key]
                    sc.has_clash = True
                    msg = (
                        f"Cohort Conflict: Two full-class lectures scheduled in the same slot on {day_name} at {time_str}."
                    )
                    sc.clash_message = msg
                    clashes.append(
                        ClashReport(
                            clash_type="COHORT_CLASH",
                            day_of_week=day,
                            day_name=day_name,
                            slot_number=slot,
                            time_str=time_str,
                            message=msg,
                        )
                    )
                else:
                    seen_cohort_slots[c_key] = sc

        # Check against existing Database Timetable entries
        existing_entries = await db.timetableentry.find_many(
            where={"cohortCourse": {"is": {"cohort": {"is": {"tenantId": tenant_id}}}}},
            include={
                "cohortCourse": {"include": {"cohort": True, "subject": True, "primaryTeacher": True}},
                "timeSlot": True,
                "classroom": True,
            },
        )

        for sc in staged_cells:
            t_id = sc.teacher_match.matched_id
            r_id = sc.classroom_match.matched_id
            day = sc.day_of_week
            slot = sc.slot_number
            time_str = time_slot_map.get(slot, f"Period {slot}")
            day_name = DAYS_MAP.get(day, f"Day {day}")

            for ex in existing_entries:
                if ex.dayOfWeek == day and ex.timeSlot.slotNumber == slot:
                    # External Room Clash
                    if r_id and ex.classroomId == r_id:
                        sc.has_clash = True
                        msg = (
                            f"Room Busy: '{sc.classroom_match.matched_name}' is already reserved by "
                            f"'{ex.cohortCourse.cohort.name}' for '{ex.cohortCourse.subject.name}' on {day_name} ({time_str})."
                        )
                        sc.clash_message = msg
                        clashes.append(
                            ClashReport(
                                clash_type="ROOM_CLASH",
                                day_of_week=day,
                                day_name=day_name,
                                slot_number=slot,
                                time_str=time_str,
                                message=msg,
                                conflicting_entity_id=r_id,
                            )
                        )
                    # External Faculty Clash
                    if t_id and ex.cohortCourse.primaryTeacherId == t_id:
                        sc.has_clash = True
                        msg = (
                            f"Faculty Engaged: Prof. '{sc.teacher_match.matched_name}' already teaches "
                            f"'{ex.cohortCourse.cohort.name}' on {day_name} ({time_str})."
                        )
                        sc.clash_message = msg
                        clashes.append(
                            ClashReport(
                                clash_type="TEACHER_CLASH",
                                day_of_week=day,
                                day_name=day_name,
                                slot_number=slot,
                                time_str=time_str,
                                message=msg,
                                conflicting_entity_id=t_id,
                            )
                        )

        return StagedTimetableResponse(
            cohort_name=parsed_doc.cohort_name,
            department_id=department_id or (dept_db.id if dept_db else None),
            department_name=dept_db.name if dept_db else parsed_doc.department_name,
            semester=parsed_doc.semester,
            academic_year=parsed_doc.academic_year,
            time_slots=parsed_doc.time_slots,
            staged_cells=staged_cells,
            clashes=clashes,
            has_clashes=len(clashes) > 0,
            confidence_score=avg_confidence,
            all_teachers=[{"id": t["id"], "label": f"{t['name']} ({t['code']})"} for t in teachers_lookup],
            all_subjects=[{"id": s["id"], "label": f"{s['name']} ({s['code']})"} for s in subjects_lookup],
            all_classrooms=[{"id": c["id"], "label": c["name"]} for c in classrooms_lookup],
        )


timetable_qa_service = TimetableQAService()

