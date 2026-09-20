"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, FileText, Image as ImageIcon } from "lucide-react";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassTable, { type TableColumn } from "@/components/ui/GlassTable";
import GlassLoader from "@/components/ui/GlassLoader";
import GlassEmptyState from "@/components/ui/GlassEmptyState";
import GlassCard from "@/components/ui/GlassCard";
import GlassSearch from "@/components/ui/GlassSearch";
import type { PendingLeaveItem } from "@/types";
import LeaveDocumentModal from "./components/LeaveDocumentModal";
import LeaveReviewDialog from "./components/LeaveReviewDialog";

export default function LeavesPage(): React.ReactElement {
  const [leaves, setLeaves] = useState<PendingLeaveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<PendingLeaveItem | null>(null);
  const [approveAction, setApproveAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [approverNote, setApproverNote] = useState("");
  const [viewDocLeave, setViewDocLeave] = useState<PendingLeaveItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchLeaves(): Promise<void> {
      try {
        const { data } = await api.get<PendingLeaveItem[]>("/teacher/leaves/pending");
        if (mounted) setLeaves(data);
      } catch {
        if (mounted) setLeaves([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchLeaves();
    return () => { mounted = false; };
  }, []);

  async function handleSubmit(): Promise<void> {
    if (!selectedLeave || !approveAction) return;
    setSubmitting(true);
    try {
      await api.put(`/teacher/leaves/${selectedLeave.id}/approve`, {
        status: approveAction,
        approver_note: approverNote || undefined,
      });
      toast.success(`Leave request ${approveAction.toLowerCase()} successfully`);
      setSelectedLeave(null);
      setApproveAction(null);
      setApproverNote("");
      const { data } = await api.get<PendingLeaveItem[]>("/teacher/leaves/pending");
      setLeaves(data);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to process leave request"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <GlassLoader text="Loading leave requests..." />;

  const columns: TableColumn<PendingLeaveItem & Record<string, unknown>>[] = [
    { key: "enrollment_number", header: "Enrollment #" },
    { key: "student_name", header: "Student", sortable: true },
    {
      key: "start_date",
      header: "From",
      render: (r) => <span className="text-xs text-slate-400">{new Date(r.start_date).toLocaleDateString()}</span>,
    },
    {
      key: "end_date",
      header: "To",
      render: (r) => <span className="text-xs text-slate-400">{new Date(r.end_date).toLocaleDateString()}</span>,
    },
    {
      key: "reason",
      header: "Reason",
      render: (r) => <span className="text-xs text-slate-300 truncate max-w-[180px] block">{r.reason}</span>,
    },
    {
      key: "document_url",
      header: "Document",
      render: (r) => r.document_url ? (
        <button
          type="button"
          onClick={() => setViewDocLeave(r)}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors"
          title="Click to preview attached document"
        >
          {r.document_url.toLowerCase().endsWith(".pdf") ? <FileText size={13} /> : <ImageIcon size={13} />}
          <span>View Doc</span>
        </button>
      ) : <span className="text-slate-600 text-xs">—</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectedLeave(row); setApproveAction("APPROVED"); setApproverNote(""); }}
            className="glass-btn glass-btn-sm glass-btn-ghost text-emerald-400 hover:text-emerald-300"
          >
            <CheckCircle2 size={14} /> Approve
          </button>
          <button
            onClick={() => { setSelectedLeave(row); setApproveAction("REJECTED"); setApproverNote(""); }}
            className="glass-btn glass-btn-sm glass-btn-ghost text-rose-400 hover:text-rose-300"
          >
            <XCircle size={14} /> Reject
          </button>
        </div>
      ),
    },
  ];

  const filtered = leaves.filter((r) =>
    r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up">
      <GlassPageHeader title="Leave Requests" description={`${leaves.length} pending leave request(s)`} />
      <GlassCard padding="sm" className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <GlassSearch placeholder="Search by student name, enrollment, or reason..." onSearch={setSearchTerm} />
          </div>
        </div>
      </GlassCard>

      {leaves.length === 0 ? (
        <GlassEmptyState title="All Clear" message="No pending leave requests found." />
      ) : (
        <GlassTable
          columns={columns}
          data={filtered as (PendingLeaveItem & Record<string, unknown>)[]}
          emptyMessage="No pending leaves match your search."
        />
      )}

      {/* Document Preview Modal */}
      <LeaveDocumentModal
        leave={viewDocLeave}
        onClose={() => setViewDocLeave(null)}
      />

      {/* Review and Approval Dialog */}
      <LeaveReviewDialog
        leave={selectedLeave}
        action={approveAction}
        approverNote={approverNote}
        submitting={submitting}
        onNoteChange={setApproverNote}
        onConfirm={handleSubmit}
        onCancel={() => { setSelectedLeave(null); setApproveAction(null); }}
        onViewDoc={(leave) => setViewDocLeave(leave)}
      />
    </div>
  );
}
