"use client";

import React from "react";
import { Cpu, ShieldCheck, Activity, Radio, Database, HardDrive } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
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
      status: config?.isFaceRecognitionEnabled ? "Active" : "Disabled",
      accuracy: "FaceNet 128-d",
      latency: health?.services?.database ? `${health.services.database.latency_ms}ms DB` : "Online",
      icon: <Cpu size={16} className="text-emerald-400" />,
      active: Boolean(config?.isFaceRecognitionEnabled),
    },
    {
      name: "Liveness Anti-Spoofing",
      status: config?.isFaceRecognitionEnabled ? "Active" : "Standby",
      accuracy: "MobileNetV2 Classifier",
      latency: "Real-time",
      icon: <ShieldCheck size={16} className="text-emerald-400" />,
      active: Boolean(config?.isFaceRecognitionEnabled),
    },
    {
      name: "Geofence Spatial Proximity",
      status: config?.isGpsVerificationEnabled ? "Active" : "Disabled",
      accuracy: "Haversine Ellipsoid",
      latency: "Local Node",
      icon: <Activity size={16} className="text-emerald-400" />,
      active: Boolean(config?.isGpsVerificationEnabled),
    },
    {
      name: "PostgreSQL pgvector Engine",
      status: health?.services?.database?.status === "healthy" ? "Connected" : "Degraded",
      accuracy: "Vector Index Active",
      latency: `${health?.services?.database?.latency_ms ?? 0}ms`,
      icon: <Database size={16} className="text-cyan-400" />,
      active: health?.services?.database?.status === "healthy",
    },
    {
      name: "Redis Cache & Token Denylist",
      status: health?.services?.redis?.status === "healthy" ? "Synchronized" : "Degraded",
      accuracy: "Distributed Lock Active",
      latency: `${health?.services?.redis?.latency_ms ?? 0}ms`,
      icon: <HardDrive size={16} className="text-purple-400" />,
      active: health?.services?.redis?.status === "healthy",
    },
  ];

  return (
    <GlassCard className="relative overflow-hidden flex flex-col justify-between" padding="none">
      <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-emerald-400" />
          <h3 className="text-sm font-extrabold text-slate-200 tracking-wide font-[Outfit] uppercase">Verification & Data Nodes</h3>
        </div>
        <GlassBadge variant={isHealthy ? "success" : "warning"} className="font-bold py-0.5 px-2 text-[10px]">
          {isHealthy ? "All Nominal" : "Degraded"}
        </GlassBadge>
      </div>
      <div className="p-5 space-y-3">
        {nodes.map((node) => (
          <div key={node.name} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.02] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                {node.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 leading-normal">{node.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold tracking-wide mt-0.5">{node.accuracy} • {node.latency}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${node.active ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
              <span className="text-[11px] font-semibold text-slate-400">{node.status}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
