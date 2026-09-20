import type { UserProfile } from "@/types";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export const mockAdminProfile: UserProfile = {
  id: "usr-adm-101",
  email: "admin.sarah@yopmail.com",
  role: "ADMIN",
  is_active: true,
  must_change_password: false,
  student_profile: null,
  teacher_profile: null,
};

export const mockTeacherProfile: UserProfile = {
  id: "usr-tch-202",
  email: "prof.rajesh@yopmail.com",
  role: "TEACHER",
  is_active: true,
  must_change_password: false,
  student_profile: null,
  teacher_profile: {
    id: "tch-profile-202",
    first_name: "Rajesh",
    last_name: "Sharma",
    employee_id: "EMP-CS-2024",
    department: "Computer Science",
    designation: "Associate Professor",
  },
};

export const mockStudentProfile: UserProfile = {
  id: "usr-stu-303",
  email: "student.rahul@yopmail.com",
  role: "STUDENT",
  is_active: true,
  must_change_password: false,
  teacher_profile: null,
  student_profile: {
    id: "stu-profile-303",
    enrollment_number: "CS-2024-0042",
  },
};

export const mockDeviceChangeRequest = {
  id: "dcr-101",
  student_id: "stu-profile-303",
  student_name: "Rahul Verma",
  enrollment_number: "CS-2024-0042",
  new_device_uuid: "uuid-iphone-15-pro-new",
  reason: "Upgraded smartphone after screen malfunction",
  status: "PENDING" as const,
  approved_by: null,
  created_at: "2026-09-20T10:00:00Z",
  updated_at: "2026-09-20T10:00:00Z",
};
