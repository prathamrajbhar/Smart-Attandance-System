"use client";

import React from "react";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { TableColumn } from "@/components/ui/GlassTable";
import type { TeacherResponse } from "@/types";

export const teacherColumns: TableColumn<TeacherResponse & Record<string, unknown>>[] = [
  {
    key: "name",
    header: "Faculty / User",
    sortable: true,
    render: (r) => {
      const name = String(
        (r as { fullName?: string }).fullName ||
        (r as { full_name?: string }).full_name ||
        (r as { name?: string }).name ||
        r.email ||
        "Teacher"
      );
      const initial = name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground text-xs leading-tight">{name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{r.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "designation",
    header: "Academic Rank",
    sortable: true,
    render: (r) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-card text-[11px] font-medium text-foreground shadow-2xs">
        {String(r.designation || "Faculty Member")}
      </span>
    ),
  },
  {
    key: "department",
    header: "Department",
    sortable: true,
    render: (r) => (
      <span className="text-xs text-muted-foreground font-medium">
        {String(r.department || "Academic Faculty")}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: () => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        Active Duty
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <Link
          href={`/admin/users/teachers/${row.id}`}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors shadow-2xs"
          title="View Profile"
        >
          <Eye size={12} /> View
        </Link>
        <Link
          href={`/admin/users/teachers/${row.id}/edit`}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors shadow-2xs"
          title="Edit Teacher"
        >
          <Pencil size={12} /> Edit
        </Link>
      </div>
    ),
  },
];
