import React from "react";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import type { TeacherResponse } from "@/types";

interface EditTeacherFormFieldsProps {
  form: Partial<TeacherResponse>;
  set: (field: keyof TeacherResponse, value: string | number | undefined) => void;
  deptOptions: { value: string; label: string }[];
  desigOptions: { value: string; label: string }[];
}

export default function EditTeacherFormFields({
  form,
  set,
  deptOptions,
  desigOptions,
}: EditTeacherFormFieldsProps): React.ReactElement {
  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
      <GlassInput
        label="First Name *"
        value={form.first_name ?? ""}
        onChange={(e) => set("first_name", e.target.value)}
      />
      <GlassInput
        label="Last Name *"
        value={form.last_name ?? ""}
        onChange={(e) => set("last_name", e.target.value)}
      />
      <GlassSelect
        label="Department *"
        options={[{ value: "", label: "— Select Department —" }, ...deptOptions]}
        value={form.department_id ?? ""}
        onChange={(v) => set("department_id", v)}
      />
      <GlassSelect
        label="Designation *"
        options={[{ value: "", label: "— Select Designation —" }, ...desigOptions]}
        value={form.designation_id ?? ""}
        onChange={(v) => set("designation_id", v)}
      />
      <GlassInput
        label="Phone (optional)"
        type="tel"
        value={form.phone ?? ""}
        onChange={(e) => set("phone", e.target.value)}
      />
      <GlassInput
        label="Qualification (optional)"
        value={form.qualification ?? ""}
        onChange={(e) => set("qualification", e.target.value)}
      />
      <GlassInput
        label="Specialization (optional)"
        value={form.specialization ?? ""}
        onChange={(e) => set("specialization", e.target.value)}
      />
      <GlassInput
        label="Experience (Years)"
        type="number"
        min="0"
        value={form.experience_years ?? ""}
        onChange={(e) => set("experience_years", e.target.value)}
      />
      <GlassInput
        label="Joining Date (optional)"
        type="date"
        value={form.joining_date ?? ""}
        onChange={(e) => set("joining_date", e.target.value)}
      />
    </div>
  );
}
