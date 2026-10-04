"use client";

import React from "react";
import { User, MapPin, Layers } from "lucide-react";
import type { ParsedTimeSlot, TimetableEntryDetail } from "@/types/timetable";

interface TimetableWeeklyGridProps {
  timeSlots: ParsedTimeSlot[];
  entries: TimetableEntryDetail[];
}

const DAYS = [
  { day: 1, name: "Monday", short: "Mon" },
  { day: 2, name: "Tuesday", short: "Tue" },
  { day: 3, name: "Wednesday", short: "Wed" },
  { day: 4, name: "Thursday", short: "Thu" },
  { day: 5, name: "Friday", short: "Fri" },
  { day: 6, name: "Saturday", short: "Sat" },
];

export default function TimetableWeeklyGrid({
  timeSlots,
  entries,
}: TimetableWeeklyGridProps): React.ReactElement {
  const sortedSlots = [...timeSlots].sort((a, b) => a.slot_number - b.slot_number);

  const getEntry = (day: number, slotNumber: number): TimetableEntryDetail | undefined => {
    return entries.find((e) => e.day_of_week === day && e.slot_number === slotNumber);
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="sticky left-0 z-10 w-28 bg-muted/80 p-3 font-semibold text-foreground backdrop-blur-xs">
              Day / Period
            </th>
            {sortedSlots.map((slot) => (
              <th
                key={slot.slot_number}
                className="min-w-[170px] p-3 font-semibold text-foreground border-l border-border"
              >
                <div className="flex items-center justify-between gap-1">
                  <span>{slot.name}</span>
                  {slot.is_break && (
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                      Break
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-normal text-muted-foreground mt-0.5">
                  {slot.start_time} – {slot.end_time}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {DAYS.map(({ day, name, short }) => (
            <tr key={day} className="hover:bg-muted/10 transition-colors">
              <td className="sticky left-0 z-10 bg-card/95 p-3 font-semibold text-foreground border-r border-border backdrop-blur-xs">
                <span className="hidden sm:inline">{name}</span>
                <span className="sm:hidden">{short}</span>
              </td>
              {sortedSlots.map((slot) => {
                if (slot.is_break) {
                  return (
                    <td
                      key={slot.slot_number}
                      className="border-l border-border bg-muted/20 p-2 text-center text-muted-foreground font-medium text-[11px]"
                    >
                      Break
                    </td>
                  );
                }

                const entry = getEntry(day, slot.slot_number);
                return (
                  <td
                    key={slot.slot_number}
                    className="border-l border-border p-2.5 align-top transition-colors"
                  >
                    {entry ? (
                      <div className="group rounded-lg border border-border bg-secondary/40 p-2.5 shadow-2xs hover:border-primary/50 hover:bg-secondary/70 transition-all space-y-1.5">
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-foreground text-[12px] leading-snug line-clamp-1">
                            {entry.subject_name}
                          </span>
                          <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-bold text-primary shrink-0">
                            {entry.subject_code}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <User size={12} className="shrink-0 text-muted-foreground" />
                          <span className="truncate">{entry.teacher_name}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          {entry.classroom_name && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin size={11} className="shrink-0 text-emerald-500" />
                              <span className="truncate">{entry.classroom_name}</span>
                            </div>
                          )}
                          {entry.batch_name && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-500 ml-auto">
                              <Layers size={10} />
                              {entry.batch_name}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border/50 text-[11px] text-muted-foreground/40 hover:border-border transition-colors">
                        —
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
