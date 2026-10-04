"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, ArrowLeft, Send } from "lucide-react";
import toast from "react-hot-toast";

import api, { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import GlassLoader from "@/components/ui/GlassLoader";
import StagingCellCard from "@/components/timetable/StagingCellCard";
import type { StagedTimetableResponse, StagedCell, CommitTimetableRequest } from "@/types/timetable";

const DAYS = [
  { day: 1, name: "Monday" },
  { day: 2, name: "Tuesday" },
  { day: 3, name: "Wednesday" },
  { day: 4, name: "Thursday" },
  { day: 5, name: "Friday" },
  { day: 6, name: "Saturday" },
];

export default function TimetableStagingPage(): React.ReactElement {
  const router = useRouter();
  const [data, setData] = useState<StagedTimetableResponse | null>(null);
  const [publishing, setPublishing] = useState<boolean>(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("staged_timetable");
    if (!raw) {
      toast.error("No staged timetable found. Please upload a document first.");
      router.replace("/admin/timetable/upload");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.replace("/admin/timetable/upload");
    }
  }, [router]);

  if (!data) return <GlassLoader text="Loading staged timetable..." />;

  const handleUpdateCell = (index: number, updated: StagedCell) => {
    setData((prev) => {
      if (!prev) return prev;
      const nextCells = [...prev.staged_cells];
      nextCells[index] = updated;
      return { ...prev, staged_cells: nextCells };
    });
  };

  const handlePublish = async () => {
    if (!data.department_id) {
      toast.error("Department is required before publishing.");
      return;
    }

    // Verify all required cells have mapped IDs
    const unmapped = data.staged_cells.some(
      (c) => !c.subject_match.matched_id || !c.teacher_match.matched_id
    );
    if (unmapped) {
      toast.error("Please assign a valid Subject and Faculty to all cells before publishing.");
      return;
    }

    setPublishing(true);
    try {
      const payload: CommitTimetableRequest = {
        cohort_name: data.cohort_name,
        department_id: data.department_id,
        semester: data.semester,
        academic_year: data.academic_year,
        time_slots: data.time_slots,
        document_url: data.document_url,
        document_key: data.document_key,
        entries: data.staged_cells.map((c) => ({
          day_of_week: c.day_of_week,
          slot_number: c.slot_number,
          subject_id: c.subject_match.matched_id as string,
          teacher_id: c.teacher_match.matched_id as string,
          classroom_id: c.classroom_match.matched_id,
          batch_name: c.batch_raw,
        })),
      };

      await api.post("/timetable/commit", payload);
      sessionStorage.removeItem("staged_timetable");
      toast.success("Timetable successfully published to live system!");
      router.push("/admin/timetable");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to publish timetable"));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassBreadcrumb
        items={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Timetable Hub", href: "/admin/timetable" },
          { label: "Staging Review" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <GlassPageHeader
          title={`Review Staged Timetable: ${data.cohort_name}`}
          description={`Semester ${data.semester} • ${data.academic_year} • AI Parsing Confidence: ${Math.round(data.confidence_score * 100)}%`}
        />
        <div className="flex items-center gap-2">
          <GlassButton variant="secondary" onClick={() => router.push("/admin/timetable/upload")}>
            <ArrowLeft size={14} className="mr-1" /> Back
          </GlassButton>
          <GlassButton
            variant="primary"
            disabled={publishing}
            onClick={handlePublish}
            className="gap-1.5 font-semibold shadow-xs"
          >
            <Send size={14} />
            <span>{publishing ? "Publishing..." : "Publish to Live System"}</span>
          </GlassButton>
        </div>
      </div>

      {/* QA Status Banner */}
      {data.has_clashes ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
            <AlertTriangle size={16} />
            <span>Constraint Conflicts Detected ({data.clashes.length})</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Our QA engine detected scheduling overlaps. Review the highlighted entries below and select an alternate room or faculty to resolve.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">All Constraints Validated & Conflict-Free</p>
            <p className="text-muted-foreground">Zero faculty overlaps and zero room clashes found across this institution.</p>
          </div>
        </div>
      )}

      {/* Days Tabs / Sections */}
      <div className="space-y-6">
        {DAYS.map(({ day, name }) => {
          const dayCells = data.staged_cells
            .map((cell, idx) => ({ cell, idx }))
            .filter(({ cell }) => cell.day_of_week === day);

          if (dayCells.length === 0) return null;

          return (
            <GlassCard key={day} padding="md" className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                {name} ({dayCells.length} Lectures)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dayCells.map(({ cell, idx }) => (
                  <StagingCellCard
                    key={`${cell.day_of_week}-${cell.slot_number}-${idx}`}
                    cell={cell}
                    allTeachers={data.all_teachers}
                    allSubjects={data.all_subjects}
                    allClassrooms={data.all_classrooms}
                    onUpdate={(updated) => handleUpdateCell(idx, updated)}
                  />
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
