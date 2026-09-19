"use client";

import React from "react";
import { Trash2, Mail, Layers, CheckCircle, AlertTriangle } from "lucide-react";
import { ParsedBulkRecord, BulkImportEntityType } from "./bulk-types";

interface BulkImportPreviewTableProps {
  records: ParsedBulkRecord[];
  entityType: BulkImportEntityType;
  sendInvite: boolean;
  onSendInviteChange: (send: boolean) => void;
  onRemoveRecord: (id: string) => void;
  onReset: () => void;
}

export default function BulkImportPreviewTable({
  records,
  entityType,
  sendInvite,
  onSendInviteChange,
  onRemoveRecord,
  onReset,
}: BulkImportPreviewTableProps): React.ReactElement {
  const validCount = records.filter((r) => r.isValid).length;
  const invalidCount = records.length - validCount;
  const batchCount = Math.ceil(records.length / 10);

  return (
    <div className="space-y-4">
      {/* Batch Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-secondary/30 rounded-xl border border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {records.length}
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Parsed Records</p>
            <p className="text-xs font-semibold text-foreground">
              {validCount} valid {invalidCount > 0 && `• ${invalidCount} issues`}
            </p>
          </div>
        </div>

        <div className="p-3 bg-secondary/30 rounded-xl border border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Layers size={16} />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-medium">Batch Architecture</p>
            <p className="text-xs font-semibold text-foreground">
              {batchCount} {batchCount === 1 ? "batch" : "batches"} (10 per batch)
            </p>
          </div>
        </div>

        <div className="p-3 bg-secondary/30 rounded-xl border border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sendInvite ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
              <Mail size={16} />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium">Email Invites</p>
              <p className="text-xs font-semibold text-foreground">{sendInvite ? "Enabled" : "Disabled"}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={sendInvite}
              onChange={(e) => onSendInviteChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="max-h-[260px] overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-secondary/60 sticky top-0 z-10 border-b border-border backdrop-blur-xs">
              <tr className="text-muted-foreground font-semibold">
                <th className="py-2 px-3 w-10 text-center">#</th>
                <th className="py-2 px-3">{entityType === "classes" ? "Class Name" : "Name"}</th>
                <th className="py-2 px-3">
                  {entityType === "students" ? "Enrollment No" : entityType === "teachers" ? "Employee ID" : "Subject Code"}
                </th>
                <th className="py-2 px-3">{entityType === "classes" ? "Teacher Email" : "Email"}</th>
                <th className="py-2 px-3 w-24">Status</th>
                <th className="py-2 px-2 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((rec, index) => (
                <tr key={rec.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-2 px-3 text-center text-muted-foreground font-mono text-[11px]">{index + 1}</td>
                  <td className="py-2 px-3 font-medium text-foreground">
                    {entityType === "classes" ? rec.first_name : `${rec.first_name} ${rec.last_name}`}
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px] text-foreground/80">{rec.identifier}</td>
                  <td className="py-2 px-3 text-muted-foreground font-mono text-[11px]">{rec.email}</td>
                  <td className="py-2 px-3">
                    {rec.isValid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle size={10} /> Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full" title={rec.validationError}>
                        <AlertTriangle size={10} /> Issue
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveRecord(rec.id)}
                      className="text-muted-foreground hover:text-red-500 p-1 rounded transition-colors"
                      title="Remove record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing all {records.length} parsed records</span>
        <button
          type="button"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground underline transition-colors cursor-pointer"
        >
          Upload a different file
        </button>
      </div>
    </div>
  );
}
