"use client";

import { useState, useRef } from "react";
import api, { getApiErrorMessage } from "@/lib/api";
import { ParsedBulkRecord, ImportStage, BatchProgressItem, BulkImportSummary } from "./bulk-types";

const BATCH_SIZE = 10;

export function useBulkImportProcessor(entityType: "students" | "teachers", onSuccess: () => void) {
  const [stage, setStage] = useState<ImportStage>("upload");
  const [records, setRecords] = useState<ParsedBulkRecord[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [sendInvite, setSendInvite] = useState<boolean>(true);
  const [batches, setBatches] = useState<BatchProgressItem[]>([]);
  const [currentBatchIdx, setCurrentBatchIdx] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [importedTotal, setImportedTotal] = useState<number>(0);
  const [failedTotal, setFailedTotal] = useState<number>(0);
  const [invitesTotal, setInvitesTotal] = useState<number>(0);
  const [summary, setSummary] = useState<BulkImportSummary | null>(null);
  const [isAborting, setIsAborting] = useState<boolean>(false);
  const abortRef = useRef<boolean>(false);

  const handleReset = (): void => {
    setStage("upload");
    setRecords([]);
    setFileName("");
    setBatches([]);
    setSummary(null);
    abortRef.current = false;
    setIsAborting(false);
  };

  const handleRecordsParsed = (parsed: ParsedBulkRecord[], name: string): void => {
    setRecords(parsed);
    setFileName(name);
    setStage("preview");
  };

  const handleRemoveRecord = (id: string): void => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    if (updated.length === 0) handleReset();
  };

  const buildBatches = (list: ParsedBulkRecord[]): BatchProgressItem[] => {
    const total = Math.ceil(list.length / BATCH_SIZE);
    return Array.from({ length: total }, (_, i) => ({
      batchNumber: i + 1,
      totalBatches: total,
      startIndex: i * BATCH_SIZE,
      endIndex: Math.min((i + 1) * BATCH_SIZE, list.length),
      status: "queued",
      importedCount: 0,
      failedCount: 0,
      invitationsSent: 0,
      errorMessages: [],
    }));
  };

  const executeBulkImport = async (): Promise<void> => {
    const initialBatches = buildBatches(records);
    setBatches(initialBatches);
    setStage("importing");
    abortRef.current = false;
    setIsAborting(false);

    let runningImported = 0;
    let runningFailed = 0;
    let runningInvites = 0;
    let runningProcessed = 0;
    const allCollectedErrors: string[] = [];
    const failedItems: ParsedBulkRecord[] = [];

    for (let i = 0; i < initialBatches.length; i++) {
      if (abortRef.current) break;
      setCurrentBatchIdx(i);
      const batchItem = initialBatches[i];
      const slice = records.slice(batchItem.startIndex, batchItem.endIndex);

      setBatches((prev) =>
        prev.map((b, idx) => (idx === i ? { ...b, status: "processing" } : b))
      );

      try {
        const isStudent = entityType === "students";
        const endpoint = isStudent ? "/admin/users/students/bulk" : "/admin/users/teachers/bulk";
        const payload = isStudent
          ? {
              students: slice.map((s) => ({
                email: s.email,
                enrollment_number: s.identifier,
                first_name: s.first_name,
                last_name: s.last_name,
              })),
              send_invite: sendInvite,
            }
          : {
              teachers: slice.map((t) => ({
                email: t.email,
                employee_id: t.identifier,
                first_name: t.first_name,
                last_name: t.last_name,
              })),
              send_invite: sendInvite,
            };

        const { data } = await api.post<{
          imported_count: number;
          failed_count: number;
          invitations_sent: number;
          errors: string[];
        }>(endpoint, payload);

        runningImported += data.imported_count || 0;
        runningFailed += data.failed_count || 0;
        runningInvites += data.invitations_sent || 0;
        runningProcessed += slice.length;

        if (data.errors && data.errors.length > 0) {
          allCollectedErrors.push(...data.errors);
          slice.forEach((s) => failedItems.push({ ...s, validationError: data.errors[0] }));
        }

        setBatches((prev) =>
          prev.map((b, idx) =>
            idx === i
              ? {
                  ...b,
                  status: data.failed_count > 0 ? "warning" : "success",
                  importedCount: data.imported_count || 0,
                  failedCount: data.failed_count || 0,
                  invitationsSent: data.invitations_sent || 0,
                  errorMessages: data.errors || [],
                }
              : b
          )
        );
      } catch (err: unknown) {
        const msg = getApiErrorMessage(err, `Batch ${i + 1} failed`);
        allCollectedErrors.push(msg);
        runningFailed += slice.length;
        runningProcessed += slice.length;
        slice.forEach((s) => failedItems.push({ ...s, validationError: msg }));

        setBatches((prev) =>
          prev.map((b, idx) => (idx === i ? { ...b, status: "failed", errorMessages: [msg] } : b))
        );
      }

      setProcessedCount(runningProcessed);
      setImportedTotal(runningImported);
      setFailedTotal(runningFailed);
      setInvitesTotal(runningInvites);
    }

    setSummary({
      totalProcessed: runningProcessed,
      totalImported: runningImported,
      totalFailed: runningFailed,
      totalInvited: runningInvites,
      allErrors: allCollectedErrors,
      failedRecords: failedItems,
    });
    setStage("completed");
    if (runningImported > 0) onSuccess();
  };

  const handleAbort = (): void => {
    abortRef.current = true;
    setIsAborting(true);
  };

  return {
    stage,
    records,
    fileName,
    sendInvite,
    batches,
    currentBatchIdx,
    processedCount,
    importedTotal,
    failedTotal,
    invitesTotal,
    summary,
    isAborting,
    setSendInvite,
    handleReset,
    handleRecordsParsed,
    handleRemoveRecord,
    executeBulkImport,
    handleAbort,
  };
}
