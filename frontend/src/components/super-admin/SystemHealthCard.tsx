"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlassBadge from "@/components/ui/GlassBadge";
import type { ServiceHealthItem } from "@/types/tenant";

interface SystemHealthCardProps {
  title: string;
  description: string;
  service: ServiceHealthItem;
  icon: React.ReactNode;
}

export default function SystemHealthCard({
  title,
  description,
  service,
  icon,
}: SystemHealthCardProps): React.ReactElement {
  const isHealthy = service.status === "healthy";
  const isWarning = service.status === "warning" || service.status === "degraded";

  const getStatusBadge = (): React.ReactElement => {
    if (isHealthy) {
      return (
        <GlassBadge variant="success" className="gap-1">
          <CheckCircle2 size={11} /> OPERATIONAL
        </GlassBadge>
      );
    }
    if (isWarning) {
      return (
        <GlassBadge variant="warning" className="gap-1">
          <AlertTriangle size={11} /> DEGRADED
        </GlassBadge>
      );
    }
    return (
      <GlassBadge variant="danger" className="gap-1">
        <XCircle size={11} /> UNHEALTHY
      </GlassBadge>
    );
  };

  return (
    <GlassCard className="p-5 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isHealthy ? "bg-emerald-500/10 text-emerald-500" : isWarning ? "bg-amber-500/10 text-amber-500" : "bg-destructive/10 text-destructive"
            }`}>
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{title}</h3>
              <p className="text-[11px] text-muted-foreground">{description}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Latency Meter */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock size={12} /> Response Latency
          </span>
          <span className="font-mono font-bold text-foreground">
            {service.latency_ms} ms
          </span>
        </div>

        {/* Details Dictionary */}
        {service.details && Object.keys(service.details).length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Configuration & Status
            </span>
            <div className="p-2.5 rounded-lg bg-muted/20 border border-border text-[11px] font-mono space-y-1">
              {Object.entries(service.details).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-muted-foreground">
                  <span className="capitalize">{key.replace(/_/g, " ")}:</span>
                  <span className="text-foreground font-medium truncate max-w-[160px]">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
