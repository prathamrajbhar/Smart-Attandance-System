import React from "react";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import type { StudentResponse } from "@/types";

interface EditStudentFormFieldsProps {
  form: Partial<StudentResponse>;
  set: (field: keyof StudentResponse, value: string | number | undefined) => void;
  deptOptions: { value: string; label: string }[];
}

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Semester ${i + 1}`,
}));

export default function EditStudentFormFields({
  form,
  set,
  deptOptions,
}: EditStudentFormFieldsProps): React.ReactElement {
  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
      <GlassInput
        label="First Name"
        value={form.first_name ?? ""}
        onChange={(e) => set("first_name", e.target.value)}
      />
      <GlassInput
        label="Last Name"
        value={form.last_name ?? ""}
        onChange={(e) => set("last_name", e.target.value)}
      />
      <GlassInput
        label="Phone (optional)"
        type="tel"
        value={form.phone ?? ""}
        onChange={(e) => set("phone", e.target.value)}
      />
      <GlassSelect
        label="Gender (optional)"
        options={[{ value: "", label: "— Select —" }, ...GENDER_OPTIONS]}
        value={form.gender ?? ""}
        onChange={(v) => set("gender", v)}
      />
      <GlassInput
        label="Date of Birth (optional)"
        type="date"
        value={form.date_of_birth ?? ""}
        onChange={(e) => set("date_of_birth", e.target.value)}
      />
      <GlassSelect
        label="Semester (optional)"
        options={[{ value: "", label: "— Select —" }, ...SEMESTER_OPTIONS]}
        value={form.semester ? String(form.semester) : ""}
        onChange={(v) => set("semester", v ? Number(v) : undefined)}
      />
      <GlassInput
        label="Batch (optional)"
        value={form.batch ?? ""}
        onChange={(e) => set("batch", e.target.value)}
      />
      <GlassSelect
        label="Department (optional)"
        options={deptOptions}
        value={form.department_id ?? ""}
        onChange={(v) => set("department_id", v)}
      />
    </div>
  );
}
