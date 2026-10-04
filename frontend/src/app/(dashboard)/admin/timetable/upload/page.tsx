"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import api, { getApiErrorMessage } from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassSelect from "@/components/ui/GlassSelect";
import GlassButton from "@/components/ui/GlassButton";
import type { DepartmentResponse } from "@/types";
import type { StagedTimetableResponse } from "@/types/timetable";

export default function TimetableUploadPage(): React.ReactElement {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [cohortName, setCohortName] = useState<string>("");
  const [semester, setSemester] = useState<string>("3");
  const [academicYear, setAcademicYear] = useState<string>("2024-2028");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [analyzing, setAnalyzing] = useState<boolean>(false), [dragActive, setDragActive] = useState<boolean>(false);

  useEffect(() => {
    async function loadDepts() {
      try {
        const { data } = await api.get<DepartmentResponse[]>("/admin/departments");
        const list = Array.isArray(data) ? data : [];
        setDepartments(list);
        if (list.length > 0) setDepartmentId(list[0].id);
      } catch {
        toast.error("Could not load departments");
      }
    }
    void loadDepts();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please drop or select a timetable document first.");
      return;
    }

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (departmentId) formData.append("department_id", departmentId);
      if (cohortName) formData.append("cohort_name", cohortName);
      if (semester) formData.append("semester", semester);
      if (academicYear) formData.append("academic_year", academicYear);

      const { data } = await api.post<StagedTimetableResponse>(
        "/timetable/parse-document",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Store staged result in sessionStorage for resolution review
      sessionStorage.setItem("staged_timetable", JSON.stringify(data));
      toast.success("Document analyzed! Reviewing conflicts & mapping...");
      router.push("/admin/timetable/staging");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "AI document analysis failed"));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <GlassBreadcrumb
        items={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Timetable Hub", href: "/admin/timetable" },
          { label: "AI Document Upload" },
        ]}
      />

      <GlassPageHeader
        title="AI Timetable Ingestion"
        description="Drop your department's timetable PDF, Excel sheet, or image. Automated AI parsing will extract the matrix, verify room and faculty availability, and detect conflicts."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : file
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <input
            type="file"
            id="timetable-file"
            accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${file ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"}`}>
              {file ? <CheckCircle2 size={24} /> : <Upload size={24} />}
            </div>
            {file ? (
              <div>
                <p className="text-sm font-semibold text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Ready to analyze</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-foreground">Drop Timetable Document here or Click to Browse</p>
                <p className="text-xs text-muted-foreground mt-0.5">Supports PDF, Excel (.xlsx, .csv), and Images (PNG, JPG)</p>
              </div>
            )}
          </div>
        </div>

        <GlassCard padding="md" className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText size={14} className="text-primary" />
            <span>Target Cohort & Department (Optional Fallbacks)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassSelect
              label="Department"
              value={departmentId}
              onChange={(val) => setDepartmentId(val)}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
            />
            <GlassInput
              label="Cohort / Section (e.g. CSE-3A)"
              placeholder="Auto-detected if empty"
              value={cohortName}
              onChange={(e) => setCohortName(e.target.value)}
            />
            <GlassSelect
              label="Semester"
              value={semester}
              onChange={(val) => setSemester(val)}
              options={Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `Semester ${i + 1}` }))}
            />
            <GlassInput
              label="Academic Year"
              placeholder="e.g. 2024-2028"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            />
          </div>
        </GlassCard>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Cancel</span>
          </button>

          <GlassButton
            type="submit"
            variant="primary"
            disabled={!file || analyzing}
            className="gap-2 font-semibold shadow-sm min-w-[200px]"
          >
            <Sparkles size={16} className={analyzing ? "animate-spin" : "text-amber-300"} />
            <span>{analyzing ? "AI Parsing & Validating..." : "Analyze with AI Engine"}</span>
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
