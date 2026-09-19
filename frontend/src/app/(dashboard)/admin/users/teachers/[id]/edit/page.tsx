"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Briefcase, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import GlassLoader from "@/components/ui/GlassLoader";
import EditTeacherFormFields from "./EditTeacherFormFields";
import type { TeacherResponse, DepartmentResponse, DesignationResponse } from "@/types";

export default function EditTeacherPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [teacher, setTeacher] = useState<TeacherResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [designations, setDesignations] = useState<DesignationResponse[]>([]);
  
  const [form, setForm] = useState<Partial<TeacherResponse>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const [teachersRes, depsRes, desigsRes] = await Promise.all([
          api.get<TeacherResponse[]>("/admin/users/teachers"),
          api.get<DepartmentResponse[]>("/admin/departments").catch(() => ({ data: [] })),
          api.get<DesignationResponse[]>("/admin/designations").catch(() => ({ data: [] })),
        ]);
        setDepartments(depsRes.data);
        setDesignations(desigsRes.data);
        
        const found = teachersRes.data.find((t) => t.id === id);
        if (found) {
          setTeacher(found);
          setForm({
            employee_id: found.employee_id,
            first_name: found.first_name,
            last_name: found.last_name,
            phone: found.phone,
            qualification: found.qualification,
            specialization: found.specialization,
            experience_years: found.experience_years,
            joining_date: found.joining_date ? new Date(found.joining_date).toISOString().split("T")[0] : undefined,
            department_id: found.department_id,
            designation_id: found.designation_id,
          });
        }
      } catch {
        toast.error("Failed to load teacher data");
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [id]);

  function set(field: keyof TeacherResponse, value: string | number | undefined): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!form.employee_id?.trim() || !form.first_name?.trim() || !form.last_name?.trim() || !form.department_id || !form.designation_id) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/admin/users/teachers/${id}`, {
        employee_id: form.employee_id,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || undefined,
        qualification: form.qualification || undefined,
        specialization: form.specialization || undefined,
        experience_years: form.experience_years !== undefined && form.experience_years !== null ? Number(form.experience_years) : undefined,
        joining_date: form.joining_date ? new Date(form.joining_date).toISOString() : undefined,
        department_id: form.department_id,
        designation_id: form.designation_id,
      });
      toast.success("Teacher updated successfully");
      router.push(`/admin/users/teachers/${id}`);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Update failed"));
    } finally {
      setSaving(false);
    }
  }

  const deptOptions = departments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }));
  const desigOptions = designations.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }));

  if (loading) return <GlassLoader text="Loading teacher..." />;
  if (!teacher) return <div className="text-center py-20 text-slate-500">Teacher not found</div>;

  return (
    <div className="animate-fade-in-up">
      <GlassBreadcrumb
        items={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Teachers", href: "/admin/users/teachers" },
          { label: teacher.email, href: `/admin/users/teachers/${id}` },
          { label: "Edit" },
        ]}
      />
      <GlassPageHeader title="Edit Teacher Profile" description="Update teacher personal and academic details." />

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="!p-0 overflow-hidden">
              <div className="p-5 border-b border-border bg-muted/40">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  Account Info
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Core system identifiers.</p>
              </div>
              <div className="p-5 space-y-4">
                <GlassInput label="Email Address" value={teacher.email} disabled />
                <GlassInput
                  label="Employee ID *"
                  value={form.employee_id ?? ""}
                  onChange={(e) => set("employee_id", e.target.value)}
                />
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard className="!p-0 overflow-hidden h-full">
              <div className="p-5 border-b border-border bg-muted/40">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Briefcase size={18} className="text-primary" />
                  Professional Profile
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Personal and academic details.</p>
              </div>
              <EditTeacherFormFields
                form={form}
                set={set}
                deptOptions={deptOptions}
                desigOptions={desigOptions}
              />
            </GlassCard>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 pb-12">
          <GlassButton variant="ghost" type="button" onClick={() => router.back()} icon={<X size={16} />}>
            Cancel
          </GlassButton>
          <GlassButton variant="primary" type="submit" loading={saving} icon={<Save size={16} />}>
            Save Changes
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
