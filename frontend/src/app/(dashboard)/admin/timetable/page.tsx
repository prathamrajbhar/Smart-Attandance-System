"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Calendar, Upload, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import api, { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassSelect from "@/components/ui/GlassSelect";
import GlassButton from "@/components/ui/GlassButton";
import GlassLoader from "@/components/ui/GlassLoader";
import TimetableWeeklyGrid from "@/components/timetable/TimetableWeeklyGrid";
import type { TimetableMatrixResponse } from "@/types/timetable";

interface CohortSummary {
  id: string;
  name: string;
  department_name: string;
  semester: number;
  academic_year: string;
  student_count: number;
}

export default function AdminTimetablePage(): React.ReactElement {
  const [cohorts, setCohorts] = useState<CohortSummary[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<string>("");
  const [matrix, setMatrix] = useState<TimetableMatrixResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMatrix, setLoadingMatrix] = useState<boolean>(false);

  const fetchCohorts = useCallback(async (): Promise<void> => {
    try {
      const { data } = await api.get<CohortSummary[]>("/timetable/cohorts");
      setCohorts(data);
      if (data.length > 0) {
        setSelectedCohortId((prev) => (prev ? prev : data[0].id));
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load academic cohorts"));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMatrix = useCallback(async (cohortId: string): Promise<void> => {
    if (!cohortId) return;
    setLoadingMatrix(true);
    try {
      const { data } = await api.get<TimetableMatrixResponse>(`/timetable/cohort/${cohortId}`);
      setMatrix(data);
    } catch {
      setMatrix(null);
    } finally {
      setLoadingMatrix(false);
    }
  }, []);

  useEffect(() => {
    void fetchCohorts();
  }, [fetchCohorts]);

  useEffect(() => {
    if (selectedCohortId) {
      void fetchMatrix(selectedCohortId);
    }
  }, [selectedCohortId, fetchMatrix]);

  if (loading) return <GlassLoader text="Loading timetable hub..." />;

  const cohortOptions = cohorts.map((c) => ({
    value: c.id,
    label: `${c.name} — ${c.department_name} (Sem ${c.semester})`,
  }));

  const totalClasses = matrix ? matrix.entries.length : 0;
  const uniqueTeachers = matrix ? new Set(matrix.entries.map((e) => e.teacher_id)).size : 0;
  const uniqueSubjects = matrix ? new Set(matrix.entries.map((e) => e.subject_code)).size : 0;

  return (
    <div className="space-y-6">
      <GlassBreadcrumb
        items={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Timetable Hub" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <GlassPageHeader
          title="Master Timetable Hub"
          description="Institutional scheduling, automated period tracking, and AI document ingestion"
        />
        <div className="flex items-center gap-2">
          <Link href="/admin/timetable/upload">
            <GlassButton variant="primary" className="gap-2 shadow-sm font-semibold">
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
              <span>AI Document Ingestion</span>
            </GlassButton>
          </Link>
        </div>
      </div>

      {cohorts.length === 0 ? (
        <GlassCard padding="lg" className="text-center py-12 space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Calendar size={24} />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-foreground">No Timetables Published Yet</h3>
            <p className="text-xs text-muted-foreground">
              Drop your existing timetable PDF, Excel spreadsheet, or schedule image to automatically extract and publish the weekly schedule using AI Document Engine.
            </p>
          </div>
          <Link href="/admin/timetable/upload">
            <GlassButton variant="primary" className="gap-2 mt-2">
              <Upload size={14} />
              <span>Upload First Timetable</span>
            </GlassButton>
          </Link>
        </GlassCard>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2">
              <GlassSelect
                label="Select Cohort / Division"
                options={cohortOptions}
                value={selectedCohortId}
                onChange={(val) => setSelectedCohortId(val)}
              />
            </div>

            {/* Quick Metrics */}
            <div className="md:col-span-2 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border bg-card p-2.5 text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Periods / Wk</span>
                <span className="text-lg font-bold text-foreground">{totalClasses}</span>
              </div>
              <div className="rounded-lg border border-border bg-card p-2.5 text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Faculty</span>
                <span className="text-lg font-bold text-foreground">{uniqueTeachers}</span>
              </div>
              <div className="rounded-lg border border-border bg-card p-2.5 text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Subjects</span>
                <span className="text-lg font-bold text-foreground">{uniqueSubjects}</span>
              </div>
            </div>
          </div>

          {/* Timetable Grid View */}
          {loadingMatrix ? (
            <GlassLoader text="Loading cohort matrix..." />
          ) : matrix ? (
            <TimetableWeeklyGrid
              timeSlots={matrix.time_slots}
              entries={matrix.entries}
            />
          ) : (
            <GlassCard padding="md" className="text-center py-8 text-xs text-muted-foreground">
              No entries scheduled for this cohort yet.
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
