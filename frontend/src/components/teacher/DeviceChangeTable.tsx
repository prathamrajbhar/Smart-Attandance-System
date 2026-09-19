"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Smartphone, AlertCircle } from "lucide-react";
import GlassTable, { TableColumn } from "@/components/ui/GlassTable";
import api, { getApiErrorMessage } from "@/lib/api";
import { toast } from "react-hot-toast";

interface DeviceChangeRequest {
  id: string;
  student_id: string;
  student_name: string;
  enrollment_number: string;
  new_device_uuid: string;
  reason: string | null;
  status: string;
  created_at: string;
}

interface DeviceChangeTableProps {
  requests: DeviceChangeRequest[];
  onActionComplete: () => void;
}

export default function DeviceChangeTable({ requests, onActionComplete }: DeviceChangeTableProps): React.ReactElement {
  const [processing, setProcessing] = useState<string | null>(null);

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
      setProcessing(id);
      await api.put(`/teacher/device-changes/${id}/approve`, { status });
      toast.success(`Request ${status.toLowerCase()} successfully`);
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
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-800 bg-amber-50 border border-amber-200 w-fit px-2 py-0.5 rounded">
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
      render: (req) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleAction(req.id, "REJECTED")}
            disabled={processing !== null}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors text-xs font-medium"
          >
            <XCircle size={14} />
            Reject
          </button>
          <button
            onClick={() => handleAction(req.id, "APPROVED")}
            disabled={processing !== null}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors text-xs font-medium"
          >
            <CheckCircle2 size={14} />
            Approve
          </button>
        </div>
      ),
    },
  ];

  if (requests.length === 0) {
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

  return <GlassTable columns={columns} data={requests as (DeviceChangeRequest & Record<string, unknown>)[]} />;
}
