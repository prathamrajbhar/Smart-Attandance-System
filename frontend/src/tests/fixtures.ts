import { UserProfile, Role } from "@/types/auth";

export const mockAdminProfile: UserProfile = {
  id: "usr-adm-101",
  email: "admin.sarah@yopmail.com",
  role: "ADMIN" as Role,
  is_active: true,
  must_change_password: false,
};

export const mockTeacherProfile: UserProfile = {
  id: "usr-tch-202",
  email: "prof.rajesh@yopmail.com",
  role: "TEACHER" as Role,
  is_active: true,
  must_change_password: false,
  teacher_profile: {
    id: "tch-profile-202",
    first_name: "Rajesh",
    last_name: "Sharma",
    employee_id: "EMP-CS-2024",
    department: "Computer Science",
    department_id: "dept-cs-01",
    designation: "Associate Professor",
    designation_id: "desig-prof-01",
  },
};

export const mockStudentProfile: UserProfile = {
  id: "usr-stu-303",
  email: "student.rahul@yopmail.com",
  role: "STUDENT" as Role,
  is_active: true,
  must_change_password: false,
  student_profile: {
    id: "stu-profile-303",
    first_name: "Rahul",
    last_name: "Verma",
    enrollment_number: "CS-2024-0042",
    face_registered: true,
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
