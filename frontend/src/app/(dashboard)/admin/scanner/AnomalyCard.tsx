"use client";

import React, { useState } from "react";
import {
  User,
  Hash,
  Calendar,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import GlassBadge from "@/components/ui/GlassBadge";
import type { AnomalyResult } from "@/types";

interface AnomalyCardProps {
  result: AnomalyResult;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getRiskLevel(score: number): {
  label: string;
  variant: "danger" | "warning" | "neutral";
} {
  if (score > 0.25) return { label: "High Risk", variant: "danger" };
  if (score > 0.15) return { label: "Medium Risk", variant: "warning" };
  return { label: "Low Risk", variant: "neutral" };
}

export default function AnomalyCard({ result }: AnomalyCardProps): React.ReactElement {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);
  const risk = getRiskLevel(result.anomaly_score || 0);

  const breakdown = result.day_breakdown || {};
  const maxDayCount = Math.max(1, ...Object.values(breakdown));

  function handleCopyId(id: string): void {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Student ID copied");
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <GlassCard hoverable className="flex flex-col justify-between h-full bg-card/70 border-border/80 transition-all duration-200">
      <div className="space-y-3">
        {/* Header: Risk & Score */}
        <div className="flex items-center justify-between gap-2">
          <GlassBadge variant={risk.variant}>{risk.label}</GlassBadge>
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium block">
              Anomaly Index
            </span>
            <span className="text-sm font-bold text-foreground font-mono">
              {typeof result.anomaly_score === "number"
                ? result.anomaly_score.toFixed(3)
                : "—"}
            </span>
          </div>
        </div>

        {/* Student Name & Enrollment */}
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5 truncate">
            <User size={14} className="text-muted-foreground shrink-0" />
            <span className="truncate">{result.student_name || "Unknown Student"}</span>
          </h4>
          <p className="text-xs font-mono text-muted-foreground mt-0.5 flex items-center gap-1">
            <Hash size={11} className="shrink-0" />
            <span>{result.enrollment_number || "No PRN"}</span>
          </p>
        </div>

        {/* AI Pattern Tag */}
        {result.primary_pattern && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <Sparkles size={13} className="shrink-0" />
            <span className="truncate">{result.primary_pattern}</span>
          </div>
        )}

        {/* Key Metric: Total Absences */}
        {typeof result.total_absences === "number" && (
          <div className="flex items-center justify-between text-xs py-1 px-2 rounded bg-muted/40 border border-border/40">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar size={12} /> Total Absences
            </span>
            <span className="text-foreground font-semibold font-mono">
              {result.total_absences}
            </span>
          </div>
        )}

        {/* Progressive Disclosure: Day Breakdown */}
        {result.day_breakdown && Object.keys(result.day_breakdown).length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowBreakdown((prev) => !prev)}
              className="w-full flex items-center justify-between text-[11px] font-medium text-muted-foreground hover:text-foreground py-1 transition-colors"
            >
              <span>Weekday Breakdown</span>
              {showBreakdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showBreakdown && (
              <div className="grid grid-cols-7 gap-1 pt-1.5 pb-1">
                {WEEKDAYS.map((day) => {
                  const count = breakdown[day] || 0;
                  const intensity = count > 0 ? Math.min(100, Math.round((count / maxDayCount) * 100)) : 0;
                  return (
                    <div
                      key={day}
                      className="flex flex-col items-center justify-center p-1 rounded bg-secondary/50 border border-border/30 text-center"
                    >
                      <span className="text-[10px] text-muted-foreground font-medium">{day}</span>
                      <span className={`text-[11px] font-bold font-mono ${count > 0 ? "text-foreground" : "text-muted-foreground/60"}`}>
                        {count}
                      </span>
                      <div className="w-full h-0.5 bg-muted rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${intensity}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: Student ID copy */}
      <div className="pt-2.5 border-t border-border mt-3 flex items-center justify-between gap-3 text-[10px] text-muted-foreground font-mono">
        <span className="truncate">ID: {result.student_id}</span>
        <button
          onClick={() => handleCopyId(result.student_id)}
          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
          title="Copy Student ID"
        >
          {copiedId === result.student_id ? (
            <Check size={12} className="text-emerald-500" />
          ) : (
            <Copy size={12} />
          )}
        </button>
      </div>
    </GlassCard>
  );
}

