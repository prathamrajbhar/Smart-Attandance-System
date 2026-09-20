import { describe, it, expect } from "vitest";
import {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
} from "../auth";
import { classFormSchema } from "../admin";
import { studentFormSchema } from "../student";
import {
  departmentSchema,
  subjectSchema,
  classroomSchema,
  designationSchema,
} from "../masterData";
import { geofenceSchema } from "../teacher";
import { leaveRequestSchema } from "../leave";

describe("Frontend Zod Validations", () => {
  describe("Auth Schemas", () => {
    it("should validate a valid login payload", () => {
      const valid = {
        email: "admin.smith@yopmail.com",
        password: "SecurePassword123!",
      };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject an invalid email on login", () => {
      const invalid = {
        email: "not-an-email",
        password: "short",
      };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject password mismatch on changePasswordSchema", () => {
      const invalid = {
        current_password: "OldPassword123!",
        new_password: "NewPassword123!",
        confirm_password: "DifferentPassword456!",
      };
      const result = changePasswordSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("Admin & Master Data Schemas", () => {
    it("should validate student creation schema", () => {
      const valid = {
        email: "student.rahul@yopmail.com",
        enrollment_number: "CS-2024-0042",
        first_name: "Rahul",
        last_name: "Verma",
        semester: 6,
        batch: "2022-2026",
      };
      const result = studentFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should validate class creation schema", () => {
      const valid = {
        name: "AI & Neural Networks",
        subject_id: "sub-101",
        teacher_id: "tch-101",
        semester: 6,
      };
      const result = classFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should validate department creation schema", () => {
      const valid = {
        name: "Computer Science and Engineering",
        code: "CSE",
        head: "Dr. Ananya Roy",
      };
      const result = departmentSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should validate classroom and subject schemas", () => {
      expect(
        classroomSchema.safeParse({ name: "Lecture Hall 101", building: "Block A", capacity: 60 }).success
      ).toBe(true);

      expect(
        subjectSchema.safeParse({ name: "Operating Systems", code: "CS401" }).success
      ).toBe(true);
    });
  });

  describe("Teacher & Leave Schemas", () => {
    it("should validate geofence radius bounds", () => {
      const valid = {
        latitude: 28.6139,
        longitude: 77.2090,
        radius_meters: 75.0,
      };
      expect(geofenceSchema.safeParse(valid).success).toBe(true);

      const invalidRadius = {
        latitude: 28.6139,
        longitude: 77.2090,
        radius_meters: -5,
      };
      expect(geofenceSchema.safeParse(invalidRadius).success).toBe(false);
    });

    it("should validate leave request schema with reason length", () => {
      const valid = {
        start_date: "2026-10-01",
        end_date: "2026-10-04",
        reason: "Attending state level Hackathon tournament representing the university.",
      };
      expect(leaveRequestSchema.safeParse(valid).success).toBe(true);

      const tooShortReason = {
        start_date: "2026-10-01",
        end_date: "2026-10-04",
        reason: "short",
      };
      expect(leaveRequestSchema.safeParse(tooShortReason).success).toBe(false);
    });
  });
});
