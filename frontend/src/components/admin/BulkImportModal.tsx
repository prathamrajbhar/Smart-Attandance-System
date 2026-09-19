"use client";

import React from "react";
import { X, Users, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { useBulkImportProcessor } from "./bulk/useBulkImportProcessor";
import BulkImportDropzone from "./bulk/BulkImportDropzone";
import BulkImportPreviewTable from "./bulk/BulkImportPreviewTable";
import BulkImportProgress from "./bulk/BulkImportProgress";
import BulkImportResults from "./bulk/BulkImportResults";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "students" | "teachers";
  onSuccess: () => void;
}

export default function BulkImportModal({
  isOpen,
  onClose,
  entityType,
  onSuccess,
}: BulkImportModalProps): React.ReactElement | null {
  const {
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
  } = useBulkImportProcessor(entityType, onSuccess);

  if (!isOpen) return null;

  const handleClose = (): void => {
    if (stage === "completed" && importedTotal > 0) onSuccess();
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={stage !== "importing" ? handleClose : undefined} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl p-6 z-10 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {entityType === "students" ? <GraduationCap size={18} /> : <Users size={18} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-[Outfit]">
                Bulk Ingest {entityType === "students" ? "Students" : "Faculty"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {fileName ? `File: ${fileName}` : "Upload institution roster for 10-batch ingestion & email invites"}
              </p>
            </div>
          </div>
          {stage !== "importing" && (
            <button onClick={handleClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Stage 1: Upload & Parse */}
        {stage === "upload" && (
          <BulkImportDropzone
            entityType={entityType}
            onRecordsParsed={handleRecordsParsed}
            onError={(m) => toast.error(m)}
          />
        )}

        {/* Stage 2: Preview & Options */}
        {stage === "preview" && (
          <>
            <BulkImportPreviewTable
              records={records}
              entityType={entityType}
              sendInvite={sendInvite}
              onSendInviteChange={setSendInvite}
              onRemoveRecord={handleRemoveRecord}
              onReset={handleReset}
            />
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-secondary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeBulkImport}
                disabled={records.length === 0}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
              >
                Commit Import ({records.length} records in {Math.ceil(records.length / 10)} batches)
              </button>
            </div>
          </>
        )}

        {/* Stage 3: Batch Progress */}
        {stage === "importing" && (
          <BulkImportProgress
            batches={batches}
            currentBatchIndex={currentBatchIdx}
            totalRecords={records.length}
            processedRecords={processedCount}
            importedCount={importedTotal}
            failedCount={failedTotal}
            invitationsSent={invitesTotal}
            onAbort={handleAbort}
            isAborting={isAborting}
          />
        )}

        {/* Stage 4: Results & Resolution */}
        {stage === "completed" && summary && (
          <BulkImportResults
            summary={summary}
            entityType={entityType}
            onClose={handleClose}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
