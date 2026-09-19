"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload } from "lucide-react";
import api from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassTable from "@/components/ui/GlassTable";
import EnterpriseTableToolbar from "@/components/ui/EnterpriseTableToolbar";
import EnterprisePagination from "@/components/ui/EnterprisePagination";
import BulkImportModal from "@/components/admin/BulkImportModal";
import { useTableQuery } from "@/hooks/useTableQuery";
import { studentColumns } from "./student-columns";
import type { StudentResponse, DepartmentResponse } from "@/types";

export default function StudentsPage(): React.ReactElement {
  const router = useRouter();
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const {
    data: students,
    totalItems,
    loading,
    searchQuery,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    filterValue,
    setSearchQuery,
    setCurrentPage,
    setPageSize,
    handleSort,
    setFilterValue,
    refetch,
  } = useTableQuery<StudentResponse>({
    endpoint: "/admin/users/students",
    defaultPageSize: 10,
    defaultSortBy: "created_at",
    defaultSortOrder: "desc",
  });

  useEffect(() => {
    async function loadDepartments(): Promise<void> {
      try {
        const { data } = await api.get<DepartmentResponse[]>("/admin/departments");
        setDepartments(data.map((d) => ({ value: d.id, label: d.name })));
      } catch {
        setDepartments([]);
      }
    }
    void loadDepartments();
  }, []);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <GlassBreadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Users" }, { label: "Students" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-[Outfit]">
            Student & Access Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage enrolled students, biometrics, and security credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors shadow-2xs"
          >
            <Upload size={13} /> Bulk Import
          </button>
          <button
            onClick={() => router.push("/admin/users/students/add")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus size={14} /> Add Student
          </button>
        </div>
      </div>

      <EnterpriseTableToolbar
        searchPlaceholder="Search by name, email, login ID..."
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        filterLabel="Department"
        filterOptions={departments}
        selectedFilter={filterValue}
        onFilterChange={setFilterValue}
      />

      <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
        <GlassTable
          columns={studentColumns}
          data={students as (StudentResponse & Record<string, unknown>)[]}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSort}
          emptyMessage="No students found matching current filters"
        />
        <EnterprisePagination
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemName="students"
        />
      </div>

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        entityType="students"
        onSuccess={() => void refetch()}
      />
    </div>
  );
}


