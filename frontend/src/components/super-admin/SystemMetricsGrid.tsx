"use client";

import React from "react";
import { Server, Database, Cpu, HardDrive } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { PlatformHealth } from "@/types/tenant";

interface SystemMetricsGridProps {
  health: PlatformHealth;
}

export default function SystemMetricsGrid({ health }: SystemMetricsGridProps): React.ReactElement {
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    return parts.join(" ") || "< 1m";
  };

  const poolActive = (health.database_pool?.active_queries as number) ?? 1;
  const poolMax = (health.database_pool?.max_connections as number) ?? 20;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassCard className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
          <Server size={18} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">Backend Process Uptime</p>
          <p className="text-lg font-bold text-foreground font-[Outfit]">
            {formatUptime(health.server_uptime_seconds)}
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
          <Database size={18} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">DB Connection Pool</p>
          <p className="text-lg font-bold text-foreground font-[Outfit]">
            {poolActive} / {poolMax} active
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
          <HardDrive size={18} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">Redis In-Memory Cache</p>
          <p className="text-lg font-bold text-foreground font-[Outfit]">
            {health.services.redis_cache.status === "healthy" ? "Online & Synced" : "Unreachable"}
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
          <Cpu size={18} />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">Multimodal AI Engine</p>
          <p className="text-sm font-bold text-foreground font-mono truncate max-w-[130px]" title="Active & Ready">
            {health.services?.gemini_multimodal_ai?.status === "healthy" ? "Active & Ready" : "Standby"}
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
