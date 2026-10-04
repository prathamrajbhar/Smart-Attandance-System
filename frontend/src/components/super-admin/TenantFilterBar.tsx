"use client";

import React from "react";
import GlassSearch from "@/components/ui/GlassSearch";
import { Filter } from "lucide-react";

interface TenantFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  onReset: () => void;
}

export default function TenantFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  onReset,
}: TenantFilterBarProps): React.ReactElement {
  const hasActiveFilters = Boolean(searchQuery || statusFilter || typeFilter);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-card rounded-xl border border-border mb-4">
      <div className="flex-1 max-w-md">
        <GlassSearch
          placeholder="Search by institution name or slug..."
          value={searchQuery}
          onSearch={onSearchChange}
        />
      </div>

      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <Filter size={14} />
          <span>Filters:</span>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          aria-label="Filter by institution type"
          className="h-9 px-3 text-xs rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Types</option>
          <option value="SCHOOL">School</option>
          <option value="COLLEGE">College</option>
          <option value="COACHING_CENTER">Coaching Center</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by institution status"
          className="h-9 px-3 text-xs rounded-md bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="TRIAL">Trial</option>
          <option value="PROVISIONING">Provisioning</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground underline px-2 py-1 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
