"use client";

import React from "react";
import { Clock, ArrowRight, User, Network } from "lucide-react";
import Link from "next/link";
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
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Clock size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-[Outfit]">Live Audit Stream</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Immutable security transactions & node state events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE SYNC</span>
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-3 relative">
        {displayEvents.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-8 text-center">No recent audit events recorded.</p>
        ) : (
          displayEvents.map((evt) => {
            const isSuccess = evt.severity === "INFO" || evt.severity === "LOW";
            const isWarning = evt.severity === "WARNING" || evt.severity === "MEDIUM";

            return (
              <div
                key={evt.id}
                className="p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isSuccess ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-rose-500"
                      }`}
                    />
                    <p className="text-xs font-bold text-foreground truncate uppercase tracking-tight">
                      {((evt.eventType || (evt as { action?: string }).action) ?? "SYSTEM_EVENT").replace(/_/g, " ")}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground shrink-0">
                    {formatRelativeTime(evt.timestamp || (evt as { createdAt?: string }).createdAt || new Date().toISOString())}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-1">
                  {evt.description ||
                    ((evt as { details?: Record<string, unknown> }).details
                      ? JSON.stringify((evt as { details?: Record<string, unknown> }).details)
                      : "System activity log entry")}
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                  <span className="flex items-center gap-1 font-mono truncate max-w-[200px]">
                    <User size={11} className="text-slate-400" />
                    {evt.actor || (evt as { performedBy?: string }).performedBy || "System"}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Network size={11} className="text-slate-400" />
                    {evt.ip || "127.0.0.1"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-5 py-3 border-t border-border bg-secondary/20 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Displaying latest system telemetry</span>
        <Link href="/admin/audit" className="text-primary hover:underline font-semibold inline-flex items-center gap-1">
          <span>Full Audit Log</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
