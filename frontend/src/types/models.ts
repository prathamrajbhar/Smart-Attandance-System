export interface StudentCreate {
  email: string;
  password?: string;
  enrollment_number: string;
  first_name: string;
  last_name: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  semester?: number;
  batch?: string;
  department_id?: string;
}

export interface StudentResponse {
  id: string;
  user_id: string;
  enrollment_number: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  gender?: string | null;
  date_of_birth?: string | null;
  department_id?: string | null;
  department_name?: string | null;
  semester?: number | null;
  batch?: string | null;
}

export interface TeacherCreate {
  email: string;
  password?: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  department_id: string;
  designation_id: string;
  phone?: string;
  qualification?: string;
  specialization?: string;
  experience_years?: number;
  joining_date?: string;
}

export interface TeacherResponse {
  id: string;
  user_id: string;
  email: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  department_id: string;
  designation_id: string;
  department: string;
  designation: string;
  phone?: string | null;
  qualification?: string | null;
  specialization?: string | null;
  experience_years?: number | null;
  joining_date?: string | null;
}

export interface ClassCreate {
  name: string;
  subject_id: string;
  teacher_id: string;
  classroom_id?: string;
  semester?: number;
  batch?: string;
  max_students?: number;
}

export interface ClassResponse {
  id: string;
  name: string;
  subject_name: string;
  subject_code: string;
  teacherId: string;
  classroom_name?: string | null;
  semester?: number | null;
  batch?: string | null;
  max_students?: number | null;
  enrolled_count: number;
  enrolled_student_ids?: string[];
}

export interface DepartmentCreate {
  name: string;
  code: string;
  head?: string;
  description?: string;
}

export interface DepartmentResponse {
  id: string;
  name: string;
  code: string;
  head: string | null;
  description: string | null;
  classCount: number;
}

export interface SubjectCreate {
  name: string;
  code: string;
  description?: string;
}

export interface SubjectResponse {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export interface ClassroomCreate {
  name: string;
  building?: string;
  capacity?: number;
}

export interface ClassroomResponse {
  id: string;
  name: string;
  building: string | null;
  capacity: number | null;
}

export interface DesignationCreate {
  name: string;
  code: string;
  description?: string;
}

export interface DesignationResponse {
  id: string;
  name: string;
  code: string;
  description: string | null;
}
