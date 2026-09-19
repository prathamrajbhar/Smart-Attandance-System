"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import GlassLoader from "@/components/ui/GlassLoader";
import EnrollStudentRow from "./EnrollStudentRow";
import EnrollStudentFilters from "./EnrollStudentFilters";
import type { StudentResponse, ClassResponse } from "@/types";

export default function EnrollStudentsPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [cls, setCls] = useState<ClassResponse | null>(null);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const [clsRes, studentsRes] = await Promise.all([
          api.get<ClassResponse[]>("/admin/classes"),
          api.get<StudentResponse[]>("/admin/users/students")
        ]);
        setCls(clsRes.data.find(c => c.id === id) || null);
        setStudents(studentsRes.data);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, [id]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedDepartment && s.department_name !== selectedDepartment) return false;
      if (selectedSemester && String(s.semester) !== selectedSemester) return false;
      if (selectedBatch && s.batch !== selectedBatch) return false;
      if (searchQuery.trim()) {
        const lowerQ = searchQuery.toLowerCase();
        const nameMatch = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase().includes(lowerQ);
        const emailMatch = s.email.toLowerCase().includes(lowerQ);
        const enrollMatch = (s.enrollment_number || "").toLowerCase().includes(lowerQ);
        const deptMatch = (s.department_name || "").toLowerCase().includes(lowerQ);
        if (!nameMatch && !emailMatch && !enrollMatch && !deptMatch) return false;
      }
      return true;
    });
  }, [students, searchQuery, selectedDepartment, selectedSemester, selectedBatch]);

  const nonEnrolledFilteredStudents = useMemo(() => {
    return filteredStudents.filter((s) => !(cls?.enrolled_student_ids?.includes(s.id) ?? false));
  }, [filteredStudents, cls]);

  const allVisibleSelected = nonEnrolledFilteredStudents.length > 0 && 
    nonEnrolledFilteredStudents.every((s) => selectedIds.has(s.id));

  const filterOptions = useMemo(() => {
    const departments = new Set<string>();
    const semesters = new Set<string>();
    const batches = new Set<string>();
    for (const s of students) {
      if (s.department_name) departments.add(s.department_name);
      if (s.semester) semesters.add(String(s.semester));
      if (s.batch) batches.add(s.batch);
    }
    return {
      uniqueDepartments: Array.from(departments).sort(),
      uniqueSemesters: Array.from(semesters).sort(),
      uniqueBatches: Array.from(batches).sort(),
    };
  }, [students]);

  const toggleSelect = (studentId: string) => {
    if (cls?.enrolled_student_ids?.includes(studentId)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      nonEnrolledFilteredStudents.forEach((s) => allVisibleSelected ? next.delete(s.id) : next.add(s.id));
      return next;
    });
  };

  async function handleEnroll(): Promise<void> {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one student");
      return;
    }
    setEnrolling(true);
    try {
      const { data } = await api.post<{ enrolled_count: number }>(`/admin/classes/${id}/enroll`, { 
        student_ids: Array.from(selectedIds) 
      });
      toast.success(`${data.enrolled_count} students enrolled successfully`);
      router.push(`/admin/classes/${id}`);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Enrollment failed"));
    } finally { 
      setEnrolling(false); 
    }
  }

  if (loading) return <GlassLoader text="Loading students directory..." />;
  if (!cls) return <div className="text-center py-20 text-muted-foreground text-xs">Class not found</div>;

  return (
    <div className="space-y-6">
      <GlassBreadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Classes", href: "/admin/classes" }, { label: cls.name, href: `/admin/classes/${id}` }, { label: "Enroll Students" }]} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <GlassPageHeader 
          title="Enroll Students" 
          description={`Select students to enroll into ${cls.name} (${cls.subject_code})`} 
        />
        <div className="flex items-center gap-3 bg-card p-2.5 rounded-xl border border-border shadow-xs">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Selected</p>
            <p className="text-lg font-bold text-foreground leading-none">{selectedIds.size}</p>
          </div>
          <div className="h-6 w-px bg-border mx-1" />
          <GlassButton 
            variant="primary" 
            size="sm"
            icon={<UserPlus size={14} />} 
            onClick={handleEnroll}
            loading={enrolling}
            disabled={selectedIds.size === 0}
          >
            Enroll Selected
          </GlassButton>
        </div>
      </div>

      <GlassCard padding="none" className="overflow-hidden bg-card">
        <EnrollStudentFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          selectedBatch={selectedBatch}
          setSelectedBatch={setSelectedBatch}
          filterOptions={filterOptions}
          allVisibleSelected={allVisibleSelected}
          onToggleSelectAll={toggleSelectAll}
          selectedCount={selectedIds.size}
          onClearSelection={() => setSelectedIds(new Set())}
          hasNonEnrolledVisible={nonEnrolledFilteredStudents.length > 0}
        />

        <div className="max-h-[560px] overflow-y-auto p-3 space-y-2">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No students found matching your search filter.
            </div>
          ) : (
            filteredStudents.map((student) => (
              <EnrollStudentRow
                key={student.id}
                student={student}
                isSelected={selectedIds.has(student.id)}
                isAlreadyEnrolled={cls?.enrolled_student_ids?.includes(student.id) || false}
                onToggle={() => toggleSelect(student.id)}
              />
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}
