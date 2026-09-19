"use client";

import React from "react";
import { GraduationCap, Users, BookOpen, CheckCircle2, ShieldCheck, Activity } from "lucide-react";

export interface DashboardKpiItem {
  label: string;
  value: string | number;
  trend: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

interface DashboardKpiStripProps {
  studentCount?: number;
  teacherCount?: number;
  classCount?: number;
  items?: DashboardKpiItem[];
}

export default function DashboardKpiStrip({
  studentCount,
  teacherCount,
  classCount,
  items,
}: DashboardKpiStripProps): React.ReactElement {
  const defaultKpis: DashboardKpiItem[] = [
    {
      label: "Total Students",
      value: studentCount ? studentCount.toLocaleString() : "1,420",
      trend: "↑ 4.8% vs prev period",
      trendUp: true,
      icon: <GraduationCap size={16} className="text-blue-600" />,
      iconBg: "bg-blue-50 border-blue-100",
    },
    {
      label: "Active Faculty",
      value: teacherCount ? teacherCount.toLocaleString() : "58",
      trend: "↑ 100% on schedule",
      trendUp: true,
      icon: <Users size={16} className="text-emerald-600" />,
      iconBg: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Configured Classes",
      value: classCount ? classCount.toLocaleString() : "44",
      trend: "Active rosters",
      trendUp: true,
      icon: <BookOpen size={16} className="text-purple-600" />,
      iconBg: "bg-purple-50 border-purple-100",
    },
    {
      label: "Present Rate",
      value: "94.2%",
      trend: "↑ 2.4% vs last week",
      trendUp: true,
      icon: <CheckCircle2 size={16} className="text-teal-600" />,
      iconBg: "bg-teal-50 border-teal-100",
    },
    {
      label: "Biometric Passes",
      value: "1,338",
      trend: "99.1% facial match",
      trendUp: true,
      icon: <ShieldCheck size={16} className="text-sky-600" />,
      iconBg: "bg-sky-50 border-sky-100",
    },
    {
      label: "Engine Health",
      value: "99.98%",
      trend: "14ms avg latency",
      trendUp: true,
      icon: <Activity size={16} className="text-amber-600" />,
      iconBg: "bg-amber-50 border-amber-100",
    },
  ];

  const displayList = items && items.length > 0 ? items : defaultKpis;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {displayList.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-medium text-muted-foreground truncate">{kpi.label}</span>
            <div className={`p-1.5 rounded-lg border ${kpi.iconBg} shrink-0`}>
              {kpi.icon}
            </div>
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight text-foreground font-[Outfit]">{kpi.value}</p>
            <p className="text-[10px] font-medium text-muted-foreground mt-1 truncate">
              <span className={kpi.trendUp ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                {kpi.trend}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
