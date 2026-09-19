"use client";

import React from "react";
import { Clock } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { AuditLogResponse } from "@/types";

interface SystemEventsCardProps {
  events: AuditLogResponse[];
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return "Recent";
  }
}

export default function SystemEventsCard({ events }: SystemEventsCardProps): React.ReactElement {
  const displayEvents = events.slice(0, 5);

  return (
    <GlassCard className="relative overflow-hidden" padding="none">
      <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-emerald-400" />
          <h3 className="text-sm font-extrabold text-slate-200 tracking-wide font-[Outfit] uppercase">Live Audit Stream</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      <div className="p-5 space-y-4 relative">
        <div className="absolute left-[33px] top-[25px] bottom-[25px] w-px bg-white/[0.06] pointer-events-none" />

        {displayEvents.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">No recent audit events recorded.</p>
        ) : (
          displayEvents.map((evt) => {
            const isSuccess = evt.severity === "INFO" || evt.severity === "LOW";
            const isWarning = evt.severity === "WARNING" || evt.severity === "MEDIUM";

            return (
              <div key={evt.id} className="flex gap-4 relative z-10 group">
                <div className="flex items-center justify-center shrink-0">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      isSuccess
                        ? "bg-emerald-500/20 border-emerald-500/50"
                        : isWarning
                        ? "bg-amber-500/20 border-amber-500/50"
                        : "bg-rose-500/20 border-rose-500/50"
                    } flex items-center justify-center`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${
                        isSuccess ? "bg-emerald-400" : isWarning ? "bg-amber-400" : "bg-rose-400"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-slate-100 transition-colors duration-200">
                      {evt.eventType.replace(/_/g, " ")}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500 shrink-0 mt-0.5">
                      {formatRelativeTime(evt.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal font-medium">{evt.description}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5 font-mono">Actor: {evt.actor}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}
