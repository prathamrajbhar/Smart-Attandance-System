"use client";

import React from "react";
import { CheckCircle2, XCircle, FileText, Image as ImageIcon, Calendar, User, Eye } from "lucide-react";
import type { PendingLeaveItem } from "@/types";

interface LeaveReviewDialogProps {
  leave: PendingLeaveItem | null;
  action: "APPROVED" | "REJECTED" | null;
  approverNote: string;
  submitting: boolean;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onViewDoc: (leave: PendingLeaveItem) => void;
}

export default function LeaveReviewDialog({
  leave,
  action,
  approverNote,
  submitting,
  onNoteChange,
  onConfirm,
  onCancel,
  onViewDoc,
}: LeaveReviewDialogProps): React.ReactElement | null {
  if (!leave || !action) return null;

  const isApproved = action === "APPROVED";
  const fromDate = new Date(leave.start_date).toLocaleDateString();
  const toDate = new Date(leave.end_date).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${isApproved ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}>
            {isApproved ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              {isApproved ? "Approve Leave Request" : "Reject Leave Request"}
            </h3>
            <p className="text-xs text-slate-400">Review request details and add decision notes</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2 text-slate-300">
              <User size={15} className="text-emerald-400 shrink-0" />
              <div className="overflow-hidden">
                <div className="text-xs text-slate-400">Student</div>
                <div className="font-medium text-white truncate">{leave.student_name}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar size={15} className="text-emerald-400 shrink-0" />
              <div className="overflow-hidden">
                <div className="text-xs text-slate-400">Period</div>
                <div className="font-medium text-white text-xs">{fromDate} – {toDate}</div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Reason for Leave</span>
            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/60 text-slate-300 text-xs leading-relaxed">
              {leave.reason}
            </div>
          </div>

          {/* Attached Document Preview */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Attached Documentation</span>
            {leave.document_url ? (
              <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-emerald-500/20">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  {leave.document_url.toLowerCase().endsWith(".pdf") ? <FileText size={16} /> : <ImageIcon size={16} />}
                  <span>Document Attached (S3)</span>
                </div>
                <button
                  type="button"
                  onClick={() => onViewDoc(leave)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
                >
                  <Eye size={13} /> View Doc
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic p-2 bg-slate-950/30 rounded border border-slate-800/40">
                No supporting document attached
              </div>
            )}
          </div>

          {/* Note Input */}
          <div>
            <label htmlFor="approver-note" className="text-xs font-semibold text-slate-400 block mb-1">
              Approver Note (Optional)
            </label>
            <textarea
              id="approver-note"
              value={approverNote}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder={isApproved ? "Optional approval note..." : "Reason for rejection..."}
              maxLength={300}
              rows={2}
              className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-lg disabled:opacity-50 ${isApproved ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500"}`}
          >
            {isApproved ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {submitting ? "Processing..." : (isApproved ? "Confirm Approval" : "Confirm Rejection")}
          </button>
        </div>
      </div>
    </div>
  );
}
