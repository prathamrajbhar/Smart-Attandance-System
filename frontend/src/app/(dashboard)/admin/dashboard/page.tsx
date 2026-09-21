"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  Users, GraduationCap, BookOpen, ShieldCheck, RefreshCw, Megaphone 
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import GlassStatCard from "@/components/ui/GlassStatCard";
import GlassLoader from "@/components/ui/GlassLoader";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import SystemNodesCard from "@/components/admin/SystemNodesCard";
import SystemEventsCard from "@/components/admin/SystemEventsCard";
import BroadcastNotificationModal from "@/components/admin/BroadcastNotificationModal";
import type { AdminStatsResponse, SystemHealthResponse, AuditLogResponse, SystemConfigResponse } from "@/types";

export default function AdminDashboardPage(): React.ReactElement {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditLogResponse[]>([]);
  const [config, setConfig] = useState<SystemConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const displayName = user?.email ? user.email.split("@")[0] : "Administrator";

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const fetchDashboardData = useCallback(async (): Promise<void> => {
    try {
      const [statsRes, healthRes, auditRes, configRes] = await Promise.allSettled([
        api.get<AdminStatsResponse>("/admin/stats"),
        api.get<SystemHealthResponse>("/health"),
        api.get<AuditLogResponse[]>("/admin/audit"),
        api.get<SystemConfigResponse>("/admin/config"),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.data);
      if (auditRes.status === "fulfilled") {
        const raw = auditRes.value.data;
        const items = Array.isArray(raw) ? raw : (raw as { items?: AuditLogResponse[] })?.items || [];
        setAuditEvents(items);
      }
      if (configRes.status === "fulfilled") setConfig(configRes.value.data);
    } catch {
      setStats({ studentCount: 0, teacherCount: 0, classCount: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [statsRes, healthRes, auditRes, configRes] = await Promise.allSettled([
          api.get<AdminStatsResponse>("/admin/stats"),
          api.get<SystemHealthResponse>("/health"),
          api.get<{ items: AuditLogResponse[] } | AuditLogResponse[]>("/admin/audit"),
          api.get<SystemConfigResponse>("/admin/config"),
        ]);
        if (isMounted) {
          if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
          if (healthRes.status === "fulfilled") setHealth(healthRes.value.data);
          if (auditRes.status === "fulfilled") {
            const raw = auditRes.value.data;
            const items = Array.isArray(raw) ? raw : (raw as { items?: AuditLogResponse[] })?.items || [];
            setAuditEvents(items);
          }
          if (configRes.status === "fulfilled") setConfig(configRes.value.data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setStats({ studentCount: 0, teacherCount: 0, classCount: 0 });
          setLoading(false);
        }
      }
    };
    void load();
    return () => { isMounted = false; };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  if (loading) return <GlassLoader text="Loading system metrics..." />;

  const isHealthy = health?.status === "healthy";

  return (
    <div className="space-y-6 pb-6">
      {/* Top Executive Command Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isHealthy ? "System Operational" : "Partially Degraded"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" />
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono">
              {todayStr}
            </p>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {greeting}, {displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Live zero-trust biometric attendance cluster, vector inference pipelines, and security telemetries.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 z-10 self-start md:self-center">
          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-secondary/50 text-xs font-semibold text-foreground hover:bg-secondary hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
          >
            <Megaphone size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Broadcast</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin text-primary" : "text-muted-foreground"} />
            <span>{refreshing ? "Refreshing..." : "Refresh Status"}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStatCard
          icon={<GraduationCap size={20} />}
          label="Total Students"
          value={stats?.studentCount ?? 0}
          accentColor="blue"
          trend={stats && stats.studentCount > 0 ? "Active roster" : "Empty roster"}
          trendUp={stats ? stats.studentCount > 0 : false}
          subtext="Enrolled biometric accounts"
        />
        <GlassStatCard
          icon={<Users size={20} />}
          label="Total Faculty"
          value={stats?.teacherCount ?? 0}
          accentColor="emerald"
          trend={stats && stats.teacherCount > 0 ? "Faculty active" : "No staff"}
          trendUp={stats ? stats.teacherCount > 0 : false}
          subtext="Active teaching staff"
        />
        <GlassStatCard
          icon={<BookOpen size={20} />}
          label="Configured Classes"
          value={stats?.classCount ?? 0}
          accentColor="purple"
          trend={stats && stats.classCount > 0 ? "Active classes" : "No classes"}
          trendUp={stats ? stats.classCount > 0 : false}
          subtext="Geofenced amphitheaters"
        />
        <GlassStatCard
          icon={<ShieldCheck size={20} />}
          label="Biometric Passes"
          value={stats?.biometricPassRate !== undefined && (stats.attendanceCount ?? 0) > 0 ? `${stats.biometricPassRate}%` : "0.0%"}
          accentColor="amber"
          trend={stats && (stats.attendanceCount ?? 0) > 0 ? "Live verification" : "No logs recorded"}
          trendUp={stats ? (stats.attendanceCount ?? 0) > 0 : false}
          subtext="Liveness & face verification"
        />
      </div>

      {/* Administration Controls Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
            {"Administration Controls"}
          </h2>
          <span className="text-[11px] text-muted-foreground">
            Core Services & Fast Pathways
          </span>
        </div>
        <AdminQuickActions />
      </div>

      {/* System Infrastructure Matrix & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemNodesCard health={health} config={config} />
        <SystemEventsCard events={auditEvents} />
      </div>

      {/* Broadcast Modal */}
      <BroadcastNotificationModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        onSuccess={() => void fetchDashboardData()}
      />
    </div>
  );
}
