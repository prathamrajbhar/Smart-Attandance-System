"use client";

import React, { useState } from "react";
import { User, Hash, Calendar, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import GlassBadge from "@/components/ui/GlassBadge";
import type { AnomalyResult } from "@/types";

interface AnomalyCardProps {
  result: AnomalyResult;
}

function getRiskLevel(score: number): { label: string; variant: "danger" | "warning" | "neutral" } {
  if (score > 0.25) return { label: "High Risk", variant: "danger" };
  if (score > 0.15) return { label: "Medium Risk", variant: "warning" };
  return { label: "Low Risk", variant: "neutral" };
}

export default function AnomalyCard({ result }: AnomalyCardProps): React.ReactElement {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const risk = getRiskLevel(result.anomaly_score || 0);

  function handleCopyId(id: string): void {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Student ID copied");
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <GlassCard hoverable className="flex flex-col justify-between h-full bg-card">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <GlassBadge variant={risk.variant}>{risk.label}</GlassBadge>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Anomaly Score</p>
            <p className="text-sm font-bold text-foreground font-mono">
              {typeof result.anomaly_score === "number" ? result.anomaly_score.toFixed(3) : "—"}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5 truncate">
            <User size={15} className="text-muted-foreground shrink-0" />
            <span className="truncate">{result.student_name || "Unknown Student"}</span>
          </h4>
          <p className="text-xs font-mono text-muted-foreground mt-1 flex items-center gap-1">
            <Hash size={12} className="shrink-0" />
            <span>{result.enrollment_number || "No Enrollment Num"}</span>
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-border mt-auto flex flex-col gap-1.5">
        {typeof result.total_absences === "number" && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar size={12} /> Total Absences
            </span>
            <span className="text-foreground font-semibold bg-secondary px-1.5 py-0.5 rounded">
              {result.total_absences}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 text-[10px] text-muted-foreground font-mono mt-1">
          <span className="truncate">ID: {result.student_id}</span>
          <button
            onClick={() => handleCopyId(result.student_id)}
            className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Copy Student ID"
          >
            {copiedId === result.student_id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
