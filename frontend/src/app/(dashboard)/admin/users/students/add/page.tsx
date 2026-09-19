"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, GraduationCap, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import StudentFormFields from "./StudentFormFields";
import type { StudentCreate, DepartmentResponse } from "@/types";

type FormErrors = Partial<Record<keyof StudentCreate, string>>;

export default function AddStudentPage(): React.ReactElement {
  const router = useRouter();
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [form, setForm] = useState<StudentCreate>({
    email: "",
    enrollment_number: "",
    first_name: "",
    last_name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDepartments(): Promise<void> {
      try {
        const { data } = await api.get<DepartmentResponse[]>("/admin/departments");
        setDepartments(data);
      } catch {
        
      }
    }
    void fetchDepartments();
  }, []);

  function set(field: keyof StudentCreate, value: string | number | undefined): void {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.enrollment_number.trim()) errs.enrollment_number = "Enrollment number is required";
    if (!form.first_name.trim()) errs.first_name = "First name is required";
    if (!form.last_name.trim()) errs.last_name = "Last name is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/admin/users/student", form);
      toast.success("Student created and temporary password sent via email");
      router.push("/admin/users/students");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to create student"));
    } finally {
      setLoading(false);
    }
  }

  const deptOptions = [
    { value: "", label: "None — assign later" },
    ...departments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` })),
  ];

  return (
    <div className="animate-fade-in-up">
      <GlassBreadcrumb
        items={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Students", href: "/admin/users/students" },
          { label: "Add New" },
        ]}
      />
      <GlassPageHeader title="Add Student" description="Create a new student account and profile" />

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="!p-0 overflow-hidden">
              <div className="p-5 border-b border-border bg-muted/40">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  Account Info
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Core system credentials.</p>
              </div>
              <div className="p-5 space-y-4">
                <GlassInput
                  label="Email Address"
                  type="email"
                  placeholder="student@university.edu"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  error={errors.email}
                />
                <GlassInput
                  label="Enrollment Number"
                  placeholder="e.g. EN2024001"
                  value={form.enrollment_number}
                  onChange={(e) => set("enrollment_number", e.target.value)}
                  error={errors.enrollment_number}
                />
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/60 text-xs text-blue-800 leading-relaxed">
                  🔒 A secure temporary password will be automatically generated and emailed to this student. They will be prompted to choose a new password upon first login.
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard className="!p-0 overflow-hidden h-full">
              <div className="p-5 border-b border-border bg-muted/40">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap size={18} className="text-primary" />
                  Student Profile
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Personal and academic details.</p>
              </div>
              <StudentFormFields
                form={form}
                errors={errors}
                set={set}
                deptOptions={deptOptions}
              />
            </GlassCard>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 pb-12">
          <GlassButton variant="ghost" type="button" onClick={() => router.back()} icon={<X size={16} />}>
            Cancel
          </GlassButton>
          <GlassButton variant="primary" type="submit" loading={loading} icon={<PlusCircle size={16} />}>
            Create Student
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
