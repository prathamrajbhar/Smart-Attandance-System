import React from "react";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import GlassCard from "@/components/ui/GlassCard";
import { Briefcase } from "lucide-react";
import type { TeacherCreate } from "@/types";

interface TeacherFormProfileProps {
  form: TeacherCreate;
  errors: Partial<Record<keyof TeacherCreate, string>>;
  set: (field: keyof TeacherCreate, value: string | number | undefined) => void;
  deptOptions: { value: string; label: string }[];
  desigOptions: { value: string; label: string }[];
}

export default function TeacherFormProfile({
  form,
  errors,
  set,
  deptOptions,
  desigOptions,
}: TeacherFormProfileProps): React.ReactElement {
  return (
    <div className="space-y-6">
      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/40">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Briefcase size={18} className="text-primary" />
            Personal Details
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Faculty identity and contact records.</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <GlassInput
            label="First Name"
            placeholder="e.g. Ravi"
            value={form.first_name}
            onChange={(e) => set("first_name", e.target.value)}
            error={errors.first_name}
          />
          <GlassInput
            label="Last Name"
            placeholder="e.g. Shankar"
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
          <GlassInput
            label="Joining Date (optional)"
            type="date"
            value={form.joining_date ?? ""}
            onChange={(e) => set("joining_date", e.target.value || undefined)}
          />
        </div>
      </GlassCard>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/40">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Briefcase size={18} className="text-primary" />
            Institutional Assignment
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Departmental and role configuration.</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <GlassSelect
            label="Department"
            options={deptOptions}
            value={form.department_id}
            onChange={(v) => set("department_id", v)}
            error={errors.department_id}
          />
          <GlassSelect
            label="Designation"
            options={desigOptions}
            value={form.designation_id}
            onChange={(v) => set("designation_id", v)}
            error={errors.designation_id}
          />
          <GlassInput
            label="Qualification (optional)"
            placeholder="e.g. Ph.D, M.Tech"
            value={form.qualification ?? ""}
            onChange={(e) => set("qualification", e.target.value || undefined)}
          />
          <GlassInput
            label="Specialization (optional)"
            placeholder="e.g. Machine Learning"
            value={form.specialization ?? ""}
            onChange={(e) => set("specialization", e.target.value || undefined)}
          />
          <div className="sm:col-span-2">
            <GlassInput
              label="Experience (years, optional)"
              type="number"
              placeholder="e.g. 5"
              value={form.experience_years !== undefined ? String(form.experience_years) : ""}
              onChange={(e) =>
                set("experience_years", e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
