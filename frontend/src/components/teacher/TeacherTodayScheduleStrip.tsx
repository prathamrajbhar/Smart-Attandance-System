"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Play, MapPin, Radio, Layers } from "lucide-react";
import toast from "react-hot-toast";

import api, { getApiErrorMessage } from "@/lib/api";
import GlassButton from "@/components/ui/GlassButton";
import type { TeacherTodayScheduleItem } from "@/types/timetable";

interface Props {
  schedule: TeacherTodayScheduleItem[];
  onSessionStarted?: () => void;
}

export default function TeacherTodayScheduleStrip({
  schedule,
  onSessionStarted,
}: Props): React.ReactElement {
  const [startingEntryId, setStartingEntryId] = useState<string | null>(null);

  if (schedule.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <span>No teaching periods scheduled on the timetable for today.</span>
        </div>
        <Link href="/teacher/classes" className="text-primary hover:underline font-semibold">
          View All Classes →
        </Link>
      </div>
    );
  }

  const liveItem = schedule.find((s) => s.is_live_now);

  const handleStartQuickSession = async (item: TeacherTodayScheduleItem) => {
    setStartingEntryId(item.entry_id);
    try {
      const { data: myClasses } = await api.get<Array<{ id: string; name: string }>>("/teacher/my-classes");
      const matched = myClasses.find((c) => c.name.toLowerCase().includes(item.subject_code.toLowerCase())) || myClasses[0];

      if (!matched) {
        toast.error("No linked academic class found to broadcast.");
        return;
      }

      await api.post("/teacher/sessions/start", {
        academic_class_id: matched.id,
        duration_minutes: 50,
      });

      toast.success(`Attendance session started for ${item.subject_name}!`);
      if (onSessionStarted) onSessionStarted();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to start quick session"));
    } finally {
      setStartingEntryId(null);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-[Outfit]">
            Today&apos;s Teaching Timetable
          </h3>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {schedule.length} Period{schedule.length > 1 ? "s" : ""} Today
        </span>
      </div>

      {liveItem && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE RIGHT NOW • {liveItem.start_time} – {liveItem.end_time}</span>
            </div>
            <h4 className="text-base font-bold text-foreground font-[Outfit]">
              {liveItem.subject_name} ({liveItem.subject_code})
            </h4>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} className="text-emerald-500" />
                {liveItem.classroom_name}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Layers size={12} className="text-primary" />
                Cohort: {liveItem.cohort_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {liveItem.active_session_id ? (
              <Link href={`/teacher/sessions/${liveItem.active_session_id}`}>
                <GlassButton variant="primary" className="gap-1.5 font-semibold text-xs shadow-xs">
                  <Radio size={14} className="text-emerald-300 animate-pulse" />
                  <span>View Live Attendance</span>
                </GlassButton>
              </Link>
            ) : (
              <GlassButton
                variant="primary"
                disabled={startingEntryId === liveItem.entry_id}
                onClick={() => handleStartQuickSession(liveItem)}
                className="gap-1.5 font-semibold text-xs shadow-xs bg-emerald-600 hover:bg-emerald-500"
              >
                <Play size={13} fill="currentColor" />
                <span>{startingEntryId === liveItem.entry_id ? "Starting..." : "Start Attendance (1-Tap)"}</span>
              </GlassButton>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {schedule.map((item) => (
          <div
            key={item.entry_id}
            className={`rounded-lg border p-3 text-xs transition-all space-y-1.5 ${
              item.is_live_now
                ? "border-emerald-500/50 bg-emerald-500/5"
                : item.is_past
                ? "border-border/50 bg-muted/20 opacity-70"
                : "border-border bg-secondary/30 hover:border-border"
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-muted-foreground">{item.period_name}</span>
              <span className="text-[10px] text-muted-foreground">{item.start_time}–{item.end_time}</span>
            </div>
            <div className="font-semibold text-foreground truncate">
              {item.subject_name}
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
              <span>{item.classroom_name}</span>
              <span className="rounded bg-muted px-1.5 py-0.2">{item.cohort_name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
