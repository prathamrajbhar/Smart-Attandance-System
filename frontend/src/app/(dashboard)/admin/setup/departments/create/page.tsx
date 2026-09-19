"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import api, { getApiErrorMessage, applyValidationErrorsToForm } from "@/lib/api";
import { departmentSchema, type DepartmentFormData } from "@/lib/validations/masterData";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassTextarea from "@/components/ui/GlassTextarea";
import GlassButton from "@/components/ui/GlassButton";

export default function CreateDepartmentPage(): React.ReactElement {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      head: "",
      description: "",
    },
  });

  async function onSubmit(formData: DepartmentFormData): Promise<void> {
    try {
      await api.post("/admin/departments", {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        head: formData.head ? formData.head.trim() : undefined,
        description: formData.description ? formData.description.trim() : undefined,
      });
      toast.success("Department created successfully");
      router.push("/admin/setup/departments");
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
          { label: "Departments", href: "/admin/setup/departments" },
          { label: "Create" },
        ]}
      />
      <GlassPageHeader title="Create Department" description="Register a new college department" />
      <GlassCard className="max-w-xl">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <GlassInput
            label="Department Name"
            placeholder="e.g. Computer Science"
            {...register("name")}
            error={errors.name?.message}
          />
          <GlassInput
            label="Code"
            placeholder="e.g. CSE"
            {...register("code")}
            error={errors.code?.message}
          />
          <GlassInput
            label="Head (optional)"
            placeholder="e.g. Dr. Jane Smith"
            {...register("head")}
            error={errors.head?.message}
          />
          <GlassTextarea
            label="Description (optional)"
            placeholder="Brief details about the department..."
            {...register("description")}
            error={errors.description?.message}
          />
          <div className="flex justify-end gap-3 pt-4">
            <GlassButton variant="ghost" type="button" onClick={() => router.back()}>
              Cancel
            </GlassButton>
            <GlassButton variant="primary" type="submit" loading={isSubmitting}>
              Create Department
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
