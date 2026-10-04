"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Database, Zap, Cpu, RefreshCw, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { superAdminService } from "@/lib/services/superAdminService";
import { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";
import SystemHealthCard from "@/components/super-admin/SystemHealthCard";
import SystemMetricsGrid from "@/components/super-admin/SystemMetricsGrid";
import type { PlatformHealth } from "@/types/tenant";

export default function PlatformHealthPage(): React.ReactElement {
  const [health, setHealth] = useState<PlatformHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchHealth = useCallback(async (showToast = false): Promise<void> => {
    try {
      if (showToast) setRefreshing(true);
      const data = await superAdminService.getSystemHealth();
      setHealth(data);
      if (showToast) {
        toast.success("Platform diagnostics refreshed successfully");
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to retrieve system diagnostics"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  // Auto-refresh timer if toggled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      void fetchHealth(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchHealth]);

  return (
    <div className="space-y-6 max-w-7xl animate-fade-in-up">
      <GlassBreadcrumb
        items={[
          { label: "Platform Control", href: "/super-admin/dashboard" },
          { label: "Platform Health & Diagnostics" },
        ]}
      />

      <GlassPageHeader
        title="Platform Health & Diagnostics"
        description="Real-time multi-tenant infrastructure monitoring, database query latency, cache status, and AI model health."
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAutoRefresh((prev) => !prev)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                autoRefresh
                  ? "bg-primary/15 border-primary text-primary"
                  : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity size={13} className={autoRefresh ? "animate-spin" : ""} />
              <span>{autoRefresh ? "Auto-Refresh: 10s" : "Auto-Refresh: OFF"}</span>
            </button>

            <GlassButton
              variant="secondary"
              onClick={() => void fetchHealth(true)}
              disabled={refreshing}
              className="gap-1.5"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span>Run Health Check</span>
            </GlassButton>
          </div>
        }
      />

      {loading || !health ? (
        <div className="space-y-4">
          <div className="h-24 rounded-2xl bg-muted/40 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Platform Status Banner */}
          <GlassCard
            className={`p-6 border-l-4 ${
              health.status === "healthy"
                ? "border-l-emerald-500 bg-emerald-500/5"
                : "border-l-amber-500 bg-amber-500/5"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    health.status === "healthy"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-amber-500/15 text-amber-500"
                  }`}
                >
                  {health.status === "healthy" ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {health.status === "healthy"
                      ? "All Core Subsystems Operational"
                      : "Platform Operating with Subsystem Degradation"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Last probe evaluated at{" "}
                    {new Date(health.timestamp).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-card px-3 py-1.5 rounded-lg border border-border text-foreground">
                <ShieldCheck size={14} className="text-primary" />
                <span>Enterprise High Availability (99.9%)</span>
              </div>
            </div>
          </GlassCard>

          {/* Infrastructure Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SystemHealthCard
              title="PostgreSQL Database"
              description="Primary relational datastore with tenant partitions"
              service={health.services.postgresql}
              icon={<Database size={20} />}
            />

            <SystemHealthCard
              title="Redis Distributed Cache"
              description="Multi-tenant session broker and token blacklist"
              service={health.services.redis_cache}
              icon={<Zap size={20} />}
            />

            <SystemHealthCard
              title="Multimodal AI Engine"
              description="Document & Timetable OCR engine"
              service={health.services.gemini_multimodal_ai}
              icon={<Cpu size={20} />}
            />
          </div>

          {/* Detailed Metric Strip */}
          <SystemMetricsGrid health={health} />
        </div>
      )}
    </div>
  );
}
