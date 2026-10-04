export interface ParsedTimeSlot {
  slot_number: number;
  name: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
}

export interface EntityMatch {
  raw_text: string;
  matched_id: string | null;
  matched_name: string | null;
  confidence: number;
  is_ambiguous: boolean;
  candidates: Array<{ id: string; label: string }>;
}

export interface ClashReport {
  clash_type: string;
  day_of_week: number;
  day_name: string;
  slot_number: number;
  time_str: string;
  message: string;
  conflicting_entity_id: string | null;
}

export interface StagedCell {
  day_of_week: number;
  slot_number: number;
  subject_raw: string;
  teacher_raw: string;
  classroom_raw: string;
  batch_raw: string | null;
  subject_match: EntityMatch;
  teacher_match: EntityMatch;
  classroom_match: EntityMatch;
  has_clash: boolean;
  clash_message: string | null;
}

export interface StagedTimetableResponse {
  cohort_name: string;
  department_id: string | null;
  department_name: string | null;
  semester: number;
  academic_year: string;
  time_slots: ParsedTimeSlot[];
  staged_cells: StagedCell[];
  clashes: ClashReport[];
  has_clashes: boolean;
  confidence_score: number;
  document_url?: string | null;
  document_key?: string | null;
  all_teachers: Array<{ id: string; label: string }>;
  all_subjects: Array<{ id: string; label: string }>;
  all_classrooms: Array<{ id: string; label: string }>;
}

export interface CommitEntryItem {
  day_of_week: number;
  slot_number: number;
  subject_id: string;
  teacher_id: string;
  classroom_id: string | null;
  batch_name: string | null;
}

export interface CommitTimetableRequest {
  cohort_name: string;
  department_id: string;
  semester: number;
  academic_year: string;
  time_slots: ParsedTimeSlot[];
  entries: CommitEntryItem[];
  document_url?: string | null;
  document_key?: string | null;
}

export interface TimetableEntryDetail {
  id: string;
  day_of_week: number;
  slot_number: number;
  subject_name: string;
  subject_code: string;
  teacher_name: string;
  teacher_id: string;
  classroom_name: string | null;
  batch_name: string | null;
}

export interface TimetableMatrixResponse {
  cohort_id: string;
  cohort_name: string;
  department_name: string;
  semester: number;
  academic_year: string;
  time_slots: ParsedTimeSlot[];
  entries: TimetableEntryDetail[];
}

export interface TeacherTodayScheduleItem {
  entry_id: string;
  slot_number: number;
  period_name: string;
  start_time: string;
  end_time: string;
  subject_name: string;
  subject_code: string;
  cohort_name: string;
  cohort_id: string;
  classroom_name: string;
  is_live_now: boolean;
  is_past: boolean;
  is_substitute: boolean;
  active_session_id: string | null;
}
