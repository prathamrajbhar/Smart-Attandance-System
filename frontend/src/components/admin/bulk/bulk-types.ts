export interface ParsedBulkRecord {
  id: string;
  email: string;
  identifier: string; // enrollment_number or employee_id
  first_name: string;
  last_name: string;
  isValid: boolean;
  validationError?: string;
}

export type ImportStage = "upload" | "preview" | "importing" | "completed";

export interface BatchProgressItem {
  batchNumber: number;
  totalBatches: number;
  startIndex: number;
  endIndex: number;
  status: "queued" | "processing" | "success" | "warning" | "failed";
  importedCount: number;
  failedCount: number;
  invitationsSent: number;
  errorMessages: string[];
}

export interface BulkImportSummary {
  totalProcessed: number;
  totalImported: number;
  totalFailed: number;
  totalInvited: number;
  allErrors: string[];
  failedRecords: ParsedBulkRecord[];
}
