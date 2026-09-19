import { z } from "zod";

export const studentFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .optional()
    .or(z.literal("")),
  enrollment_number: z
    .string()
    .trim()
    .min(3, "Enrollment number must be at least 3 characters")
    .max(30, "Enrollment number cannot exceed 30 characters"),
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name cannot exceed 100 characters"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name cannot exceed 100 characters"),
  phone: z.string().trim().max(20, "Phone number cannot exceed 20 characters").optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  semester: z.union([z.number().int().min(1).max(8), z.literal(""), z.undefined()]).optional(),
  batch: z.string().trim().max(20, "Batch cannot exceed 20 characters").optional().or(z.literal("")),
  department_id: z.string().optional().or(z.literal("")),
  send_invite: z.boolean().optional(),
});

export type StudentFormData = z.infer<typeof studentFormSchema>;

export const studentUpdateSchema = z.object({
  enrollment_number: z
    .string()
    .trim()
    .min(3, "Enrollment number must be at least 3 characters")
    .max(30, "Enrollment number cannot exceed 30 characters"),
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name cannot exceed 100 characters"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name cannot exceed 100 characters"),
  phone: z.string().trim().max(20, "Phone number cannot exceed 20 characters").optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  semester: z.union([z.number().int().min(1).max(8), z.literal(""), z.undefined()]).optional(),
  batch: z.string().trim().max(20, "Batch cannot exceed 20 characters").optional().or(z.literal("")),
  department_id: z.string().optional().or(z.literal("")),
});

export type StudentUpdateFormData = z.infer<typeof studentUpdateSchema>;

export const studentNoteSchema = z.object({
  note: z
    .string()
    .trim()
    .min(1, "Note cannot be empty")
    .max(500, "Note cannot exceed 500 characters"),
});

export type StudentNoteFormData = z.infer<typeof studentNoteSchema>;
