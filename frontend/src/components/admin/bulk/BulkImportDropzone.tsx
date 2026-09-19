"use client";

import React, { useRef } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { ParsedBulkRecord } from "./bulk-types";

interface BulkImportDropzoneProps {
  entityType: "students" | "teachers";
  onRecordsParsed: (records: ParsedBulkRecord[], fileName: string) => void;
  onError: (msg: string) => void;
}

export default function BulkImportDropzone({
  entityType,
  onRecordsParsed,
  onError,
}: BulkImportDropzoneProps): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCsvContent = (content: string, fileName: string): void => {
    const rawLines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (rawLines.length < 2) {
      onError("The CSV file must contain a header row and at least 1 record row.");
      return;
    }

    const records: ParsedBulkRecord[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (let i = 1; i < rawLines.length; i++) {
      const parts = rawLines[i].split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length < 4) continue;

      const email = parts[0] || "";
      const identifier = parts[1] || "";
      const firstName = parts[2] || "";
      const lastName = parts[3] || "";

      const isValidEmail = emailRegex.test(email);
      const hasIdentifier = identifier.length >= 3;
      const isValid = isValidEmail && hasIdentifier && firstName.length > 0;

      let validationError: string | undefined;
      if (!isValidEmail) validationError = "Invalid email format";
      else if (!hasIdentifier) validationError = "Identifier too short (min 3 chars)";
      else if (!firstName) validationError = "First name is required";

      records.push({
        id: `row-${i}-${Date.now()}`,
        email,
        identifier,
        first_name: firstName,
        last_name: lastName,
        isValid,
        validationError,
      });
    }

    if (records.length === 0) {
      onError("No valid records found in the uploaded file. Check headers and column format.");
      return;
    }

    onRecordsParsed(records, fileName);
  };

  const handleFile = (file: File): void => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      onError("Please upload a valid .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result || "");
      parseCsvContent(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = (): void => {
    const isStudent = entityType === "students";
    const header = isStudent
      ? "email,enrollment_number,first_name,last_name\n" +
        "alex.carter@university.edu,STU-2026-001,Alex,Carter\n" +
        "brooke.hayes@university.edu,STU-2026-002,Brooke,Hayes\n" +
        "connor.reed@university.edu,STU-2026-003,Connor,Reed"
      : "email,employee_id,first_name,last_name\n" +
        "alan.turing@university.edu,FAC-2026-001,Alan,Turing\n" +
        "ada.lovelace@university.edu,FAC-2026-002,Ada,Lovelace\n" +
        "grace.hopper@university.edu,FAC-2026-003,Grace,Hopper";

    const blob = new Blob([header], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sample-${entityType}-import.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <FileSpreadsheet size={14} className="text-primary" /> Supported format: UTF-8 CSV
        </span>
        <button
          type="button"
          onClick={handleDownloadSample}
          className="text-primary hover:text-primary/80 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
        >
          <Download size={13} /> Download Sample Template
        </button>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) handleFile(dropped);
        }}
        className="group border-2 border-dashed border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary group-hover:scale-105 transition-transform">
          <Upload size={20} />
        </div>
        <p className="text-sm font-semibold text-foreground">Click to select or drag and drop CSV</p>
        <p className="text-xs text-muted-foreground mt-1">
          Required columns: <code className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[11px]">email</code>,{" "}
          <code className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[11px]">
            {entityType === "students" ? "enrollment_number" : "employee_id"}
          </code>, <code className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[11px]">first_name</code>,{" "}
          <code className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[11px]">last_name</code>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
          className="hidden"
        />
      </div>

      <div className="flex items-start gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50 text-[11px] text-muted-foreground">
        <AlertCircle size={14} className="text-muted-foreground shrink-0 mt-0.5" />
        <span>
          Records are processed in automatic sequential batches of <strong>10</strong> with real-time verification and optional onboarding invitations.
        </span>
      </div>
    </div>
  );
}
