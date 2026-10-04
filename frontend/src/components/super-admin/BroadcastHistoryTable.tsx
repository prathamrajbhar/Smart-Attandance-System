"use client";

import React, { useState, useEffect, useCallback } from "react";
import { History, RefreshCw, Radio, Users, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { superAdminService } from "@/lib/services/superAdminService";
import GlassCard from "@/components/ui/GlassCard";
import GlassBadge, { type BadgeVariant } from "@/components/ui/GlassBadge";
import type { BroadcastHistoryItem } from "@/types/tenant";

interface BroadcastHistoryTableProps {
  refreshTrigger?: number;
}

export default function BroadcastHistoryTable({ refreshTrigger }: BroadcastHistoryTableProps): React.ReactElement {
  const [items, setItems] = useState<BroadcastHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await superAdminService.getBroadcasts(1, 15);
      setItems(res.items || []);
    } catch {
      setError("Failed to load broadcast history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory, refreshTrigger]);

  const getSeverityBadge = (severity: string): { variant: BadgeVariant; icon: React.ReactElement } => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
      case "ERROR":
        return { variant: "danger", icon: <AlertCircle size={12} className="text-destructive" /> };
      case "WARNING":
        return { variant: "warning", icon: <AlertTriangle size={12} className="text-amber-500" /> };
      case "SUCCESS":
        return { variant: "success", icon: <CheckCircle2 size={12} className="text-emerald-500" /> };
      case "INFO":
      default:
        return { variant: "info", icon: <Info size={12} className="text-blue-500" /> };
    }
  };

  return (
    <GlassCard className="p-5 border-border space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Recent Global Broadcast Dispatch Log</h3>
        </div>
        <button
          type="button"
          onClick={() => void fetchHistory()}
          disabled={loading}
          className="p-1.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Refresh broadcast logs"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-primary" : ""} />
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
          <RefreshCw size={18} className="animate-spin text-primary" />
          <span>Loading broadcast dispatch history...</span>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-xs text-destructive bg-destructive/10 rounded-xl border border-destructive/20 p-4">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void fetchHistory()}
            className="mt-2 px-3 py-1 bg-card border border-border rounded-lg text-foreground hover:bg-secondary text-xs cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-border p-6 flex flex-col items-center gap-2">
          <Radio size={20} className="text-muted-foreground/60" />
          <p className="font-semibold text-foreground">No Global Broadcasts Dispatched Yet</p>
          <p className="text-[11px] text-muted-foreground">
            Announcements dispatched via the composer above will appear here with delivery audit logs.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                <th className="py-2.5 px-3">Title / Subject</th>
                <th className="py-2.5 px-3">Target Scope</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Delivered</th>
                <th className="py-2.5 px-3">Dispatched By</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              {items.map((item) => {
                const badge = getSeverityBadge(item.severity);
                return (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-foreground max-w-[220px]">
                      <div className="truncate font-semibold">{item.title}</div>
                      <div className="truncate text-[10px] text-muted-foreground font-mono mt-0.5">
                        {item.description}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-secondary border border-border font-semibold text-foreground">
                        <Users size={10} />
                        <span>{item.target}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <GlassBadge variant={badge.variant} className="gap-1 text-[10px]">
                        {badge.icon}
                        <span>{item.severity}</span>
                      </GlassBadge>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-foreground font-semibold">
                      {item.delivered_count > 0 ? `${item.delivered_count} users` : "Campus Broadcast"}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-muted-foreground">
                      {item.actor}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-right text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
}
