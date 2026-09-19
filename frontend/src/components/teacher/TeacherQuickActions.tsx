"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Radio, ClipboardCheck, Clock, ArrowUpRight } from "lucide-react";

export default function TeacherQuickActions(): React.ReactElement {
  const actions = [
    {
      label: "My Classes",
      href: "/teacher/classes",
      detail: "Manage rosters & geofences",
      icon: <BookOpen size={16} className="text-slate-900" />,
    },
    {
      label: "Broadcast Session",
      href: "/teacher/sessions",
      detail: "Launch attendance broadcast",
      icon: <Radio size={16} className="text-slate-900" />,
    },
    {
      label: "Review Queue",
      href: "/teacher/review",
      detail: "Resolve verification flags",
      icon: <ClipboardCheck size={16} className="text-slate-900" />,
    },
    {
      label: "Attendance History",
      href: "/teacher/history",
      detail: "Archive logs & reports",
      icon: <Clock size={16} className="text-slate-900" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {actions.map((action) => (
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
