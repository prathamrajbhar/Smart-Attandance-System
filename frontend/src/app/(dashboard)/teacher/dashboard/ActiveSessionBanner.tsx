"use client";

import React from "react";
import Link from "next/link";
import { Radio, Eye } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";
import type { SessionWithClassResponse } from "@/types";

interface ActiveSessionBannerProps {
  session: SessionWithClassResponse;
}

export default function ActiveSessionBanner({ session }: ActiveSessionBannerProps): React.ReactElement {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Radio size={20} className="animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-1.5 py-0.5 rounded">
              Broadcast Active
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Started {new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <h3 className="text-base font-bold text-foreground mt-1 font-[Outfit]">{session.class_name}</h3>
          <p className="text-xs text-muted-foreground">{session.subject || "Attendance Beacon in Progress"}</p>
        </div>
      </div>
      <Link href={`/teacher/sessions/${session.id}`} className="shrink-0">
        <GlassButton variant="primary" size="sm" icon={<Eye size={14} />}>
          Monitor Live Roster
        </GlassButton>
      </Link>
    </div>
  );
}
