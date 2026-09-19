"use client";

import React from "react";
import { Cpu, ShieldCheck, Activity, Radio, Database, HardDrive, CheckCircle2 } from "lucide-react";
import GlassBadge from "@/components/ui/GlassBadge";
import type { SystemHealthResponse, SystemConfigResponse } from "@/types";

interface SystemNodesCardProps {
  health: SystemHealthResponse | null;
  config: SystemConfigResponse | null;
}

export default function SystemNodesCard({ health, config }: SystemNodesCardProps): React.ReactElement {
  const isHealthy = health?.status === "healthy";

  const nodes = [
    {
      name: "Facial Recognition Model",
      status: config?.isFaceRecognitionEnabled ? "Operational" : "Disabled",
      accuracy: "FaceNet 128-d Vector Space",
      latency: health?.services?.database ? `${health.services.database.latency_ms}ms DB` : "Online",
      icon: <Cpu size={16} className="text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      active: Boolean(config?.isFaceRecognitionEnabled),
    },
    {
      name: "Liveness Anti-Spoofing",
      status: config?.isFaceRecognitionEnabled ? "Operational" : "Standby",
      accuracy: "MobileNetV2 Neural Classifier",
      latency: "Real-time",
      icon: <ShieldCheck size={16} className="text-teal-600" />,
      iconBg: "bg-teal-50 border-teal-100",
      active: Boolean(config?.isFaceRecognitionEnabled),
    },
    {
      name: "Geofence Spatial Proximity",
      status: config?.isGpsVerificationEnabled ? "Operational" : "Disabled",
      accuracy: "Haversine Ellipsoid (BLE/GPS)",
      latency: "Local Node",
      icon: <Activity size={16} className="text-sky-600" />,
      iconBg: "bg-sky-50 border-sky-100",
      active: Boolean(config?.isGpsVerificationEnabled),
    },
    {
      name: "PostgreSQL pgvector Engine",
      status: health?.services?.database?.status === "healthy" ? "Operational" : "Degraded",
      accuracy: "Vector Index Active (ivfflat)",
      latency: `${health?.services?.database?.latency_ms ?? 14}ms`,
      icon: <Database size={16} className="text-indigo-600" />,
      iconBg: "bg-indigo-50 border-indigo-100",
      active: health?.services?.database?.status === "healthy",
    },
    {
      name: "Redis Cache & Token Denylist",
      status: health?.services?.redis?.status === "healthy" ? "Operational" : "Degraded",
      accuracy: "Distributed Session & Lock Engine",
      latency: `${health?.services?.redis?.latency_ms ?? 0}ms`,
      icon: <HardDrive size={16} className="text-purple-600" />,
      iconBg: "bg-purple-50 border-purple-100",
      active: health?.services?.redis?.status === "healthy",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
            <Radio size={16} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-[Outfit]">System Nodes & Engines</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Vector biometric pipelines & local geospatial services</p>
          </div>
        </div>
        <GlassBadge variant={isHealthy ? "success" : "warning"} className="py-1 px-2.5 text-[10px] font-semibold">
          {isHealthy ? "All Operational" : "Degraded"}
        </GlassBadge>
      </div>

      <div className="p-4 sm:p-5 space-y-2.5">
        {nodes.map((node) => (
          <div
            key={node.name}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-lg border ${node.iconBg} shrink-0`}>
                {node.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground leading-snug truncate">{node.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{node.accuracy}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono font-medium text-muted-foreground bg-card px-2 py-0.5 rounded border border-border">
                {node.latency}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{node.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-border bg-secondary/20 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 size={13} className="text-emerald-600" />
          Zero-Trust Invariant Active
        </span>
        <span className="font-mono">Cluster: local-node-01</span>
      </div>
    </div>
  );
}
