import { ParsedBulkRecord, BatchProgressItem, BulkImportEntityType } from "./bulk-types";

export const BULK_BATCH_SIZE = 10;

export function buildBatches(list: ParsedBulkRecord[], batchSize = BULK_BATCH_SIZE): BatchProgressItem[] {
  const total = Math.ceil(list.length / batchSize);
  return Array.from({ length: total }, (_, i) => ({
    batchNumber: i + 1,
    totalBatches: total,
    startIndex: i * batchSize,
    endIndex: Math.min((i + 1) * batchSize, list.length),
    status: "queued",
    importedCount: 0,
    failedCount: 0,
    invitationsSent: 0,
    errorMessages: [],
  }));
}

export function buildBulkPayload(
  entityType: BulkImportEntityType,
  slice: ParsedBulkRecord[],
  sendInvite: boolean
): { endpoint: string; payload: Record<string, unknown> } {
  if (entityType === "students") {
    return {
      endpoint: "/admin/users/students/bulk",
      payload: {
        students: slice.map((s) => ({
          email: s.email,
          enrollment_number: s.identifier,
          first_name: s.first_name,
          last_name: s.last_name,
        })),
        send_invite: sendInvite,
      },
    };
  }

  if (entityType === "teachers") {
    return {
      endpoint: "/admin/users/teachers/bulk",
      payload: {
        teachers: slice.map((t) => ({
          email: t.email,
          employee_id: t.identifier,
          first_name: t.first_name,
          last_name: t.last_name,
        })),
        send_invite: sendInvite,
      },
    };
  }

  return {
    endpoint: "/admin/classes/bulk",
    payload: {
      classes: slice.map((c) => ({
        name: c.first_name,
        subject_code: c.identifier,
        teacher_email: c.email,
        classroom_name: c.last_name || undefined,
        semester: c.semester,
        batch: c.batch,
        max_students: c.max_students,
      })),
    },
  };
}
