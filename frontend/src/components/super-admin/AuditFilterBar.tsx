"use client";

import React from "react";
import { Search, RotateCcw, RefreshCw, Filter } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";

interface AuditFilterBarProps {
  actorSearch: string;
  onActorSearchChange: (val: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (val: string) => void;
  eventTypeFilter: string;
  onEventTypeFilterChange: (val: string) => void;
  onReset: () => void;
  onRefresh: () => void;
}

const SEVERITY_OPTIONS = [
  { value: "ALL", label: "All Severities" },
  { value: "INFO", label: "Info" },
  { value: "WARNING", label: "Warning" },
  { value: "CRITICAL", label: "Critical" },
  { value: "ERROR", label: "Error" },
];

const EVENT_TYPE_OPTIONS = [
  { value: "ALL", label: "All Event Types" },
  { value: "PROVISION_TENANT", label: "Provision Tenant" },
  { value: "UPDATE_USER_STATUS", label: "User Status Change" },
  { value: "FORCE_PASSWORD_RESET", label: "Password Reset" },
  { value: "ADD_TENANT_ADMIN", label: "Add Tenant Admin" },
  { value: "GLOBAL_BROADCAST", label: "Global Broadcast" },
  { value: "TIMETABLE_AI_PROCESS", label: "AI Timetable Ingestion" },
  { value: "AUTH_LOGIN", label: "User Authentication" },
];

export default function AuditFilterBar({
  actorSearch,
  onActorSearchChange,
  severityFilter,
  onSeverityFilterChange,
  eventTypeFilter,
  onEventTypeFilterChange,
  onReset,
  onRefresh,
}: AuditFilterBarProps): React.ReactElement {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
      {/* Actor / User Search */}
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter by actor email or system agent..."
          value={actorSearch}
          onChange={(e) => onActorSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter size={13} />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => onSeverityFilterChange(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {SEVERITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={eventTypeFilter}
          onChange={(e) => onEventTypeFilterChange(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {EVENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <GlassButton variant="ghost" size="sm" onClick={onReset} className="gap-1 text-xs">
          <RotateCcw size={12} />
          <span>Reset</span>
        </GlassButton>

        <GlassButton variant="secondary" size="sm" onClick={onRefresh} className="gap-1 text-xs">
          <RefreshCw size={12} />
          <span>Refresh</span>
        </GlassButton>
      </div>
    </div>
  );
}
