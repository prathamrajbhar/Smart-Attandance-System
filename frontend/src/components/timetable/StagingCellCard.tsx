"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import type { StagedCell } from "@/types/timetable";

interface StagingCellCardProps {
  cell: StagedCell;
  allTeachers: Array<{ id: string; label: string }>;
  allSubjects: Array<{ id: string; label: string }>;
  allClassrooms: Array<{ id: string; label: string }>;
  onUpdate: (updatedCell: StagedCell) => void;
}

export default function StagingCellCard({
  cell,
  allTeachers,
  allSubjects,
  allClassrooms,
  onUpdate,
}: StagingCellCardProps): React.ReactElement {
  const isAmbiguous =
    cell.teacher_match.is_ambiguous ||
    cell.subject_match.is_ambiguous ||
    cell.classroom_match.is_ambiguous;

  return (
    <div
      className={`rounded-lg border p-2.5 text-xs transition-all space-y-2 ${
        cell.has_clash
          ? "border-rose-500/60 bg-rose-500/10 shadow-xs"
          : isAmbiguous
          ? "border-amber-500/40 bg-amber-500/5 shadow-2xs"
          : "border-border bg-card shadow-2xs"
      }`}
    >
      {/* Clash Warning Header */}
      {cell.has_clash && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-rose-500">
          <AlertTriangle size={12} className="shrink-0" />
          <span className="truncate">{cell.clash_message || "Conflict detected"}</span>
        </div>
      )}

      {/* Subject Selector */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
          Subject ({cell.subject_raw})
        </label>
        <select
          value={cell.subject_match.matched_id || ""}
          onChange={(e) => {
            const found = allSubjects.find((s) => s.id === e.target.value);
            onUpdate({
              ...cell,
              subject_match: {
                ...cell.subject_match,
                matched_id: e.target.value,
                matched_name: found ? found.label : null,
                is_ambiguous: false,
              },
            });
          }}
          className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-hidden focus:border-primary"
        >
          <option value="">— Select Subject —</option>
          {allSubjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Selector */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
          Teacher ({cell.teacher_raw})
        </label>
        <select
          value={cell.teacher_match.matched_id || ""}
          onChange={(e) => {
            const found = allTeachers.find((t) => t.id === e.target.value);
            onUpdate({
              ...cell,
              teacher_match: {
                ...cell.teacher_match,
                matched_id: e.target.value,
                matched_name: found ? found.label : null,
                is_ambiguous: false,
              },
            });
          }}
          className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-hidden focus:border-primary"
        >
          <option value="">— Select Faculty —</option>
          {allTeachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Classroom Selector */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
            Room ({cell.classroom_raw})
          </label>
          <select
            value={cell.classroom_match.matched_id || ""}
            onChange={(e) => {
              const found = allClassrooms.find((c) => c.id === e.target.value);
              onUpdate({
                ...cell,
                classroom_match: {
                  ...cell.classroom_match,
                  matched_id: e.target.value,
                  matched_name: found ? found.label : null,
                  is_ambiguous: false,
                },
              });
            }}
            className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-hidden focus:border-primary"
          >
            <option value="">— Select Room —</option>
            {allClassrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {cell.batch_raw && (
          <span className="self-end rounded bg-sky-500/10 px-1.5 py-1 text-[10px] font-bold text-sky-500 shrink-0">
            {cell.batch_raw}
          </span>
        )}
      </div>
    </div>
  );
}
