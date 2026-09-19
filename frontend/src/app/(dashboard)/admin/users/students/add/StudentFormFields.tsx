import React from "react";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import type { StudentCreate } from "@/types";

interface StudentFormFieldsProps {
  form: StudentCreate;
  errors: Partial<Record<keyof StudentCreate, string>>;
  set: (field: keyof StudentCreate, value: string | number | undefined) => void;
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

export default function StudentFormFields({
  form,
  errors,
  set,
  deptOptions,
}: StudentFormFieldsProps): React.ReactElement {
  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
      <GlassInput
        label="First Name"
        placeholder="e.g. Aanya"
        value={form.first_name}
        onChange={(e) => set("first_name", e.target.value)}
        error={errors.first_name}
      />
      <GlassInput
        label="Last Name"
        placeholder="e.g. Sharma"
        value={form.last_name}
        onChange={(e) => set("last_name", e.target.value)}
        error={errors.last_name}
      />
      <GlassInput
        label="Phone (optional)"
        type="tel"
        placeholder="+91 98765 43210"
        value={form.phone ?? ""}
        onChange={(e) => set("phone", e.target.value || undefined)}
      />
      <GlassSelect
        label="Gender (optional)"
        options={[{ value: "", label: "— Select —" }, ...GENDER_OPTIONS]}
        value={form.gender ?? ""}
        onChange={(v) => set("gender", v || undefined)}
      />
      <GlassInput
        label="Date of Birth (optional)"
        type="date"
        value={form.date_of_birth ?? ""}
        onChange={(e) => set("date_of_birth", e.target.value || undefined)}
      />
      <GlassSelect
        label="Semester (optional)"
        options={[{ value: "", label: "— Select —" }, ...SEMESTER_OPTIONS]}
        value={form.semester ? String(form.semester) : ""}
        onChange={(v) => set("semester", v ? Number(v) : undefined)}
      />
      <GlassInput
        label="Batch (optional)"
        placeholder="e.g. 2022-2026"
        value={form.batch ?? ""}
        onChange={(e) => set("batch", e.target.value || undefined)}
      />
      <GlassSelect
        label="Department (optional)"
        options={deptOptions}
        value={form.department_id ?? ""}
        onChange={(v) => set("department_id", v || undefined)}
      />
    </div>
  );
}
