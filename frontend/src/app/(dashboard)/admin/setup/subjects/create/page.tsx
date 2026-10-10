"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import api, { getApiErrorMessage, applyValidationErrorsToForm } from "@/lib/api";
import { subjectSchema, type SubjectFormData } from "@/lib/validations/masterData";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassTextarea from "@/components/ui/GlassTextarea";
import GlassButton from "@/components/ui/GlassButton";

export default function CreateSubjectPage(): React.ReactElement {
  const router = useRouter();
  const [departments, setDepartments] = React.useState<Array<{ id: string; name: string }>>([]);

  React.useEffect(() => {
    async function loadDepts(): Promise<void> {
      try {
        const { data } = await api.get<Array<{ id: string; name: string }>>("/admin/departments");
        setDepartments(data);
      } catch {
        // non-blocking
      }
    }
    void loadDepts();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      department_id: "",
    },
  });

  async function onSubmit(formData: SubjectFormData): Promise<void> {
    try {
      await api.post("/admin/subjects", {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description ? formData.description.trim() : undefined,
        department_id: formData.department_id ? formData.department_id : undefined,
      });
      toast.success("Subject created successfully");
      router.push("/admin/setup/subjects");
    } catch (err: unknown) {
      const handled = applyValidationErrorsToForm(err, setError);
      if (!handled) {
        toast.error(getApiErrorMessage(err, "Creation failed"));
      }
    }
  }

  return (
    <div className="animate-fade-in-up">
      <GlassBreadcrumb
        items={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Setup" },
          { label: "Subjects", href: "/admin/setup/subjects" },
          { label: "Create" },
        ]}
      />
      <GlassPageHeader title="Create Subject" description="Register a new course subject" />
      <GlassCard className="max-w-xl">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <GlassInput
            label="Subject Name"
            placeholder="e.g. Machine Learning"
            {...register("name")}
            error={errors.name?.message}
          />
          <GlassInput
            label="Subject Code"
            placeholder="e.g. CS-402"
            {...register("code")}
            error={errors.code?.message}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Department (Optional)</label>
            <select
              {...register("department_id")}
              className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30"
            >
              <option value="">No Department (General / Common)</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <GlassTextarea
            label="Description (optional)"
            placeholder="Brief details about the subject curriculum..."
            {...register("description")}
            error={errors.description?.message}
          />
          <div className="flex justify-end gap-3 pt-4">
            <GlassButton variant="ghost" type="button" onClick={() => router.back()}>
              Cancel
            </GlassButton>
            <GlassButton variant="primary" type="submit" loading={isSubmitting}>
              Create Subject
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
