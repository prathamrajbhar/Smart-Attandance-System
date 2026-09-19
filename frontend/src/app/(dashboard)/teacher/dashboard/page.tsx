"use client";

import React, { useEffect, useState, useCallback } from "react";
import { BookOpen, Radio, ClipboardCheck, Clock, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassStatCard from "@/components/ui/GlassStatCard";
import GlassLoader from "@/components/ui/GlassLoader";
import GlassBadge from "@/components/ui/GlassBadge";
import toast from "react-hot-toast";
import ActiveSessionBanner from "./ActiveSessionBanner";
import TeacherQuickActions from "@/components/teacher/TeacherQuickActions";
import type { AcademicClassWithGeofence, SessionWithClassResponse, FlaggedAttendanceResponse } from "@/types";

export default function TeacherDashboardPage(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [classes, setClasses] = useState<AcademicClassWithGeofence[]>([]);
  const [sessions, setSessions] = useState<SessionWithClassResponse[]>([]);
  const [flagged, setFlagged] = useState<FlaggedAttendanceResponse[]>([]);

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long", day: "numeric", month: "short", year: "numeric",
  }).format(new Date());

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const [c, s, f] = await Promise.all([
        api.get<AcademicClassWithGeofence[]>("/teacher/my-classes"),
        api.get<SessionWithClassResponse[]>("/teacher/sessions/all"),
        api.get<FlaggedAttendanceResponse[]>("/teacher/attendance/flagged"),
      ]);
      setClasses(c.data);
      setSessions(s.data);
      setFlagged(f.data);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to load dashboard data"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [c, s, f] = await Promise.all([
          api.get<AcademicClassWithGeofence[]>("/teacher/my-classes"),
          api.get<SessionWithClassResponse[]>("/teacher/sessions/all"),
          api.get<FlaggedAttendanceResponse[]>("/teacher/attendance/flagged"),
        ]);
        if (isMounted) {
          setClasses(c.data);
          setSessions(s.data);
          setFlagged(f.data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          toast.error(getApiErrorMessage(err, "Failed to load dashboard data"));
          setLoading(false);
        }
      }
    };
    void load();
    return () => { isMounted = false; };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  if (loading) return <GlassLoader text="Loading faculty console..." />;

  const activeSessions = sessions.filter((s) => s.isActive);
  const completedSessions = sessions.filter((s) => !s.isActive);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Faculty Lecture Portal • {todayStr}</p>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-[Outfit]">{greeting}, Professor</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage your assigned courses, broadcast live attendance sessions, and resolve flagged student verifications.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-all shadow-xs disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin text-primary" : "text-muted-foreground"} />
          <span>{refreshing ? "Refreshing..." : "Refresh Console"}</span>
        </button>
      </div>

      {activeSessions.length > 0 && <ActiveSessionBanner session={activeSessions[0]} />}

      {/* Quick Actions */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider font-[Outfit]">Faculty Actions</h2>
          <span className="text-[11px] text-muted-foreground">Broadcasts & Queue Management</span>
        </div>
        <TeacherQuickActions />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStatCard
          icon={<BookOpen size={20} />}
          label="My Classes"
          value={classes.length}
          accentColor="blue"
          trend="Assigned"
          trendUp
          subtext="Active course rosters"
        />
        <GlassStatCard
          icon={<Radio size={20} />}
          label="Active Sessions"
          value={activeSessions.length}
          accentColor="emerald"
          trend={completedSessions.length > 0 ? `${completedSessions.length} Finished` : "Ready"}
          trendUp
          subtext="Real-time broadcasts"
        />
        <GlassStatCard
          icon={<ClipboardCheck size={20} />}
          label="Pending Reviews"
          value={flagged.length}
          accentColor={flagged.length > 0 ? "rose" : "purple"}
          trend={flagged.length > 0 ? "Action Required" : "All Clear"}
          trendUp={flagged.length === 0}
          subtext="Verification anomaly queue"
        />
        <GlassStatCard
          icon={<CheckCircle2 size={20} />}
          label="Attendance Rate"
          value="94.8%"
          accentColor="amber"
          trend="↑ 2.1% this term"
          trendUp
          subtext="Across all course sections"
        />
      </div>

      {/* Recent Sessions */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-[Outfit]">Recent Course Sessions</h3>
          </div>
          <Link href="/teacher/sessions" className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1">
            <span>View All Sessions</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="p-4 space-y-2.5">
          {sessions.slice(0, 5).map((session, i) => (
            <div key={session.id || i} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {session.class_name || (session as { className?: string }).className || "Class Session"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {new Date(session.startTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <GlassBadge variant={session.isActive ? "success" : "neutral"} className="text-[10px] py-0.5 px-2 shrink-0 font-medium">
                {session.isActive ? "ACTIVE" : "COMPLETED"}
              </GlassBadge>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-xs">No sessions recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
