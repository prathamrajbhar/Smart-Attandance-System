from datetime import date
from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class ParsedTimeSlot(BaseModel):
    slot_number: int
    name: str
    start_time: str  # "HH:MM" e.g. "09:00"
    end_time: str    # "HH:MM" e.g. "09:50"
    is_break: bool = False


class ParsedTimetableCell(BaseModel):
    day_of_week: int  # 1 = Monday, 2 = Tuesday ... 6 = Saturday
    slot_number: int
    subject_raw: str = "TBA"
    teacher_raw: Optional[str] = "TBA"
    classroom_raw: Optional[str] = "TBA"
    batch_raw: Optional[str] = None


class ParsedTimetableDocument(BaseModel):
    cohort_name: str
    department_name: Optional[str] = None
    semester: int
    academic_year: str
    time_slots: List[ParsedTimeSlot]
    cells: List[ParsedTimetableCell]


class EntityMatch(BaseModel):
    raw_text: str
    matched_id: Optional[str] = None
    matched_name: Optional[str] = None
    confidence: float = 0.0
    is_ambiguous: bool = False
    candidates: List[Dict[str, str]] = Field(default_factory=list)


class ClashReport(BaseModel):
    clash_type: str  # "ROOM_CLASH", "TEACHER_CLASH", "COHORT_CLASH", "BATCH_CLASH"
    day_of_week: int
    day_name: str
    slot_number: int
    time_str: str
    message: str
    conflicting_entity_id: Optional[str] = None


class StagedCell(BaseModel):
    day_of_week: int
    slot_number: int
    subject_raw: str = "TBA"
    teacher_raw: Optional[str] = "TBA"
    classroom_raw: Optional[str] = "TBA"
    batch_raw: Optional[str] = None
    subject_match: EntityMatch
    teacher_match: EntityMatch
    classroom_match: EntityMatch
    has_clash: bool = False
    clash_message: Optional[str] = None


class StagedTimetableResponse(BaseModel):
    cohort_name: str
    department_id: Optional[str] = None
    department_name: Optional[str] = None
    semester: int
    academic_year: str
    time_slots: List[ParsedTimeSlot]
    staged_cells: List[StagedCell]
    clashes: List[ClashReport]
    has_clashes: bool
    confidence_score: float
    document_url: Optional[str] = None
    document_key: Optional[str] = None
    all_teachers: List[Dict[str, str]] = Field(default_factory=list)
    all_subjects: List[Dict[str, str]] = Field(default_factory=list)
    all_classrooms: List[Dict[str, str]] = Field(default_factory=list)


class CommitEntryItem(BaseModel):
    day_of_week: int
    slot_number: int
    subject_id: str
    teacher_id: str
    classroom_id: Optional[str] = None
    batch_name: Optional[str] = None


class CommitTimetableRequest(BaseModel):
    cohort_name: str
    department_id: str
    semester: int
    academic_year: str
    time_slots: List[ParsedTimeSlot]
    entries: List[CommitEntryItem]
    document_url: Optional[str] = None
    document_key: Optional[str] = None


class TimetableEntryDetail(BaseModel):
    id: str
    day_of_week: int
    slot_number: int
    subject_name: str
    subject_code: str
    teacher_name: str
    teacher_id: str
    classroom_name: Optional[str] = None
    batch_name: Optional[str] = None


class TimetableMatrixResponse(BaseModel):
    cohort_id: str
    cohort_name: str
    department_name: str
    semester: int
    academic_year: str
    time_slots: List[ParsedTimeSlot]
    entries: List[TimetableEntryDetail]


class TeacherTodayScheduleItem(BaseModel):
    entry_id: str
    slot_number: int
    period_name: str
    start_time: str
    end_time: str
    subject_name: str
    subject_code: str
    cohort_name: str
    cohort_id: str
    classroom_name: str
    is_live_now: bool
    is_past: bool
    is_substitute: bool = False
    active_session_id: Optional[str] = None


class StudentTodayScheduleItem(BaseModel):
    entry_id: str
    slot_number: int
    period_name: str
    start_time: str
    end_time: str
    subject_name: str
    subject_code: str
    teacher_name: str
    classroom_name: str
    is_live_now: bool
    attendance_status: Optional[str] = None
    active_session_id: Optional[str] = None


class SubstitutionCreateRequest(BaseModel):
    timetable_entry_id: str
    substitute_teacher_id: str
    date: date
    reason: Optional[str] = None


class SubstitutionResponse(BaseModel):
    id: str
    timetable_entry_id: str
    original_teacher_name: str
    substitute_teacher_name: str
    date: date
    reason: Optional[str] = None
    status: str
