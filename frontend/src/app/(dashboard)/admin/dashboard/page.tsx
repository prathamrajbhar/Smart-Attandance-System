"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, GraduationCap, BookOpen, ShieldCheck, Activity, Cpu, 
  ArrowUpRight, RefreshCw 
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import GlassStatCard from "@/components/ui/GlassStatCard";
import GlassLoader from "@/components/ui/GlassLoader";
import SystemNodesCard from "@/components/admin/SystemNodesCard";
import SystemEventsCard from "@/components/admin/SystemEventsCard";
import type { AdminStatsResponse, SystemHealthResponse, AuditLogResponse, SystemConfigResponse } from "@/types";

export default function AdminDashboardPage(): React.ReactElement {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditLogResponse[]>([]);
  const [config, setConfig] = useState<SystemConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");

  async function fetchDashboardData(): Promise<void> {
    try {
      const [statsRes, healthRes, auditRes, configRes] = await Promise.allSettled([
        api.get<AdminStatsResponse>("/admin/stats"),
        api.get<SystemHealthResponse>("/health"),
        api.get<AuditLogResponse[]>("/admin/audit"),
        api.get<SystemConfigResponse>("/admin/config"),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.data);
      if (auditRes.status === "fulfilled") setAuditEvents(auditRes.value.data);
      if (configRes.status === "fulfilled") setConfig(configRes.value.data);
    } catch {
      setStats({ studentCount: 0, teacherCount: 0, classCount: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchDashboardData();
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  if (loading) return <GlassLoader text="Loading system metrics..." />;

  const quickActions = [
    { label: "Configure Verifications", href: "/admin/setup/verification-settings", detail: "Toggle verification modes", icon: <ShieldCheck size={18} className="text-emerald-400" /> },
    { label: "Audit Activity Log", href: "/admin/audit", detail: "Inspect node transactions", icon: <Activity size={18} className="text-emerald-400" /> },
    { label: "Configure Classes", href: "/admin/classes", detail: "Manage schedules & enrollments", icon: <BookOpen size={18} className="text-emerald-400" /> },
    { label: "Execute AI Scanner", href: "/admin/scanner", detail: "Scan absentee anomalies", icon: <Cpu size={18} className="text-emerald-400" /> },
  ];

  return (
    <div className="animate-fade-in-up space-y-6 md:space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">System Administration</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight font-[Outfit]">{greeting}, Admin</h1>
            <p className="text-sm font-semibold text-slate-400 mt-1 max-w-2xl">
              System status is {health?.status === "healthy" ? "Operating Nominally" : "Partially Degraded"} with active vector indexes.
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="self-start sm:self-center glass-btn glass-btn-secondary glass-btn-sm font-semibold flex items-center gap-2 border border-white/5 hover:border-white/20 transition-all duration-300"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh Status"}</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex flex-col gap-3 p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                {action.icon}
              </div>
              <ArrowUpRight size={16} className="text-slate-500 opacity-60 group-hover:text-emerald-400 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-200 tracking-wide">{action.label}</span>
              <p className="text-xs text-slate-500 mt-0.5 leading-normal font-medium">{action.detail}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
        <GlassStatCard
          icon={<GraduationCap size={20} />}
          label="Total Students"
          value={stats?.studentCount ?? 0}
          accentColor="blue"
          trend="Enrolled"
          trendUp
        />
        <GlassStatCard
          icon={<Users size={20} />}
          label="Total Teachers"
          value={stats?.teacherCount ?? 0}
          accentColor="emerald"
          trend="Active"
          trendUp
        />
        <GlassStatCard
          icon={<BookOpen size={20} />}
          label="Total Classes"
          value={stats?.classCount ?? 0}
          accentColor="purple"
          trend="Configured"
          trendUp
        />
      </div>

      {/* Dynamic System Status & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemNodesCard health={health} config={config} />
        <SystemEventsCard events={auditEvents} />
      </div>
    </div>
  );
}
