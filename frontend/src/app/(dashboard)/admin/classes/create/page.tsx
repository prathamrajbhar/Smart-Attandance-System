"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, PlusCircle, X, Settings2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import GlassButton from "@/components/ui/GlassButton";
import type { TeacherResponse, SubjectResponse, ClassroomResponse, ClassCreate } from "@/types";

type FormErrors = Partial<Record<keyof ClassCreate, string>>;

const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Semester ${i + 1}`,
}));

export default function CreateClassPage(): React.ReactElement {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [form, setForm] = useState<ClassCreate>({ name: "", subject_id: "", teacher_id: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMasterData(): Promise<void> {
      try {
        const [teachersRes, subjectsRes, classroomsRes] = await Promise.all([
          api.get<TeacherResponse[] | { items?: TeacherResponse[] }>("/admin/users/teachers?page_size=100"),
          api.get<SubjectResponse[]>("/admin/subjects"),
          api.get<ClassroomResponse[]>("/admin/classrooms"),
        ]);
        const teacherList = Array.isArray(teachersRes.data)
          ? teachersRes.data
          : teachersRes.data?.items || [];
        setTeachers(teacherList);
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
        setClassrooms(Array.isArray(classroomsRes.data) ? classroomsRes.data : []);
      } catch {
        toast.error("Could not load master data.");
      }
    }
    void fetchMasterData();
  }, []);

  function set(field: keyof ClassCreate, value: string | number | undefined): void {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Class name is required";
    if (!form.teacher_id) errs.teacher_id = "Teacher is required";
    if (!form.subject_id) errs.subject_id = "Subject is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/admin/classes", form);
      toast.success("Class created successfully");
      router.push("/admin/classes");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to create class"));
    } finally {
      setLoading(false);
    }
  }

  const teacherOptions = [
    { value: "", label: "— Select Teacher —" },
    ...teachers.map((t) => ({
      value: t.id,
      label: `${t.first_name || ""} ${t.last_name || ""} (${t.email})${t.department ? ` — ${t.department}` : ""}`.trim(),
    })),
  ];
  const subjectOptions = [
    { value: "", label: "— Select Subject —" },
    ...subjects.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` })),
  ];
  const classroomOptions = [
    { value: "", label: "None — no classroom" },
    ...classrooms.map((c) => ({ value: c.id, label: c.building ? `${c.name} — ${c.building}` : c.name })),
  ];

  return (
    <div className="space-y-6">
      <GlassBreadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Classes", href: "/admin/classes" }, { label: "Create" }]} />
      <GlassPageHeader title="Create Class" description="Set up a new academic class with linked faculty and room" />

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-5">
            <GlassCard padding="md" className="bg-card">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Core Info</h3>
              </div>
              <GlassInput
                label="Class Name"
                placeholder="e.g. CS-101-A"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors.name}
              />
            </GlassCard>
            
            <GlassCard padding="md" className="bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Capacity</h3>
              </div>
              <GlassInput
                label="Max Students (optional)"
                type="number"
                placeholder="e.g. 60"
                value={form.max_students !== undefined ? String(form.max_students) : ""}
                onChange={(e) => set("max_students", e.target.value ? Number(e.target.value) : undefined)}
              />
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard padding="md" className="bg-card h-full">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Class Configuration</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <GlassSelect
                    label="Teacher"
                    options={teacherOptions}
                    value={form.teacher_id}
                    onChange={(v) => set("teacher_id", v)}
                    error={errors.teacher_id}
                  />
                </div>
                <GlassSelect
                  label="Subject"
                  options={subjectOptions}
                  value={form.subject_id}
                  onChange={(v) => set("subject_id", v)}
                  error={errors.subject_id}
                />
                <GlassSelect
                  label="Classroom (optional)"
                  options={classroomOptions}
                  value={form.classroom_id ?? ""}
                  onChange={(v) => set("classroom_id", v || undefined)}
                />
                <GlassSelect
                  label="Semester"
                  options={[{ value: "", label: "— Select —" }, ...SEMESTER_OPTIONS]}
                  value={form.semester ? String(form.semester) : ""}
                  onChange={(v) => set("semester", v ? Number(v) : undefined)}
                />
                <GlassInput
                  label="Batch"
                  placeholder="e.g. 2022-2026"
                  value={form.batch ?? ""}
                  onChange={(e) => set("batch", e.target.value || undefined)}
                />
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <GlassButton variant="ghost" type="button" onClick={() => router.back()} icon={<X size={14} />}>
            Cancel
          </GlassButton>
          <GlassButton variant="primary" type="submit" loading={loading} icon={<PlusCircle size={14} />}>
            Create Class
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
