"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Activity, BookOpen, Cpu, ArrowUpRight } from "lucide-react";

export default function AdminQuickActions(): React.ReactElement {
  const quickActions = [
    {
      label: "Configure Verifications",
      href: "/admin/setup/verification-settings",
      detail: "Toggle biometric & BLE thresholds",
      icon: <ShieldCheck size={16} className="text-slate-900" />,
    },
    {
      label: "Audit Activity Log",
      href: "/admin/audit",
      detail: "Inspect security transactions",
      icon: <Activity size={16} className="text-slate-900" />,
    },
    {
      label: "Configure Classes",
      href: "/admin/classes",
      detail: "Manage schedules & rosters",
      icon: <BookOpen size={16} className="text-slate-900" />,
    },
    {
      label: "Execute AI Scanner",
      href: "/admin/scanner",
      detail: "Scan absentee anomalies",
      icon: <Cpu size={16} className="text-slate-900" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {quickActions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex flex-col gap-2.5 p-4 rounded-xl border border-border bg-card hover:border-slate-300 hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-secondary text-primary">
              {action.icon}
            </div>
            <ArrowUpRight
              size={14}
              className="text-muted-foreground opacity-60 group-hover:text-foreground group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </div>
          <div>
            <span className="font-semibold text-xs text-foreground">{action.label}</span>
            <p className="text-[11px] text-muted-foreground mt-0.5">{action.detail}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
