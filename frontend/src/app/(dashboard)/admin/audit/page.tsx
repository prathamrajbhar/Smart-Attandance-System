"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import GlassBreadcrumb from "@/components/ui/GlassBreadcrumb";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassTable, { type TableColumn } from "@/components/ui/GlassTable";
import EnterpriseTableToolbar from "@/components/ui/EnterpriseTableToolbar";
import EnterprisePagination from "@/components/ui/EnterprisePagination";
import GlassBadge from "@/components/ui/GlassBadge";
import { useTableQuery } from "@/hooks/useTableQuery";
import type { AuditLogResponse } from "@/types";
import type { BadgeVariant } from "@/components/ui/GlassBadge";

const SEVERITY_VARIANT: Record<string, BadgeVariant> = {
  HIGH: "danger",
  CRITICAL: "danger",
  MEDIUM: "warning",
  LOW: "info",
};

export default function AuditPage(): React.ReactElement {
  const [exporting, setExporting] = useState(false);

  const {
    data: logs,
    totalItems,
    loading,
    searchQuery,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    filterValue,
    setSearchQuery,
    setCurrentPage,
    setPageSize,
    handleSort,
    setFilterValue,
  } = useTableQuery<AuditLogResponse>({
    endpoint: "/admin/audit",
    defaultPageSize: 15,
    defaultSortBy: "timestamp",
    defaultSortOrder: "desc",
  });

  const handleExportCSV = async (): Promise<void> => {
    try {
      setExporting(true);
      const res = await api.get("/admin/audit/export", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `system-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Audit log CSV exported successfully");
    } catch {
      toast.error("Failed to export audit log");
    } finally {
      setExporting(false);
    }
  };

  const columns: TableColumn<AuditLogResponse & Record<string, unknown>>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (r) => (
        <span className="text-xs font-mono text-muted-foreground">
          {new Date(String(r.timestamp)).toLocaleString()}
        </span>
      ),
    },
    { key: "eventType", header: "Event Type", sortable: true },
    {
      key: "severity",
      header: "Severity",
      render: (r) => (
        <GlassBadge variant={SEVERITY_VARIANT[String(r.severity)] ?? "info"}>
          {String(r.severity)}
        </GlassBadge>
      ),
    },
    { key: "actor", header: "Actor" },
    { key: "target", header: "Target" },
    {
      key: "description",
      header: "Description",
      render: (r) => (
        <span className="text-xs text-foreground max-w-xs truncate block">
          {String(r.description)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <GlassBreadcrumb items={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Audit Log" }]} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <GlassPageHeader title="System Audit Trail" description={`${totalItems} immutable events recorded`} />
        <button
          onClick={() => void handleExportCSV()}
          disabled={exporting}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary hover:text-foreground transition-all shadow-xs disabled:opacity-50"
        >
          <Download size={13} className={exporting ? "animate-bounce text-primary" : "text-muted-foreground"} />
          <span>{exporting ? "Exporting CSV..." : "Export Audit CSV"}</span>
        </button>
      </div>

      <EnterpriseTableToolbar
        searchPlaceholder="Search audit trail by event, actor, or payload..."
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        filterLabel="Severity"
        filterOptions={[
          { value: "CRITICAL", label: "Critical" },
          { value: "HIGH", label: "High" },
          { value: "MEDIUM", label: "Medium" },
          { value: "LOW", label: "Low" },
          { value: "INFO", label: "Info" },
        ]}
        selectedFilter={filterValue}
        onFilterChange={setFilterValue}
      />

      <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
        <GlassTable
          columns={columns}
          data={logs as (AuditLogResponse & Record<string, unknown>)[]}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSort}
          emptyMessage="No audit events recorded"
        />
        <EnterprisePagination
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemName="audit events"
        />
      </div>
    </div>
  );
}

