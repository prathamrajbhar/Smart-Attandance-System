"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";
import api, { getApiErrorMessage } from "@/lib/api";
import toast from "react-hot-toast";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "students" | "teachers";
  onSuccess: () => void;
}

interface ParsedRecord {
  email: string;
  first_name: string;
  last_name: string;
  identifier: string; // enrollment_number or employee_id
}

export default function BulkImportModal({
  isOpen,
  onClose,
  entityType,
  onSuccess,
}: BulkImportModalProps): React.ReactElement | null {
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setErrors([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || "");
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        setErrors(["CSV file must contain a header and at least one data row."]);
        return;
      }
      const header = lines[0].split(",").map(c => c.trim().toLowerCase());
      const records: ParsedRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map(c => c.trim());
        if (parts.length >= 4) {
          records.push({
            email: parts[0],
            identifier: parts[1],
            first_name: parts[2],
            last_name: parts[3],
          });
        }
      }
      setParsed(records);
    };
    reader.readAsText(f);
  };

  const handleDownloadSample = () => {
    const header = entityType === "students" 
      ? "email,enrollment_number,first_name,last_name\nstudent1@university.edu,STU-2026-001,John,Doe\nstudent2@university.edu,STU-2026-002,Jane,Smith"
      : "email,employee_id,first_name,last_name\nteacher1@university.edu,EMP-2026-001,Alan,Turing\nteacher2@university.edu,EMP-2026-002,Ada,Lovelace";
    const blob = new Blob([header], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sample-${entityType}-import.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (parsed.length === 0) {
      toast.error("Please select a valid CSV file with records.");
      return;
    }
    setUploading(true);
    setErrors([]);
    try {
      if (entityType === "students") {
        const payload = {
          students: parsed.map(p => ({
            email: p.email,
            enrollment_number: p.identifier,
            first_name: p.first_name,
            last_name: p.last_name,
          })),
        };
        const { data } = await api.post<{ imported_count: number; failed_count: number; errors: string[] }>(
          "/admin/users/students/bulk",
          payload
        );
        if (data.errors && data.errors.length > 0) setErrors(data.errors);
        toast.success(`Successfully imported ${data.imported_count} students.`);
        if (data.imported_count > 0) onSuccess();
        if (data.failed_count === 0) onClose();
      } else {
        const payload = {
          teachers: parsed.map(p => ({
            email: p.email,
            employee_id: p.identifier,
            first_name: p.first_name,
            last_name: p.last_name,
            department_id: "",
            designation_id: "",
          })),
        };
        const { data } = await api.post<{ imported_count: number; failed_count: number; errors: string[] }>(
          "/admin/users/teachers/bulk",
          payload
        );
        if (data.errors && data.errors.length > 0) setErrors(data.errors);
        toast.success(`Successfully imported ${data.imported_count} faculty.`);
        if (data.imported_count > 0) onSuccess();
        if (data.failed_count === 0) onClose();
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Bulk import failed"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl p-6 z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground font-[Outfit]">
              Bulk Import {entityType === "students" ? "Students" : "Faculty"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Upload a CSV file to batch enroll institutional accounts.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Supported format: .csv (UTF-8)</span>
          <button onClick={handleDownloadSample} className="text-primary hover:underline flex items-center gap-1 font-medium">
            <Download size={12} /> Download Sample CSV
          </button>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-slate-300 rounded-xl p-6 text-center cursor-pointer bg-secondary/20 hover:bg-secondary/40 transition-colors"
        >
          <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-xs font-semibold text-foreground">Click to browse or drop CSV file</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {file ? `Selected: ${file.name} (${parsed.length} rows parsed)` : "Must include: email, identifier, first_name, last_name"}
          </p>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        </div>

        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs space-y-1 max-h-32 overflow-y-auto">
            <div className="flex items-center gap-1.5 font-bold"><AlertCircle size={13} /> Import Discrepancies:</div>
            {errors.map((e, idx) => <p key={idx} className="text-[11px] font-mono">{e}</p>)}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || parsed.length === 0}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-2xs"
          >
            {uploading ? "Ingesting..." : `Import ${parsed.length > 0 ? `(${parsed.length} records)` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
