export interface BulkMarkRecord {
  student_id: string;
  status: "Present" | "Absent";
}

export interface BulkMarkRequest {
  records: BulkMarkRecord[];
}

export interface AttendanceExportRow {
  enrollment_number: string;
  first_name: string;
  last_name: string;
  email: string;
  session_date: string;
  class_name: string;
  subject: string;
  status: string;
  final_ai_score: number;
  remarks?: string;
}

export interface FlaggedAttendanceResponse {
  id: string;
  enrollment_number: string;
  student_name: string;
  class_name: string;
  subject: string;
  face_score: number;
  liveness_score: number;
  background_score: number;
  final_ai_score: number;
  gps_latitude: number;
  gps_longitude: number;
  created_at: string;
  student_note?: string | null;
}

export interface PendingLeaveItem {
  id: string;
  student_id: string;
  student_name: string;
  enrollment_number: string;
  start_date: string;
  end_date: string;
  reason: string;
  document_url: string | null;
  status: string;
  approved_by?: string | null;
  approver_note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionTrendItem {
  session_id: string;
  session_name: string;
  attendance_percentage: number;
}

export interface ClassStatsResponse {
  class_id: string;
  total_sessions: number;
  total_students: number;
  overall_attendance_percentage: number;
  history?: SessionTrendItem[];
}

export interface AnomalyResult {
  student_id: string;
  anomaly_score: number;
  total_absences: number;
  student_name?: string;
  enrollment_number?: string;
  [key: string]: unknown;
}
