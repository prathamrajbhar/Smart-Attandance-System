import React from "react";
import { UseFormRegister, Control, FieldErrors, Controller } from "react-hook-form";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import GlassCard from "@/components/ui/GlassCard";
import { Briefcase } from "lucide-react";
import type { TeacherFormData } from "@/lib/validations/teacher";

interface TeacherFormProfileProps {
  register: UseFormRegister<TeacherFormData>;
  control: Control<TeacherFormData>;
  errors: FieldErrors<TeacherFormData>;
  deptOptions: { value: string; label: string }[];
  desigOptions: { value: string; label: string }[];
}

export default function TeacherFormProfile({
  register,
  control,
  errors,
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
            {...register("first_name")}
            error={errors.first_name?.message}
          />
          <GlassInput
            label="Last Name"
            placeholder="e.g. Shankar"
            {...register("last_name")}
            error={errors.last_name?.message}
          />
          <GlassInput
            label="Phone (optional)"
            type="tel"
            placeholder="+91 98765 43210"
            {...register("phone")}
            error={errors.phone?.message}
          />
          <GlassInput
            label="Joining Date (optional)"
            type="date"
            {...register("joining_date")}
            error={errors.joining_date?.message}
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
          <Controller
            control={control}
            name="department_id"
            render={({ field }) => (
              <GlassSelect
                label="Department"
                options={deptOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.department_id?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="designation_id"
            render={({ field }) => (
              <GlassSelect
                label="Designation"
                options={desigOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.designation_id?.message}
              />
            )}
          />
          <GlassInput
            label="Qualification (optional)"
            placeholder="e.g. Ph.D, M.Tech"
            {...register("qualification")}
            error={errors.qualification?.message}
          />
          <GlassInput
            label="Specialization (optional)"
            placeholder="e.g. Machine Learning"
            {...register("specialization")}
            error={errors.specialization?.message}
          />
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="experience_years"
              render={({ field }) => (
                <GlassInput
                  label="Experience (years, optional)"
                  type="number"
                  placeholder="e.g. 5"
                  value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  error={errors.experience_years?.message}
                />
              )}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
