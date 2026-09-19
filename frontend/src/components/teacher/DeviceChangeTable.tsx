"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Smartphone, AlertCircle, Loader2 } from "lucide-react";
import GlassTable, { TableColumn } from "@/components/ui/GlassTable";
import api, { getApiErrorMessage } from "@/lib/api";
import { toast } from "react-hot-toast";
import type { DeviceChangeRequest } from "@/types/models";

interface DeviceChangeTableProps {
  requests: DeviceChangeRequest[];
  onActionComplete: () => void;
}

export default function DeviceChangeTable({ requests, onActionComplete }: DeviceChangeTableProps): React.ReactElement {
  const [localRequests, setLocalRequests] = useState<DeviceChangeRequest[]>(requests);
  const [processing, setProcessing] = useState<{ id: string; action: "APPROVED" | "REJECTED" } | null>(null);

  useEffect(() => {
    setLocalRequests(requests);
  }, [requests]);

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    } catch {
      return "";
    }
  };

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED"): Promise<void> => {
    try {
      setProcessing({ id, action: status });
      await api.put(`/teacher/device-changes/${id}/approve`, { status });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      setLocalRequests((prev) => prev.filter((r) => r.id !== id));
      onActionComplete();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Action failed"));
    } finally {
      setProcessing(null);
    }
  };

  const columns: TableColumn<DeviceChangeRequest & Record<string, unknown>>[] = [
    {
      key: "student",
      header: "Student Details",
      render: (req) => (
        <div>
          <p className="text-sm font-semibold text-foreground">{req.student_name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{req.enrollment_number}</p>
        </div>
      ),
    },
    {
      key: "request",
      header: "Request Info",
      render: (req) => (
        <div>
          <div className="flex items-center gap-1.5">
            <Smartphone size={14} className="text-muted-foreground" />
            <span className="text-xs font-mono text-foreground">
              {req.new_device_uuid.substring(0, 8)}...
            </span>
          </div>
          {req.reason && (
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 w-fit px-2 py-0.5 rounded">
              <AlertCircle size={10} />
              <span className="truncate max-w-[200px]">{req.reason}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "date",
      header: "Date Submitted",
      render: (req) => (
        <div className="text-xs text-foreground">
          {formatDate(req.created_at)}
          <div className="text-muted-foreground">{formatTime(req.created_at)}</div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (req) => {
        const isRowProcessing = processing?.id === req.id;
        const isApproving = isRowProcessing && processing?.action === "APPROVED";
        const isRejecting = isRowProcessing && processing?.action === "REJECTED";

        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => void handleAction(req.id, "REJECTED")}
              disabled={isRowProcessing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 active:scale-95 disabled:opacity-50 transition-all text-xs font-medium cursor-pointer"
            >
              {isRejecting ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
              {isRejecting ? "Rejecting..." : "Reject"}
            </button>
            <button
              onClick={() => void handleAction(req.id, "APPROVED")}
              disabled={isRowProcessing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all text-xs font-medium cursor-pointer"
            >
              {isApproving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
              {isApproving ? "Approving..." : "Approve"}
            </button>
          </div>
        );
      },
    },
  ];

  if (localRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-xl bg-card">
        <div className="w-12 h-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mb-3">
          <Smartphone size={24} />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1 font-[Outfit]">No Pending Requests</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          All device change requests have been processed. Students can request device changes from their mobile app.
        </p>
      </div>
    );
  }

  return (
    <GlassTable
      columns={columns}
      data={localRequests as (DeviceChangeRequest & Record<string, unknown>)[]}
      rowKey={(req) => req.id}
    />
  );
}
