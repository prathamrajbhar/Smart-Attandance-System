"use client";

import React, { useState } from "react";
import { 
  ScanSearch, AlertTriangle, ShieldAlert, Sparkles, Search, BarChart4 
} from "lucide-react";
import api, { getApiErrorMessage } from "@/lib/api";
import toast from "react-hot-toast";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassEmptyState from "@/components/ui/GlassEmptyState";
import ScannerControls from "./ScannerControls";
import AnomalyCard from "./AnomalyCard";
import type { AnomalyResult } from "@/types";

export default function ScannerPage(): React.ReactElement {
  const [contamination, setContamination] = useState<number>(0.10);
  const [results, setResults] = useState<AnomalyResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  async function runScan(): Promise<void> {
    setLoading(true);
    try {
      const { data } = await api.post<AnomalyResult[]>(`/admin/scan-absentees?contamination=${contamination}`);
      setResults(data);
      setHasRun(true);
      if (data.length === 0) {
        toast.success("No anomalies detected");
      } else {
        toast("Scan complete — anomalies flagged", { icon: "⚠️" });
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Scan failed"));
    } finally {
      setLoading(false);
    }
  }

  const filteredResults = results.filter((r) => {
    const name = (r.student_name || "").toLowerCase();
    const enroll = (r.enrollment_number || "").toLowerCase();
    const id = r.student_id.toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || enroll.includes(term) || id.includes(term);
  });

  const avgScore = results.length > 0
    ? results.reduce((acc, curr) => acc + (curr.anomaly_score || 0), 0) / results.length
    : 0;

  const maxScore = results.length > 0
    ? Math.max(...results.map((r) => r.anomaly_score || 0))
    : 0;

  return (
    <div className="space-y-6">
      <GlassBreadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "AI Scanner" }]} />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <GlassPageHeader 
          title="AI Absentee Pattern Scanner" 
          description="Detect subtle attendance skipping anomalies using an Isolation Forest ML model." 
        />
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800">
          <Sparkles size={13} />
          <span>Machine Learning Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <ScannerControls
            contamination={contamination}
            onContaminationChange={setContamination}
            onRunScan={runScan}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-8 flex flex-col gap-5">
          {loading && (
            <GlassCard className="flex flex-col items-center justify-center py-20 text-center bg-card">
              <div className="w-12 h-12 rounded-full border-3 border-secondary border-t-primary animate-spin mb-4" />
              <h4 className="text-base font-semibold text-foreground mb-1">Evaluating Isolation Forest Trees</h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                Analyzing structural path lengths and computing student anomaly scores...
              </p>
            </GlassCard>
          )}

          {!loading && !hasRun && (
            <GlassCard className="flex flex-col items-center justify-center py-24 text-center bg-card">
              <div className="p-3.5 bg-secondary text-primary rounded-xl mb-3">
                <ScanSearch size={32} />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">System Awaiting Analysis</h4>
              <p className="text-xs text-muted-foreground max-w-md">
                Adjust the contamination factor and trigger &quot;Run AI Anomaly Scan&quot; to inspect absentee distributions.
              </p>
            </GlassCard>
          )}

          {!loading && hasRun && results.length === 0 && (
            <GlassEmptyState 
              title="No Anomalies Flagged" 
              message="The ML engine analyzed all student records and found zero anomalous absentee patterns." 
            />
          )}

          {!loading && hasRun && results.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Flagged Students</p>
                    <h5 className="text-xl font-bold text-foreground mt-0.5">{results.length}</h5>
                  </div>
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <ShieldAlert size={18} />
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Avg Anomaly Score</p>
                    <h5 className="text-xl font-bold text-foreground mt-0.5">{avgScore.toFixed(3)}</h5>
                  </div>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <BarChart4 size={18} />
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Max Anomaly Score</p>
                    <h5 className="text-xl font-bold text-foreground mt-0.5">{maxScore.toFixed(3)}</h5>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Sparkles size={18} />
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input 
                  type="text" 
                  placeholder="Filter flagged students by name, enrollment, or ID..." 
                  value={searchTerm} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-xs shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredResults.map((r, i) => (
                  <AnomalyCard key={i} result={r} />
                ))}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-10 rounded-xl border border-border bg-card">
                  <AlertTriangle className="mx-auto text-muted-foreground mb-1.5" size={20} />
                  <p className="text-xs text-muted-foreground">No students match your filter criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
